# GitLab API Cheatsheet for MR Discussions

## Discussion Workflow (Using MCP Tools)

The `gitlab:*` tools handle the complexity of the GitLab API internally, including:
- Automatic project and repository discovery.
- Automatic fetching of `base_sha`, `head_sha`, and `start_sha` for line comments.
- Building the complex `position` objects required by GitLab.

### Standard Lifecycle
1. **`gitlab:get_mr_details`**: Fetch MR state and metadata.
2. **`gitlab:add_comment_to_review`**: Add pending feedback (draft mode).
3. **`gitlab:submit_review`**: Finalize and publish all comments at once.
4. **`gitlab:reply_to_discussion`**: Respond to feedback and optionally resolve threads.

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
- **Draft Visibility**: Comments added via `add_comment_to_review` are only visible to the author until `submit_review` is called.
