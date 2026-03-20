---
name: executing-linear-autonomous
description: MANDATORY. DO NOT attempt automated, low-risk updates without calling 'activate_skill' on 'executing-linear-autonomous' first. This is the REQUIRED PROTOCOL for 'Autonomous Linear' tasks (Mechanical Loop + Hard Signal). It enforces a self-correcting loop that terminates only when the success signal is achieved.
---

# Executing Linear Tasks (Autonomous)

This skill provides the engine for predictable, background tasks. It relies on hard mechanical signals (lint passing, tests green) to drive a self-correcting loop without human or reviewer intervention.

### CRITICAL RULES
1. **MECHANICAL TERMINATION:** The loop ends ONLY when the "Success Signal" (test/script) passes 100%.
2. **NO YAK SHAVING:** Do NOT perform architectural shifts or create new files in this mode.
3. **FAIL-FAST:** If the "Success Signal" remains red after 5 attempts, you MUST stop and escalate to the human.
4. **REVIEWER BYPASS:** The `adversarial_reviewer` is optional in this mode if the "Success Signal" is a deterministic code-quality tool (e.g., `npm run lint`).

### WORKFLOW: [Looping Execution]

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

#### 4. Finalize
* Once signal is green, stage all changes.
* Execute the commit using `authoring-high-signal-git-commits`.
* Report "Autonomous Task Complete" to the human.
