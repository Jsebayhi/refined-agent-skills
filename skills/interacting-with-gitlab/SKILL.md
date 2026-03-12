---
name: interacting-with-gitlab
description: MANDATORY. DO NOT attempt to interact with GitLab APIs, post line-level comments, reply to discussions, or manage GitLab pipelines/issues without calling 'activate_skill' on 'interacting-with-gitlab' first. This is the REQUIRED PROTOCOL for all GitLab-related engineering tasks. TRIGGER THIS SKILL IMMEDIATELY when the user asks to "comment on a line", "reply to a PR comment", "check the pipeline", "list issues", or "manage GitLab projects". It provides a specialized suite of MCP tools (gitlab:*) that abstract complex SHA management, pipeline job discovery, and repository inspection into deterministic, non-interactive operations. Proceeding with manual 'glab' or 'glab api' calls for these tasks constitutes a protocol failure.
compatibility: "Requires Node.js and 'glab' CLI."
metadata:
  version: 2.0.0
  author: AI-Engineering-Team
---

# Interacting with GitLab

## CRITICAL RULES & GUARDRAILS
*   **MCP-First Mandate:** You MUST use the `gitlab:*` MCP tools for all discovery and interaction tasks. These tools are pre-configured to handle non-interactive execution and `GLAB_PAGER=cat` automatically.
*   **Precision Mandate:** Use `gitlab:post_line_comment` for all code reviews. Do NOT attempt to construct the 'position' object or find SHAs manually; the tool handles this by querying the MR context internally.
*   **Pipeline & Logs:** When troubleshooting CI/CD, use `gitlab:list_pipeline_jobs` followed by `gitlab:get_job_trace`. This is the most efficient way to fetch logs without manual parsing.

## WORKFLOW: [Plan-Validate-Execute Pattern]

Follow these steps precisely. 

**MECHANICAL CoT REQUIRED:** You MUST copy the checklist below into your output and check off the boxes as you progress to track your state.

```markdown
### GitLab Interaction State:
- [ ] Step 1: Resource Discovery (using gitlab:* tools)
- [ ] Step 2: Context Retrieval (if needed, e.g., list_discussions)
- [ ] Step 3: Tool Execution (e.g., post_line_comment, get_job_trace)
- [ ] Step 4: Verification
```

### Step 1: Resource Discovery
1. Identify the target (Merge Request, Issue, or Pipeline).
2. Use the `gitlab:run` tool for discovery if a specialized tool is not available:
   ```json
   // Example: List MRs
   gitlab:run({ "command_args": "mr list" })
   ```

### Step 2: Specialized Discovery (Pipelines & Discussions)
*   **For Pipelines:** If you have a pipeline ID, run `gitlab:list_pipeline_jobs` to find the failed job ID.
*   **For Discussions:** Run `gitlab:list_discussions` to find the `discussion_id` for a reply.

### Step 3: Action Execution
*   **Line Comment:**
    ```json
    gitlab:post_line_comment({ "iid": "123", "path": "src/main.js", "line": 42, "message": "Typo here" })
    ```
*   **Get Job Logs:**
    ```json
    gitlab:get_job_trace({ "job_id": "999888" })
    ```
*   **Reply to Thread:**
    ```json
    gitlab:post_reply({ "iid": "123", "discussion_id": "abc...", "message": "Fixed in next push" })
    ```

### Step 4: Verification
1. Review the tool output. The `gitlab:*` tools return the raw response or a semantic error message.
2. If a tool fails with a `409 Conflict`, the SHAs for the MR have likely changed; retry the operation.

## 📚 References
*   `references/gitlab-api-cheatsheet.md`: Payload structures and error handling for GitLab API.
