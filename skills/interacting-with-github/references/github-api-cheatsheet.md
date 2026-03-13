# GitHub API Cheatsheet for PR Discussions

## Workflow Orchestration (Using MCP Tools)

The `github_*` tools handle the complexity of the GitHub API internally, including repository discovery and non-interactive execution.

### Reviewer Feedback Lifecycle
1. **`github_get_pull_request_details`**: Fetch PR state, metadata, and CI status.
2. **`github_list_vulnerabilities`**: Audit code for security alerts.
3. **`github_post_comment`**: Post immediate top-level feedback.
4. **`github_submit_review`**: Submit a grouped review with an outcome (`APPROVE`, `REQUEST_CHANGES`).

### Submitter/Author Lifecycle
1. **`github_create_pull_request`**: Open a new Pull Request. Use `fill: true` for automatic metadata.
2. **`github_get_pull_request_details`**: Monitor labels and mergeability.
3. **`github_list_workflow_runs`**: Monitor GitHub Actions execution.
4. **`github_get_job_logs`**: Troubleshoot failed CI jobs.
5. **`github_merge_pull_request`**: Finalize and merge once the review is satisfactory.

## Common Error Codes

| Status | Meaning | Solution |
| :--- | :--- | :--- |
| `400 Bad Request` | Invalid payload or missing fields. | Verify PR number and payload structure. |
| `401 Unauthorized` | Invalid or missing `GH_TOKEN`. | Run `gh auth login` in your terminal. |
| `403 Forbidden` | Insufficient permissions for the Repo. | Verify user access to the organization/repo. |
| `404 Not Found` | PR Number or Comment ID not found. | Verify the PR number or ID. |
| `422 Unprocessable` | Branch already exists or validation error. | Check if the PR already exists for the head branch. |

## Important Notes
- **Review Mode**: GitHub's `submit_review` is the most common way to finalize a review phase.
- **Vulnerabilities**: Searching for code scanning alerts typically requires **GitHub Advanced Security** for private repos, but is available for public ones.
