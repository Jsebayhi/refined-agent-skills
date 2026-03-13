---
name: interacting-with-gitlab
description: MANDATORY. DO NOT attempt to interact with GitLab APIs, post line-level comments, reply to discussions, or manage GitLab pipelines/issues without calling 'activate_skill' on 'interacting-with-gitlab' first. This is the REQUIRED PROTOCOL for all GitLab-related engineering tasks. TRIGGER THIS SKILL IMMEDIATELY when the user asks to "create an MR", "start a review", "submit a review", "comment on a line", "check the pipeline", "search GitLab", "view an issue", "set auto-merge", or "manage GitLab projects". It provides a specialized suite of MCP tools (gitlab_*) that handle the full reviewer/submitter lifecycle, including MR discovery, multi-comment reviews, automated SHA discovery, search, and deterministic pipeline monitoring. Proceeding with manual 'glab' or 'glab api' calls for these tasks constitutes a protocol failure.
compatibility: "Requires Node.js and 'glab' CLI."
metadata:
  version: 3.4.0
  author: AI-Engineering-Team
---

# Interacting with GitLab

## CRITICAL RULES & GUARDRAILS
*   **Authentication & Fail-Fast:** The `gitlab_*` tools automatically verify authentication. If a tool returns an "ERROR: GitLab authentication failed" message, you MUST stop immediately, inform the user, and ask them to run `glab auth login` in their terminal.
*   **Precision Feedback (Line Comments):** When creating comments on specific lines (via `add_comment_to_review` or `post_comment`), you MUST provide the `path` and the `line` number as they appear in the **NEW** version of the file (the diff). Do not guess line numbers.
*   **Closing the Loop (Resolution):** To resolve a discussion thread, use `gitlab_reply_to_discussion` with `resolve: true`. This is the standard way to verify a fix and clean up the MR for merging.
*   **Discovery & Search Mandate:** You MUST use the `gitlab_search` or `gitlab_list_mrs` tools for all resource discovery. Do NOT attempt to run raw `glab mr list` commands in the terminal. The MCP tools are optimized for unpaged output and distilled JSON to save context.
*   **MCP-First Mandate:** You MUST use the `gitlab_*` MCP tools for all interaction tasks. These tools are pre-configured to handle non-interactive execution and `GLAB_PAGER=cat` automatically.

## WORKFLOW: [Plan-Validate-Execute Pattern]

Follow these steps precisely. 

**MECHANICAL CoT REQUIRED:** You MUST copy the checklist below into your output and check off the boxes as you progress to track your state.

```markdown
### GitLab Interaction State:
- [ ] Step 1: Resource Discovery & Context (using gitlab_* search/view tools)
- [ ] Step 2: Planning Actions (Review vs. Submission tasks)
- [ ] Step 3: Tool Execution (Creating MRs, Drafting comments, or CI monitoring)
- [ ] Step 4: Final Verification
```

### Step 1: Resource Discovery & Context
1. If the resource ID is unknown, use `gitlab_search` or `gitlab_list_mrs({ "project": "80229875", "state": "opened" })`.
2. Use `gitlab_view({ "type": "mr", "id": "<IID>" })` to inspect title, description, and status.
3. Use `gitlab_get_mr_diffs({ "iid": "<IID>" })` to see the actual code changes.
4. Use `gitlab_list_discussions({ "iid": "<IID>", "only_unresolved": true })` to find active threads.

### Step 2: Reviewer Workflow (Review Mode)
*   **Start/Continue Review:** 
    Use `gitlab_add_comment_to_review` for every comment. Ensure `path` and `line` (new version) are exact.
*   **Resolve & Reply:**
    If a reviewer comment is addressed, use `gitlab_reply_to_discussion` with `resolve: true`.
*   **Finish Review:**
    Use `gitlab_submit_review` to publish all comments at once and set the final status.

### Step 3: Submitter Workflow (Delivery)
*   **Create MR:**
    Use `gitlab_create_mr` to open a new Merge Request. Use `fill: true` for automatic metadata and `auto_merge: true` to enable merging when CI succeeds.
*   **Monitor & Wait for CI:**
    Use `gitlab_list_pipelines` followed by `gitlab_wait_for_pipeline` to wait for completion.
*   **Troubleshoot Pipeline:**
    Use `gitlab_list_pipeline_jobs` followed by `gitlab_get_job_trace` for failed jobs.

### Step 4: Verification
1. Review the tool output for successful API responses.
2. If a tool fails with a `409 Conflict`, the SHAs for the MR have likely changed; re-fetch details and retry.

## 📚 References
*   `references/gitlab-api-cheatsheet.md`: Workflow orchestration and error handling.
