---
name: working-with-gitlab-mr
description: Enforces a high-transparency, senior-level Merge Request lifecycle on GitLab. Covers opening MRs, handling peer feedback, and performing technical reviews.
metadata:
  category: engineering-ops
  version: 1.0.0
---

# Working with GitLab MR: The Senior Engineering Protocol

This skill provides a strict procedural framework for the three facets of Merge Request (MR) management. Your objective is to ensure every MR interaction—whether authoring, responding, or reviewing—is high-hygiene, clearly justified, and mechanically precise.

### ⚠️ THE SENIOR CORE MANDATES

1.  **Threaded Continuity (For Feedback):** NEVER use `glab mr note` to reply to specific reviewer comments. You MUST reply directly to the reviewer's specific discussion thread using the GitLab API.
2.  **The PRB Framework:** Every MR you author or update MUST follow the **PRB (Problem-Reasoning-Benefit)** framework in its description to provide a clear technical justification (See the Reference section for details).
3.  **Diff Hygiene (Logical Units):** Every commit MUST be a self-contained logical unit. Do not bury authored code inside a "blob" of unrelated changes or massive, static reference materials. Ensure the diff is "scannable" for the reviewer.
4.  **Functional Naming:** Name artifacts by their **Domain Function** (e.g., `validate_bdi.sh`), not their technical mechanism (e.g., `validate_router.sh`).
5.  **Legacy Continuity:** When replacing a tool, create a **Legacy Wrapper** with the old filename that redirects execution to the new functional engine.

---

## FACET 1: OPENING AN MR (The Author's Duty)

When creating a new MR, focus on making the reviewer's job effortless.

- [ ] **1. Preparation:** Audit your local diff. Ensure every commit is a self-contained logical unit. No "blob" diffs where code is buried in unrelated materials.
- [ ] **2. Functional Intent:** Verify all new scripts use **Functional Naming**. Check for missing **Legacy Wrappers**.
- [ ] **3. Creation:** Use `glab mr create` with a description following the **PRB Framework**.
- [ ] **4. Supplemental Context:** Use `glab mr note` immediately after creation to provide additional high-level context, non-obvious implementation details, or guidance for the reviewer that doesn't belong in the formal description.

---

## FACET 2: HANDLING FEEDBACK (The Responder's Duty)

When peers provide feedback, your goal is to resolve it completely and transparently.

- [ ] **1. Audit Discussions:** Run `glab mr view <id> --comments` to capture all open threads.
- [ ] **2. Authenticate:** If `glab` returns 401/404, request a PAT and run `glab auth login`.
- [ ] **3. Implement & Commit:** Apply fixes. Ensure new commits are logical units. Do not squash unrelated logic or docs into a single "blob."
- [ ] **4. The "No-Orphan" Protocol (Threaded Reply):**
    1. **Fetch Discussions**: `glab api projects/:id/merge_requests/:iid/discussions` (Replace `:id` with project ID/path and `:iid` with MR number).
    2. **Locate Thread ID**: Match the `body` of the reviewer's comment in the JSON output to find its parent `id` (the `discussion_id`).
    3. **Post the Reply**: 
       ```bash
       glab api -X POST projects/:id/merge_requests/:iid/discussions/:discussion_id/notes -f body="Done. [Brief Explanation]"
       ```

---

## FACET 3: REVIEWING AN MR (The Peer's Duty)

When reviewing a peer's MR, uphold the same standards you apply to your own work.

- [ ] **1. High-Level Audit:** Check the MR description for the **PRB Framework**. If missing, ask for it.
- [ ] **2. Diff Analysis:**
    - Is there "Diff Hygiene"? (Are logic and docs mixed?)
    - Do filenames reflect **Functional Intent** or just implementation details?
    - Are there missing **Legacy Wrappers** for deleted tools?
- [ ] **3. Functional Testing:** Checkout the branch and run relevant validation scripts.
- [ ] **4. Providing Feedback:** 
    - Use `glab mr note` for general praise or high-level architectural concerns.
    - Use line-specific comments (if supported by your environment) or clear references to file/line numbers in your notes.
- [ ] **5. Disposition:** Use `glab mr approve` if standards are met, or clearly state the "Changes Requested" in a final summary note.

---

### REFERENCE: THE PRB FRAMEWORK
- **The Problem**: The specific failure mode or limitation being addressed.
- **The Reasoning**: The technical justification for the chosen solution.
- **The Benefit**: The functional outcome or improvement.

### REFERENCE: LEGACY WRAPPER PATTERN
```python
# legacy_tool.py (Wrapper)
import subprocess, sys
def main():
    subprocess.check_call(["./new_functional_engine.sh"] + sys.argv[1:])
if __name__ == "__main__":
    main()
```
