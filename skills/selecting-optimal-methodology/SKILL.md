---
name: selecting-optimal-methodology
description: MANDATORY. DO NOT start any task without calling 'activate_skill' on 'selecting-optimal-methodology' first. This is the REQUIRED ENTRYPOINT for establishing the operational contract (Linear vs. Complex) and selecting the appropriate execution engine. Proceeding with execution without this initial selection constitutes a mechanical failure of the framework.
---

# Selecting Optimal Methodology

This skill is the mandatory entrypoint for all agent operations. You MUST select your operational quadrant from the matrix below before executing any implementation tools.

### THE QUADRANT MATRIX
Select your **Primary Engine** based on task complexity and required oversight. Default to **Complex** if nature is ambiguous.

| Task Nature | Operational Mode | Selection Criteria | Primary Engine |
| :--- | :--- | :--- | :--- |
| **Linear** | **Supervised** | Trivial update (<20 lines, zero logic changes) + Human Sign-off. | `executing-linear-task-supervised` |
| **Linear** | **Autonomous** | Trivial update + Mechanical Signal (lint/tests) only. | `executing-linear-task-autonomous` |
| **Complex** | **Supervised** | Decisions/Features/Bugs + Human Architectural control. | `navigating-complex-task-supervised` |
| **Complex** | **Autonomous** | Decisions/Features/Bugs + Reviewer Proxy gatekeeping. | `navigating-complex-task-autonomous` |

### MANDATORY PROTOCOL

#### 1. Propose Contract
Analyze the request, select the quadrant, and present the following contract for approval:

> **MODE MATRIX CONTRACT**
> - **Nature:** [Linear | Complex]
> - **Mode:** [Supervised | Autonomous]
> - **Engine:** [Engine name from Matrix]
> - **Signal:** [Test/Script defining success]
> - **Rationale:** [Brief justification for this selection]

**APPROVAL GATE:**
- **Supervised Mode:** HALT. Wait for user to type 'APPROVE'.
- **Autonomous Mode:** Call `adversarial_reviewer`. Proceed only if the contract logic is validated.

#### 2. Handover
Once approved:
1. Deactivate this skill.
2. Activate **`authoring-artifact-driven-plans`** and the selected **Primary Engine**.
3. Follow the state-management protocol to initialize task memory and begin execution.
