---
name: executing-linear-tasks
description: MANDATORY. DO NOT attempt to "patch" or "update" code without calling 'activate_skill' on 'executing-linear-tasks' first. This is the REQUIRED PROTOCOL for predictable, low-risk engineering tasks where the path is obvious and follows an existing pattern. It enforces a high-velocity "Analyze -> Implement -> Validate -> Review" loop. Proceeding with brute-force changes without validation constitutes a protocol failure.
---

# Executing Linear Tasks

This skill provides the "Execution Engine" for straightforward work. It is designed for speed while maintaining safety through mandatory local validation and a pre-human convergence review.

## CRITICAL RULES
1.  **NO BRUTE FORCE:** You MUST identify an existing pattern in the codebase before implementing a change.
2.  **MANDATORY VALIDATION:** You are PROHIBITED from committing until local tests or linting scripts pass.
3.  **CONVERGENCE MANDATE:** You MUST call the `adversarial_reviewer` via the `conducting-adversarial-convergence` protocol before presenting the work to the human.
4.  **COMPLEXITY ESCALATION:** If local validation fails more than 2 times, you MUST stop, backtrack to the `orchestrating-decision-router`, and upgrade the task nature to **Complex**.

## WORKFLOW: [Analyze -> Act -> Validate -> Review]

### Step 1: Analyze & Pattern Match
*   Find the file(s) to modify.
*   Identify the existing pattern (style, logic, tests) that your change should follow.

### Step 2: Implement (Surgical Action)
*   Apply the change surgically. Avoid unrelated modifications.
*   Update the `.gemini/state/plan.md` to reflect the implementation.

### Step 3: Local Validation
*   Run the project's specific test runner or linting tool.
*   If validation fails, fix the code immediately.

### Step 4: Convergence Review
*   Activate the `conducting-adversarial-convergence` protocol.
*   Spar with the `adversarial_reviewer` until a "Pass" is achieved.

### Step 5: Finalize
*   Stage the changes.
*   Use `authoring-high-signal-git-commits` to finalize the work.

## INTERACTION STYLE
*   **Velocity:** Focus on fast, surgical execution.
*   **Directness:** Avoid long preambles. State what pattern was found and what was changed.
