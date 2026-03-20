# Part 6: Ideas from Conductor and Superpowers

Analyzing external extensions revealed further architectural optimizations that can be integrated into our framework.

## 1. From Conductor (gemini-cli-extensions/conductor)

### Tracks Architecture (Disk-Based State Management)
*   **The Concept:** Instead of holding the "to-do" list in the context window, Conductor forces the agent to generate `conductor/tracks/<id>/plan.md` and `spec.md`. The agent reads the disk, does one task, and updates the markdown file on disk to say `[x]`. 
*   **Value:** This completely solves the "Lost in the Middle" context accumulation problem. If the agent gets confused, it just reads `plan.md` from the disk to reorient itself.

### Smart Revert Tool
*   **The Concept:** A dedicated command that understands logical "tracks" and "phases" rather than just git hashes.
*   **Value:** Formalizes the "Sunk Cost Backtrack." We should build an explicit "Undo Sub-Routine" so the agent doesn't hallucinate destructive `git` commands when it gets stuck.

## 2. From Superpowers (obra/superpowers)

### Two-Stage Sub-Agent Review
*   **The Concept:** In their `subagent-driven-development` skill, a task is not "done" until it passes *two* distinct reviewers:
    1.  **Spec Compliance Review:** Did it actually build the feature requested?
    2.  **Code Quality Review:** Is the code clean, DRY, and tested?
*   **Value:** Splitting the review lenses prevents the reviewer from being overwhelmed and ensures higher-fidelity feedback.

### The "Delete Code Written Before Tests" Rule
*   **The Concept:** In their TDD skill, if implementation code is written *before* the test fails (Red phase), the agent is mandated to delete the implementation code, commit the failing test, and *then* rewrite the implementation.
*   **Value:** This is the ultimate "Action-Oriented Nudge." It physically prevents the LLM from "cheating" at TDD.

### Git Worktrees
*   **The Concept:** Using `git worktree` to isolate the agent's experimental thrashing from the primary workspace.
*   **Value:** Much safer than just branching. It guarantees that the agent's experimental thrashing doesn't pollute the user's primary working directory.
