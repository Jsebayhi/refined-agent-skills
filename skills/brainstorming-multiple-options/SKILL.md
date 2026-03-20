---
name: brainstorming-multiple-options
description: MANDATORY. DO NOT attempt to pick a single approach for a complex problem without calling 'activate_skill' on 'brainstorming-multiple-options' first. This is the REQUIRED SUB-ROUTINE for generating exactly 3 distinct, falsifiable options (hypotheses or strategies) using Tree-of-Thought (ToT) logic. Proceeding with a single naive approach constitutes a protocol failure.
---

# Brainstorming Multiple Options

This skill provides the "Divergent Thinking" sub-routine for the Engines. Its objective is to explore the solution space by proposing three distinct paths that can be reviewed and converged upon.

## CRITICAL RULES
1.  **RULE OF THREE:** You MUST generate exactly 3 options. No more, no less.
2.  **DISTINCT PATHS:** Options must be fundamentally different (e.g., "Surgical Patch" vs. "Refactor" vs. "Env Change"). Do not propose three variations of the same idea.
3.  **FALSIFIABILITY:** Every option MUST include a "Test for Failure" (What evidence would prove this idea wrong?).

## WORKFLOW: [Tree-of-Thought Generation]

### Step 1: Analyze Context
Review the current `.gemini/state/plan.md` and any evidence gathered.

### Step 2: Generate 3 Options
Draft three distinct paths following this structure:

> ### Option [1|2|3]: [Name]
> *   **Premise:** [What do you believe is the cause/path?]
> *   **Action:** [What specific code changes are proposed?]
> *   **Trade-offs:** [Pros and Cons]
> *   **Falsifier:** [What specific test result or log entry would prove this option is INCORRECT?]

### Step 3: Persistence
Save these options to `.gemini/state/hypotheses.md` or `.gemini/state/strategies.md`.

## INTERACTION STYLE
*   **Analytical:** Focus on logic and distinct architectural differences.
*   **Structured:** Use the specific Markdown headers provided.
