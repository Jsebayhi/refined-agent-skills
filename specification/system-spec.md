# System Specification: Mode-Aware Stateful Orchestration (v0.4.5)

## 1. Objective
Establish a high-fidelity, modular skill framework for the Gemini CLI that eliminates "Instructional Dilution," manages "Context Economics," and enforces a scientific approach through a consolidated 3-engine model with visual progress tracking.

## 2. Core Components

### A. The Methodology Selector (The Entrypoint)
*   **Skill:** `selecting-optimal-methodology`
*   **Responsibility:** Establish the task contract and activate the correct engine (Linear or Complex).

### B. The Artifact-Driven State Machine (Active Memory)
*   **Skill:** `authoring-artifact-driven-plans`
*   **Location:** `.gemini/skills/current-task-state/`
*   **Core Shards:** `original_goal.md`, `plan.md`, `strategies.md`.
*   **Intelligence Shards:** Mandates `human_gathered_[topic].md` and `auto_gathered_[topic].md` prefixes.

### C. The 3 Quadrant Engines
1.  **`executing-linear-task` (High-Velocity):**
    *   *Modes:* Supervised or Autonomous.
    *   *Constraint:* 10-attempt threshold before escalation to Complex.
    *   *Workflow:* Decompose -> Pattern Match -> Implement -> Validate -> Reviewer Convergence -> Commit.
2.  **`navigating-complex-task-supervised` (Architectural Sparring):**
    *   *Workflow:* Research -> 3 Hypotheses -> Reviewer PASS -> Human Approval -> 3 Strategies -> Reviewer PASS -> Human Approval -> Implementation Plan -> Implement.
3.  **`navigating-complex-task-autonomous` (Scientific Loop):**
    *   *Workflow:* Research -> Hypotheses -> Reviewer PASS -> Strategies -> Reviewer PASS -> Implementation Plan -> Checkpoint -> Implement -> Validate -> Diagnostic RCA -> Backtrack.

## 3. Physical Constraints (The "Teeth")
1.  **Flight Deck Header:** Mandatory Turn-Start Header with **Visual Progress Map**.
2.  **Turn-Based Tool Gate:** Prohibit implementation tools unless plan/strategy read in last 3 turns.
3.  **Feedback Intercept:** Mandatory `REASONING_RESET` token and "Step Back" on user feedback.
4.  **Wait-for-Go:** Prohibit Supervised Execution until explicit user approval ("Proceed/Go").
