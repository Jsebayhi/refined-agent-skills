---
name: executing-linear-task
description: MANDATORY. DO NOT attempt predictable updates without calling 'activate_skill' on 'executing-linear-task' first. This is the REQUIRED PROTOCOL for 'Linear' tasks (Pattern Matching). It enforces a high-velocity "Decompose -> Analyze -> Implement -> Validate -> Review -> Commit" loop with a 10-attempt threshold.
---

# Executing Linear Tasks

This skill provides the unified "Execution Engine" for straightforward, pattern-based work. It is designed for maximum velocity, using Git as a persistent checkpointing mechanism.

### CRITICAL RULES
1. **DECOMPOSITION:** Your first action MUST be to decompose the task into specific micro-tasks following the State Maintenance Rules.
2. **10-ATTEMPT THRESHOLD:** You are allowed up to 10 corrective iterations to achieve a passing validation state.
3. **LINEAR ESCALATION:** If validation fails after the 10th attempt, you MUST stop, return to `selecting-optimal-methodology`, and upgrade the task to **Complex** to trigger the scientific loop.
4. **CONVERGENCE MANDATE:** You MUST achieve a "PASS" from the `adversarial_reviewer` via the convergence protocol before committing.
5. **CHECKPOINT PHILOSOPHY:** No human halt is required at the commit stage. Commits serve as valuable reversible checkpoints.

### WORKFLOW: [Decompose -> Analyze -> Act -> Validate -> Review -> Commit]

#### 1. Initial Decomposition
* Translate the workflow into micro-tasks.
* Update the task state (checklist and context) in the `current-task-state` skill.

#### 2. Analyze & Pattern Match
* Identify target files and the existing pattern to follow.
* Document the findings in the task state references.

#### 3. Implement (Surgical Action)
* Apply the change surgically.
* Update the task state immediately.

#### 4. Local Validation & Iteration
* Run project-specific tests/lint. 
* If fails: Apply a fix and repeat (up to 10 total implementation attempts). 
* **Note:** Track every attempt in the reference shards.

#### 5. Convergence Review
* Activate `conducting-adversarial-convergence`.
* Spar with the Reviewer until a "PASS" is achieved.

#### 6. Finalize & Commit
* Stage changes and commit using `authoring-high-signal-git-commits`.
* Report completion to the human.
