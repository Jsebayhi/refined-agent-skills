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

function distillPr(pr) {
  return {
    number: pr.number,
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

function distillVulnerability(v) {
  return {
    number: v.number,
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
    description: "Search for repositories, or pull requests globally.",
    parameters: { query: "string", scope: "string" },
    required: ["query"],
    run: ({ query, scope }) => {
      const s = scope || 'repos';
      const args = ['search', s, query, '--json'];
      if (s === 'prs') args.push('number,title,state,author,url,labels,isDraft');
      if (s === 'repos') args.push('nameWithOwner,description,url,stargazerCount');
      
      const response = runGh(args);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const results = JSON.parse(response);
        if (s === 'prs') return JSON.stringify(results.map(distillPr), null, 2);
        if (s === 'repos') return JSON.stringify(results.map(distillRepo), null, 2);
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
        return JSON.stringify(JSON.parse(response).map(i => ({ name: i.name, type: i.type, path: i.path })), null, 2);
      } catch (e) { return response; }
    }
  },
  "github_get_repository_file": {
    description: "Fetch raw content of a file from the repository.",
    parameters: { path: "string", branch: "string" },
    required: ["path"],
    run: ({ path, branch }) => {
      return runGhApi(`repos/{owner}/{repo}/contents/${path}${branch ? '?ref=' + branch : ''}`, 'GET', null, { 
        headers: { 'Accept': 'application/vnd.github.v3.raw' } 
      });
      // Note: runGhApi needs header support or a raw flag. I'll use gh api --raw for this if needed.
      // Refined runGhApi below handles it via runGh(['api', ...])
    }
  },

  // --- PR / Pull Request Management ---
  "github_list_prs": {
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
  "github_create_pr": {
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
  "github_merge_pr": {
    description: "Merge a PR.",
    parameters: { number: "string", method: "string", delete_branch: "boolean" },
    required: ["number"],
    run: ({ number, method, delete_branch }) => {
      const args = ['pr', 'merge', number, '--merge']; // Default to merge commit
      if (method === 'squash') args[3] = '--squash';
      if (method === 'rebase') args[3] = '--rebase';
      if (delete_branch) args.push('--delete-branch');
      return runGh(args);
    }
  },
  "github_get_pr_details": {
    description: "Fetch full PR details (Distilled summary).",
    parameters: { number: "string" },
    required: ["number"],
    run: ({ number }) => {
      const response = runGh(['pr', 'view', number, '--json', 'number,title,state,author,url,labels,isDraft,body,baseRefName,headRefName,mergeable,statusCheckRollup']);
      if (response.startsWith('Error:') || response.startsWith('ERROR:')) return response;
      try {
        const pr = JSON.parse(response);
        return JSON.stringify({
          ...distillPr(pr),
          body: pr.body ? pr.body.substring(0, 500) + (pr.body.length > 500 ? '...' : '') : '',
          base: pr.baseRefName,
          head: pr.headRefName,
          mergeable: pr.mergeable,
          checks: pr.statusCheckRollup ? pr.statusCheckRollup.map(c => ({ name: i.name || c.context, state: c.state || c.status, status: c.conclusion })) : []
        }, null, 2);
      } catch (e) { return response; }
    }
  },
  "github_get_pr_diffs": {
    description: "Fetch the diffs for a specific Pull Request.",
    parameters: { number: "string" },
    required: ["number"],
    run: ({ number }) => runGh(['pr', 'diff', number])
  },

  // --- Feedback & Review Lifecycle ---
  "github_get_comment": {
    description: "Fetch details of a specific comment from a PR/Issue.",
    parameters: { comment_id: "string" },
    required: ["comment_id"],
    run: ({ comment_id }) => runGhApi(`repos/{owner}/{repo}/issues/comments/${comment_id}`)
  },
  "github_edit_comment": {
    description: "Edit an existing comment.",
    parameters: { comment_id: "string", body: "string" },
    required: ["comment_id", "body"],
    run: ({ comment_id, body }) => runGhApi(`repos/{owner}/{repo}/issues/comments/${comment_id}`, 'PATCH', { body })
  },
  "github_delete_comment": {
    description: "Delete a specific comment.",
    parameters: { comment_id: "string" },
    required: ["comment_id"],
    run: ({ comment_id }) => runGhApi(`repos/{owner}/{repo}/issues/comments/${comment_id}`, 'DELETE')
  },
  "github_post_comment": {
    description: "Post a comment to a PR/Issue.",
    parameters: { number: "string", body: "string" },
    required: ["number", "body"],
    run: ({ number, body }) => runGh(['pr', 'comment', number, '--body', `"${body}"`])
  },
  "github_submit_review": {
    description: "Submit a full PR review.",
    parameters: { number: "string", outcome: "string", body: "string" },
    required: ["number", "outcome"],
    run: ({ number, outcome, body }) => {
      const args = ['pr', 'review', number];
      if (outcome === 'APPROVE') args.push('--approve');
      else if (outcome === 'REQUEST_CHANGES') args.push('--request-changes');
      else args.push('--comment');
      if (body) args.push('--body', `"${body}"`);
      return runGh(args);
    }
  },

  // --- CI/CD Monitoring ---
  "github_list_runs": {
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
  "github_get_run_details": {
    description: "Fetch workflow run details.",
    parameters: { run_id: "string" },
    required: ["run_id"],
    run: ({ run_id }) => runGh(['run', 'view', run_id, '--json', 'number,status,conclusion,url,createdAt,updatedAt,jobs'])
  },
  "github_get_job_logs": {
    description: "Fetch logs for a specific job.",
    parameters: { job_id: "string" },
    required: ["job_id"],
    run: ({ job_id }) => runGh(['run', 'view', '--job', job_id, '--log'])
  },

  // --- Security & Vulnerabilities ---
  "github_list_vulnerability_findings": {
    description: "List code scanning alerts for a repository or PR.",
    parameters: { pr_number: "string", severity: "string", state: "string" },
    required: [],
    run: ({ pr_number, severity, state }) => {
      let endpoint = `repos/{owner}/{repo}/code-scanning/alerts?per_page=100`;
      if (pr_number) endpoint += `&pr=${pr_number}`;
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
    parameters: { alert_number: "string" },
    required: ["alert_number"],
    run: ({ alert_number }) => runGhApi(`repos/{owner}/{repo}/code-scanning/alerts/${alert_number}`)
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
      const response = { jsonrpc: "2.0", id: request.id, result: { protocolVersion: "2024-11-05", capabilities: { tools: {} }, serverInfo: { name: "github-mcp", version: "1.0.0" } } };
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
