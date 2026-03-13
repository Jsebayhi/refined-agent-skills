const { execSync } = require('child_process');
const readline = require('readline');

const GLAB_ENV = { ...process.env, GLAB_PAGER: 'cat', PAGER: 'cat' };

function handleGlabError(error) {
  const stderr = error.stderr ? error.stderr.toString() : '';
  const stdout = error.stdout ? error.stdout.toString() : '';
  
  if (stderr.includes('glab auth login') || stdout.includes('glab auth login') || stderr.includes('Invalid token')) {
    return "ERROR: GitLab authentication failed. Please run 'glab auth login' in your terminal to authenticate before using this tool.";
  }
  
  return `Error: ${error.message}\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`;
}

function runGlab(argsArray) {
  const cmd = `glab ${argsArray.join(' ')}`;
  try {
    return execSync(cmd, { env: GLAB_ENV, encoding: 'utf-8' });
  } catch (error) {
    return handleGlabError(error);
  }
}

function runGlabApi(endpoint, method = 'GET', data = null) {
  let cmd = `glab api "${endpoint}"`;
  if (method !== 'GET') {
    cmd += ` --method ${method}`;
  }
  let input = undefined;
  if (data) {
    input = JSON.stringify(data);
    cmd += ` --input -`;
  }
  try {
    return execSync(cmd, { input, env: GLAB_ENV, encoding: 'utf-8' });
  } catch (error) {
    return handleGlabError(error);
  }
}

function getMrDiffRefs(iid) {
  const response = runGlabApi(`projects/:id/merge_requests/${iid}`);
  if (response.startsWith('Error:') || response.startsWith('ERROR:')) throw new Error(response);
  const mr = JSON.parse(response);
  return mr.diff_refs;
}

const tools = {
  "gitlab:search": {
    description: "Search for projects, issues, or merge requests across GitLab.",
    parameters: { query: "string", scope: "string" },
    required: ["query"]
  },
  "gitlab:view": {
    description: "View details of a specific Merge Request, Issue, or Repository.",
    parameters: { type: "string", id: "string", comments: "boolean" },
    required: ["type"]
  },
  "gitlab:get_mr_diffs": {
    description: "Fetch the diffs for a specific Merge Request.",
    parameters: { iid: "string" },
    required: ["iid"]
  },
  "gitlab:create_mr": {
    description: "Create a new Merge Request. Can optionally enable auto-merge immediately.",
    parameters: { 
      title: "string", description: "string", source_branch: "string", target_branch: "string", 
      labels: "string", fill: "boolean", draft: "boolean", auto_merge: "boolean"
    },
    required: []
  },
  "gitlab:get_mr_details": {
    description: "Fetch full details (status, labels, SHAs) for a Merge Request.",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => { return runGlabApi(`projects/:id/merge_requests/${iid}`); }
  },
  "gitlab:post_comment": {
    description: "Post a comment to an MR that is published IMMEDIATELY. Use for quick one-off feedback.",
    parameters: { iid: "string", path: "string", line: "number", message: "string" },
    required: ["iid", "path", "line", "message"],
    run: ({ iid, path, line, message }) => {
      try {
        const diffRefs = getMrDiffRefs(iid);
        const payload = {
          body: message,
          position: {
            base_sha: diffRefs.base_sha, head_sha: diffRefs.head_sha, start_sha: diffRefs.start_sha,
            position_type: 'text', new_path: path, new_line: line
          }
        };
        return runGlabApi(`projects/:id/merge_requests/${iid}/discussions`, 'POST', payload);
      } catch (e) { return e.message; }
    }
  },
  "gitlab:add_comment_to_review": {
    description: "Add a comment to an ongoing review. The comment will NOT be visible to others until you call 'submit_review'.",
    parameters: { iid: "string", path: "string", line: "number", message: "string" },
    required: ["iid", "path", "line", "message"],
    run: ({ iid, path, line, message }) => {
      try {
        const diffRefs = getMrDiffRefs(iid);
        const payload = {
          note: message,
          position: {
            base_sha: diffRefs.base_sha, head_sha: diffRefs.head_sha, start_sha: diffRefs.start_sha,
            position_type: 'text', new_path: path, new_line: line
          }
        };
        return runGlabApi(`projects/:id/merge_requests/${iid}/draft_notes`, 'POST', payload);
      } catch (e) { return e.message; }
    }
  },
  "gitlab:submit_review": {
    description: "Submit your full review. This publishes all comments added via 'add_comment_to_review' and sets the MR status (APPROVE, REQUEST_CHANGES, or COMMENT).",
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
  "gitlab:approve": {
    description: "Approve a Merge Request independently.",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => { return runGlabApi(`projects/:id/merge_requests/${iid}/approve`, 'POST'); }
  },
  "gitlab:unapprove": {
    description: "Revoke an approval on a Merge Request.",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => { return runGlabApi(`projects/:id/merge_requests/${iid}/unapprove`, 'POST'); }
  },
  "gitlab:list_discussions": {
    description: "List all discussion threads in an MR. Use 'only_unresolved: true' to find active threads needing attention.",
    parameters: { iid: "string", only_unresolved: "boolean" },
    required: ["iid"],
    run: ({ iid, only_unresolved }) => {
      const response = runGlabApi(`projects/:id/merge_requests/${iid}/discussions`);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      let discussions = JSON.parse(response);
      if (only_unresolved) {
        discussions = discussions.filter(d => d.notes.some(n => n.resolvable && !n.resolved));
      }
      return JSON.stringify(discussions.map(d => ({
        id: d.id, resolvable: d.resolvable || false, resolved: d.resolved || false,
        notes: d.notes.map(n => ({ 
          id: n.id, body: n.body, author: n.author.username, resolvable: n.resolvable, resolved: n.resolved 
        }))
      })), null, 2);
    }
  },
  "gitlab:reply_to_discussion": {
    description: "Reply to an existing discussion thread. Set 'resolve: true' if your reply addresses the feedback.",
    parameters: { iid: "string", discussion_id: "string", message: "string", resolve: "boolean" },
    required: ["iid", "discussion_id", "message"],
    run: ({ iid, discussion_id, message, resolve }) => {
      const payload = { body: message };
      if (resolve) payload.resolve_discussion = true;
      return runGlabApi(`projects/:id/merge_requests/${iid}/discussions/${discussion_id}/notes`, 'POST', payload);
    }
  },
  "gitlab:resolve_discussion": {
    description: "Mark a discussion thread as resolved or unresolved without posting a new note.",
    parameters: { iid: "string", discussion_id: "string", resolved: "boolean" },
    required: ["iid", "discussion_id", "resolved"],
    run: ({ iid, discussion_id, resolved }) => {
      return runGlabApi(`projects/:id/merge_requests/${iid}/discussions/${discussion_id}?resolved=${resolved}`, 'PUT');
    }
  },
  "gitlab:list_pipelines": {
    description: "List recent CI/CD pipelines.",
    parameters: { status: "string", ref: "string" },
    required: [],
    run: ({ status, ref }) => {
      const args = ['ci', 'list'];
      if (status) args.push('--status', status);
      if (ref) args.push('--ref', ref);
      return runGlab(args);
    }
  },
  "gitlab:get_pipeline_details": {
    description: "Fetch full details and status for a specific pipeline.",
    parameters: { pipeline_id: "string" },
    required: ["pipeline_id"],
    run: ({ pipeline_id }) => { return runGlabApi(`projects/:id/pipelines/${pipeline_id}`); }
  },
  "gitlab:wait_for_pipeline": {
    description: "Wait for a pipeline to complete (success, failed, or canceled). Polling tool.",
    parameters: { pipeline_id: "string", timeout_minutes: "number" },
    required: ["pipeline_id"],
    run: async ({ pipeline_id, timeout_minutes }) => {
      const start = Date.now();
      const timeoutMs = (timeout_minutes || 10) * 60 * 1000;
      while (Date.now() - start < timeoutMs) {
        const response = runGlabApi(`projects/:id/pipelines/${pipeline_id}`);
        if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
        const pipeline = JSON.parse(response);
        if (['success', 'failed', 'canceled', 'skipped', 'manual'].includes(pipeline.status)) {
          return `Pipeline ${pipeline_id} finished with status: ${pipeline.status}`;
        }
        await new Promise(resolve => setTimeout(resolve, 15000));
      }
      return `TIMEOUT: Pipeline ${pipeline_id} did not complete within ${timeout_minutes || 10} minutes.`;
    }
  },
  "gitlab:list_pipeline_jobs": {
    description: "List jobs for a specific pipeline.",
    parameters: { pipeline_id: "string" },
    required: ["pipeline_id"],
    run: ({ pipeline_id }) => {
      const response = runGlabApi(`projects/:id/pipelines/${pipeline_id}/jobs`);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      const jobs = JSON.parse(response);
      return JSON.stringify(jobs.map(j => ({ id: j.id, name: j.name, status: j.status })), null, 2);
    }
  },
  "gitlab:get_job_trace": {
    description: "Fetch the log trace for a specific job.",
    parameters: { job_id: "string" },
    required: ["job_id"],
    run: ({ job_id }) => { return runGlabApi(`projects/:id/jobs/${job_id}/trace`); }
  },
  "gitlab:set_auto_merge": {
    description: "Enable auto-merge for an MR (Merge when pipeline succeeds).",
    parameters: { iid: "string" },
    required: ["iid"],
    run: ({ iid }) => { return runGlab(['mr', 'merge', iid, '--auto', '--yes']); }
  },
  "gitlab:update_mr": {
    description: "Update MR attributes (title, labels, description, etc.).",
    parameters: { iid: "string", title: "string", labels: "string", description: "string" },
    required: ["iid"],
    run: ({ iid, title, labels, description }) => {
      const args = ['mr', 'update', iid];
      if (title) args.push('--title', `"${title}"`);
      if (labels) args.push('--label', `"${labels}"`);
      if (description) args.push('--description', `"${description}"`);
      return runGlab(args);
    }
  },
  "gitlab:run": {
    description: "Run any standard glab command in safe, non-interactive mode.",
    parameters: { command_args: "string" },
    required: ["command_args"],
    run: ({ command_args }) => { return runGlab(command_args.split(' ')); }
  }
};

// Add missing 'run' methods for search, view, get_mr_diffs, create_mr
tools["gitlab:search"].run = ({ query, scope }) => runGlabApi(`search?scope=${scope || 'projects'}&search=${encodeURIComponent(query)}`);
tools["gitlab:view"].run = ({ type, id, comments }) => {
  const args = [type, 'view'];
  if (id) args.push(id);
  if (comments) args.push('--comments');
  return runGlab(args);
};
tools["gitlab:get_mr_diffs"].run = ({ iid }) => runGlab(['mr', 'diff', iid]);
tools["gitlab:create_mr"].run = ({ title, description, source_branch, target_branch, labels, fill, draft, auto_merge }) => {
  const args = ['mr', 'create', '--yes'];
  if (fill) args.push('--fill');
  if (title) args.push('--title', `"${title}"`);
  if (description) args.push('--description', `"${description}"`);
  if (source_branch) args.push('--source-branch', source_branch);
  if (target_branch) args.push('--target-branch', target_branch);
  if (labels) args.push('--label', `"${labels}"`);
  if (draft) args.push('--draft');
  
  const createResp = runGlab(args);
  if (createResp.startsWith('Error:') || createResp.startsWith('ERROR:')) return createResp;
  
  if (auto_merge) {
    const match = createResp.match(/!(\d+)/) || createResp.match(/merge_requests\/(\d+)/);
    if (match) {
      const iid = match[1];
      const autoMergeResp = runGlab(['mr', 'merge', iid, '--auto', '--yes']);
      return `${createResp}\n\nAUTO-MERGE: ${autoMergeResp}`;
    }
  }
  return createResp;
};

const rl = readline.createInterface({
  input: process.stdin,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;
  
  try {
    const request = JSON.parse(line);
    
    if (request.method === 'initialize') {
      const response = {
        jsonrpc: "2.0",
        id: request.id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "gitlab-mcp", version: "1.7.0" }
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (request.method === 'list_tools') {
      const response = {
        jsonrpc: "2.0",
        id: request.id,
        result: {
          tools: Object.entries(tools).map(([name, info]) => ({
            name,
            description: info.description,
            inputSchema: {
              type: "object",
              properties: Object.fromEntries(
                Object.entries(info.parameters).map(([p, type]) => [p, { type }])
              ),
              required: info.required
            }
          }))
        }
      };
      process.stdout.write(JSON.stringify(response) + '\n');
    } else if (request.method === 'call_tool') {
      const tool = tools[request.params.name];
      if (tool) {
        try {
          const result = await tool.run(request.params.arguments);
          const response = {
            jsonrpc: "2.0",
            id: request.id,
            result: {
              content: [{ type: "text", text: String(result) }]
            }
          };
          process.stdout.write(JSON.stringify(response) + '\n');
        } catch (err) {
          const response = {
            jsonrpc: "2.0",
            id: request.id,
            error: { code: -32603, message: err.message }
          };
          process.stdout.write(JSON.stringify(response) + '\n');
        }
      } else {
        const response = {
          jsonrpc: "2.0",
          id: request.id,
          error: { code: -32601, message: `Tool not found: ${request.params.name}` }
        };
        process.stdout.write(JSON.stringify(response) + '\n');
      }
    } else if (request.method === 'notifications/initialized') {
      // Ignore
    }
  } catch (e) {
    process.stderr.write(`Error parsing line: ${e.message}\nLine: ${line}\n`);
  }
});

process.on('uncaughtException', (err) => {
  process.stderr.write(`Uncaught Exception: ${err.message}\n${err.stack}\n`);
});

process.on('unhandledRejection', (reason, promise) => {
  process.stderr.write(`Unhandled Rejection at: ${promise} reason: ${reason}\n`);
});
