# GitLab API & CLI Reference (Technical Specification)

This document provides the exhaustive technical data contracts for the **38 tools** implemented in the GitLab MCP server (v3.7.0).

## 🔍 Discovery & Research
### `gitlab_search`
*   **Endpoint:** `GET /search?scope={scope}&search={query}`
*   **Scopes Supported:** `projects`, `issues`, `merge_requests`, `blobs`
*   **Official Doc:** [GitLab Search API](https://docs.gitlab.com/ee/api/search.html)

### `gitlab_view`
*   **CLI Command (MR/Issue):** `glab <mr|issue> view <id> [--comments]`
*   **CLI Command (Repo):** `glab repo view <id>` (Note: `--comments` is NOT supported for repos)
*   **Official Doc:** [glab mr view](https://glab.readthedocs.io/en/latest/mr/view.html)

### `gitlab_list_repository_tree`
*   **Endpoint:** `GET /projects/:id/repository/tree`
*   **Recursive Parameter:** `recursive=true` (Used by `gitlab_find_file`)
*   **Official Doc:** [List repository tree](https://docs.gitlab.com/ee/api/repositories.html#list-repository-tree)

## 🏗️ Merge Request Management
### `gitlab_create_pull_request`
*   **CLI Flags:** `--title`, `--description`, `--source-branch`, `--target-branch`, `--label`, `--draft`, `--fill`, `--yes`
*   **Official Doc:** [glab mr create](https://glab.readthedocs.io/en/latest/mr/create.html)

### `gitlab_merge_pull_request`
*   **CLI Flags:** `--rebase|--squash`, `--remove-source-branch`, `--yes`
*   **Official Doc:** [glab mr merge](https://glab.readthedocs.io/en/latest/mr/merge.html)

### `gitlab_get_pull_request_details`
*   **Endpoint:** `GET /projects/:id/merge_requests/:iid`
*   **Bundled Context (REST Parallel):**
    *   `GET /projects/:id/vulnerability_findings?pipeline_id={id}`
    *   `GET /projects/:id/merge_requests/:iid/discussions`
*   **Official Doc:** [Get single MR](https://docs.gitlab.com/ee/api/merge_requests.html#get-single-mr)

## 💬 Feedback & Review Lifecycle
### `gitlab_add_comment_to_review` (Draft Note)
*   **Endpoint:** `POST /projects/:id/merge_requests/:iid/draft_notes`
*   **Payload (Precision Positioning):**
    ```json
    {
      "note": "string",
      "position": {
        "base_sha": "string",
        "head_sha": "string",
        "start_sha": "string",
        "position_type": "text",
        "new_path": "string",
        "new_line": "integer",
        "line_range": {
          "start": { "line_code": "string", "type": "new", "old_line": "integer", "new_line": "integer" },
          "end": { "line_code": "string", "type": "new", "old_line": "integer", "new_line": "integer" }
        }
      }
    }
    ```
*   **Official Doc:** [Create a draft note](https://docs.gitlab.com/ee/api/draft_notes.html#create-a-new-draft-note-to-a-merge-request)

### `gitlab_submit_review`
*   **Endpoint:** `POST /projects/:id/merge_requests/:iid/draft_notes/bulk_publish`
*   **Official Doc:** [Bulk publish draft notes](https://docs.gitlab.com/ee/api/draft_notes.html#bulk-publish-merge-request-draft-notes)

## 🧵 Discussion Management
### `gitlab_list_discussions`
*   **Endpoint:** `GET /projects/:id/merge_requests/:iid/discussions`
*   **Official Doc:** [List MR discussions](https://docs.gitlab.com/ee/api/discussions.html#list-project-merge-request-discussion-items)

### `gitlab_resolve_discussions`
*   **Endpoint:** `PUT /projects/:id/merge_requests/:iid/discussions/:id`
*   **Payload:** `{ "resolved": true }` (Iterated over provided IDs)
*   **Official Doc:** [Resolve a discussion thread](https://docs.gitlab.com/ee/api/discussions.html#resolve-a-merge-request-discussion-thread)

## ⚙️ CI/CD Monitoring
### `gitlab_get_workflow_run_details` (Pipeline)
*   **Endpoint:** `GET /projects/:id/pipelines/:pipeline_id`
*   **Failed Logs Logic:** Aggregates `GET /projects/:id/jobs/:job_id/trace` for failed jobs.
*   **Official Doc:** [Get a single pipeline](https://docs.gitlab.com/ee/api/pipelines.html#get-a-single-pipeline)

## 🛡️ Security & Vulnerabilities
### `gitlab_list_vulnerabilities`
*   **Endpoint:** `GET /projects/:id/vulnerability_findings`
*   **Filters:** `severity`, `report_type`, `scope`
*   **Official Doc:** [List vulnerability findings](https://docs.gitlab.com/ee/api/vulnerability_findings.html)
