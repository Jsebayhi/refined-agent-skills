---
name: selecting-optimal-methodology
description: MANDATORY. DO NOT start any task without calling 'activate_skill' on 'selecting-optimal-methodology' first. This is the REQUIRED ENTRYPOINT for establishing the operational contract (Linear vs. Complex) and selecting the appropriate execution engine. Proceeding with execution without this initial selection constitutes a mechanical failure of the framework.
---

# Selecting Optimal Methodology

This skill is the mandatory entrypoint for all agent operations. You MUST follow this two-step protocol to establish your operational quadrant before executing any implementation tools.

### STEP 1: TASK CLASSIFICATION (THE LINEARITY GATE)
Analyze the request against the following criteria. A task is **Linear (Trivial)** ONLY if it meets ALL of the following:
1.  **Surgical Scope:** <20 lines of code changed.
2.  **Zero Logic Drift:** No changes to logic flow, architecture, or state management.
3.  **Pattern Match:** Follows a 100% established pattern or is a purely mechanical fix (lint, formatting, docs).
4.  **Deterministic Signal:** Has a hard, non-ambiguous success signal (e.g., a specific test or lint command).

**DEFAULT TO COMPLEX:** If any criterion is unmet or ambiguous, the task NATURE is **Complex**.

### STEP 2: QUADRANT SELECTION
Once the nature is decided, select your **Primary Engine** based on the required oversight:

| Task Nature | Operational Mode | Primary Engine |
| :--- | :--- | :--- |
| **Linear** | **Any** (Supervised or Autonomous) | `executing-linear-task` |
| **Complex** | **Supervised** (Human architectural gatekeeping) | `navigating-complex-task-supervised` |
| **Complex** | **Autonomous** (Reviewer Proxy only) | `navigating-complex-task-autonomous` |

---

### MANDATORY PROTOCOL

#### 1. Propose Contract
Present the following contract for convergence:

> **MODE MATRIX CONTRACT**
> - **Nature:** [Linear | Complex]
> - **Mode:** [Supervised | Autonomous]
> - **Engine:** [Engine name from Matrix]
> - **Signal:** [Test/Script defining success]
> - **Rationale:** [Brief justification based on Step 1 criteria]

#### 2. Convergence & Approval Gate
The contract MUST be validated by the Reviewer first to ensure strategic alignment.

1.  **Reviewer Validation:** Call the `adversarial_reviewer`. Provide the contract and objective. 
2.  **Wait for PASS:** If the Reviewer fails the contract logic, adjust and re-submit.
3.  **Mode-Based Exit:**
    *   **Autonomous Mode:** If Reviewer issues "PASS", proceed immediately to Handover.
    *   **Supervised Mode:** If Reviewer issues "PASS", you MUST HALT and wait for the human to type 'APPROVE'.

#### 3. Handover
Once approved:
1. Activate **`authoring-artifact-driven-plans`** and the selected **Primary Engine**.
2. Follow the state-management protocol to initialize task memory and begin execution.

### ESCALATION GUARDRAIL
If local validation fails more than 10 times in the **Linear** engine, you MUST immediately halt, return to this skill, and upgrade the task nature to **Complex**.
