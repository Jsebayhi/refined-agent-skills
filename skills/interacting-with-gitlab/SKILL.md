---
name: interacting-with-gitlab
description: MANDATORY. DO NOT attempt to interact with GitLab APIs, post line-level comments, reply to discussions, or manage GitLab pipelines/issues without calling 'activate_skill' on 'interacting-with-gitlab' first. This is the REQUIRED PROTOCOL for all GitLab-related engineering tasks. TRIGGER THIS SKILL IMMEDIATELY when the user asks to "start a review", "submit a review", "comment on a line", "check the pipeline", "set auto-merge", or "manage GitLab projects". It provides a specialized suite of MCP tools (gitlab:*) that handle the full reviewer/submitter lifecycle, including multi-comment reviews via draft notes, automated SHA discovery, and pipeline job monitoring. Proceeding with manual 'glab' or 'glab api' calls for these tasks constitutes a protocol failure.
compatibility: "Requires Node.js and 'glab' CLI."
metadata:
  version: 3.0.0
  author: AI-Engineering-Team
---

# Interacting with GitLab

## CRITICAL RULES & GUARDRAILS
*   **MCP-First Mandate:** You MUST use the `gitlab:*` MCP tools for all discovery and interaction tasks. These tools are pre-configured to handle non-interactive execution and `GLAB_PAGER=cat` automatically.
*   **Review Lifecycle (Reviewer):** 
    1. Use `gitlab:create_draft_note` to add multiple comments without notifying the author immediately.
    2. Use `gitlab:submit_review` with an outcome (`APPROVE`, `REQUEST_CHANGES`, or `COMMENT`) to publish all drafts at once.
*   **Submitter Lifecycle:**
    1. Use `gitlab:run` with `mr create` to open a PR.
    2. Use `gitlab:list_pipeline_jobs` and `gitlab:get_job_trace` to monitor and troubleshoot CI.
    3. Use `gitlab:set_auto_merge` once the review is satisfactory to ensure the MR merges as soon as the pipeline passes.
*   **Context Requirement:** Always use `gitlab:get_mr_details` or `gitlab:list_discussions` (with `only_unresolved: true`) to understand the current state before responding to feedback.

## WORKFLOW: [Plan-Validate-Execute Pattern]

Follow these steps precisely. 

**MECHANICAL CoT REQUIRED:** You MUST copy the checklist below into your output and check off the boxes as you progress to track your state.

```markdown
### GitLab Interaction State:
- [ ] Step 1: Resource Discovery & Context (using gitlab:* tools)
- [ ] Step 2: Planning Actions (Review vs. Submission tasks)
- [ ] Step 3: Tool Execution (Drafting notes, Submitting reviews, or CI monitoring)
- [ ] Step 4: Final Verification
```

### Step 1: Context Discovery
1. Identify the MR IID.
2. Run `gitlab:get_mr_details({ "iid": "<IID>" })` to fetch labels, status, and SHAs.
3. Run `gitlab:list_discussions({ "iid": "<IID>", "only_unresolved": true })` to find active threads.

### Step 2: Reviewer Workflow (Precision Feedback)
*   **Add Draft Comment:**
    ```json
    gitlab:create_draft_note({ "iid": "123", "path": "src/app.js", "line": 10, "message": "Suggest refactoring this." })
    ```
*   **Submit Review (Final Step):**
    ```json
    gitlab:submit_review({ "iid": "123", "outcome": "REQUEST_CHANGES", "message": "Good progress, but please address the draft notes." })
    ```

### Step 3: Submitter Workflow (Delivery)
*   **Troubleshoot Pipeline:**
    ```json
    // 1. List jobs
    gitlab:list_pipeline_jobs({ "pipeline_id": "88888" })
    // 2. Get failed job trace
    gitlab:get_job_trace({ "job_id": "77777" })
    ```
*   **Set Auto-Merge:**
    ```json
    gitlab:set_auto_merge({ "iid": "123" })
    ```
*   **Update MR Labels/Title:**
    ```json
    gitlab:update_mr({ "iid": "123", "labels": "bugfix,high-priority" })
    ```

### Step 4: Verification
1. Review the tool output for successful API responses.
2. If a tool fails with a `409 Conflict`, the SHAs for the MR have likely changed; re-fetch details and retry.

## 📚 References
*   `references/gitlab-api-cheatsheet.md`: Payload structures and error handling for GitLab API.
