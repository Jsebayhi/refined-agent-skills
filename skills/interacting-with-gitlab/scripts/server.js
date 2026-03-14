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
  if (data) { 
    input = JSON.stringify(data); 
    cmd += ` --input - -H "Content-Type: application/json"`; 
  }
  try { return execSync(cmd, { input, env: GLAB_ENV, encoding: 'utf-8' }); }
  catch (error) { return handleGlabError(error); }
}

function getMrDiffRefs(id) {
  const response = runGlabApi(`projects/:id/merge_requests/${id}`);
  if (response.startsWith('Error:') || response.startsWith('ERROR:')) throw new Error(response);
  const mr = JSON.parse(response);
  return mr.diff_refs;
}

function distillMr(mr) {
  return {
    id: mr.iid, project_id: mr.project_id, title: mr.title, state: mr.state,
    author: mr.author ? mr.author.username : 'unknown', web_url: mr.web_url,
    labels: mr.labels, draft: mr.draft
  };
}

function distillIssue(issue) {
  return {
    id: issue.iid, title: issue.title, state: issue.state,
    web_url: issue.web_url, labels: issue.labels
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

function distillBlob(blob) {
  return {
    path: blob.path,
    filename: blob.filename,
    basename: blob.basename,
    ref: blob.ref,
    start_line: blob.start_line,
    project_id: blob.project_id
  };
}

const tools = {
  // --- Discovery & Research ---
  "gitlab_search": {
    description: "Search for projects, issues, merge requests, or code globally.",
    parameters: { query: "string", scope: "string" },
    required: ["query"],
    run: ({ query, scope }) => {
      const s = scope || 'projects';
      const response = runGlabApi(`search?scope=${s}&search=${encodeURIComponent(query)}`);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const results = JSON.parse(response);
        if (!Array.isArray(results)) return response;
        if (s === 'merge_requests') return JSON.stringify(results.map(distillMr), null, 2);
        if (s === 'issues') return JSON.stringify(results.map(distillIssue), null, 2);
        if (s === 'projects') return JSON.stringify(results.map(distillProject), null, 2);
        if (s === 'blobs') return JSON.stringify(results.map(distillBlob), null, 2);
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
  "gitlab_find_file": {
    description: "Recursively search for a file by name or pattern in the repository.",
    parameters: { pattern: "string", ref: "string" },
    required: ["pattern"],
    run: ({ pattern, ref }) => {
      let endpoint = `projects/:id/repository/tree?recursive=true&per_page=100`;
      if (ref) endpoint += `&ref=${ref}`;
      const response = runGlabApi(endpoint);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const data = JSON.parse(response);
        const results = data
          .filter(item => item.type === 'blob' && item.path.includes(pattern))
          .map(item => ({ path: item.path, id: item.id }));
        return JSON.stringify(results.slice(0, 50), null, 2); // Limit to 50 results
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
  "gitlab_list_pull_requests": {
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
  "gitlab_create_pull_request": {
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
        const id = match[1];
        const autoMergeResp = runGlab(['mr', 'merge', id, '--auto', '--yes']);
        return `${createResp}\n\nAUTO-MERGE: ${autoMergeResp}`;
      }
      return createResp;
    }
  },
  "gitlab_merge_pull_request": {
    description: "Merge an MR immediately.",
    parameters: { id: "string", rebase: "boolean", remove_source_branch: "boolean", squash: "boolean" },
    required: ["id"],
    run: ({ id, rebase, remove_source_branch, squash }) => {
      const args = ['mr', 'merge', id, '--yes'];
      if (rebase) args.push('--rebase');
      if (remove_source_branch) args.push('--remove-source-branch');
      if (squash) args.push('--squash');
      return runGlab(args);
    }
  },
  "gitlab_get_pull_request_details": {
    description: "Fetch full MR details via API. Set 'full_context: true' to bundle security and discussions.",
    parameters: { id: "string", full_context: "boolean" },
    required: ["id"],
    run: async ({ id, full_context }) => {
      const response = runGlabApi(`projects/:id/merge_requests/${id}`);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const mr = JSON.parse(response);
        const details = {
          ...distillMr(mr),
          description: mr.description ? mr.description.substring(0, 500) + (mr.description.length > 500 ? '...' : '') : '',
          diff_refs: mr.diff_refs, merge_status: mr.merge_status, has_conflicts: mr.has_conflicts,
          blocking_discussions_resolved: mr.blocking_discussions_resolved,
          pipeline: mr.pipeline ? { id: mr.pipeline.id, status: mr.pipeline.status } : null
        };

        if (full_context) {
          // Parallel fetch security and discussions
          const [vulnResp, discResp] = await Promise.all([
            details.pipeline ? runGlabApi(`projects/:id/vulnerability_findings?pipeline_id=${details.pipeline.id}&severity=high,critical`) : Promise.resolve('[]'),
            runGlabApi(`projects/:id/merge_requests/${id}/discussions`)
          ]);

          if (!vulnResp.startsWith('Error:')) {
            const vulns = JSON.parse(vulnResp);
            details.critical_vulnerabilities = vulns.map(distillVulnerability);
          }

          if (!discResp.startsWith('Error:')) {
            const discs = JSON.parse(discResp);
            details.unresolved_discussions = discs
              .filter(d => d.notes.some(n => n.resolvable && !n.resolved))
              .map(d => ({ id: d.id, notes: d.notes.map(n => ({ author: n.author.username, body: n.body.substring(0, 100) + '...' })) }));
          }
        }

        return JSON.stringify(details, null, 2);
      } catch (e) { return response; }
    }
  },
  "gitlab_get_pull_request_diffs": {
    description: "Fetch the diffs for a specific Merge Request.",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGlab(['mr', 'diff', id])
  },

  // --- Feedback & Review Lifecycle ---
  "gitlab_get_comment": {
    description: "Fetch details of a specific comment/note from an MR.",
    parameters: { id: "string", note_id: "string" },
    required: ["id", "note_id"],
    run: ({ id, note_id }) => runGlabApi(`projects/:id/merge_requests/${id}/notes/${note_id}`)
  },
  "gitlab_edit_comment": {
    description: "Edit the body of an existing published comment/note in an MR.",
    parameters: { id: "string", note_id: "string", message: "string" },
    required: ["id", "note_id", "message"],
    run: ({ id, note_id, message }) => runGlabApi(`projects/:id/merge_requests/${id}/notes/${note_id}`, 'PUT', { body: message })
  },
  "gitlab_delete_comment": {
    description: "Delete a specific published comment/note from an MR.",
    parameters: { id: "string", note_id: "string" },
    required: ["id", "note_id"],
    run: ({ id, note_id }) => runGlabApi(`projects/:id/merge_requests/${id}/notes/${note_id}`, 'DELETE')
  },
  "gitlab_list_review_comments": {
    description: "List all pending/draft comments (Review mode).",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGlabApi(`projects/:id/merge_requests/${id}/draft_notes`)
  },
  "gitlab_edit_review_comment": {
    description: "Edit a pending/draft comment from an ongoing review.",
    parameters: { id: "string", note_id: "string", message: "string" },
    required: ["id", "note_id", "message"],
    run: ({ id, note_id, message }) => runGlabApi(`projects/:id/merge_requests/${id}/draft_notes/${note_id}`, 'PUT', { note: message })
  },
  "gitlab_delete_review_comment": {
    description: "Delete a pending/draft comment from an ongoing review.",
    parameters: { id: "string", note_id: "string" },
    required: ["id", "note_id"],
    run: ({ id, note_id }) => runGlabApi(`projects/:id/merge_requests/${id}/draft_notes/${note_id}`, 'DELETE')
  },
  "gitlab_post_comment": {
    description: "Post a comment to an MR that is published IMMEDIATELY.",
    parameters: { id: "string", path: "string", line: "number", message: "string" },
    required: ["id", "path", "line", "message"],
    run: ({ id, path, line, message }) => {
      try {
        const diffRefs = getMrDiffRefs(id);
        const payload = { body: message, position: { base_sha: diffRefs.base_sha, head_sha: diffRefs.head_sha, start_sha: diffRefs.start_sha, position_type: 'text', new_path: path, new_line: line } };
        return runGlabApi(`projects/:id/merge_requests/${id}/discussions`, 'POST', payload);
      } catch (e) { return e.message; }
    }
  },
  "gitlab_add_comment_to_review": {
    description: "Add a comment to an ongoing review (Draft Mode).",
    parameters: { id: "string", path: "string", line: "number", message: "string" },
    required: ["id", "path", "line", "message"],
    run: ({ id, path, line, message }) => {
      try {
        const diffRefs = getMrDiffRefs(id);
        const payload = { note: message, position: { base_sha: diffRefs.base_sha, head_sha: diffRefs.head_sha, start_sha: diffRefs.start_sha, position_type: 'text', new_path: path, new_line: line } };
        return runGlabApi(`projects/:id/merge_requests/${id}/draft_notes`, 'POST', payload);
      } catch (e) { return e.message; }
    }
  },
  "gitlab_submit_review": {
    description: "Submit your full review (publishes drafts).",
    parameters: { id: "string", outcome: "string", message: "string" },
    required: ["id", "outcome"],
    run: ({ id, outcome, message }) => {
      const publishResp = runGlabApi(`projects/:id/merge_requests/${id}/draft_notes/bulk_publish`, 'POST');
      if (publishResp.startsWith('ERROR:')) return publishResp;
      let body = message || "Review submitted.";
      if (outcome === 'APPROVE') body = `/submit_review /approve\n\n${body}`;
      else if (outcome === 'REQUEST_CHANGES') body = `/submit_review /request_changes\n\n${body}`;
      else body = `/submit_review\n\n${body}`;
      return runGlabApi(`projects/:id/merge_requests/${id}/notes`, 'POST', { body });
    }
  },
  "gitlab_approve": {
    description: "Approve an MR.",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGlabApi(`projects/:id/merge_requests/${id}/approve`, 'POST')
  },
  "gitlab_unapprove": {
    description: "Revoke approval.",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGlabApi(`projects/:id/merge_requests/${id}/unapprove`, 'POST')
  },
  "gitlab_list_discussions": {
    description: "List all discussion threads in an MR.",
    parameters: { id: "string", only_unresolved: "boolean" },
    required: ["id"],
    run: ({ id, only_unresolved }) => {
      const resp = runGlabApi(`projects/:id/merge_requests/${id}/discussions`);
      if (resp.startsWith('Error:') || resp.startsWith('ERROR:')) return resp;
      let discs = JSON.parse(resp);
      if (only_unresolved) discs = discs.filter(d => d.notes.some(n => n.resolvable && !n.resolved));
      return JSON.stringify(discs.map(d => ({ id: d.id, resolvable: d.resolvable || false, resolved: d.resolved || false, notes: d.notes.map(n => ({ id: n.id, body: n.body, author: n.author.username, resolvable: n.resolvable, resolved: n.resolved })) })), null, 2);
    }
  },
  "gitlab_reply_to_discussion": {
    description: "Reply to a thread. Set 'resolve: true' to close the loop.",
    parameters: { id: "string", discussion_id: "string", message: "string", resolve: "boolean" },
    required: ["id", "discussion_id", "message"],
    run: ({ id, discussion_id, message, resolve }) => {
      const payload = { body: message };
      if (resolve) payload.resolve_discussion = true;
      return runGlabApi(`projects/:id/merge_requests/${id}/discussions/${discussion_id}/notes`, 'POST', payload);
    }
  },
  "gitlab_resolve_discussion": {
    description: "Toggle resolution status of a thread.",
    parameters: { id: "string", discussion_id: "string", resolved: "boolean" },
    required: ["id", "discussion_id", "resolved"],
    run: ({ id, discussion_id, resolved }) => runGlabApi(`projects/:id/merge_requests/${id}/discussions/${discussion_id}?resolved=${resolved}`, 'PUT')
  },

  // --- CI/CD Monitoring ---
  "gitlab_list_workflow_runs": {
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
  "gitlab_run_workflow": {
    description: "Create/Run a new CI pipeline on a specific branch/ref.",
    parameters: { ref: "string" },
    required: ["ref"],
    run: ({ ref }) => runGlab(['ci', 'run', '--branch', ref])
  },
  "gitlab_get_workflow_run_details": {
    description: "Fetch pipeline details. Set 'failed_logs: true' to automatically include traces for failed jobs.",
    parameters: { id: "string", failed_logs: "boolean" },
    required: ["id"],
    run: ({ id, failed_logs }) => {
      const response = runGlabApi(`projects/:id/pipelines/${id}`);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const p = JSON.parse(response);
        const details = {
          id: p.id, iid: p.iid, project_id: p.project_id, status: p.status, ref: p.ref, web_url: p.web_url,
          created_at: p.created_at, updated_at: p.updated_at, started_at: p.started_at, finished_at: p.finished_at, duration: p.duration
        };
        
        if (failed_logs && (p.status === 'failed' || p.status === 'success')) {
          const jobsResp = runGlabApi(`projects/:id/pipelines/${id}/jobs`);
          if (!jobsResp.startsWith('Error:') && !jobsResp.startsWith('ERROR:')) {
            const jobs = JSON.parse(jobsResp);
            const failedJobs = jobs.filter(j => j.status === 'failed');
            if (failedJobs.length > 0) {
              details.failed_job_logs = failedJobs.map(j => {
                const trace = runGlabApi(`projects/:id/jobs/${j.id}/trace`);
                return {
                  name: j.name,
                  log: trace.length > 5000 ? trace.substring(0, 5000) + "\n... [TRUNCATED]" : trace
                };
              });
            }
          }
        }
        
        return JSON.stringify(details, null, 2);
      } catch (e) { return response; }
    }
  },
  "gitlab_wait_for_workflow_run": {
    description: "Wait for pipeline completion (Polling).",
    parameters: { id: "string", timeout_minutes: "number" },
    required: ["id"],
    run: async ({ id, timeout_minutes }) => {
      const start = Date.now();
      const timeoutMs = (timeout_minutes || 10) * 60 * 1000;
      while (Date.now() - start < timeoutMs) {
        const resp = runGlabApi(`projects/:id/pipelines/${id}`);
        if (resp.startsWith('Error:') || resp.startsWith('ERROR:')) return resp;
        const pipe = JSON.parse(resp);
        if (['success', 'failed', 'canceled', 'skipped', 'manual'].includes(pipe.status)) return `Pipeline ${id} finished with status: ${pipe.status}`;
        await new Promise(r => setTimeout(r, 15000));
      }
      return `TIMEOUT: Pipeline ${id} did not complete.`;
    }
  },
  "gitlab_list_workflow_run_jobs": {
    description: "List jobs for a pipeline.",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => {
      const resp = runGlabApi(`projects/:id/pipelines/${id}/jobs`);
      if (resp.startsWith('Error:') || resp.startsWith('ERROR:')) return response;
      try {
        const jobs = JSON.parse(resp);
        return JSON.stringify(jobs.map(j => ({ id: j.id, name: j.name, status: j.status, stage: j.stage, web_url: j.web_url })), null, 2);
      } catch (e) { return resp; }
    }
  },
  "gitlab_get_job_logs": {
    description: "Fetch job log trace.",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGlabApi(`projects/:id/jobs/${id}/trace`)
  },
  "gitlab_set_auto_merge": {
    description: "Enable auto-merge for an MR.",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGlab(['mr', 'merge', id, '--auto', '--yes'])
  },

  // --- Security & Vulnerabilities ---
  "gitlab_list_vulnerabilities": {
    description: "List vulnerability findings for a project.",
    parameters: { workflow_run_id: "string", severity: "string", report_type: "string", state: "string" },
    required: [],
    run: ({ workflow_run_id, severity, report_type, state }) => {
      let endpoint = `projects/:id/vulnerability_findings?scope=${state || 'all'}`;
      if (workflow_run_id) endpoint += `&pipeline_id=${workflow_run_id}`;
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
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGlabApi(`vulnerabilities/${id}`)
  },
  "gitlab_dismiss_vulnerability": {
    description: "Dismiss a vulnerability (Mark as false positive, etc.).",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGlabApi(`vulnerabilities/${id}/dismiss`, 'POST')
  },
  "gitlab_resolve_vulnerability": {
    description: "Mark a vulnerability as fixed.",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGlabApi(`vulnerabilities/${id}/resolve`, 'POST')
  },

  // --- Safety Hatch ---
  "gitlab_run_command": {
    description: "Run a custom glab command not covered by other tools. Automatically handles non-interactive mode and suppresses pagers.",
    parameters: { command: "string" },
    required: ["command"],
    run: ({ command }) => {
      // Basic sanitization: prevent command injection by splitting into args array
      const args = command.trim().split(/\s+/);
      return runGlab(args);
    }
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
      const response = { jsonrpc: "2.0", id: request.id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "gitlab-mcp", version: "3.3.0" } } };
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
