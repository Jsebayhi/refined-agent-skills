# Part 12: Intelligence Separation and Dynamic Planning

*This document captures the rigorous protocols for separating source intelligence and the timing of task decomposition.*

## 1. The Intelligence Split
To ensure high-fidelity continuity, the agent must treat information differently based on its source.

### A. Human Intelligence (Guaranteed Guidance)
*   **Source:** Instructions, context, and domain knowledge provided by the human.
*   **Persistence:** Immutable by the agent.
*   **Rule:** Only the human can invalidate or modify this intelligence. If the agent identifies a contradiction between human guidance and the codebase, it MUST flag the discrepancy and wait for human alignment before proceeding.
*   **Storage:** `[STEP_PREFIX]_human_intel.md`.

### B. Autonomous Intelligence (Scrutinized Evidence)
*   **Source:** Grep results, logs, stack traces, and code analysis gathered by the agent.
*   **Persistence:** Transient.
*   **Rule:** Subject to constant scrutiny and "remise en question." This intelligence is considered "suspect" and must be verified against hard signals. It is discarded or re-evaluated during backtracking.
*   **Storage:** `[STEP_PREFIX]_autonomous_intel.md`.

## 2. Dynamic Decomposition
The timing of task decomposition must match the task's uncertainty level.

### A. Linear Tasks (Single-Stage)
*   Since the path is a trivial pattern match, the agent decomposes the entire implementation immediately upon entry.

### B. Complex Tasks (Two-Stage)
*   **Stage 1: Discovery Planning.** Upon entry, the agent only decomposes the micro-tasks for Research, Hypothesis Generation, and Solution Strategy.
*   **Stage 2: Implementation Planning.** Only after the Solution Convergence loop achieves a "PASS" from the Reviewer does the agent decompose the specific, surgical implementation micro-tasks.

## 3. The Original Goal (The North Star)
*   The agent must maintain a `[STEP_PREFIX]_original_goal.md` file.
*   This file contains the initial task description and is enriched by later feedback. It ensures that no matter how deep the exploration goes, the "North Star" of the mission is never lost.
