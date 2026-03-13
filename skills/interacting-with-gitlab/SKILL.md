---
name: interacting-with-gitlab
description: MANDATORY. DO NOT attempt to interact with GitLab APIs, post line-level comments, reply to discussions, or manage GitLab pipelines/issues without calling 'activate_skill' on 'interacting-with-gitlab' first. This is the REQUIRED PROTOCOL for all GitLab-related engineering tasks. TRIGGER THIS SKILL IMMEDIATELY when the user asks to "start a review", "submit a review", "comment on a line", "check the pipeline", "set auto-merge", or "manage GitLab projects". It provides a specialized suite of MCP tools (gitlab:*) that handle the full reviewer/submitter lifecycle, including multi-comment reviews, automated SHA discovery, and pipeline job monitoring. Proceeding with manual 'glab' or 'glab api' calls for these tasks constitutes a protocol failure.
compatibility: "Requires Node.js and 'glab' CLI."
metadata:
  version: 3.2.0
  author: AI-Engineering-Team
---

# Interacting with GitLab

## CRITICAL RULES & GUARDRAILS
*   **Authentication & Fail-Fast:** The `gitlab:*` tools automatically verify authentication. If a tool returns an "ERROR: GitLab authentication failed" message, you MUST stop immediately, inform the user, and ask them to run `glab auth login` in their terminal.
*   **MCP-First Mandate:** You MUST use the `gitlab:*` MCP tools for all discovery and interaction tasks. These tools are pre-configured to handle non-interactive execution and `GLAB_PAGER=cat` automatically.
*   **Review Lifecycle (Reviewer):** 
    1. **Drafting:** Use `gitlab:add_comment_to_review` to add multiple comments. This puts you in "Review Mode"; comments are NOT visible to the author until you submit.
    2. **Submitting:** Once all comments are ready, use `gitlab:submit_review` with an outcome (`APPROVE`, `REQUEST_CHANGES`, or `COMMENT`). This publishes all your comments in a single batch.
*   **Submitter Lifecycle:**
    1. Use `gitlab:run` with `mr create` to open a PR.
    2. Use `gitlab:list_pipeline_jobs` and `gitlab:get_job_trace` to monitor and troubleshoot CI.
    3. Use `gitlab:set_auto_merge` once the review is satisfactory to ensure the MR merges as soon as the pipeline passes.

## WORKFLOW: [Plan-Validate-Execute Pattern]

Follow these steps precisely. 

**MECHANICAL CoT REQUIRED:** You MUST copy the checklist below into your output and check off the boxes as you progress to track your state.

```markdown
### GitLab Interaction State:
- [ ] Step 1: Resource Discovery & Context (using gitlab:* tools)
- [ ] Step 2: Planning Actions (Review vs. Submission tasks)
- [ ] Step 3: Tool Execution (Drafting comments, Submitting reviews, or CI monitoring)
- [ ] Step 4: Final Verification
```

### Step 1: Resource Discovery & Context
1. Identify the target (MR, Issue, or Pipeline).
2. Use `gitlab:get_mr_details({ "iid": "<IID>" })` to fetch labels, status, and SHAs.
3. Use `gitlab:list_discussions({ "iid": "<IID>", "only_unresolved": true })` to find active threads.

### Step 2: Reviewer Workflow (Review Mode)
*   **Start/Continue Review:** 
    Use `gitlab:add_comment_to_review` for every comment.
*   **Finish Review:**
    Use `gitlab:submit_review` to publish all comments at once and set the final status.

### Step 3: Submitter Workflow (Delivery)
*   **Troubleshoot Pipeline:**
    Use `gitlab:list_pipeline_jobs` followed by `gitlab:get_job_trace` for failed jobs.
*   **Set Auto-Merge:**
    Use `gitlab:set_auto_merge({ "iid": "123" })`.

### Step 4: Verification
1. Review the tool output for successful API responses.
2. If a tool fails with a `409 Conflict`, the SHAs for the MR have likely changed; re-fetch details and retry.

## 📚 References
*   `references/gitlab-api-cheatsheet.md`: Payload structures and error handling for GitLab API.
