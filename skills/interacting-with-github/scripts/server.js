const { spawnSync } = require('child_process');
const readline = require('readline');

// All protocol-breaking logs must go to stderr
const log = (msg) => process.stderr.write(`[github-mcp] ${msg}\n`);
log('Server starting...');

const GH_ENV = { ...process.env, GH_PAGER: 'cat', PAGER: 'cat' };

function handleGhError(result) {
  const stderr = result.stderr ? result.stderr.toString() : '';
  const stdout = result.stdout ? result.stdout.toString() : '';
  const message = result.error ? result.error.message : '';
  
  if (message.includes('ENOENT') || stderr.includes('not found')) {
    return "ERROR: 'gh' CLI is not installed or not in PATH. This MCP server requires the GitHub CLI to function. Please install it from https://cli.github.com/";
  }

  if (stderr.includes('gh auth login') || stdout.includes('gh auth login') || stderr.includes('Not logged in')) {
    return "ERROR: GitHub authentication failed. Please run 'gh auth login' in your terminal.";
  }
  
  return `Error: ${message}\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`;
}

function runGh(argsArray, input = undefined) {
  const result = spawnSync('gh', argsArray, { env: GH_ENV, input, encoding: 'utf-8' });
  if (result.status !== 0) {
    return handleGhError(result);
  }
  return result.stdout;
}

function runGhApi(endpoint, method = 'GET', data = null) {
  const args = ['api', endpoint];
  if (method !== 'GET') args.push('--method', method);
  let input = undefined;
  if (data) { 
    input = JSON.stringify(data); 
    args.push('--input', '-');
    args.push('-H', 'Content-Type: application/json');
  }
  return runGh(args, input);
}

function runGhGraphql(query, variables = {}) {
  const input = JSON.stringify({ query, variables });
  return runGh(['api', 'graphql', '--input', '-'], input);
}

function distillPr(pr) {
  return {
    pull_request_id: pr.number,
    title: pr.title,
    state: pr.state,
    author: pr.author ? pr.author.login : 'unknown',
    url: pr.url,
    labels: pr.labels ? pr.labels.map(l => l.name) : [],
    isDraft: pr.isDraft
  };
}

function distillRepo(repo) {
  return {
    fullName: repo.nameWithOwner || repo.full_name,
    description: repo.description ? repo.description.substring(0, 100) + '...' : '',
    url: repo.url || repo.html_url,
    stargazerCount: repo.stargazerCount || repo.stargazers_count
  };
}

function distillCode(code) {
  return {
    path: code.path,
    repository: code.repository ? code.repository.nameWithOwner : 'unknown',
    url: code.url
  };
}

function distillVulnerability(v) {
  return {
    vulnerability_id: v.number,
    rule: v.rule ? v.rule.description : 'unknown',
    severity: v.rule ? v.rule.severity : v.severity,
    state: v.state,
    tool: v.tool ? v.tool.name : 'unknown',
    location: v.most_recent_instance ? { path: v.most_recent_instance.location.path, line: v.most_recent_instance.location.start_line } : 'unknown'
  };
}

const tools = {
  // --- Discovery & Research ---
  "github_search": {
    description: "Search for repositories, pull requests, or code globally.",
    parameters: { query: "string", scope: "string" },
    required: ["query"],
    run: ({ query, scope }) => {
      const s = scope || 'repos';
      const args = ['search', s, query, '--json'];
      if (s === 'prs') args.push('number,title,state,author,url,labels,isDraft');
      else if (s === 'repos') args.push('nameWithOwner,description,url,stargazerCount');
      else if (s === 'code') args.push('path,repository,url');
      
      const response = runGh(args);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const results = JSON.parse(response);
        if (s === 'prs') return JSON.stringify(results.map(distillPr), null, 2);
        if (s === 'repos') return JSON.stringify(results.map(distillRepo), null, 2);
        if (s === 'code') return JSON.stringify(results.map(distillCode), null, 2);
        return response;
      } catch (e) { return response; }
    }
  },
  "github_view": {
    description: "View details of a PR, Issue, or Repo.",
    parameters: { type: "string", pull_request_id: "string", comments: "boolean" },
    required: ["type"],
    run: ({ type, pull_request_id, comments }) => {
      const args = [type, 'view'];
      if (pull_request_id) args.push(pull_request_id);
      if (comments && (type === 'pr' || type === 'issue')) args.push('--comments');
      return runGh(args);
    }
  },
  "github_list_repository_tree": {
    description: "List files in a repository directory.",
    parameters: { path: "string", branch: "string" },
    required: [],
    run: ({ path, branch }) => {
      let endpoint = `repos/{owner}/{repo}/contents/${path || ''}`;
      if (branch) endpoint += `?ref=${branch}`;
      const response = runGhApi(endpoint);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const items = JSON.parse(response);
        if (!Array.isArray(items)) return response;
        return JSON.stringify(items.map(i => ({ name: i.name, type: i.type, path: i.path })), null, 2);
      } catch (e) { return response; }
    }
  },
  "github_find_file": {
    description: "Recursively search for a file by name or pattern in the repository.",
    parameters: { pattern: "string", branch: "string" },
    required: ["pattern"],
    run: ({ pattern, branch }) => {
      const ref = branch || 'HEAD';
      const response = runGhApi(`repos/{owner}/{repo}/git/trees/${ref}?recursive=1`);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const data = JSON.parse(response);
        const results = data.tree
          .filter(item => item.type === 'blob' && item.path.includes(pattern))
          .map(item => ({ path: item.path, sha: item.sha }));
        return JSON.stringify(results.slice(0, 50), null, 2);
      } catch (e) { return response; }
    }
  },
  "github_get_repository_file": {
    description: "Fetch raw content of a file from the repository.",
    parameters: { path: "string", branch: "string" },
    required: ["path"],
    run: ({ path, branch }) => {
      const endpoint = `repos/{owner}/{repo}/contents/${path}${branch ? '?ref=' + branch : ''}`;
      return runGh(['api', endpoint, '-H', 'Accept: application/vnd.github.v3.raw']);
    }
  },

  // --- PR / Pull Request Management ---
  "github_list_pull_requests": {
    description: "List Pull Requests with filters.",
    parameters: { state: "string", labels: "string", base: "string", author: "string", limit: "number" },
    required: [],
    run: ({ state, labels, base, author, limit }) => {
      const args = ['pr', 'list'];
      if (state) args.push('--state', state);
      if (labels) args.push('--label', labels);
      if (base) args.push('--base', base);
      if (author) args.push('--author', author);
      if (limit) args.push('--limit', limit.toString());
      return runGh(args);
    }
  },
  "github_create_pull_request": {
    description: "Create a new PR.",
    parameters: { title: "string", body: "string", base: "string", head: "string", labels: "string", draft: "boolean", fill: "boolean" },
    required: [],
    run: ({ title, body, base, head, labels, draft, fill }) => {
      const args = ['pr', 'create'];
      if (fill) args.push('--fill');
      if (title) args.push('--title', title);
      if (body) args.push('--body', body);
      if (base) args.push('--base', base);
      if (head) args.push('--head', head);
      if (labels) args.push('--label', labels);
      if (draft) args.push('--draft');
      return runGh(args);
    }
  },
  "github_merge_pull_request": {
    description: "Merge a PR.",
    parameters: { pull_request_id: "string", method: "string", delete_branch: "boolean" },
    required: ["pull_request_id"],
    run: ({ pull_request_id, method, delete_branch }) => {
      const args = ['pr', 'merge', pull_request_id, '--merge'];
      if (method === 'squash') args[3] = '--squash';
      if (method === 'rebase') args[3] = '--rebase';
      if (delete_branch) args.push('--delete-branch');
      return runGh(args);
    }
  },
  "github_get_pull_request_details": {
    description: "Fetch full PR details. Set 'full_context: true' to bundle security and checks.",
    parameters: { pull_request_id: "string", full_context: "boolean" },
    required: ["pull_request_id"],
    run: async ({ pull_request_id, full_context }) => {
      const response = runGh(['pr', 'view', pull_request_id, '--json', 'number,title,state,author,url,labels,isDraft,body,baseRefName,headRefName,mergeable,statusCheckRollup']);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const pr = JSON.parse(response);
        const details = {
          ...distillPr(pr),
          body: pr.body ? pr.body.substring(0, 500) + (pr.body.length > 500 ? '...' : '') : '',
          base: pr.baseRefName,
          head: pr.headRefName,
          mergeable: pr.mergeable,
          checks: pr.statusCheckRollup ? pr.statusCheckRollup.map(c => ({ name: c.name || c.context, state: c.state || c.status, status: c.conclusion })) : []
        };

        if (full_context) {
          const [vulnResp, commResp] = await Promise.all([
            runGhApi(`repos/{owner}/{repo}/code-scanning/alerts?pr=${pull_request_id}&state=open`),
            runGhApi(`repos/{owner}/{repo}/issues/${pull_request_id}/comments?per_page=50`)
          ]);

          if (!vulnResp.startsWith('Error:')) {
            const vulns = JSON.parse(vulnResp);
            details.critical_vulnerabilities = vulns.map(distillVulnerability);
          }

          if (!commResp.startsWith('Error:')) {
            const comments = JSON.parse(commResp);
            details.recent_comments = comments.slice(-5).map(c => ({ author: c.user.login, body: c.body.substring(0, 100) + '...' }));
          }
        }

        return JSON.stringify(details, null, 2);
      } catch (e) { return response; }
    }
  },
  "github_get_pull_request_diffs": {
    description: "Fetch the diffs for a specific Pull Request.",
    parameters: { pull_request_id: "string" },
    required: ["pull_request_id"],
    run: ({ pull_request_id }) => runGh(['pr', 'diff', pull_request_id])
  },

  // --- Feedback & Review Lifecycle ---
  "github_get_comment": {
    description: "Fetch details of a specific comment from a PR/Issue.",
    parameters: { pull_request_id: "string", comment_id: "string" },
    required: ["pull_request_id", "comment_id"],
    run: ({ comment_id }) => runGhApi(`repos/{owner}/{repo}/issues/comments/${comment_id}`)
  },
  "github_edit_comment": {
    description: "Edit an existing published comment.",
    parameters: { pull_request_id: "string", comment_id: "string", message: "string" },
    required: ["pull_request_id", "comment_id", "message"],
    run: ({ comment_id, message }) => runGhApi(`repos/{owner}/{repo}/issues/comments/${comment_id}`, 'PATCH', { body: message })
  },
  "github_delete_comment": {
    description: "Delete a specific published comment.",
    parameters: { pull_request_id: "string", comment_id: "string" },
    required: ["pull_request_id", "comment_id"],
    run: ({ comment_id }) => runGhApi(`repos/{owner}/{repo}/issues/comments/${comment_id}`, 'DELETE')
  },
  "github_list_review_comments": {
    description: "List all pending/draft comments (Review mode).",
    parameters: { pull_request_id: "string" },
    required: ["pull_request_id"],
    run: ({ pull_request_id }) => runGhApi(`repos/{owner}/{repo}/pulls/${pull_request_id}/comments`)
  },
  "github_edit_review_comment": {
    description: "Edit a pending/draft comment from an ongoing review.",
    parameters: { pull_request_id: "string", comment_id: "string", message: "string" },
    required: ["pull_request_id", "comment_id", "message"],
    run: ({ comment_id, message }) => runGhApi(`repos/{owner}/{repo}/pulls/comments/${comment_id}`, 'PATCH', { body: message })
  },
  "github_delete_review_comment": {
    description: "Delete a pending/draft comment from an ongoing review.",
    parameters: { pull_request_id: "string", comment_id: "string" },
    required: ["pull_request_id", "comment_id"],
    run: ({ comment_id }) => runGhApi(`repos/{owner}/{repo}/pulls/comments/${comment_id}`, 'DELETE')
  },
  "github_post_comment": {
    description: "Post a top-level comment to a PR/Issue.",
    parameters: { pull_request_id: "string", message: "string" },
    required: ["pull_request_id", "message"],
    run: ({ pull_request_id, message }) => runGh(['pr', 'comment', pull_request_id, '--body', message])
  },
  "github_add_comment_to_review": {
    description: "Add a precise line-level comment to a PR review. Supports multi-line if 'start_line' is provided.",
    parameters: { pull_request_id: "string", path: "string", line: "number", start_line: "number", message: "string" },
    required: ["pull_request_id", "path", "line", "message"],
    run: ({ pull_request_id, path, line, start_line, message }) => {
      try {
        const prInfoResp = runGh(['pr', 'view', pull_request_id, '--json', 'commits']);
        if (prInfoResp.startsWith('Error:') || prInfoResp.startsWith('ERROR:')) return prInfoResp;
        const prInfo = JSON.parse(prInfoResp);
        if (!prInfo.commits || prInfo.commits.length === 0) return "ERROR: No commits found in PR.";
        
        const latestCommit = prInfo.commits[prInfo.commits.length - 1].oid;
        const payload = {
          body: message,
          commit_id: latestCommit,
          path: path,
          line: parseInt(line),
          side: "RIGHT"
        };

        if (start_line) {
          payload.start_line = parseInt(start_line);
          payload.start_side = "RIGHT";
        }

        return runGhApi(`repos/{owner}/{repo}/pulls/${pull_request_id}/comments`, 'POST', payload);
      } catch (e) { return e.message; }
    }
  },
  "github_submit_review": {
    description: "Submit a full PR review.",
    parameters: { pull_request_id: "string", outcome: "string", message: "string" },
    required: ["pull_request_id", "outcome"],
    run: ({ pull_request_id, outcome, message }) => {
      const args = ['pr', 'review', pull_request_id];
      if (outcome === 'APPROVE') args.push('--approve');
      else if (outcome === 'REQUEST_CHANGES') args.push('--request-changes');
      else args.push('--comment');
      if (message) args.push('--body', message);
      return runGh(args);
    }
  },
  "github_approve": {
    description: "Approve a PR.",
    parameters: { pull_request_id: "string" },
    required: ["pull_request_id"],
    run: ({ pull_request_id }) => runGh(['pr', 'review', pull_request_id, '--approve'])
  },
  "github_unapprove": {
    description: "Revoke approval (Set to comment).",
    parameters: { pull_request_id: "string" },
    required: ["pull_request_id"],
    run: ({ pull_request_id }) => runGh(['pr', 'review', pull_request_id, '--comment', '--body', 'Revoking approval.'])
  },
  "github_list_discussions": {
    description: "List all discussion threads in a PR (High-fidelity GraphQL).",
    parameters: { pull_request_id: "string", only_unresolved: "boolean" },
    required: ["pull_request_id"],
    run: ({ pull_request_id, only_unresolved }) => {
      const query = `query($num: Int!) {
        repository(owner: "{owner}", name: "{repo}") {
          pullRequest(number: $num) {
            reviewThreads(last: 50) {
              nodes {
                id
                isResolved
                comments(last: 10) {
                  nodes {
                    id
                    body
                    author { login }
                  }
                }
              }
            }
          }
        }
      }`;
      const response = runGhGraphql(query, { num: parseInt(pull_request_id) });
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const data = JSON.parse(response);
        let threads = data.data.repository.pullRequest.reviewThreads.nodes;
        if (only_unresolved) threads = threads.filter(t => !t.isResolved);
        return JSON.stringify(threads.map(t => ({
          thread_id: t.id,
          resolved: t.isResolved,
          notes: t.comments.nodes.map(c => ({ id: c.id, body: c.body, author: c.author ? c.author.login : 'unknown' }))
        })), null, 2);
      } catch (e) { return response; }
    }
  },
  "github_reply_to_discussion": {
    description: "Reply to a thread.",
    parameters: { pull_request_id: "string", thread_id: "string", message: "string" },
    required: ["pull_request_id", "thread_id", "message"],
    run: ({ pull_request_id, thread_id, message }) => {
      if (thread_id.startsWith('PRRT_')) {
        const mutation = `mutation($threadId: ID!, $body: String!) {
          addPullRequestReviewThreadReply(input: {pullRequestReviewThreadId: $threadId, body: $body}) {
            comment { id body }
          }
        }`;
        return runGhGraphql(mutation, { threadId: thread_id, body: message });
      }
      const payload = { body: message, in_reply_to_id: parseInt(thread_id) };
      return runGhApi(`repos/{owner}/{repo}/pulls/${pull_request_id}/comments`, 'POST', payload);
    }
  },
  "github_resolve_discussion": {
    description: "Toggle resolution status of a thread.",
    parameters: { pull_request_id: "string", thread_id: "string", resolved: "boolean" },
    required: ["pull_request_id", "thread_id", "resolved"],
    run: ({ thread_id, resolved }) => {
      const mutation = resolved 
        ? `mutation($id: ID!) { resolveReviewThread(input: {threadId: $id}) { thread { isResolved } } }`
        : `mutation($id: ID!) { unresolveReviewThread(input: {threadId: $id}) { thread { isResolved } } }`;
      return runGhGraphql(mutation, { id: thread_id });
    }
  },
  "github_resolve_discussions": {
    description: "Resolve multiple discussion threads at once.",
    parameters: { pull_request_id: "string", thread_ids: "string" },
    required: ["pull_request_id", "thread_ids"],
    run: async ({ thread_ids }) => {
      const ids = thread_ids.split(/[\s,]+/).filter(Boolean);
      const results = [];
      for (const tid of ids) {
        const mutation = `mutation($id: ID!) { resolveReviewThread(input: {threadId: $id}) { thread { isResolved } } }`;
        const resp = runGhGraphql(mutation, { id: tid });
        results.push({ thread_id: tid, success: !resp.startsWith('Error:') });
      }
      return JSON.stringify(results, null, 2);
    }
  },

  // --- CI/CD Monitoring ---
  "github_list_workflow_runs": {
    description: "List recent workflow runs.",
    parameters: { workflow: "string", status: "string", branch: "string" },
    required: [],
    run: ({ workflow, status, branch }) => {
      const args = ['run', 'list'];
      if (workflow) args.push('--workflow', workflow);
      if (status) args.push('--status', status);
      if (branch) args.push('--branch', branch);
      return runGh(args);
    }
  },
  "github_run_workflow": {
    description: "Create/Run a new workflow on a specific branch/ref.",
    parameters: { ref: "string", workflow: "string" },
    required: ["ref", "workflow"],
    run: ({ ref, workflow }) => runGh(['workflow', 'run', workflow, '--ref', ref])
  },
  "github_get_workflow_run_details": {
    description: "Fetch workflow run details. Set 'failed_logs: true' to automatically include logs for failed jobs.",
    parameters: { run_id: "string", failed_logs: "boolean" },
    required: ["run_id"],
    run: ({ run_id, failed_logs }) => {
      if (failed_logs) {
        const logs = runGh(['run', 'view', run_id, '--log-failed']);
        return logs.length > 5000 ? logs.substring(0, 5000) + "\n... [TRUNCATED]" : logs;
      }
      return runGh(['run', 'view', run_id, '--json', 'number,status,conclusion,url,createdAt,updatedAt,jobs']);
    }
  },
  "github_wait_for_workflow_run": {
    description: "Wait for a GitHub Actions workflow run to complete (Polling).",
    parameters: { run_id: "string", timeout_minutes: "number" },
    required: ["run_id"],
    run: async ({ run_id, timeout_minutes }) => {
      const start = Date.now();
      const timeoutMs = (timeout_minutes || 10) * 60 * 1000;
      while (Date.now() - start < timeoutMs) {
        const resp = runGh(['run', 'view', run_id, '--json', 'status,conclusion']);
        if (resp.startsWith('Error:') || resp.startsWith('ERROR:')) return resp;
        try {
          const run = JSON.parse(resp);
          if (run.status === 'completed') return `Workflow run ${run_id} finished with conclusion: ${run.conclusion}`;
        } catch (e) { /* ignore parse error on polling */ }
        await new Promise(r => setTimeout(r, 15000));
      }
      return `TIMEOUT: Workflow run ${run_id} did not complete.`;
    }
  },
  "github_list_workflow_run_jobs": {
    description: "List jobs for a workflow run.",
    parameters: { run_id: "string" },
    required: ["run_id"],
    run: ({ run_id }) => runGh(['run', 'view', run_id, '--json', 'jobs'])
  },
  "github_get_job_logs": {
    description: "Fetch logs for a specific job.",
    parameters: { job_id: "string" },
    required: ["job_id"],
    run: ({ job_id }) => runGh(['run', 'view', '--job', job_id, '--log'])
  },
  "github_set_auto_merge": {
    description: "Enable auto-merge for a PR.",
    parameters: { pull_request_id: "string" },
    required: ["pull_request_id"],
    run: ({ pull_request_id }) => runGh(['pr', 'merge', pull_request_id, '--auto', '--merge'])
  },

  // --- Security & Vulnerabilities ---
  "github_list_vulnerabilities": {
    description: "List code scanning alerts for a repository or PR.",
    parameters: { pull_request_id: "string", severity: "string", state: "string" },
    required: [],
    run: ({ pull_request_id, severity, state }) => {
      let endpoint = `repos/{owner}/{repo}/code-scanning/alerts?per_page=100`;
      if (pull_request_id) endpoint += `&pr=${pull_request_id}`;
      if (severity) endpoint += `&severity=${severity}`;
      if (state) endpoint += `&state=${state || 'open'}`;
      const response = runGhApi(endpoint);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const findings = JSON.parse(response);
        return JSON.stringify(findings.map(distillVulnerability), null, 2);
      } catch (e) { return response; }
    }
  },
  "github_get_vulnerability_details": {
    description: "Fetch full details for a specific code scanning alert.",
    parameters: { vulnerability_id: "string" },
    required: ["vulnerability_id"],
    run: ({ vulnerability_id }) => runGhApi(`repos/{owner}/{repo}/code-scanning/alerts/${vulnerability_id}`)
  },
  "github_dismiss_vulnerability": {
    description: "Dismiss a code scanning alert.",
    parameters: { vulnerability_id: "string", reason: "string" },
    required: ["vulnerability_id", "reason"],
    run: ({ vulnerability_id, reason }) => runGhApi(`repos/{owner}/{repo}/code-scanning/alerts/${vulnerability_id}`, 'PATCH', { state: 'dismissed', dismissed_reason: reason })
  },
  "github_resolve_vulnerability": {
    description: "Mark a code scanning alert as fixed (Handled automatically by GitHub usually).",
    parameters: { vulnerability_id: "string" },
    required: ["vulnerability_id"],
    run: ({ vulnerability_id }) => `NOTE: GitHub code scanning alerts are resolved automatically when the fix is merged. Alert ID: ${vulnerability_id}`
  },

  // --- Safety Hatch ---
  "github_run_command": {
    description: "Run a custom gh command. Automatically handles non-interactive mode.",
    parameters: { command: "string" },
    required: ["command"],
    run: ({ command }) => {
      const args = command.trim().split(/\s+/);
      return runGh(args);
    }
  },

  // --- Helpers ---
  "github_list_labels": {
    description: "List available project labels.",
    parameters: { project: "string" },
    required: [],
    run: ({ project }) => {
      const args = ['label', 'list'];
      if (project) args.push('--repo', project);
      return runGh(args);
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
      const response = { jsonrpc: "2.0", id: request.id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "github-mcp", version: "3.7.0" } } };
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
