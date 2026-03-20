---
name: selecting-optimal-methodology
description: MANDATORY. DO NOT start any task without calling 'activate_skill' on 'selecting-optimal-methodology' first. This is the REQUIRED ENTRYPOINT for establishing the operational contract (Linear vs. Complex) and selecting the appropriate execution engine. Proceeding with execution without this initial selection constitutes a mechanical failure of the framework.
---

# Selecting Optimal Methodology

This skill is the mandatory entrypoint for all agent operations. It forces the selection of the specific operational loop (Linear or Complex) required to achieve the user's goal with maximum fidelity.

### CRITICAL RULES
1.  **NO ACTION WITHOUT CONTRACT:** Execution of implementation or discovery tools is PROHIBITED until the Mode Matrix Contract is established and approved.
2.  **MANDATORY SUB-SKILL CHAINING:** Once the contract is approved, you MUST deactivate this skill and activate both the **state-management skill** (`authoring-artifact-driven-plans`) and the specific **Engine skill** indicated in the contract:
    *   For **Linear** tasks: Activate **`executing-linear-tasks`**.
    *   For **Complex** tasks: Activate **`navigating-complex-implementations`**.
3.  **OBJECTIVE JUSTIFICATION:** You must explicitly justify why a task is "Linear" based on the technical constraints below. If in doubt, you MUST default to "Complex."

### WORKFLOW: [Discovery -> Selection -> Handover]

#### 1. Discovery & Analysis
Analyze the request to determine its nature based on the following definitions:
*   **Linear (Trivial):** The path is a brainless update (e.g., surgical one-line fixes, documentation updates, or applying lint fixes). It involves <20 lines of code and zero logic flow changes.
*   **Complex (Standard/Exploration):** Any task requiring decision-making. This includes implementing new features, multi-step investigations, or any change that alters logic flow or creates new files.

#### 2. Establish the Mode Matrix Contract
Present the following contract to the human (or reviewer in Autonomous mode) and wait for approval:

> **MODE MATRIX CONTRACT**
> *   **Task Nature:** [Linear | Complex]
> *   **Operational Mode:** [Supervised (Human Review) | Autonomous (Reviewer Proxy)]
> *   **Primary Engine:** [executing-linear-tasks | navigating-complex-implementations]
> *   **Success Signal:** [Technical name of test/script/condition that defines success]
> *   **Justification:** [Technical reason for this selection]

**APPROVAL GATE:**
- **Supervised Mode:** HALT AND WAIT FOR USER TO TYPE 'APPROVE'.
- **Autonomous Mode:** Call the `adversarial_reviewer`. If the reviewer confirms the contract logic and engine choice, proceed.

#### 3. Handover & Initialization
Once approved:
1.  State: "Contract established. Handing over to [Engine Skill] and initializing state."
2.  Deactivate this skill.
3.  Activate the **state-management skill** (`authoring-artifact-driven-plans`) and the chosen **Engine skill**.
4.  Follow the state-management protocol to initialize task memory and begin execution.
