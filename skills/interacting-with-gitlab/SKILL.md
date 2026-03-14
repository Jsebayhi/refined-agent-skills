---
name: interacting-with-gitlab
description: MANDATORY. DO NOT attempt to interact with GitLab APIs, post line-level comments, reply to discussions, or manage GitLab pipelines/issues without calling 'activate_skill' on 'interacting-with-gitlab' first. This is the REQUIRED PROTOCOL for all GitLab-related engineering tasks. TRIGGER THIS SKILL IMMEDIATELY when the user asks to "create an MR", "start a review", "submit a review", "comment on a line", "check the pipeline", "search GitLab", "view an issue", "check vulnerabilities", "set auto-merge", or "manage GitLab projects". It provides a specialized suite of MCP tools (gitlab_*) that handle the full reviewer/submitter lifecycle, including MR discovery, multi-comment reviews, automated SHA discovery, search, security auditing, and deterministic pipeline monitoring. Proceeding with manual 'glab' or 'glab api' calls for these tasks constitutes a protocol failure.
compatibility: "Requires Node.js and 'glab' CLI."
metadata:
  version: 1.0.0
  author: refined-agent-skills contributors
---

# Interacting with GitLab

## CRITICAL RULES & GUARDRAILS
*   **Authentication & Fail-Fast:** The `gitlab_*` tools automatically verify authentication. If a tool returns an "ERROR: GitLab authentication failed" message, you MUST stop immediately, inform the user, and ask them to run `glab auth login` in their terminal.
*   **Precision Feedback (Line Comments):** When creating comments on specific lines (via `add_comment_to_review` or `post_comment`), you MUST provide the `path` and the `line` number as they appear in the **NEW** version of the file (the diff). Do not guess line numbers.
*   **Closing the Loop (Resolution):** To resolve a discussion thread, use `gitlab_reply_to_discussion` with `resolve: true`. This is the standard way to verify a fix and clean up the MR for merging.
*   **Security Auditing:** For every code review or MR inspection, you SHOULD check for vulnerabilities. Use `gitlab_list_vulnerabilities` filtered by the current `workflow_run_id` (pipeline ID) to ensure no high or critical security issues were introduced.
*   **Discovery & Search Mandate:** You MUST use the `gitlab_search`, `gitlab_list_pull_requests`, or `gitlab_find_file` tools for all resource discovery. Do NOT attempt to run raw `glab mr list` commands in the terminal. The MCP tools are optimized for unpaged output and distilled JSON to save context.
*   **Recursive Discovery:** Use `gitlab_find_file` to instantly locate files deep within the repository without crawling the tree manually.
*   **MCP-First Mandate:** You MUST use the `gitlab_*` MCP tools for all interaction tasks. These tools are pre-configured to handle non-interactive execution and `GLAB_PAGER=cat` automatically.

## WORKFLOW: [Plan-Validate-Execute Pattern]

Follow these steps precisely. 

**MECHANICAL CoT REQUIRED:** You MUST copy the checklist below into your output and check off the boxes as you progress to track your state.

```markdown
### GitLab Interaction State:
- [ ] Step 1: Resource Discovery & Context (using gitlab_* search/view/find tools)
- [ ] Step 2: Planning Actions (Review vs. Submission tasks)
- [ ] Step 3: Tool Execution (Creating MRs, Drafting comments, or Security check)
- [ ] Step 4: Final Verification
```

### Step 1: Resource Discovery & Context
1. If the file path is unknown but you have a name, use `gitlab_find_file`.
2. If the resource ID is unknown, use `gitlab_search` or `gitlab_list_pull_requests`.
3. Use `gitlab_view` to inspect title, description, and status.
4. Use `gitlab_get_pull_request_diffs({ "id": "<IID>" })` to see the actual code changes.
5. Use `gitlab_list_discussions` to find active threads.
6. Use `gitlab_get_comment` if you need the full history of a specific note.

### Step 2: Reviewer Workflow (Review Mode)
*   **Start/Continue Review:** 
    Use `gitlab_add_comment_to_review` for every comment. Ensure `path` and `line` (new version) are exact.
*   **Security Check:**
    Run `gitlab_list_vulnerabilities` for the latest pipeline. Focus on `critical` and `high` findings.
*   **Iterative Refinement:**
    Use `gitlab_edit_review_comment` if you need to update a previously posted draft.
*   **Resolve & Reply:**
    If a reviewer comment is addressed, use `gitlab_reply_to_discussion` with `resolve: true`.
*   **Finish Review:**
    Use `gitlab_submit_review` to publish all comments at once and set the final status.

### Step 3: Submitter Workflow (Delivery)
*   **Create MR:**
    Use `gitlab_create_pull_request`. Use `fill: true` for automatic metadata and `auto_merge: true` to enable merging when CI succeeds.
*   **Monitor & Wait for CI:**
    Use `gitlab_list_workflow_runs` followed by `gitlab_wait_for_workflow_run` to wait for completion.
*   **Troubleshoot Pipeline:**
    Use `gitlab_get_workflow_run_details({ "id": "<ID>", "failed_logs": true })` to see exactly why jobs failed in a single turn.

### Step 4: Final Verification
1. Review the tool output for successful API responses.
2. If a tool fails with a `409 Conflict`, the SHAs for the MR have likely changed; re-fetch details and retry.

## 📚 References
*   `references/gitlab-api-cheatsheet.md`: Workflow orchestration and error handling.
