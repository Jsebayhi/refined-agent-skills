const { execSync } = require('child_process');

const GLAB_ENV = { ...process.env, GLAB_PAGER: 'cat', PAGER: 'cat' };

function runGlab(argsArray) {
  const cmd = `glab ${argsArray.join(' ')}`;
  try {
    return execSync(cmd, { env: GLAB_ENV, encoding: 'utf-8' });
  } catch (error) {
    return `Error: ${error.message}\nSTDOUT: ${error.stdout}\nSTDERR: ${error.stderr}`;
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
    return `Error: ${error.message}\nSTDOUT: ${error.stdout}\nSTDERR: ${error.stderr}`;
  }
}

function getMrDiffRefs(iid) {
  const response = runGlabApi(`projects/:id/merge_requests/${iid}`);
  if (response.startsWith('Error:')) throw new Error(response);
  const mr = JSON.parse(response);
  return mr.diff_refs;
}

const tools = {
  "gitlab:get_mr_details": {
    description: "Fetch full details for a Merge Request.",
    parameters: { iid: "string" },
    run: ({ iid }) => {
      return runGlabApi(`projects/:id/merge_requests/${iid}`);
    }
  },
  "gitlab:post_line_comment": {
    description: "Post a precision comment on a specific line of a file in an MR (immediate publish).",
    parameters: { iid: "string", path: "string", line: "number", message: "string" },
    run: ({ iid, path, line, message }) => {
      try {
        const diffRefs = getMrDiffRefs(iid);
        const payload = {
          body: message,
          position: {
            base_sha: diffRefs.base_sha,
            head_sha: diffRefs.head_sha,
            start_sha: diffRefs.start_sha,
            position_type: 'text',
            new_path: path,
            new_line: line
          }
        };
        return runGlabApi(`projects/:id/merge_requests/${iid}/discussions`, 'POST', payload);
      } catch (e) { return e.message; }
    }
  },
  "gitlab:create_draft_note": {
    description: "Create a draft note (pending comment) on a specific line. Use this to start a multi-comment review.",
    parameters: { iid: "string", path: "string", line: "number", message: "string" },
    run: ({ iid, path, line, message }) => {
      try {
        const diffRefs = getMrDiffRefs(iid);
        const payload = {
          note: message,
          position: {
            base_sha: diffRefs.base_sha,
            head_sha: diffRefs.head_sha,
            start_sha: diffRefs.start_sha,
            position_type: 'text',
            new_path: path,
            new_line: line
          }
        };
        return runGlabApi(`projects/:id/merge_requests/${iid}/draft_notes`, 'POST', payload);
      } catch (e) { return e.message; }
    }
  },
  "gitlab:submit_review": {
    description: "Publish all draft notes and set the review outcome (APPROVE, REQUEST_CHANGES, or COMMENT).",
    parameters: { iid: "string", outcome: "string", message: "string" },
    run: ({ iid, outcome, message }) => {
      // 1. Bulk publish drafts
      runGlabApi(`projects/:id/merge_requests/${iid}/draft_notes/bulk_publish`, 'POST');
      
      // 2. Post summary note with quick action for outcome
      let body = message || "Review submitted.";
      if (outcome === 'APPROVE') body = `/submit_review /approve\n\n${body}`;
      else if (outcome === 'REQUEST_CHANGES') body = `/submit_review /request_changes\n\n${body}`;
      else body = `/submit_review\n\n${body}`;
      
      return runGlabApi(`projects/:id/merge_requests/${iid}/notes`, 'POST', { body });
    }
  },
  "gitlab:list_discussions": {
    description: "List all discussion threads in an MR.",
    parameters: { iid: "string", only_unresolved: "boolean" },
    run: ({ iid, only_unresolved }) => {
      const response = runGlabApi(`projects/:id/merge_requests/${iid}/discussions`);
      if (response.startsWith('Error:')) return response;
      let discussions = JSON.parse(response);
      if (only_unresolved) {
        discussions = discussions.filter(d => d.notes.some(n => n.resolvable && !n.resolved));
      }
      return JSON.stringify(discussions.map(d => ({
        id: d.id,
        resolvable: d.resolvable || false,
        resolved: d.resolved || false,
        notes: d.notes.map(n => ({ 
          id: n.id, body: n.body, author: n.author.username, resolvable: n.resolvable, resolved: n.resolved 
        }))
      })), null, 2);
    }
  },
  "gitlab:post_reply": {
    description: "Post a reply to an existing discussion thread.",
    parameters: { iid: "string", discussion_id: "string", message: "string" },
    run: ({ iid, discussion_id, message }) => {
      return runGlabApi(`projects/:id/merge_requests/${iid}/discussions/${discussion_id}/notes`, 'POST', { body: message });
    }
  },
  "gitlab:set_auto_merge": {
    description: "Enable auto-merge for an MR (Merge when pipeline succeeds).",
    parameters: { iid: "string" },
    run: ({ iid }) => {
      return runGlab(['mr', 'merge', iid, '--auto', '--yes']);
    }
  },
  "gitlab:update_mr": {
    description: "Update MR attributes (title, labels, description, etc.).",
    parameters: { iid: "string", title: "string", labels: "string", description: "string" },
    run: ({ iid, title, labels, description }) => {
      const args = ['mr', 'update', iid];
      if (title) args.push('--title', `"${title}"`);
      if (labels) args.push('--label', `"${labels}"`);
      if (description) args.push('--description', `"${description}"`);
      return runGlab(args);
    }
  },
  "gitlab:list_pipeline_jobs": {
    description: "List jobs for a specific pipeline.",
    parameters: { pipeline_id: "string" },
    run: ({ pipeline_id }) => {
      const response = runGlabApi(`projects/:id/pipelines/${pipeline_id}/jobs`);
      if (response.startsWith('Error:')) return response;
      const jobs = JSON.parse(response);
      return JSON.stringify(jobs.map(j => ({ id: j.id, name: j.name, status: j.status })), null, 2);
    }
  },
  "gitlab:get_job_trace": {
    description: "Fetch the log trace for a specific job.",
    parameters: { job_id: "string" },
    run: ({ job_id }) => {
      return runGlabApi(`projects/:id/jobs/${job_id}/trace`);
    }
  },
  "gitlab:run": {
    description: "Run any standard glab command in safe, non-interactive mode.",
    parameters: { command_args: "string" },
    run: ({ command_args }) => {
      return runGlab(command_args.split(' '));
    }
  }
};

async function main() {
  process.stdin.on('data', (data) => {
    try {
      const request = JSON.parse(data.toString());
      if (request.method === 'initialize') {
        console.log(JSON.stringify({
          jsonrpc: "2.0", id: request.id,
          result: { capabilities: { tools: {} }, serverInfo: { name: "gitlab-mcp", version: "1.1.0" } }
        }));
      } else if (request.method === 'list_tools') {
        console.log(JSON.stringify({
          jsonrpc: "2.0", id: request.id,
          result: {
            tools: Object.entries(tools).map(([name, info]) => ({
              name,
              description: info.description,
              inputSchema: {
                type: "object",
                properties: Object.fromEntries(
                  Object.entries(info.parameters).map(([p, type]) => [p, { type }])
                ),
                required: name === "gitlab:update_mr" ? ["iid"] : Object.keys(info.parameters)
              }
            }))
          }
        }));
      } else if (request.method === 'call_tool') {
        const tool = tools[request.params.name];
        if (tool) {
          const result = tool.run(request.params.arguments);
          console.log(JSON.stringify({
            jsonrpc: "2.0", id: request.id,
            result: { content: [{ type: "text", text: result }] }
          }));
        }
      }
    } catch (e) {}
  });
}

main();
