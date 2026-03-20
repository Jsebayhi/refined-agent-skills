---
name: orchestrating-decision-router
description: MANDATORY. DO NOT start any engineering task (build, fix, refactor, investigate) without calling 'activate_skill' on 'orchestrating-decision-router' first. This is the REQUIRED ENTRYPOINT for establishing the operational contract (Linear vs. Complex, Supervised vs. Autonomous) and initializing disk-based state. Proceeding without this initial routing constitutes a protocol failure.
---

# Orchestrating Decision Router

This skill is the undisputed entrypoint for all agent operations. Its goal is to eliminate "Instructional Dilution" by forcing the agent to select the specific, high-fidelity loop required for the current task.

## CRITICAL RULES
1.  **NO ACTION WITHOUT CONTRACT:** You are strictly PROHIBITED from executing any implementation or discovery tools until the Mode Matrix Contract is established and approved by the human.
2.  **MANDATORY SUB-SKILL CHAINING:** Once the contract is established, you MUST deactivate the router and activate the specific Engine skill (Linear or Exploration) for that quadrant.

## WORKFLOW: [Discovery -> Routing -> Handover]

Follow these steps precisely.

### Step 1: High-Level Discovery
Briefly analyze the request to determine its nature. Do NOT perform deep research yet.
*   **Linear:** The path is obvious, low-risk, and follows a clear existing pattern (e.g., "Add a field," "Update docs," "Linting").
*   **Complex:** The path is unknown, requires exploration, architectural changes, or the agent has hit resistance (e.g., "Implement feature X," "Fix obscure bug Y").

### Step 2: Establish the Mode Matrix Contract
Present the following contract to the human (or reviewer in Autonomous mode) and wait for approval:

> **MODE MATRIX CONTRACT**
> *   **Task Nature:** [Linear | Complex]
> *   **Operational Mode:** [Supervised (Human Review) | Autonomous (Reviewer Proxy)]
> *   **Primary Engine:** [executing-linear-tasks | navigating-complex-implementations]
> *   **Success Signal:** [Name of test/script/condition that defines 'Done']

**APPROVAL GATE:**
- **Supervised Mode:** HALT AND WAIT FOR USER TO TYPE 'APPROVE'.
- **Autonomous Mode:** Activate the `adversarial_reviewer`. If the reviewer confirms the contract is logical and the engine choice is correct, proceed.

### Step 3: Initialize State & Handover
Once approved:
1.  Initialize the disk-based memory in `.gemini/state/` (using `authoring-artifact-driven-plans`).
2.  Explicitly state: "Contract established. Handing over to [Engine Skill]."
3.  Activate the specific Engine skill and proceed.

## INTERACTION STYLE
*   **Tone:** High-fidelity project conductor.
*   **Efficiency:** Minimal text. Focus strictly on establishing the routing contract.
