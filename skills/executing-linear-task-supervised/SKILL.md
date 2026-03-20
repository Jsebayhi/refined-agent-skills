---
name: executing-linear-task-supervised
description: MANDATORY. DO NOT attempt predictable, low-risk updates without calling 'activate_skill' on 'executing-linear-supervised' first. This is the REQUIRED PROTOCOL for 'Supervised Linear' tasks (Pattern Matching + Human Sign-off). It enforces a high-velocity "Analyze -> Implement -> Validate -> Review -> Approval" loop.
---

# Executing Linear Tasks (Supervised)

This skill provides the engine for straightforward, human-supervised work. It focuses on surgical pattern-matching and high-velocity implementation with final human gatekeeping.

### CRITICAL RULES
1. **NO BRUTE FORCE:** You MUST identify an existing pattern in the codebase before implementing a change.
2. **LOCAL VALIDATION:** You are PROHIBITED from presenting work until local tests or linting scripts pass.
3. **CONVERGENCE MANDATE:** You MUST achieve a "PASS" from the `adversarial_reviewer` via the convergence protocol before presenting the final diff to the human.
4. **COMPLEXITY ESCALATION:** If local validation fails more than 2 times, you MUST backtrack to `selecting-optimal-methodology` and upgrade to **Complex**.

### WORKFLOW: [Analyze -> Act -> Validate -> Review -> Approve]

#### 1. Analyze & Pattern Match
* Identify target files and existing patterns.
* Document the pattern in the task state references.

#### 2. Implement (Surgical Action)
* Apply the change surgically.
* Update the task state skill and references.

#### 3. Local Validation
* Run project-specific tests/lint. Fix any failures immediately.

#### 4. Convergence Review
* Activate `conducting-adversarial-convergence`.
* Debate with the Reviewer until a "PASS" is achieved.

#### 5. Human Approval & Finalize
* Present the converged, pre-hardened result to the human.
* **WAIT FOR APPROVAL.**
* Stage changes and commit using `authoring-high-signal-git-commits`.
