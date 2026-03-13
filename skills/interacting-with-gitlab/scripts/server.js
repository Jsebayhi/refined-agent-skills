const { execSync } = require('child_process');
const readline = require('readline');

// All protocol-breaking logs must go to stderr
const log = (msg) => process.stderr.write(`[gitlab-mcp] ${msg}\n`);
log('Server starting...');

const GLAB_ENV = { ...process.env, GLAB_PAGER: 'cat', PAGER: 'cat' };

function handleGlabError(error) {
  const stderr = error.stderr ? error.stderr.toString() : '';
  const stdout = error.stdout ? error.stdout.toString() : '';
  if (stderr.includes('glab auth login') || stdout.includes('glab auth login') || stderr.includes('Invalid token')) {
    return "ERROR: GitLab authentication failed. Please run 'glab auth login' in your terminal.";
  }
  return `Error: ${error.message}\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`;
}

function runGlab(argsArray) {
  const cmd = `glab ${argsArray.join(' ')}`;
  try { return execSync(cmd, { env: GLAB_ENV, encoding: 'utf-8' }); }
  catch (error) { return handleGlabError(error); }
}

function runGlabApi(endpoint, method = 'GET', data = null) {
  let cmd = `glab api "${endpoint}"`;
  if (method !== 'GET') cmd += ` --method ${method}`;
  let input = undefined;
  if (data) { input = JSON.stringify(data); cmd += ` --input -`; }
  try { return execSync(cmd, { input, env: GLAB_ENV, encoding: 'utf-8' }); }
  catch (error) { return handleGlabError(error); }
}

function getMrDiffRefs(iid) {
  const response = runGlabApi(`projects/:id/merge_requests/${iid}`);
  if (response.startsWith('Error:') || response.startsWith('ERROR:')) throw new Error(response);
  const mr = JSON.parse(response);
  return mr.diff_refs;
}

const tools = {
  "gitlab_search": {
    description: "Search projects, issues, or MRs.",
    parameters: { query: "string", scope: "string" },
    required: ["query"],
    run: ({ query, scope }) => runGlabApi(`search?scope=${scope || 'projects'}&search=${encodeURIComponent(query)}`)
  },
  "gitlab_view": {
    description: "View details of an MR, Issue, or Repo.",
    parameters: { type: "string", id: "string", comments: "boolean" },
    required: ["type"],
    run: ({ type, id, comments }) => {
      const args = [type, 'view'];
      if (id) args.push(id);
      if (comments) args.push('--comments');
      return runGlab(args);
    }
  },
  "gitlab_get_mr_diffs": {
    description: "Fetch diffs for an MR.",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => runGlab(['mr', 'diff', iid])
  },
  "gitlab_create_mr": {
    description: "Create a new MR.",
    parameters: { title: "string", description: "string", source_branch: "string", target_branch: "string", labels: "string", fill: "boolean", draft: "boolean", auto_merge: "boolean" },
    required: [],
    run: ({ title, description, source_branch, target_branch, labels, fill, draft, auto_merge }) => {
      const args = ['mr', 'create', '--yes'];
      if (fill) args.push('--fill');
      if (title) args.push('--title', `"${title}"`);
      if (description) args.push('--description', `"${description}"`);
      if (source_branch) args.push('--source-branch', source_branch);
      if (target_branch) args.push('--target-branch', target_branch);
      if (labels) args.push('--label', `"${labels}"`);
      if (draft) args.push('--draft');
      const createResp = runGlab(args);
      if (createResp.startsWith('Error:') || createResp.startsWith('ERROR:') || !auto_merge) return createResp;
      const match = createResp.match(/!(\d+)/) || createResp.match(/merge_requests\/(\d+)/);
      if (match) {
        const autoMergeResp = runGlab(['mr', 'merge', match[1], '--auto', '--yes']);
        return `${createResp}\n\nAUTO-MERGE: ${autoMergeResp}`;
      }
      return createResp;
    }
  },
  "gitlab_get_mr_details": {
    description: "Fetch full MR details.",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => runGlabApi(`projects/:id/merge_requests/${iid}`)
  },
  "gitlab_post_comment": {
    description: "Immediate comment on a line.",
    parameters: { iid: "string", path: "string", line: "number", message: "string" },
    required: ["iid", "path", "line", "message"],
    run: ({ iid, path, line, message }) => {
      try {
        const diffRefs = getMrDiffRefs(iid);
        const payload = { body: message, position: { base_sha: diffRefs.base_sha, head_sha: diffRefs.head_sha, start_sha: diffRefs.start_sha, position_type: 'text', new_path: path, new_line: line } };
        return runGlabApi(`projects/:id/merge_requests/${iid}/discussions`, 'POST', payload);
      } catch (e) { return e.message; }
    }
  },
  "gitlab_add_comment_to_review": {
    description: "Add a draft comment.",
    parameters: { iid: "string", path: "string", line: "number", message: "string" },
    required: ["iid", "path", "line", "message"],
    run: ({ iid, path, line, message }) => {
      try {
        const diffRefs = getMrDiffRefs(iid);
        const payload = { note: message, position: { base_sha: diffRefs.base_sha, head_sha: diffRefs.head_sha, start_sha: diffRefs.start_sha, position_type: 'text', new_path: path, new_line: line } };
        return runGlabApi(`projects/:id/merge_requests/${iid}/draft_notes`, 'POST', payload);
      } catch (e) { return e.message; }
    }
  },
  "gitlab_submit_review": {
    description: "Publish drafts and set outcome.",
    parameters: { iid: "string", outcome: "string", message: "string" },
    required: ["iid", "outcome"],
    run: ({ iid, outcome, message }) => {
      const publishResp = runGlabApi(`projects/:id/merge_requests/${iid}/draft_notes/bulk_publish`, 'POST');
      if (publishResp.startsWith('ERROR:')) return publishResp;
      let body = message || "Review submitted.";
      if (outcome === 'APPROVE') body = `/submit_review /approve\n\n${body}`;
      else if (outcome === 'REQUEST_CHANGES') body = `/submit_review /request_changes\n\n${body}`;
      else body = `/submit_review\n\n${body}`;
      return runGlabApi(`projects/:id/merge_requests/${iid}/notes`, 'POST', { body });
    }
  },
  "gitlab_approve": {
    description: "Approve an MR.",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => runGlabApi(`projects/:id/merge_requests/${iid}/approve`, 'POST')
  },
  "gitlab_unapprove": {
    description: "Revoke approval.",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => runGlabApi(`projects/:id/merge_requests/${iid}/unapprove`, 'POST')
  },
  "gitlab_list_discussions": {
    description: "List discussion threads.",
    parameters: { iid: "string", only_unresolved: "boolean" },
    required: ["iid"],
    run: ({ iid, only_unresolved }) => {
      const resp = runGlabApi(`projects/:id/merge_requests/${iid}/discussions`);
      if (resp.startsWith('Error:') || resp.startsWith('ERROR:')) return resp;
      let discs = JSON.parse(resp);
      if (only_unresolved) discs = discs.filter(d => d.notes.some(n => n.resolvable && !n.resolved));
      return JSON.stringify(discs.map(d => ({ id: d.id, resolvable: d.resolvable || false, resolved: d.resolved || false, notes: d.notes.map(n => ({ id: n.id, body: n.body, author: n.author.username, resolvable: n.resolvable, resolved: n.resolved })) })), null, 2);
    }
  },
  "gitlab_reply_to_discussion": {
    description: "Reply to a thread.",
    parameters: { iid: "string", discussion_id: "string", message: "string", resolve: "boolean" },
    required: ["iid", "discussion_id", "message"],
    run: ({ iid, discussion_id, message, resolve }) => {
      const payload = { body: message };
      if (resolve) payload.resolve_discussion = true;
      return runGlabApi(`projects/:id/merge_requests/${iid}/discussions/${discussion_id}/notes`, 'POST', payload);
    }
  },
  "gitlab_resolve_discussion": {
    description: "Toggle resolution status.",
    parameters: { iid: "string", discussion_id: "string", resolved: "boolean" },
    required: ["iid", "discussion_id", "resolved"],
    run: ({ iid, discussion_id, resolved }) => runGlabApi(`projects/:id/merge_requests/${iid}/discussions/${discussion_id}?resolved=${resolved}`, 'PUT')
  },
  "gitlab_list_pipelines": {
    description: "List CI pipelines.",
    parameters: { status: "string", ref: "string" },
    required: [],
    run: ({ status, ref }) => {
      const args = ['ci', 'list'];
      if (status) args.push('--status', status);
      if (ref) args.push('--ref', ref);
      return runGlab(args);
    }
  },
  "gitlab_get_pipeline_details": {
    description: "Fetch pipeline details.",
    parameters: { pipeline_id: "string" },
    required: ["pipeline_id"],
    run: ({ pipeline_id }) => runGlabApi(`projects/:id/pipelines/${pipeline_id}`)
  },
  "gitlab_wait_for_pipeline": {
    description: "Wait for pipeline completion.",
    parameters: { pipeline_id: "string", timeout_minutes: "number" },
    required: ["pipeline_id"],
    run: async ({ pipeline_id, timeout_minutes }) => {
      const start = Date.now();
      const timeoutMs = (timeout_minutes || 10) * 60 * 1000;
      while (Date.now() - start < timeoutMs) {
        const resp = runGlabApi(`projects/:id/pipelines/${pipeline_id}`);
        if (resp.startsWith('Error:') || resp.startsWith('ERROR:')) return resp;
        const pipe = JSON.parse(resp);
        if (['success', 'failed', 'canceled', 'skipped', 'manual'].includes(pipe.status)) return `Pipeline ${pipeline_id} finished with status: ${pipe.status}`;
        await new Promise(r => setTimeout(r, 15000));
      }
      return `TIMEOUT: Pipeline ${pipeline_id} did not complete.`;
    }
  },
  "gitlab_list_pipeline_jobs": {
    description: "List jobs for a pipeline.",
    parameters: { pipeline_id: "string" },
    required: ["pipeline_id"],
    run: ({ pipeline_id }) => {
      const resp = runGlabApi(`projects/:id/pipelines/${pipeline_id}/jobs`);
      if (resp.startsWith('Error:') || resp.startsWith('ERROR:')) return resp;
      const jobs = JSON.parse(resp);
      return JSON.stringify(jobs.map(j => ({ id: j.id, name: j.name, status: j.status })), null, 2);
    }
  },
  "gitlab_get_job_trace": {
    description: "Fetch job log trace.",
    parameters: { job_id: "string" },
    required: ["job_id"],
    run: ({ job_id }) => runGlabApi(`projects/:id/jobs/${job_id}/trace`)
  },
  "gitlab_set_auto_merge": {
    description: "Enable auto-merge.",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => runGlab(['mr', 'merge', iid, '--auto', '--yes'])
  },
  "gitlab_update_mr": {
    description: "Update MR attributes.",
    parameters: { iid: "string", title: "string", labels: "string", description: "string" },
    required: ["iid"],
    run: ({ iid, title, labels, description }) => {
      const args = ['mr', 'update', iid];
      if (title) args.push('--title', `"${title}"`);
      if (labels) args.push('--label', `"${labels}"`);
      if (description) args.push('--description', `"${description}"`);
      return runGlab(args);
    }
  }
};

const rl = readline.createInterface({ input: process.stdin, terminal: false });

rl.on('line', async (line) => {
  if (!line.trim()) return;
  log(`Received: ${line.substring(0, 100)}...`);
  try {
    const request = JSON.parse(line);
    const method = request.method;

    if (method === 'initialize') {
      log('Handling initialize...');
      const response = { jsonrpc: "2.0", id: request.id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "gitlab-mcp", version: "2.0.0" } } };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'tools/list' || method === 'list_tools') {
      log(`Handling ${method}...`);
      const response = { jsonrpc: "2.0", id: request.id, result: { tools: Object.entries(tools).map(([name, info]) => ({ name, description: info.description, inputSchema: { type: "object", properties: Object.fromEntries(Object.entries(info.parameters).map(([p, type]) => [p, { type }])), required: info.required } })) } };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (method === 'tools/call' || method === 'call_tool') {
      const name = request.params.name;
      log(`Calling tool: ${name}`);
      const tool = tools[name];
      if (tool) {
        try {
          const result = await tool.run(request.params.arguments);
          const response = { jsonrpc: "2.0", id: request.id, result: { content: [{ type: "text", text: String(result) }] } };
          process.stdout.write(JSON.stringify(response) + '\n');
        } catch (err) {
          const response = { jsonrpc: "2.0", id: request.id, error: { code: -32603, message: err.message } };
          process.stdout.write(JSON.stringify(response) + '\n');
        }
      } else {
        const response = { jsonrpc: "2.0", id: request.id, error: { code: -32601, message: `Tool not found: ${name}` } };
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } else if (method === 'notifications/initialized') {
      log('Received initialized notification.');
    } else if (method === 'ping') {
      const response = { jsonrpc: "2.0", id: request.id, result: {} };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else {
      log(`Unknown method: ${method}`);
    }
  } catch (e) {
    log(`Error: ${e.message}`);
  }
});

process.on('uncaughtException', (err) => log(`Uncaught: ${err.message}\n${err.stack}`));
process.on('unhandledRejection', (reason) => log(`Unhandled: ${reason}`));
