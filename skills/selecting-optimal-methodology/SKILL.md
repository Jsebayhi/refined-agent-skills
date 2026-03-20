---
name: selecting-optimal-methodology
description: MANDATORY. DO NOT start any task without calling 'activate_skill' on 'selecting-optimal-methodology' first. This is the REQUIRED ENTRYPOINT for establishing the operational contract (Linear vs. Complex) and selecting the appropriate execution engine. Proceeding with execution without this initial selection constitutes a mechanical failure of the framework.
---

# Selecting Optimal Methodology

This skill is the mandatory entrypoint for all agent operations. It forces the selection of the specific operational engine required to achieve the user's goal with maximum fidelity.

### 1. THE DECISION MATRIX
Use the following matrix to select the appropriate **Primary Engine**:

| Task Nature | Definition | Primary Engine |
| :--- | :--- | :--- |
| **Linear** | Trivial pattern-match, <20 lines of code, zero logic flow changes. | `executing-linear-tasks` |
| **Complex** | New features, bug investigations, or any change requiring decision-making. | `navigating-complex-implementations` |

### 2. CRITICAL RULES
1.  **NO ACTION WITHOUT CONTRACT:** Execution of implementation or discovery tools is PROHIBITED until the Mode Matrix Contract is established and approved.
2.  **MANDATORY SUB-SKILL CHAINING:** Once the contract is approved, you MUST deactivate this skill and activate both the **state-management skill** (`authoring-artifact-driven-plans`) and the **Primary Engine** skill selected from the matrix.
3.  **DEFAULT TO COMPLEX:** If a task nature is ambiguous, you MUST select **Complex**.

### 3. WORKFLOW: [Discovery -> Selection -> Handover]

#### Step 1: Discovery & Analysis
Analyze the request against the Decision Matrix definitions above.

#### Step 2: Establish the Mode Matrix Contract
Present the following contract to the human (or reviewer in Autonomous mode) with your selections and wait for approval:

> **MODE MATRIX CONTRACT**
> *   **Task Nature:** [Linear | Complex]
> *   **Operational Mode:** [Supervised (Human Review) | Autonomous (Reviewer Proxy)]
> *   **Primary Engine:** [Name of the selected engine from the Matrix]
> *   **Success Signal:** [Technical name of test/script/condition that defines success]
> *   **Justification:** [Brief technical reason for this selection]

**APPROVAL GATE:**
- **Supervised Mode:** HALT AND WAIT FOR USER TO TYPE 'APPROVE'.
- **Autonomous Mode:** Call the `adversarial_reviewer`. If the reviewer confirms the contract logic and engine choice, proceed.

#### Step 3: Handover & Initialization
Once approved:
1.  State: "Contract established. Handing over to [Selected Engine] and initializing state."
2.  Deactivate this skill.
3.  Activate **`authoring-artifact-driven-plans`** and the selected **Engine skill**.
4.  Follow the state-management protocol to initialize task memory and begin execution.
