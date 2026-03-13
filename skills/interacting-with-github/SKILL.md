---
name: interacting-with-github
description: MANDATORY. DO NOT attempt to interact with GitHub APIs, post PR comments, or manage GitHub Actions/checks without calling 'activate_skill' on 'interacting-with-github' first. This is the REQUIRED PROTOCOL for all GitHub-related engineering tasks. TRIGGER THIS SKILL IMMEDIATELY when the user asks to "create a PR", "start a review", "submit a review", "comment on a line", "check the actions", "search GitHub", "view an issue", "check vulnerabilities", or "manage GitHub projects". It provides a specialized suite of MCP tools (github_*) that handle the full reviewer/submitter lifecycle, including PR discovery, multi-comment reviews, automated SHA discovery, search, security auditing, and deterministic pipeline monitoring. Proceeding with manual 'gh' or 'gh api' calls for these tasks constitutes a protocol failure.
compatibility: "Requires Node.js and 'gh' CLI."
metadata:
  version: 1.0.0
  author: refined-agent-skills contributors
---

# Interacting with GitHub

## CRITICAL RULES & GUARDRAILS
*   **Authentication & Fail-Fast:** The `github_*` tools automatically verify authentication. If a tool returns an "ERROR: GitHub authentication failed" message, you MUST stop immediately, inform the user, and ask them to run `gh auth login` in their terminal.
*   **Precision Feedback (Line Comments):** When creating comments on specific lines (via `github_post_comment` or specialized review tools), you MUST ensure precision. Use `github_run_command` if specialized line-level tools are needed beyond standard PR comments.
*   **Closing the Loop (Resolution):** For GitHub, use `github_post_comment` to acknowledge fixes. Threaded resolution is handled via the PR UI, but ensure all feedback is addressed.
*   **Security Auditing:** For every code review or PR inspection, you SHOULD check for vulnerabilities. Use `github_list_vulnerabilities` filtered by the current `id` (PR number) to ensure no new security issues were introduced.
*   **Discovery & Search Mandate:** You MUST use the `github_search` or `github_list_pull_requests` tools for all resource discovery. Do NOT attempt to run raw `gh pr list` commands in the terminal. The MCP tools are optimized for unpaged output and distilled JSON to save context.
*   **MCP-First Mandate:** You MUST use the `github_*` MCP tools for all interaction tasks. These tools are pre-configured to handle non-interactive execution and `GH_PAGER=cat` automatically.

## WORKFLOW: [Plan-Validate-Execute Pattern]

Follow these steps precisely. 

**MECHANICAL CoT REQUIRED:** You MUST copy the checklist below into your output and check off the boxes as you progress to track your state.

```markdown
### GitHub Interaction State:
- [ ] Step 1: Resource Discovery & Context (using github_* search/view tools)
- [ ] Step 2: Planning Actions (Review vs. Submission tasks)
- [ ] Step 3: Tool Execution (Creating PRs, Posting comments, or Security check)
- [ ] Step 4: Final Verification
```

### Step 1: Resource Discovery & Context
1. If the resource ID is unknown, use `github_search` or `github_list_pull_requests`.
2. Use `github_view({ "type": "pr", "id": "<NUMBER>" })` to inspect title, description, and status.
3. Use `github_get_pull_request_diffs({ "id": "<NUMBER>" })` to see the actual code changes.
4. Use `github_get_pull_request_details({ "id": "<NUMBER>" })` to check mergeability and CI check status.

### Step 2: Reviewer Workflow (Review Mode)
*   **Start/Continue Review:** 
    Use `github_submit_review` with `outcome: "COMMENT"` for iterative feedback.
*   **Security Check:**
    Run `github_list_vulnerabilities` for the current PR. Focus on `critical` and `high` findings.
*   **Finish Review:**
    Use `github_submit_review` with `APPROVE` or `REQUEST_CHANGES` to finalize the review.

### Step 3: Submitter Workflow (Delivery)
*   **Create PR:**
    Use `github_create_pull_request`. Use `fill: true` for automatic metadata from commits.
*   **Monitor & Wait for Actions:**
    Use `github_list_workflow_runs` to check CI progress.
*   **Troubleshoot Checks:**
    Use `github_get_workflow_run_details({ "id": "<ID>", "failed_logs": true })` to see exactly why jobs failed in a single turn.

### Step 4: Final Verification
1. Review the tool output for successful API responses.
2. If a tool fails, check `gh auth status` via the safety hatch if necessary.

## 📚 References
*   `references/github-api-cheatsheet.md`: Workflow orchestration and error handling.
