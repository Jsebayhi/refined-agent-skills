# Implementation Plan: Mode Matrix Framework

## Phase 1: The Foundation (State & Router)
*   **Goal:** Establish the entrypoint and disk-based state management.
*   **Tasks:**
    1.  Implement `skills/orchestrating-decision-router/SKILL.md`.
    2.  Implement `skills/authoring-artifact-driven-plans/SKILL.md`.
    3.  Create the initial `.gemini/state/` structure and mandate its addition to `.gitignore`.

## Phase 2: The Core Engines (Execution & Exploration)
*   **Goal:** Replace the legacy lifecycle with the "Dual-Piston" system.
*   **Tasks:**
    1.  Draft `skills/executing-linear-tasks/SKILL.md` (Fast track).
    2.  Draft `skills/navigating-complex-implementations/SKILL.md` (The Scientific Loop).
    3.  Deprecate `skills/orchestrating-software-lifecycle/` and `skills/performing-systematic-root-cause-analysis/`.

## Phase 3: The Review & Convergence Layer
*   **Goal:** Refine the agent-reviewer interaction.
*   **Tasks:**
    1.  Refactor `agents/adversarial-reviewer.md` to support the Convergence Loop.
    2.  Implement "Two-Stage Review" instructions (Compliance vs. Quality).

## Phase 4: Integration & Documentation
*   **Goal:** Formalize the system for the user and other agents.
*   **Tasks:**
    1.  Update `EXTENSION-GEMINI.md` with the new Quadrant mandates.
    2.  Update `README.md` with the new skill catalog.
    3.  Bump version to `0.4.0`.

## Verification Strategy
1.  **Bootstrap Test:** Use the `orchestrating-decision-router` to plan its own Phase 2 implementation.
2.  **RCA Regression:** Verify the new "Scientific Loop" can solve a known complex bug in a dummy repo.
