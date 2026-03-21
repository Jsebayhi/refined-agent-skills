---
name: executing-linear-task-autonomous
description: MANDATORY. DO NOT attempt automated, low-risk updates without calling 'activate_skill' on 'executing-linear-task-autonomous' first. This is the REQUIRED PROTOCOL for 'Autonomous Linear' tasks (Mechanical Loop + Hard Signal). It enforces a self-correcting loop that terminates only when the success signal is achieved and the work is reviewed.
---

# Executing Linear Tasks (Autonomous)

This skill provides the engine for predictable, background tasks. It relies on hard mechanical signals (lint passing, tests green) to drive a self-correcting loop, concluding with a mandatory convergence review.

### CRITICAL RULES
1. **MECHANICAL TERMINATION:** The implementation loop ends ONLY when the "Success Signal" (test/script) passes 100%.
2. **FAIL-FAST:** If the "Success Signal" remains red after 5 attempts, you MUST stop and escalate to the human.
3. **CONVERGENCE MANDATE:** Once the mechanical signal is green, you MUST achieve a "PASS" from the `adversarial_reviewer` via the `conducting-adversarial-convergence` protocol before committing.

### WORKFLOW: [Looping Execution -> Review]

#### 1. Define Signal
Identify the deterministic test or script that defines success (e.g., `pytest tests/test_style.py`).

#### 2. Execute & Observe
* Run the signal. 
* If red: Analyze the raw error and apply a surgical fix.
* If green: Proceed to Step 4.

#### 3. Iterative Correction
* Repeat Step 2. 
* Track every attempt in the task state references (`[STEP_ID]_evidence.md`).
* Apply the **Fail-Fast** limit (5 attempts).

#### 4. Convergence Review
* Activate `conducting-adversarial-convergence`.
* Spar with the Reviewer until a "PASS" is achieved.

#### 5. Finalize
* Stage all changes.
* Execute the commit using `authoring-high-signal-git-commits`.
* Report "Autonomous Task Complete" to the human.
