# System Specification: Mode-Aware Stateful Orchestration

## 1. Objective
Establish a high-fidelity, modular skill framework for the Gemini CLI that eliminates "Instructional Dilution," manages "Context Economics," and enforces a scientific approach to problem-solving.

## 2. Core Components

### A. The Decision Router (The Entrypoint)
*   **Skill:** `orchestrating-decision-router`
*   **Responsibility:** Force the agent to identify the task quadrant before any action is taken.
*   **Triggers:** "fix," "implement," "build," "update," "investigate."
*   **Contract:** Defines if the task is **Linear vs. Complex** and **Supervised vs. Autonomous**.

### B. The Artifact-Driven State Machine (Disk-Based Memory)
*   **Skill:** `authoring-artifact-driven-plans`
*   **Responsibility:** Replace ephemeral prompt checklists with disk-based persistence.
*   **Location:** **`.gemini/state/`** (This directory MUST be added to `.gitignore`).
*   **Mechanism:** The agent shards the task into separate files within the state directory (e.g., `plan.md`, `hypotheses.md`, `results.tsv`). It executes one micro-task, updates the disk, and re-reads to maintain context.

### C. The Exploration Engine (Scientific Loop)
*   **Skill:** `navigating-complex-implementations`
*   **Responsibility:** Implement the generalized RCA/Scientific loop for any task that hits resistance.
*   **Sub-Routines:**
    *   **`brainstorming-multiple-options`**: A deterministic skill for generating exactly 3 falsifiable hypotheses or 3 distinct solution strategies.
*   **Robust Exploration Workflow:**
    1.  **Phase 1: Hypothesis Convergence:** Loop(Call `brainstorming-multiple-options` -> `adversarial_reviewer` debate) until a "Winning Hypothesis" is verified.
    2.  **Phase 2: Solution Convergence:** Loop(Call `brainstorming-multiple-options` -> `adversarial_reviewer` debate) until a "Winning Strategy" is verified.
    3.  **Phase 3: Implementation Convergence:** Loop(Checkpoint -> Implement -> Validate against Hard Signal -> `adversarial_reviewer` review).
*   **Backtrack Mandate:** If Phase 3 fails validation after 5 attempts, the agent MUST `git reset --hard` and return to Phase 1 to re-evaluate premises with new evidence.

### D. The Execution Engine (Fast Track)
*   **Skill:** `executing-linear-tasks`
*   **Responsibility:** Simplified, high-velocity workflow for predictable tasks.
*   **Workflow:** 
    1.  **Analyze:** Find the existing pattern.
    2.  **Implement:** Apply the surgical change.
    3.  **Validate:** Ensure local tests/lint pass.
    4.  **Convergence Review:** Debate with `adversarial_reviewer` to catch lazy errors.
    5.  **Commit:** Finalize the work.

### E. The Convergence Review Layer
*   **Skill:** `conducting-adversarial-convergence`
*   **Responsibility:** Orchestrate the iterative "Main Agent <---> Reviewer" debate.
*   **Mechanism:** The Main Agent dynamically prompts the `adversarial-reviewer` with specific lenses (e.g., "Logic Pass" vs. "Quality Pass") and explicit convergence criteria. It iterates until the Reviewer issues a definitive "Pass," protecting the human from intermediate drafts.

## 3. Physical Constraints (The "Hard Rules")
1.  **Context Tax:** Sub-agents are restricted to **Stateless Analysis Oracles**. No code-writing sub-agents.
2.  **Persistence Trap:** No documentation or state file (.md) shall exceed **100-150 lines**. Shard by concern to maintain high-fidelity agent write operations. (**Note:** This limit does NOT apply to `SKILL.md` files, which require space for robust instructions).
3.  **Backtrack Mandate:** A hard `git reset --hard` is required after 5 failed validation attempts in the Exploration loop.
