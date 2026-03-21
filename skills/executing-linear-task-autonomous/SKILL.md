---
name: executing-linear-task-autonomous
description: MANDATORY. DO NOT attempt automated, low-risk updates without calling 'activate_skill' on 'executing-linear-task-autonomous' first. This is the REQUIRED PROTOCOL for 'Autonomous Linear' tasks (Mechanical Loop + Hard Signal). It enforces a self-correcting loop that terminates only when the success signal is achieved and the work is reviewed.
---

# Executing Linear Tasks (Autonomous)

This skill provides the engine for predictable, background tasks. It relies on hard mechanical signals (lint passing, tests green) to drive a self-correcting loop, concluding with a mandatory convergence review.

### CRITICAL RULES
1. **DECOMPOSITION FIRST:** Your very first action MUST be to decompose the task into specific micro-tasks. Follow the **State Maintenance Rules** defined in the `current-task-state` skill to record this plan.
2. **MECHANICAL TERMINATION:** The implementation loop ends ONLY when the "Success Signal" (test/script) passes 100%.
3. **FAIL-FAST:** If the "Success Signal" remains red after 5 attempts, you MUST stop and escalate to the human.
4. **CONVERGENCE MANDATE:** Once the mechanical signal is green, you MUST achieve a "PASS" from the `adversarial_reviewer` via the convergence protocol before committing.

### WORKFLOW: [Decompose -> Looping Execution -> Review]

#### 1. Initial Decomposition
* Translate the "Background Worker" workflow into specific micro-tasks for the current goal.
* Update the task state (checklist and context) following the sharding and prefixing rules defined in the `current-task-state` skill.

#### 2. Define Signal
Identify the deterministic test or script that defines success (e.g., `pytest tests/test_style.py`).

#### 3. Execute & Observe
* Run the signal. 
* If red: Analyze the raw error and apply a surgical fix.
* If green: Proceed to Step 5.

#### 4. Iterative Correction
* Repeat Step 3. 
* Track every attempt in the task state references following the prefix-based naming convention.
* Apply the **Fail-Fast** limit (5 attempts).

#### 5. Convergence Review
* Activate `conducting-adversarial-convergence`.
* Spar with the Reviewer until a "PASS" is achieved.

#### 6. Finalize
* Stage all changes.
* Execute the commit using `authoring-high-signal-git-commits`.
* Report "Autonomous Task Complete" to the human.
