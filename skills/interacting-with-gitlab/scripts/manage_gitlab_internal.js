const { execSync } = require('child_process');

const args = process.argv.slice(2);
const command = args[0];

// Enforce non-interactive and no-pager for all glab calls
const GLAB_ENV = { ...process.env, GLAB_PAGER: 'cat', PAGER: 'cat' };

function runGlab(argsArray) {
  const cmd = `glab ${argsArray.join(' ')}`;
  return execSync(cmd, { env: GLAB_ENV, encoding: 'utf-8' });
}

function runGlabApi(endpoint, method = 'GET', data = null) {
  let cmd = `glab api "${endpoint}"`;
  if (method !== 'GET') {
    cmd += ` --method ${method}`;
  }
  if (data) {
    const json = JSON.stringify(data);
    cmd += ` --input -`;
    return execSync(cmd, { input: json, env: GLAB_ENV, encoding: 'utf-8' });
  }
  return execSync(cmd, { env: GLAB_ENV, encoding: 'utf-8' });
}

function getMrContext(iid) {
  const response = runGlabApi(`projects/:id/merge_requests/${iid}`);
  const mr = JSON.parse(response);
  return {
    base_sha: mr.diff_refs.base_sha,
    head_sha: mr.diff_refs.head_sha,
    start_sha: mr.diff_refs.start_sha,
    project_id: mr.project_id
  };
}

function listDiscussions(iid) {
  const response = runGlabApi(`projects/:id/merge_requests/${iid}/discussions`);
  const discussions = JSON.parse(response);
  return discussions.map(d => ({
    id: d.id,
    notes: d.notes.map(n => ({
      id: n.id,
      body: n.body,
      author: n.author.username
    }))
  }));
}

function postLineComment(iid, path, line, message) {
  const context = getMrContext(iid);
  const payload = {
    body: message,
    position: {
      base_sha: context.base_sha,
      head_sha: context.head_sha,
      start_sha: context.start_sha,
      position_type: 'text',
      new_path: path,
      new_line: parseInt(line, 10)
    }
  };
  return runGlabApi(`projects/:id/merge_requests/${iid}/discussions`, 'POST', payload);
}

function postReply(iid, discussionId, message) {
  const payload = { body: message };
  return runGlabApi(`projects/:id/merge_requests/${iid}/discussions/${discussionId}/notes`, 'POST', payload);
}

try {
  switch (command) {
    case 'glab': {
      // General wrapper for any glab command
      const glabArgs = args.slice(1);
      console.log(runGlab(glabArgs));
      break;
    }
    case 'get-shas': {
      const iid = args[args.indexOf('--iid') + 1];
      console.log(JSON.stringify(getMrContext(iid), null, 2));
      break;
    }
    case 'list-discussions': {
      const iid = args[args.indexOf('--iid') + 1];
      console.log(JSON.stringify(listDiscussions(iid), null, 2));
      break;
    }
    case 'post-line-comment': {
      const iid = args[args.indexOf('--iid') + 1];
      const path = args[args.indexOf('--path') + 1];
      const line = args[args.indexOf('--line') + 1];
      const message = args[args.indexOf('--message') + 1];
      console.log(postLineComment(iid, path, line, message));
      break;
    }
    case 'post-reply': {
      const iid = args[args.indexOf('--iid') + 1];
      const discussionId = args[args.indexOf('--discussion-id') + 1];
      const message = args[args.indexOf('--message') + 1];
      console.log(postReply(iid, discussionId, message));
      break;
    }
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  if (error.stdout) console.error(`STDOUT: ${error.stdout}`);
  if (error.stderr) console.error(`STDERR: ${error.stderr}`);
  process.exit(1);
}
