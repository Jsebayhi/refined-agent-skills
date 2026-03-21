---
name: navigating-complex-task-supervised
description: MANDATORY. DO NOT attempt complex tasks with human oversight without calling 'activate_skill' on 'navigating-complex-task-supervised' first. It enforces human-in-the-loop gates, Two-Stage Decomposition, and mandatory Flight Deck Headers.
---

# Navigating Complex Implementations (Supervised)

### CRITICAL RULES
1. **FLIGHT DECK HEADER:** Every response MUST begin with the header: `STEP_ID: [ID] | STATE_REF: [PATH] | PROGRESS: [X of Y] | APPROVAL: [PENDING|RECEIVED]`.
2. **TOOL-GATING:** You are PROHIBITED from calling implementation tools (`write_file`, `replace`) unless you have called `read_file` on the strategy shard (`_strategies.md`) in the last 3 turns.
3. **REINFORCED APPROVAL:** You are PROHIBITED from starting the Execution Plan until the human provides a command to "Proceed" or "Yes." You MUST confirm this in the Flight Deck Header as `APPROVAL: RECEIVED`.
4. **FEEDBACK INTERCEPT:** Human feedback is a system interrupt. Halt the loop, output `REASONING_RESET: [GOAL|ARCH]`, and step back to Phase 1 or 2.

### WORKFLOW: [Discovery -> Strategy -> Execution Loop]

#### Phase 1: Discovery (Discovery Plan -> Hypotheses -> Reviewer -> Human)
* Decompose Discovery micro-tasks. 
* Converge on Hypothesis with Reviewer -> Present to human. **WAIT FOR APPROVAL.**

#### Phase 2: Strategy (Strategy ToT -> Reviewer -> Human)
* Converge on Solution Strategy with Reviewer -> Present to human. 
* **GATE:** Wait for "Proceed with the plan" or equivalent token. Set `APPROVAL: RECEIVED`.

#### Phase 3: Execution Loop (Sub-task -> Validate -> Reviewer -> Sync)
1. **Decompose:** Only now decompose specific implementation micro-tasks. Update checklist.
2. **Read:** Read the approved strategy (must be in last 3 turns).
3. **Act:** Implement surgical micro-task.
4. **Validate:** Run Hard Signal. Apply up to 5 fixes.
5. **Converge:** Achieve Reviewer "PASS".
6. **Sync:** Mark task as `[x]` in `current-task-state`. 
7. **Analyze:** Ask if gathered knowledge invalidates the plan. If yes, re-decomose.
8. **Present:** Present final result to human. **WAIT FOR APPROVAL.**
