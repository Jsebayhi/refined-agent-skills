# System Spec Evolution: v0.4.1 (Sharded Engines)

## 1. Objective
Refine the v0.4.0 specification to shard the two primary engines (Linear and Exploration) into four specialized quadrant skills. This eliminates logic-branching and "Instructional Dilution" within the agent prompts.

## 2. Updated Core Components

### A. The Methodology Selector (The Entrypoint)
*   **Skill:** `selecting-optimal-methodology`
*   **Update:** Now maps the 4 quadrants of the Mode Matrix to 4 distinct engine skills.

### B. The 4 Quadrant Engines
1.  **`executing-linear-supervised`**: Pattern matching with human sign-off.
2.  **`executing-linear-autonomous`**: Mechanical loop (lint/tests) with minimal oversight.
3.  **`navigating-complex-supervised`**: Complex tasks with human architectural control.
4.  **`navigating-complex-autonomous`**: The "Scientific Loop" with Reviewer-Proxy gatekeeping.

## 3. Decision Matrix (Updated)

| Task Nature | Operational Mode | Primary Engine |
| :--- | :--- | :--- |
| **Linear** | **Supervised** | `executing-linear-supervised` |
| **Linear** | **Autonomous** | `executing-linear-autonomous` |
| **Complex** | **Supervised** | `navigating-complex-supervised` |
| **Complex** | **Autonomous** | `navigating-complex-autonomous` |

## 4. Continuity
All other v0.4.0 constraints (Context Tax, Persistence Trap, Backtrack Mandate) remain in effect.
