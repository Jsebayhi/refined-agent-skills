---
name: selecting-optimal-methodology
description: MANDATORY. DO NOT start any task without calling 'activate_skill' on 'selecting-optimal-methodology' first. This is the REQUIRED ENTRYPOINT for establishing the operational contract (Linear vs. Complex) and selecting the appropriate execution engine. Proceeding with execution without this initial selection constitutes a mechanical failure of the framework.
---

# Selecting Optimal Methodology

This skill is the mandatory entrypoint for all agent operations. You MUST select your operational quadrant from the matrix below before executing any implementation tools.

### THE QUADRANT MATRIX
Select your **Primary Engine** based on task complexity and required oversight.

| Quadrant | Selection Criteria (Task Nature) | Operational Mode | Primary Engine |
| :--- | :--- | :--- | :--- |
| **Q1** | **Trivial:** <20 lines of code, zero logic flow changes, surgical pattern match. | **Supervised** | `executing-linear-task-supervised` |
| **Q2** | **Trivial:** Mechanical fixes (lint/docs) with a hard deterministic success signal. | **Autonomous** | `executing-linear-task-autonomous` |
| **Q3** | **Complex:** Decisions/Features/Bugs or any task requiring architectural consideration. | **Supervised** | `navigating-complex-task-supervised` |
| **Q4** | **Complex:** High-uncertainty tasks where the agent searches the solution space. | **Autonomous** | `navigating-complex-task-autonomous` |

### CRITICAL GUARDRAILS
1.  **DEFAULT TO COMPLEX:** If a task nature is ambiguous or you cannot find a 100% pattern match, you MUST select **Complex**.
2.  **ESCALATION:** If a task is initially classified as **Linear** but local validation fails more than 2 times, you MUST immediately halt and upgrade to **Complex**.
3.  **REVIEWER MANDATE:** ALL quadrants require a final convergence review via `conducting-adversarial-convergence` before completion.

### MANDATORY PROTOCOL

#### 1. Propose Contract
Analyze the request, select the quadrant, and present the following contract for approval:

> **MODE MATRIX CONTRACT**
> - **Nature:** [Linear | Complex]
> - **Mode:** [Supervised | Autonomous]
> - **Engine:** [Engine name from Matrix]
> - **Signal:** [Test/Script defining success]
> - **Rationale:** [Technical justification for this selection]

**APPROVAL GATE:**
- **Supervised Mode:** HALT. Wait for user to type 'APPROVE'.
- **Autonomous Mode:** Call `adversarial_reviewer`. Proceed only if the contract logic is validated.

#### 2. Handover
Once approved:
1. Activate **`authoring-artifact-driven-plans`** and the selected **Primary Engine**.
2. Follow the state-management protocol to initialize task memory and begin execution.
