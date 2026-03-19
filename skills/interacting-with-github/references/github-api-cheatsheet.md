# GitHub API Cheatsheet for PR Discussions

## Workflow Orchestration (Using MCP Tools)

The `github_*` tools handle the complexity of the GitHub API internally, including repository discovery, SHA resolution, and non-interactive execution.

### Reviewer Feedback Lifecycle
1. **`github_get_pull_request_details`**: Fetch PR state, bundled context (`full_context: true`), and CI status.
2. **`github_add_comment_to_review`**: Add precise, line-level pending feedback (Draft Mode).
3. **`github_list_vulnerabilities`**: Audit code for security alerts.
4. **`github_post_comment`**: Post immediate top-level feedback.
5. **`github_submit_review`**: Submit a grouped review with an outcome (`APPROVE`, `REQUEST_CHANGES`).

### Submitter/Author Lifecycle
1. **`github_create_pull_request`**: Open a new Pull Request. Use `fill: true` for automatic metadata.
2. **`github_get_pull_request_details`**: Monitor labels and mergeability.
3. **`github_list_workflow_runs`**: Monitor GitHub Actions execution.
4. **`github_wait_for_workflow_run`**: Poll deterministically until a run completes.
5. **`github_get_workflow_run_details`**: Troubleshoot failed CI jobs instantly with `failed_logs: true`.
6. **`github_merge_pull_request`**: Finalize and merge once the review is satisfactory.

## Common Error Codes

| Status | Meaning | Solution |
| :--- | :--- | :--- |
| `400 Bad Request` | Invalid payload or missing fields. | Verify PR number, `path`, and `line` structure. |
| `401 Unauthorized` | Invalid or missing `GH_TOKEN`. | Run `gh auth login` in your terminal. |
| `403 Forbidden` | Insufficient permissions for the Repo. | Verify user access to the organization/repo. |
| `404 Not Found` | PR Number or Comment ID not found. | Verify the PR number or ID. |
| `422 Unprocessable` | Branch already exists or validation error. | Check if the PR already exists for the head branch. |

## Important Notes
- **Line Numbers**: Always provide the line number in the **new** version of the file for comments. The tool handles fetching the commit SHA automatically.
- **Review Mode**: GitHub's `submit_review` publishes any pending review comments created by `github_add_comment_to_review`.
- **Vulnerabilities**: Searching for code scanning alerts typically requires **GitHub Advanced Security** for private repos, but is available for public ones.
