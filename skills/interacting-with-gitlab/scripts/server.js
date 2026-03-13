const { execSync } = require('child_process');
const readline = require('readline');

// All protocol-breaking logs must go to stderr
const log = (msg) => process.stderr.write(`[gitlab-mcp] ${msg}\n`);
log('Server starting...');

const GLAB_ENV = { ...process.env, GLAB_PAGER: 'cat', PAGER: 'cat' };

function handleGlabError(error) {
  const stderr = error.stderr ? error.stderr.toString() : '';
  const stdout = error.stdout ? error.stdout.toString() : '';
  const message = error.message || '';
  
  if (message.includes('not found') || stderr.includes('not found')) {
    return "ERROR: 'glab' CLI is not installed or not in PATH. This MCP server requires the GitLab CLI to function. Please install it from https://gitlab.com/gitlab-org/cli";
  }

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

function distillMr(mr) {
  return {
    iid: mr.iid, project_id: mr.project_id, title: mr.title, state: mr.state,
    author: mr.author ? mr.author.username : 'unknown', web_url: mr.web_url,
    labels: mr.labels, draft: mr.draft
  };
}

function distillProject(project) {
  return {
    id: project.id, name: project.name, path_with_namespace: project.path_with_namespace,
    description: project.description ? project.description.substring(0, 100) + '...' : '',
    web_url: project.web_url
  };
}

function distillVulnerability(v) {
  return {
    id: v.id,
    title: v.name || v.title,
    severity: v.severity,
    report_type: v.report_type,
    state: v.state,
    location: v.location ? { file: v.location.file, line: v.location.start_line } : 'unknown'
  };
}

const tools = {
  // --- Discovery & Research ---
  "gitlab_search": {
    description: "Search for projects, issues, or merge requests globally.",
    parameters: { query: "string", scope: "string" },
    required: ["query"],
    run: ({ query, scope }) => {
      const response = runGlabApi(`search?scope=${scope || 'projects'}&search=${encodeURIComponent(query)}`);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const results = JSON.parse(response);
        if (!Array.isArray(results)) return response;
        const s = scope || 'projects';
        if (s === 'merge_requests') return JSON.stringify(results.map(distillMr), null, 2);
        if (s === 'projects') return JSON.stringify(results.map(distillProject), null, 2);
        return JSON.stringify(results, null, 2);
      } catch (e) { return response; }
    }
  },
  "gitlab_view": {
    description: "View details of an MR, Issue, or Repo. Returns a formatted text summary.",
    parameters: { type: "string", id: "string", comments: "boolean" },
    required: ["type"],
    run: ({ type, id, comments }) => {
      const args = [type, 'view'];
      if (id) args.push(id);
      if (comments) args.push('--comments');
      return runGlab(args);
    }
  },
  "gitlab_list_repository_tree": {
    description: "List files in a repository directory.",
    parameters: { path: "string", ref: "string" },
    required: [],
    run: ({ path, ref }) => {
      let endpoint = `projects/:id/repository/tree`;
      const params = [];
      if (path) params.push(`path=${encodeURIComponent(path)}`);
      if (ref) params.push(`ref=${ref}`);
      if (params.length > 0) endpoint += `?${params.join('&')}`;
      const response = runGlabApi(endpoint);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        return JSON.stringify(JSON.parse(response).map(i => ({ name: i.name, type: i.type, path: i.path })), null, 2);
      } catch (e) { return response; }
    }
  },
  "gitlab_get_repository_file": {
    description: "Fetch raw content of a file from the repository.",
    parameters: { path: "string", ref: "string" },
    required: ["path"],
    run: ({ path, ref }) => {
      const encodedPath = encodeURIComponent(path);
      return runGlabApi(`projects/:id/repository/files/${encodedPath}/raw?ref=${ref || 'main'}`);
    }
  },

  // --- PR / Merge Request Management ---
  "gitlab_list_mrs": {
    description: "List Merge Requests with filters.",
    parameters: { project: "string", state: "string", labels: "string", source_branch: "string", author: "string", per_page: "number" },
    required: [],
    run: ({ project, state, labels, source_branch, author, per_page }) => {
      const args = ['mr', 'list'];
      if (project) args.push('--repo', project);
      if (labels) args.push('--label', labels);
      if (source_branch) args.push('--source-branch', source_branch);
      if (author) args.push('--author', author);
      if (per_page) args.push('--per-page', per_page.toString());
      if (state === 'closed') args.push('--closed');
      else if (state === 'merged') args.push('--merged');
      else if (state === 'all') args.push('--all');
      return runGlab(args);
    }
  },
  "gitlab_create_mr": {
    description: "Create a new MR. Can optionally enable auto-merge immediately.",
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
        const iid = match[1];
        const autoMergeResp = runGlab(['mr', 'merge', iid, '--auto', '--yes']);
        return `${createResp}\n\nAUTO-MERGE: ${autoMergeResp}`;
      }
      return createResp;
    }
  },
  "gitlab_merge_mr": {
    description: "Merge an MR immediately.",
    parameters: { iid: "string", rebase: "boolean", remove_source_branch: "boolean", squash: "boolean" },
    required: ["iid"],
    run: ({ iid, rebase, remove_source_branch, squash }) => {
      const args = ['mr', 'merge', iid, '--yes'];
      if (rebase) args.push('--rebase');
      if (remove_source_branch) args.push('--remove-source-branch');
      if (squash) args.push('--squash');
      return runGlab(args);
    }
  },
  "gitlab_get_mr_details": {
    description: "Fetch full MR details via API (Distilled summary).",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => {
      const response = runGlabApi(`projects/:id/merge_requests/${iid}`);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const mr = JSON.parse(response);
        return JSON.stringify({
          ...distillMr(mr),
          description: mr.description ? mr.description.substring(0, 500) + (mr.description.length > 500 ? '...' : '') : '',
          diff_refs: mr.diff_refs, merge_status: mr.merge_status, has_conflicts: mr.has_conflicts,
          blocking_discussions_resolved: mr.blocking_discussions_resolved,
          pipeline: mr.pipeline ? { id: mr.pipeline.id, status: mr.pipeline.status } : null
        }, null, 2);
      } catch (e) { return response; }
    }
  },
  "gitlab_get_mr_diffs": {
    description: "Fetch the diffs for a specific Merge Request.",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => runGlab(['mr', 'diff', iid])
  },

  // --- Feedback & Review Lifecycle ---
  "gitlab_post_comment": {
    description: "Post a comment to an MR that is published IMMEDIATELY.",
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
    description: "Add a comment to an ongoing review (Draft Mode).",
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
    description: "Submit your full review (publishes drafts).",
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
  "gitlab_delete_comment": {
    description: "Delete a specific comment/note from an MR.",
    parameters: { iid: "string", note_id: "string" },
    required: ["iid", "note_id"],
    run: ({ iid, note_id }) => runGlabApi(`projects/:id/merge_requests/${iid}/notes/${note_id}`, 'DELETE')
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
    description: "List all discussion threads in an MR.",
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
    description: "Reply to a thread. Set 'resolve: true' to close the loop.",
    parameters: { iid: "string", discussion_id: "string", message: "string", resolve: "boolean" },
    required: ["iid", "discussion_id", "message"],
    run: ({ iid, discussion_id, message, resolve }) => {
      const payload = { body: message };
      if (resolve) payload.resolve_discussion = true;
      return runGlabApi(`projects/:id/merge_requests/${iid}/discussions/${discussion_id}/notes`, 'POST', payload);
    }
  },
  "gitlab_resolve_discussion": {
    description: "Toggle resolution status of a thread.",
    parameters: { iid: "string", discussion_id: "string", resolved: "boolean" },
    required: ["iid", "discussion_id", "resolved"],
    run: ({ iid, discussion_id, resolved }) => runGlabApi(`projects/:id/merge_requests/${iid}/discussions/${discussion_id}?resolved=${resolved}`, 'PUT')
  },

  // --- CI/CD Monitoring ---
  "gitlab_list_pipelines": {
    description: "List recent CI pipelines.",
    parameters: { status: "string", ref: "string" },
    required: [],
    run: ({ status, ref }) => {
      const args = ['ci', 'list'];
      if (status) args.push('--status', status);
      if (ref) args.push('--ref', ref);
      return runGlab(args);
    }
  },
  "gitlab_run_pipeline": {
    description: "Create/Run a new CI pipeline on a specific branch/ref.",
    parameters: { ref: "string" },
    required: ["ref"],
    run: ({ ref }) => runGlab(['ci', 'run', '--branch', ref])
  },
  "gitlab_get_pipeline_details": {
    description: "Fetch pipeline details.",
    parameters: { pipeline_id: "string" },
    required: ["pipeline_id"],
    run: ({ pipeline_id }) => {
      const response = runGlabApi(`projects/:id/pipelines/${pipeline_id}`);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const p = JSON.parse(response);
        return JSON.stringify({
          id: p.id, iid: p.iid, project_id: p.project_id, status: p.status, ref: p.ref, web_url: p.web_url,
          created_at: p.created_at, updated_at: p.updated_at, started_at: p.started_at, finished_at: p.finished_at, duration: p.duration
        }, null, 2);
      } catch (e) { return response; }
    }
  },
  "gitlab_wait_for_pipeline": {
    description: "Wait for pipeline completion (Polling).",
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
      try {
        const jobs = JSON.parse(resp);
        return JSON.stringify(jobs.map(j => ({ id: j.id, name: j.name, status: j.status, stage: j.stage, web_url: j.web_url })), null, 2);
      } catch (e) { return resp; }
    }
  },
  "gitlab_get_job_trace": {
    description: "Fetch job log trace.",
    parameters: { job_id: "string" },
    required: ["job_id"],
    run: ({ job_id }) => runGlabApi(`projects/:id/jobs/${job_id}/trace`)
  },
  "gitlab_set_auto_merge": {
    description: "Enable auto-merge for an MR.",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => runGlab(['mr', 'merge', iid, '--auto', '--yes'])
  },

  // --- Security & Vulnerabilities ---
  "gitlab_list_vulnerability_findings": {
    description: "List vulnerability findings for a project.",
    parameters: { pipeline_id: "string", severity: "string", report_type: "string", state: "string" },
    required: [],
    run: ({ pipeline_id, severity, report_type, state }) => {
      let endpoint = `projects/:id/vulnerability_findings?scope=${state || 'all'}`;
      if (pipeline_id) endpoint += `&pipeline_id=${pipeline_id}`;
      if (severity) endpoint += `&severity=${severity}`;
      if (report_type) endpoint += `&report_type=${report_type}`;
      const response = runGlabApi(endpoint);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try { return JSON.stringify(JSON.parse(response).map(distillVulnerability), null, 2); }
      catch (e) { return response; }
    }
  },
  "gitlab_get_vulnerability_details": {
    description: "Fetch full details for a specific vulnerability (Ultimate tier).",
    parameters: { vulnerability_id: "string" },
    required: ["vulnerability_id"],
    run: ({ vulnerability_id }) => runGlabApi(`vulnerabilities/${vulnerability_id}`)
  },
  "gitlab_dismiss_vulnerability": {
    description: "Dismiss a vulnerability (Mark as false positive, etc.).",
    parameters: { vulnerability_id: "string" },
    required: ["vulnerability_id"],
    run: ({ vulnerability_id }) => runGlabApi(`vulnerabilities/${vulnerability_id}/dismiss`, 'POST')
  },
  "gitlab_resolve_vulnerability": {
    description: "Mark a vulnerability as fixed.",
    parameters: { vulnerability_id: "string" },
    required: ["vulnerability_id"],
    run: ({ vulnerability_id }) => runGlabApi(`vulnerabilities/${vulnerability_id}/resolve`, 'POST')
  },

  // --- Helpers ---
  "gitlab_list_labels": {
    description: "List available project labels.",
    parameters: { project: "string" },
    required: [],
    run: ({ project }) => {
      const args = ['label', 'list'];
      if (project) args.push('--repo', project);
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
      const response = { jsonrpc: "2.0", id: request.id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "gitlab-mcp", version: "2.9.0" } } };
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
