# GitHub API & CLI Reference (Technical Specification)

This document provides the exhaustive technical data contracts for the **38 tools** implemented in the GitHub MCP server (v3.7.0).

## 🔍 Discovery & Research
### `github_search`
*   **CLI Command:** `gh search <repos|prs|code> <query> --json <fields>`
*   **Json Fields (Repos):** `nameWithOwner`, `description`, `url`, `stargazerCount`
*   **Json Fields (PRs):** `number`, `title`, `state`, `author`, `url`, `labels`, `isDraft`
*   **Json Fields (Code):** `path`, `repository`, `url`
*   **Official Doc:** [gh search](https://cli.github.com/manual/gh_search)

### `github_view`
*   **CLI Command (PR/Issue):** `gh <pr|issue> view <id> [--comments]`
*   **CLI Command (Repo):** `gh repo view <id>` (Note: `--comments` is NOT supported for repos)
*   **Official Doc:** [gh view](https://cli.github.com/manual/gh)

### `github_list_repository_tree`
*   **Endpoint:** `GET /repos/{owner}/{repo}/contents/{path}`
*   **Official Doc:** [Get repository content](https://docs.github.com/en/rest/repos/contents#get-repository-content)

### `github_find_file`
*   **Endpoint:** `GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1`
*   **Official Doc:** [Get a tree](https://docs.github.com/en/rest/git/trees#get-a-tree)

### `github_get_repository_file`
*   **Endpoint:** `GET /repos/{owner}/{repo}/contents/{path}`
*   **Header:** `Accept: application/vnd.github.v3.raw`
*   **Official Doc:** [Get repository content (raw)](https://docs.github.com/en/rest/repos/contents#get-repository-content)

## 🏗️ Pull Request Management
### `github_create_pull_request`
*   **CLI Flags:** `--title`, `--body`, `--base`, `--head`, `--label`, `--draft`, `--fill`
*   **Official Doc:** [gh pr create](https://cli.github.com/manual/gh_pr_create)

### `github_merge_pull_request`
*   **CLI Flags:** `--merge|--squash|--rebase`, `--delete-branch`
*   **Official Doc:** [gh pr merge](https://cli.github.com/manual/gh_pr_merge)

### `github_get_pull_request_details`
*   **Endpoint:** `GET /repos/{owner}/{repo}/pulls/{pull_number}`
*   **Bundled Context Filtering:**
    *   `GET /repos/{owner}/{repo}/code-scanning/alerts?ref=refs/pull/{num}/head` (Required for PR-specific filtering)
    *   `GET /repos/{owner}/{repo}/issues/{num}/comments`
*   **Official Doc:** [Get a pull request](https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request)

## 💬 Feedback & Review Lifecycle
### `github_add_comment_to_review`
*   **Endpoint:** `POST /repos/{owner}/{repo}/pulls/{pull_number}/comments`
*   **Payload:**
    ```json
    {
      "body": "string",
      "commit_id": "string",
      "path": "string",
      "line": "integer",
      "side": "RIGHT",
      "start_line": "integer (optional)",
      "start_side": "RIGHT (required if start_line present)"
    }
    ```
*   **Official Doc:** [Create a review comment](https://docs.github.com/en/rest/pulls/comments#create-a-review-comment-for-a-pull-request)

### `github_submit_review`
*   **CLI Flags:** `--approve|--request-changes|--comment`, `--body`
*   **Official Doc:** [gh pr review](https://cli.github.com/manual/gh_pr_review)

### `github_unapprove`
*   **Logic:** Uses `gh pr review --comment --body "Revoking approval."`
*   **Limitation:** This is a functional comment-based revocation; GitHub does not have a direct "unapprove" CLI flag.

## 🧵 Discussion Management (GraphQL)
### `github_list_discussions`
*   **Query:** `repository(owner, name) { pullRequest(number) { reviewThreads(last: 50) { nodes { id, isResolved, comments } } } }`
*   **Official Doc:** [GraphQL objects - PullRequest](https://docs.github.com/en/graphql/reference/objects#pullrequest)

### `github_resolve_discussion`
*   **Mutation:** `resolveReviewThread(input: {threadId: $id})`
*   **Official Doc:** [resolveReviewThread](https://docs.github.com/en/graphql/reference/mutations#resolvereviewthread)

## 🛡️ Security & Vulnerabilities
### `github_list_vulnerabilities`
*   **Endpoint:** `GET /repos/{owner}/{repo}/code-scanning/alerts`
*   **Ref Filtering:** `ref=refs/pull/{num}/head` (Used for PR filtering)
*   **Official Doc:** [List code scanning alerts](https://docs.github.com/en/rest/code-scanning#list-code-scanning-alerts-for-a-repository)

### `github_dismiss_vulnerability`
*   **Endpoint:** `PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}`
*   **Payload:** `{ "state": "dismissed", "dismissed_reason": "string" }`
*   **Official Doc:** [Update a code scanning alert](https://docs.github.com/en/rest/code-scanning#update-a-code-scanning-alert)
