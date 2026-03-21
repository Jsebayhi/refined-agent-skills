---
name: executing-linear-task-supervised
description: MANDATORY. DO NOT attempt predictable, low-risk updates without calling 'activate_skill' on 'executing-linear-task-supervised' first. This is the REQUIRED PROTOCOL for 'Supervised Linear' tasks (Pattern Matching + Human Sign-off). It enforces a high-velocity "Decompose -> Analyze -> Implement -> Validate -> Review -> Approval" loop.
---

# Executing Linear Tasks (Supervised)

This skill provides the engine for straightforward, human-supervised work. It focuses on surgical pattern-matching and high-velocity implementation with final human gatekeeping.

### CRITICAL RULES
1. **DECOMPOSITION FIRST:** Your very first action MUST be to decompose the task into micro-tasks within the sharded plan (`references/[STEP_ID]_plan.md`).
2. **NO BRUTE FORCE:** You MUST identify an existing pattern in the codebase before implementing a change.
3. **LOCAL VALIDATION:** You are PROHIBITED from presenting work until local tests or linting scripts pass.
4. **CONVERGENCE MANDATE:** You MUST achieve a "PASS" from the `adversarial_reviewer` via the convergence protocol before presenting the final diff to the human.
5. **COMPLEXITY ESCALATION:** If local validation fails more than 2 times, you MUST stop, return to `selecting-optimal-methodology`, and upgrade to **Complex**.

### WORKFLOW: [Decompose -> Analyze -> Act -> Validate -> Review -> Approve]

#### 1. Initial Decomposition
* Translate the "Fast Track" workflow into specific micro-tasks for the current goal.
* Update `references/[STEP_ID]_plan.md` and the high-level task state `SKILL.md`.

#### 2. Analyze & Pattern Match
* Identify target files and existing patterns.
* Document the pattern in the task state references.

#### 3. Implement (Surgical Action)
* Apply the change surgically.
* Update the task state skill and references.

#### 4. Local Validation
* Run project-specific tests/lint. Fix any failures immediately.

#### 5. Convergence Review
* Activate `conducting-adversarial-convergence`.
* Debate with the Reviewer until a "PASS" is achieved.

#### 6. Human Approval & Finalize
* Present the converged result to the human. **WAIT FOR APPROVAL.**
* Stage changes and commit using `authoring-high-signal-git-commits`.
