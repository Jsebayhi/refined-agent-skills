---
name: brainstorming-multiple-options
description: MANDATORY. DO NOT attempt to pick a single approach for a complex problem without calling 'activate_skill' on 'brainstorming-multiple-options' first. This is the REQUIRED SUB-ROUTINE for generating AT LEAST 3 distinct, falsifiable options (hypotheses or strategies) using Tree-of-Thought (ToT) logic. Proceeding with a single naive approach constitutes a protocol failure.
---

# Brainstorming Multiple Options

This skill provides the "Divergent Thinking" sub-routine for the Engines. Its objective is to explore the solution space by proposing multiple distinct paths that can be reviewed and converged upon.

### CRITICAL RULES
1.  **RULE OF THREE (MINIMUM):** You MUST generate AT LEAST 3 options. You are encouraged to generate more if the solution space is broad.
2.  **DISTINCT PATHS:** Options must be fundamentally different (e.g., "Surgical Patch" vs. "Refactor" vs. "Environment Change"). Do not propose variations of the same idea.
3.  **FALSIFIABILITY:** Every option MUST include a "Test for Failure" (What evidence would prove this specific idea wrong?).

### WORKFLOW: [Tree-of-Thought Generation]

#### 1. Analyze Context
Review the current task state (`SKILL.md` and reference shards) and all gathered evidence.

#### 2. Generate Options
Draft at least three distinct paths following this structure:

> ### Option [N]: [Name]
> *   **Premise:** [What do you believe is the cause/path?]
> *   **Action:** [What specific code changes are proposed?]
> *   **Trade-offs:** [Pros and Cons]
> *   **Falsifier:** [What specific test result or log entry would prove this option is INCORRECT?]

#### 3. Persistence
Save these options to the appropriate reference shard (e.g., `[STEP_ID]_hypotheses.md`) following the State Maintenance Rules.
