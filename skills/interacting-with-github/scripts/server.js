const { execSync } = require('child_process');
const readline = require('readline');

// All protocol-breaking logs must go to stderr
const log = (msg) => process.stderr.write(`[github-mcp] ${msg}\n`);
log('Server starting...');

const GH_ENV = { ...process.env, GH_PAGER: 'cat', PAGER: 'cat' };

function handleGhError(error) {
  const stderr = error.stderr ? error.stderr.toString() : '';
  const stdout = error.stdout ? error.stdout.toString() : '';
  const message = error.message || '';
  
  if (message.includes('not found') || stderr.includes('not found')) {
    return "ERROR: 'gh' CLI is not installed or not in PATH. This MCP server requires the GitHub CLI to function. Please install it from https://cli.github.com/";
  }

  if (stderr.includes('gh auth login') || stdout.includes('gh auth login') || stderr.includes('Not logged in')) {
    return "ERROR: GitHub authentication failed. Please run 'gh auth login' in your terminal.";
  }
  
  return `Error: ${error.message}\nSTDOUT: ${stdout}\nSTDERR: ${stderr}`;
}

function runGh(argsArray) {
  const cmd = `gh ${argsArray.join(' ')}`;
  try { return execSync(cmd, { env: GH_ENV, encoding: 'utf-8' }); }
  catch (error) { return handleGhError(error); }
}

function runGhApi(endpoint, method = 'GET', data = null) {
  let cmd = `gh api "${endpoint}"`;
  if (method !== 'GET') cmd += ` --method ${method}`;
  let input = undefined;
  if (data) { 
    input = JSON.stringify(data); 
    cmd += ` --input - -H "Content-Type: application/json"`; 
  }
  try { return execSync(cmd, { input, env: GH_ENV, encoding: 'utf-8' }); }
  catch (error) { return handleGhError(error); }
}

function runGhGraphql(query, variables = {}) {
  const input = JSON.stringify({ query, variables });
  try {
    return execSync(`gh api graphql --input -`, { input, env: GH_ENV, encoding: 'utf-8' });
  } catch (error) { return handleGhError(error); }
}

function distillPr(pr) {
  return {
    id: pr.number,
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
    id: v.number,
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
      if (s === 'repos') args.push('nameWithOwner,description,url,stargazerCount');
      if (s === 'code') args.push('path,repository,url');
      
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
    parameters: { type: "string", id: "string", comments: "boolean" },
    required: ["type"],
    run: ({ type, id, comments }) => {
      const args = [type, 'view'];
      if (id) args.push(id);
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
      return runGh(['api', `repos/{owner}/{repo}/contents/${path}${branch ? '?ref=' + branch : ''}`, '-H', 'Accept: application/vnd.github.v3.raw']);
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
      if (title) args.push('--title', `"${title}"`);
      if (body) args.push('--body', `"${body}"`);
      if (base) args.push('--base', base);
      if (head) args.push('--head', head);
      if (labels) args.push('--label', `"${labels}"`);
      if (draft) args.push('--draft');
      return runGh(args);
    }
  },
  "github_merge_pull_request": {
    description: "Merge a PR.",
    parameters: { id: "string", method: "string", delete_branch: "boolean" },
    required: ["id"],
    run: ({ id, method, delete_branch }) => {
      const args = ['pr', 'merge', id, '--merge']; // Default to merge commit
      if (method === 'squash') args[3] = '--squash';
      if (method === 'rebase') args[3] = '--rebase';
      if (delete_branch) args.push('--delete-branch');
      return runGh(args);
    }
  },
  "github_get_pull_request_details": {
    description: "Fetch full PR details. Set 'full_context: true' to bundle security and checks.",
    parameters: { id: "string", full_context: "boolean" },
    required: ["id"],
    run: async ({ id, full_context }) => {
      const response = runGh(['pr', 'view', id, '--json', 'number,title,state,author,url,labels,isDraft,body,baseRefName,headRefName,mergeable,statusCheckRollup']);
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
            runGhApi(`repos/{owner}/{repo}/code-scanning/alerts?pr=${id}&state=open`),
            runGhApi(`repos/{owner}/{repo}/issues/${id}/comments?per_page=50`)
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
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGh(['pr', 'diff', id])
  },

  // --- Feedback & Review Lifecycle ---
  "github_get_comment": {
    description: "Fetch details of a specific comment from a PR/Issue.",
    parameters: { id: "string", note_id: "string" },
    required: ["id", "note_id"],
    run: ({ note_id }) => runGhApi(`repos/{owner}/{repo}/issues/comments/${note_id}`)
  },
  "github_edit_comment": {
    description: "Edit an existing published comment.",
    parameters: { id: "string", note_id: "string", message: "string" },
    required: ["id", "note_id", "message"],
    run: ({ note_id, message }) => runGhApi(`repos/{owner}/{repo}/issues/comments/${note_id}`, 'PATCH', { body: message })
  },
  "github_delete_comment": {
    description: "Delete a specific published comment.",
    parameters: { id: "string", note_id: "string" },
    required: ["id", "note_id"],
    run: ({ note_id }) => runGhApi(`repos/{owner}/{repo}/issues/comments/${note_id}`, 'DELETE')
  },
  "github_list_review_comments": {
    description: "List all pending/draft comments (Review mode).",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGhApi(`repos/{owner}/{repo}/pulls/${id}/comments`)
  },
  "github_edit_review_comment": {
    description: "Edit a pending/draft comment from an ongoing review.",
    parameters: { id: "string", note_id: "string", message: "string" },
    required: ["id", "note_id", "message"],
    run: ({ note_id, message }) => runGhApi(`repos/{owner}/{repo}/pulls/comments/${note_id}`, 'PATCH', { body: message })
  },
  "github_delete_review_comment": {
    description: "Delete a pending/draft comment from an ongoing review.",
    parameters: { id: "string", note_id: "string" },
    required: ["id", "note_id"],
    run: ({ note_id }) => runGhApi(`repos/{owner}/{repo}/pulls/comments/${note_id}`, 'DELETE')
  },
  "github_post_comment": {
    description: "Post a top-level comment to a PR/Issue.",
    parameters: { id: "string", message: "string" },
    required: ["id", "message"],
    run: ({ id, message }) => runGh(['pr', 'comment', id, '--body', `"${message}"`])
  },
  "github_add_comment_to_review": {
    description: "Add a precise line-level comment to a PR review.",
    parameters: { id: "string", path: "string", line: "number", message: "string" },
    required: ["id", "path", "line", "message"],
    run: ({ id, path, line, message }) => {
      try {
        const prInfoResp = runGh(['pr', 'view', id, '--json', 'commits']);
        if (prInfoResp.startsWith('Error:') || prInfoResp.startsWith('ERROR:')) return prInfoResp;
        const prInfo = JSON.parse(prInfoResp);
        if (!prInfo.commits || prInfo.commits.length === 0) return "ERROR: No commits found in PR.";
        
        const latestCommit = prInfo.commits[prInfo.commits.length - 1].oid;
        const payload = {
          body: message,
          commit_id: latestCommit,
          path: path,
          line: line
        };
        return runGhApi(`repos/{owner}/{repo}/pulls/${id}/comments`, 'POST', payload);
      } catch (e) { return e.message; }
    }
  },
  "github_submit_review": {
    description: "Submit a full PR review.",
    parameters: { id: "string", outcome: "string", message: "string" },
    required: ["id", "outcome"],
    run: ({ id, outcome, message }) => {
      const args = ['pr', 'review', id];
      if (outcome === 'APPROVE') args.push('--approve');
      else if (outcome === 'REQUEST_CHANGES') args.push('--request-changes');
      else args.push('--comment');
      if (message) args.push('--body', `"${message}"`);
      return runGh(args);
    }
  },
  "github_approve": {
    description: "Approve a PR.",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGh(['pr', 'review', id, '--approve'])
  },
  "github_unapprove": {
    description: "Revoke approval (Set to comment).",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGh(['pr', 'review', id, '--comment', '--body', '"Revoking approval."'])
  },
  "github_list_discussions": {
    description: "List all discussion threads in a PR (High-fidelity GraphQL).",
    parameters: { id: "string", only_unresolved: "boolean" },
    required: ["id"],
    run: ({ id, only_unresolved }) => {
      // Use GraphQL to get actual thread objects and isResolved status
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
      const response = runGhGraphql(query, { num: parseInt(id) });
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const data = JSON.parse(response);
        let threads = data.data.repository.pullRequest.reviewThreads.nodes;
        if (only_unresolved) threads = threads.filter(t => !t.isResolved);
        return JSON.stringify(threads.map(t => ({
          id: t.id,
          resolved: t.isResolved,
          notes: t.comments.nodes.map(c => ({ id: c.id, body: c.body, author: c.author ? c.author.login : 'unknown' }))
        })), null, 2);
      } catch (e) { return response; }
    }
  },
  "github_reply_to_discussion": {
    description: "Reply to a thread.",
    parameters: { id: "string", discussion_id: "string", message: "string" },
    required: ["id", "discussion_id", "message"],
    run: ({ id, discussion_id, message }) => {
      // GitHub replies use the database ID usually, but GraphQL threadId is safer for some ops.
      // For REST, we need the database ID of one of the comments.
      // If discussion_id is a GraphQL ID (starting with PRRT_), we use GraphQL.
      if (discussion_id.startsWith('PRRT_')) {
        const mutation = `mutation($threadId: ID!, $body: String!) {
          addPullRequestReviewThreadReply(input: {pullRequestReviewThreadId: $threadId, body: $body}) {
            comment { id body }
          }
        }`;
        return runGhGraphql(mutation, { threadId: discussion_id, body: message });
      }
      const payload = { body: message, in_reply_to_id: parseInt(discussion_id) };
      return runGhApi(`repos/{owner}/{repo}/pulls/${id}/comments`, 'POST', payload);
    }
  },
  "github_resolve_discussion": {
    description: "Toggle resolution status of a thread.",
    parameters: { id: "string", discussion_id: "string", resolved: "boolean" },
    required: ["id", "discussion_id", "resolved"],
    run: ({ discussion_id, resolved }) => {
      const mutation = resolved 
        ? `mutation($id: ID!) { resolveReviewThread(input: {threadId: $id}) { thread { isResolved } } }`
        : `mutation($id: ID!) { unresolveReviewThread(input: {threadId: $id}) { thread { isResolved } } }`;
      return runGhGraphql(mutation, { id: discussion_id });
    }
  },
  "github_resolve_discussions": {
    description: "Resolve multiple discussion threads at once.",
    parameters: { id: "string", discussion_ids: "string" }, // list of IDs separated by comma or space
    required: ["id", "discussion_ids"],
    run: async ({ discussion_ids }) => {
      const ids = discussion_ids.split(/[\s,]+/).filter(Boolean);
      const results = [];
      for (const tid of ids) {
        const mutation = `mutation($id: ID!) { resolveReviewThread(input: {threadId: $id}) { thread { isResolved } } }`;
        const resp = runGhGraphql(mutation, { id: tid });
        results.push({ id: tid, success: !resp.startsWith('Error:') });
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
    parameters: { id: "string", failed_logs: "boolean" },
    required: ["id"],
    run: ({ id, failed_logs }) => {
      if (failed_logs) {
        const logs = runGh(['run', 'view', id, '--log-failed']);
        return logs.length > 5000 ? logs.substring(0, 5000) + "\n... [TRUNCATED]" : logs;
      }
      return runGh(['run', 'view', id, '--json', 'number,status,conclusion,url,createdAt,updatedAt,jobs']);
    }
  },
  "github_wait_for_workflow_run": {
    description: "Wait for a GitHub Actions workflow run to complete (Polling).",
    parameters: { id: "string", timeout_minutes: "number" },
    required: ["id"],
    run: async ({ id, timeout_minutes }) => {
      const start = Date.now();
      const timeoutMs = (timeout_minutes || 10) * 60 * 1000;
      while (Date.now() - start < timeoutMs) {
        const resp = runGh(['run', 'view', id, '--json', 'status,conclusion']);
        if (resp.startsWith('Error:') || resp.startsWith('ERROR:')) return resp;
        try {
          const run = JSON.parse(resp);
          if (run.status === 'completed') return `Workflow run ${id} finished with conclusion: ${run.conclusion}`;
        } catch (e) { /* ignore parse error on polling */ }
        await new Promise(r => setTimeout(r, 15000));
      }
      return `TIMEOUT: Workflow run ${id} did not complete.`;
    }
  },
  "github_list_workflow_run_jobs": {
    description: "List jobs for a workflow run.",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGh(['run', 'view', id, '--json', 'jobs'])
  },
  "github_get_job_logs": {
    description: "Fetch logs for a specific job.",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGh(['run', 'view', '--job', id, '--log'])
  },
  "github_set_auto_merge": {
    description: "Enable auto-merge for a PR.",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGh(['pr', 'merge', id, '--auto', '--merge'])
  },

  // --- Security & Vulnerabilities ---
  "github_list_vulnerabilities": {
    description: "List code scanning alerts for a repository or PR.",
    parameters: { id: "string", severity: "string", state: "string" }, // id is pr_number
    required: [],
    run: ({ id, severity, state }) => {
      let endpoint = `repos/{owner}/{repo}/code-scanning/alerts?per_page=100`;
      if (id) endpoint += `&pr=${id}`;
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
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => runGhApi(`repos/{owner}/{repo}/code-scanning/alerts/${id}`)
  },
  "github_dismiss_vulnerability": {
    description: "Dismiss a code scanning alert.",
    parameters: { id: "string", reason: "string" },
    required: ["id", "reason"],
    run: ({ id, reason }) => runGhApi(`repos/{owner}/{repo}/code-scanning/alerts/${id}`, 'PATCH', { state: 'dismissed', dismissed_reason: reason })
  },
  "github_resolve_vulnerability": {
    description: "Mark a code scanning alert as fixed (Handled automatically by GitHub usually).",
    parameters: { id: "string" },
    required: ["id"],
    run: ({ id }) => `NOTE: GitHub code scanning alerts are resolved automatically when the fix is merged. Alert ID: ${id}`
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
      const response = { jsonrpc: "2.0", id: request.id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "github-mcp", version: "3.4.0" } } };
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
