---
name: interacting-with-gitlab
description: MANDATORY. DO NOT attempt to interact with GitLab APIs, post line-level comments, reply to discussions, or manage GitLab pipelines/issues without calling 'activate_skill' on 'interacting-with-gitlab' first. This is the REQUIRED PROTOCOL for all GitLab-related engineering tasks. TRIGGER THIS SKILL IMMEDIATELY when the user asks to "create an MR", "start a review", "submit a review", "comment on a line", "check the pipeline", "wait for the build", "set auto-merge", or "manage GitLab projects". It provides a specialized suite of MCP tools (gitlab:*) that handle the full reviewer/submitter lifecycle, including MR creation, multi-comment reviews, automated SHA discovery, and deterministic pipeline monitoring. Proceeding with manual 'glab' or 'glab api' calls for these tasks constitutes a protocol failure.
compatibility: "Requires Node.js and 'glab' CLI."
metadata:
  version: 3.3.0
  author: AI-Engineering-Team
---

# Interacting with GitLab

## CRITICAL RULES & GUARDRAILS
*   **Authentication & Fail-Fast:** The `gitlab:*` tools automatically verify authentication. If a tool returns an "ERROR: GitLab authentication failed" message, you MUST stop immediately, inform the user, and ask them to run `glab auth login` in their terminal.
*   **Precision Feedback (Line Comments):** When creating comments on specific lines (via `add_comment_to_review` or `post_comment`), you MUST provide the `path` and the `line` number as they appear in the **NEW** version of the file (the diff). Do not guess line numbers.
*   **Closing the Loop (Resolution):** To resolve a discussion thread, use `gitlab:reply_to_discussion` with `resolve: true`. This is the standard way to verify a fix and clean up the MR for merging.
*   **Pipeline Monitoring:** Before merging, you MUST ensure the pipeline passes. Use `gitlab:list_pipelines` to find the latest ID, and `gitlab:wait_for_pipeline` if you need to block until completion.
*   **MCP-First Mandate:** You MUST use the `gitlab:*` MCP tools for all discovery and interaction tasks. These tools are pre-configured to handle non-interactive execution and `GLAB_PAGER=cat` automatically.

## WORKFLOW: [Plan-Validate-Execute Pattern]

Follow these steps precisely. 

**MECHANICAL CoT REQUIRED:** You MUST copy the checklist below into your output and check off the boxes as you progress to track your state.

```markdown
### GitLab Interaction State:
- [ ] Step 1: Resource Discovery & Context (using gitlab:* tools)
- [ ] Step 2: Planning Actions (Review vs. Submission tasks)
- [ ] Step 3: Tool Execution (Creating MRs, Drafting comments, or CI monitoring)
- [ ] Step 4: Final Verification
```

### Step 1: Resource Discovery & Context
1. Identify the target (MR, Issue, or Pipeline).
2. Use `gitlab:get_mr_details({ "iid": "<IID>" })` to fetch labels, status, and SHAs.
3. Use `gitlab:list_discussions({ "iid": "<IID>", "only_unresolved": true })` to find active threads.

### Step 2: Reviewer Workflow (Review Mode)
*   **Start/Continue Review:** 
    Use `gitlab:add_comment_to_review` for every comment. Ensure `path` and `line` (new version) are exact.
*   **Resolve & Reply:**
    If a reviewer comment is addressed, use `gitlab:reply_to_discussion` with `resolve: true`.
*   **Finish Review:**
    Use `gitlab:submit_review` to publish all comments at once and set the final status.

### Step 3: Submitter Workflow (Delivery)
*   **Create MR:**
    Use `gitlab:create_mr` to open a new Merge Request.
*   **Monitor & Wait for CI:**
    Use `gitlab:list_pipelines` to identify the current pipeline ID, then `gitlab:wait_for_pipeline` to wait for completion.
    ```json
    gitlab:wait_for_pipeline({ "pipeline_id": "88888", "timeout_minutes": 15 })
    ```
*   **Troubleshoot Pipeline:**
    Use `gitlab:list_pipeline_jobs` followed by `gitlab:get_job_trace` for failed jobs.
*   **Set Auto-Merge:**
    Use `gitlab:set_auto_merge({ "iid": "123" })`.

### Step 4: Verification
1. Review the tool output for successful API responses.
2. If a tool fails with a `409 Conflict`, the SHAs for the MR have likely changed; re-fetch details and retry.

## 📚 References
*   `references/gitlab-api-cheatsheet.md`: Workflow orchestration and error handling.
