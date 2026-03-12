---
name: interacting-with-gitlab
description: MANDATORY. DO NOT attempt to interact with GitLab APIs, post line-level comments, reply to discussions, or manage GitLab pipelines/issues without calling 'activate_skill' on 'interacting-with-gitlab' first. This is the REQUIRED PROTOCOL for all GitLab-related engineering tasks. TRIGGER THIS SKILL IMMEDIATELY when the user asks to "comment on a line", "reply to a PR comment", "check the pipeline", "list issues", or "manage GitLab projects". It abstracts the complex SHA and discussion-ID management into deterministic scripts and provides a safe, non-interactive wrapper for all 'glab' commands to prevent terminal hangs. Proceeding with manual 'glab' or 'glab api' calls for these tasks constitutes a protocol failure.
compatibility: "Requires Node.js and 'glab' CLI."
metadata:
  version: 1.2.0
  author: AI-Engineering-Team
---

# Interacting with GitLab

## CRITICAL RULES & GUARDRAILS
*   **Safety Wrapper Mandate:** You MUST use the `scripts/manage_gitlab.sh glab` subcommand for ALL GitLab discovery and interaction tasks (e.g., listing MRs, viewing issues). This wrapper automatically handles `GLAB_PAGER=cat` and ensures non-interactive execution to prevent terminal hangs.
*   **Precision Mandate:** You MUST use the specialized subcommands in `scripts/manage_gitlab.sh` for all line-level comments and replies. Do NOT attempt to construct the 'position' object or find 'discussion_ids' manually.
*   **SHA Integrity:** Line comments in GitLab require specific SHAs (`base_sha`, `head_sha`, `start_sha`). The provided scripts handle this automatically. Do not guess these values.

## WORKFLOW: [Plan-Validate-Execute Pattern]

Follow these steps precisely. 

**MECHANICAL CoT REQUIRED:** You MUST copy the checklist below into your output and check off the boxes as you progress to track your state.

```markdown
### GitLab Interaction State:
- [ ] Step 1: Resource Discovery (using 'glab' wrapper)
- [ ] Step 2: Context Retrieval (if specialized action needed)
- [ ] Step 3: Action Execution (using router)
- [ ] Step 4: Verification
```

### Step 1: Resource Discovery (Safe Mode)
1. Use the `glab` wrapper for all discovery commands. This prevents the agent from being stuck in a pager or interactive prompt.
   ```bash
   # Safe discovery examples:
   bash scripts/manage_gitlab.sh glab mr list
   bash scripts/manage_gitlab.sh glab issue view <ID>
   bash scripts/manage_gitlab.sh glab ci list
   ```

### Step 2: Context Retrieval (Specialized Actions)
*   **For Line Comments:** Use `bash scripts/manage_gitlab.sh get-shas --iid <IID>` to fetch the required SHAs.
*   **For Replies:** Use `bash scripts/manage_gitlab.sh list-discussions --iid <IID>` to find the `discussion_id`.

### Step 3: Action Execution
*   **Standard Actions:**
    ```bash
    # Safe execution examples:
    bash scripts/manage_gitlab.sh glab mr merge <IID> --rebase --remove-source-branch
    bash scripts/manage_gitlab.sh glab ci trace <JOB_ID>
    ```
*   **Specialized Actions:**
    ```bash
    # Post Line Comment
    bash scripts/manage_gitlab.sh post-line-comment --iid <IID> --path <file_path> --line <line_number> --message "..."
    
    # Post Reply
    bash scripts/manage_gitlab.sh post-reply --iid <IID> --discussion-id <ID> --message "..."
    ```

### Step 4: Verification
1. Verify the output of the command/script for success.
2. If the API returns an error, consult `references/gitlab-api-cheatsheet.md` to diagnose the failure.

## 📚 References
*   `references/gitlab-api-cheatsheet.md`: Payload structures and error handling for GitLab API.
