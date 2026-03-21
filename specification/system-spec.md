# System Specification: Mode-Aware Stateful Orchestration (v0.4.1)

## 1. Objective
Establish a high-fidelity, modular skill framework for the Gemini CLI that eliminates "Instructional Dilution," manages "Context Economics," and enforces a scientific approach to problem-solving through a 4-quadrant Engine model.

## 2. Core Components

### A. The Methodology Selector (The Entrypoint)
*   **Skill:** `selecting-optimal-methodology`
*   **Responsibility:** Establish the task contract and activate the correct quadrant engine.

### B. The Artifact-Driven State Machine (Disk-Based Memory)
*   **Skill:** `authoring-artifact-driven-plans`
*   **Location:** `.gemini/skills/current-task-state/` (The "Active Memory" skill).
*   **Mechanism:** Shards state into `references/` with `STEP_ID` prefixing. Enforces the "Intelligence Split."

### C. The 4 Quadrant Engines
1.  **`executing-linear-task-supervised` (Pair Programmer):**
    *   *Workflow:* Analyze -> Implement -> Local Validate -> Convergence Review -> Human Approval -> Commit.
2.  **`executing-linear-task-autonomous` (Background Worker):**
    *   *Workflow:* Define mechanical success -> Execute in a loop -> Reviewer Convergence -> Commit.
3.  **`navigating-complex-task-supervised` (Architectural Sparring):**
    *   *Workflow:* Research -> Hypothesis ToT -> **Human Approval** -> Strategy ToT -> **Human Approval** -> Implementation Plan -> Implement.
4.  **`navigating-complex-task-autonomous` (Scientific Loop):**
    *   *Workflow:* Research -> 3 Hypotheses -> Reviewer Pass -> 3 Solutions -> Reviewer Pass -> Implementation Plan -> Checkpoint -> Implement -> Validate -> Diagnostic RCA -> Backtrack on failure.

### D. The Convergence Review Layer
*   **Skill:** `conducting-adversarial-convergence`
*   **Responsibility:** Orchestrate the iterative "Main Agent <---> Reviewer" debate using specific objective-based prompts.

## 3. Physical Constraints (The "Hard Rules")
1.  **Context Tax:** Sub-agents are restricted to **Stateless Analysis Oracles**. No code-writing sub-agents.
2.  **Persistence Trap:** No state file (.md) shall exceed **100-150 lines**. Shard verbose evidence into `references/`.
3.  **Backtrack Mandate:** Mandatory `git reset --hard` after 5 failed validation attempts in Autonomous Exploration.
