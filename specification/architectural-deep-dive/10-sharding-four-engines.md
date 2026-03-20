# Part 10: Sharding the 4 Quadrant Engines

*This document captures the decision to shard the two primary engines (Linear and Exploration) into four specialized skills to ensure maximum fidelity and zero interaction confusion.*

## 1. The Conflict: Merged vs. Sharded Logic
Previously, the framework used two engines (`executing-linear-tasks` and `navigating-complex-implementations`) with internal branching for "Supervised" vs. "Autonomous" modes. 

*   **The Risk:** Internal branching causes "Instructional Dilution." The agent must constantly check its contract to decide whether to wait for a human or call a reviewer. This leads to accidental "Autonomous" actions in "Supervised" mode and vice versa.

## 2. The Resolution: 4 Specialized Engines
To eliminate branching confusion, the framework will implement four distinct engine skills, each optimized for exactly one quadrant of the Mode Matrix.

### Quadrant 1: `executing-linear-supervised`
*   **Workflow:** Analyze -> Implement -> Local Validate -> Convergence Review -> Human Approval -> Commit.
*   **Persona:** High-velocity Pair Programmer.

### Quadrant 2: `executing-linear-autonomous`
*   **Workflow:** Define mechanical success (lint/tests) -> Execute in a loop -> Stop when signal is green.
*   **Persona:** Efficient Background Worker.

### Quadrant 3: `navigating-complex-supervised`
*   **Workflow:** Research -> Hypothesis ToT -> **Human Approval** -> Strategy ToT -> **Human Approval** -> Implement.
*   **Persona:** Architectural Sparring Partner.

### Quadrant 4: `navigating-complex-autonomous`
*   **Workflow:** Research -> Hypothesis ToT -> **Reviewer Pass** -> Strategy ToT -> **Reviewer Pass** -> Checkpoint -> Implement -> Backtrack on failure.
*   **Persona:** Scientific Autonomous Researcher.

## 3. Benefits
*   **Zero Logic Branches:** The agent's prompt is 100% focused on the current interaction model.
*   **Clean Handover:** The Methodology Selector acts as a clean router, loading exactly the right "Brain" for the job.
