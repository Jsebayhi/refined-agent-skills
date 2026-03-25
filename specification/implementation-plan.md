# Implementation Plan: Mode Matrix Framework

## Phase 1: The Foundation (State & Router)
*   **Goal:** Establish the entrypoint and disk-based state management.
*   **Tasks:**
    1.  Implement `skills/selecting-optimal-methodology/SKILL.md`.
    2.  Implement `skills/authoring-artifact-driven-plans/SKILL.md`.
    3.  Create the initial `.gemini/skills/current-task-state/` structure and deterministic setup script.

## Phase 2: The Core Engines (The 4 Quadrants)
*   **Goal:** Implement specialized engines for each interaction mode.
*   **Tasks:**
    1.  Draft `skills/executing-linear-task-supervised/SKILL.md`.
    2.  Draft `skills/executing-linear-task-autonomous/SKILL.md`.
    3.  Draft `skills/navigating-complex-task-supervised/SKILL.md`.
    4.  Draft `skills/navigating-complex-task-autonomous/SKILL.md`.

## Phase 3: The Review & Convergence Layer
*   **Goal:** Refine the agent-reviewer interaction.
*   **Tasks:**
    1.  Implement `skills/conducting-adversarial-convergence/SKILL.md`.
    2.  Harden `agents/adversarial-reviewer.md` with Convergence and Code-Provision mandates.

## Phase 4: Integration & Documentation
*   **Goal:** Formalize the system for high-fidelity release.
*   **Tasks:**
    1.  Update `EXTENSION-GEMINI.md` with Quadrant mandates.
    2.  Update `README.md` with the new v0.4.1 architecture.
    3.  Bump version to `0.4.1`.

## Verification Strategy
1.  **Precision Audit:** Use the `adversarial_reviewer` to confirm zero logical deadlocks and naming consistency.
2.  **RCA Regression:** Verify the `navigating-complex-task-autonomous` engine correctly handles backtracking with evidence preservation.
