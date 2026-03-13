# GitLab API Cheatsheet for MR Discussions

## Workflow Orchestration (Using MCP Tools)

The `gitlab_*` tools handle the complexity of the GitLab API internally, including project discovery, SHA management, and non-interactive execution.

### Reviewer Feedback Lifecycle
1. **`gitlab_get_mr_details`**: Fetch MR state and metadata.
2. **`gitlab_add_comment_to_review`**: Add pending feedback (Review Mode).
3. **`gitlab_get_comment`**: Fetch a specific comment's data.
4. **`gitlab_edit_comment`**: Modify an existing comment.
5. **`gitlab_list_vulnerability_findings`**: Audit code for security issues.
6. **`gitlab_submit_review`**: Finalize and publish all comments at once with an outcome (`APPROVE`, `REQUEST_CHANGES`).
7. **`gitlab_reply_to_discussion`**: Respond to feedback and optionally resolve threads.

### Submitter/Author Lifecycle
1. **`gitlab_create_mr`**: Open a new Merge Request. Use `fill: true` for automatic metadata.
2. **`gitlab_get_mr_details`**: Monitor labels and approval status.
3. **`gitlab_list_pipelines`**: Monitor CI execution.
4. **`gitlab_list_vulnerability_findings`**: Check for security scan results in CI.
5. **`gitlab_get_job_trace`**: Troubleshoot failed jobs.
6. **`gitlab_reply_to_discussion`**: Answer reviewer comments and optionally mark as `resolve: true`.
7. **`gitlab_set_auto_merge`**: Enable merging once the review is satisfactory.

## Common Error Codes

| Status | Meaning | Solution |
| :--- | :--- | :--- |
| `400 Bad Request` | Invalid payload or missing fields. | Verify `iid`, `path`, and `line` number. |
| `401 Unauthorized` | Invalid or missing `GITLAB_TOKEN`. | Run `glab auth login` in your terminal. |
| `403 Forbidden` | Insufficient permissions for the MR. | Verify user access to the project. |
| `404 Not Found` | MR IID or Discussion ID not found. | Verify IID and Discussion ID. |
| `409 Conflict` | Outdated SHAs for line comment. | The MR has new commits. The tools will retry automatically or you can re-run. |

## Important Notes
- **Line Numbers**: Always provide the line number in the **new** version of the file for comments.
- **Review Mode Visibility**: Comments added via `add_comment_to_review` are only visible to the author until `submit_review` is called.
- **Vulnerabilities**: Searching for vulnerability findings typically requires **GitLab Ultimate**.
