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

const tools = {
  "gitlab:get_mr_shas": {
    description: "Fetch diff SHAs (base, head, start) for a Merge Request. Required for line comments.",
    parameters: { iid: "string" },
    run: ({ iid }) => {
      const response = runGlabApi(`projects/:id/merge_requests/${iid}`);
      if (response.startsWith('Error:')) return response;
      const mr = JSON.parse(response);
      return JSON.stringify(mr.diff_refs, null, 2);
    }
  },
  "gitlab:post_line_comment": {
    description: "Post a precision comment on a specific line of a file in an MR.",
    parameters: { iid: "string", path: "string", line: "number", message: "string" },
    run: ({ iid, path, line, message }) => {
      const contextResp = runGlabApi(`projects/:id/merge_requests/${iid}`);
      if (contextResp.startsWith('Error:')) return contextResp;
      const mr = JSON.parse(contextResp);
      const payload = {
        body: message,
        position: {
          base_sha: mr.diff_refs.base_sha,
          head_sha: mr.diff_refs.head_sha,
          start_sha: mr.diff_refs.start_sha,
          position_type: 'text',
          new_path: path,
          new_line: line
        }
      };
      return runGlabApi(`projects/:id/merge_requests/${iid}/discussions`, 'POST', payload);
    }
  },
  "gitlab:list_discussions": {
    description: "List all discussion threads in an MR, including resolution status.",
    parameters: { iid: "string" },
    run: ({ iid }) => {
      const response = runGlabApi(`projects/:id/merge_requests/${iid}/discussions`);
      if (response.startsWith('Error:')) return response;
      const discussions = JSON.parse(response);
      return JSON.stringify(discussions.map(d => ({
        id: d.id,
        resolvable: d.resolvable || false,
        resolved: d.resolved || false,
        notes: d.notes.map(n => ({ 
          id: n.id, 
          body: n.body, 
          author: n.author.username,
          resolvable: n.resolvable || false,
          resolved: n.resolved || false
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
  "gitlab:get_repository_file": {
    description: "Fetch raw content of a file from the repository.",
    parameters: { path: "string", ref: "string" },
    run: ({ path, ref }) => {
      const encodedPath = encodeURIComponent(path);
      return runGlabApi(`projects/:id/repository/files/${encodedPath}/raw?ref=${ref || 'main'}`);
    }
  },
  "gitlab:list_repository_tree": {
    description: "List files in a repository directory.",
    parameters: { path: "string", ref: "string" },
    run: ({ path, ref }) => {
      let endpoint = `projects/:id/repository/tree`;
      const params = [];
      if (path) params.push(`path=${encodeURIComponent(path)}`);
      if (ref) params.push(`ref=${ref}`);
      if (params.length > 0) endpoint += `?${params.join('&')}`;
      const response = runGlabApi(endpoint);
      if (response.startsWith('Error:')) return response;
      const items = JSON.parse(response);
      return items.map(i => i.name).join('\n');
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
          jsonrpc: "2.0",
          id: request.id,
          result: {
            capabilities: { tools: {} },
            serverInfo: { name: "gitlab-mcp", version: "1.0.0" }
          }
        }));
      } else if (request.method === 'list_tools') {
        console.log(JSON.stringify({
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
                required: Object.keys(info.parameters)
              }
            }))
          }
        }));
      } else if (request.method === 'call_tool') {
        const tool = tools[request.params.name];
        if (tool) {
          const result = tool.run(request.params.arguments);
          console.log(JSON.stringify({
            jsonrpc: "2.0",
            id: request.id,
            result: { content: [{ type: "text", text: result }] }
          }));
        }
      }
    } catch (e) {
      // Ignore malformed JSON or internal errors to keep stdio clean
    }
  });
}

main();
