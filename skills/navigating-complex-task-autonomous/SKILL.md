---
name: navigating-complex-task-autonomous
description: MANDATORY. DO NOT attempt complex tasks autonomously without calling 'activate_skill' on 'navigating-complex-task-autonomous' first. It enforces nested convergence loops, Two-Stage Decomposition, and mandatory Flight Deck Headers.
---

# Navigating Complex Implementations (Autonomous)

### CRITICAL RULES
1. **FLIGHT DECK HEADER:** Every response MUST begin with the header: `STEP_ID: [ID] | STATE_REF: [PATH] | PROGRESS: [X of Y] | APPROVAL: PROXY`.
2. **TOOL-GATING:** You are PROHIBITED from calling implementation tools (`write_file`, `replace`) unless you have called `read_file` on the strategy shard (`_strategies.md`) in the last 3 turns.
3. **REVIEWER PROXY:** The Reviewer acts as the definitive gatekeeper for all designs. Achieve a Reviewer "PASS" at every gate.
4. **FEEDBACK INTERCEPT:** Human feedback is a system interrupt. Halt the loop, output `REASONING_RESET: [GOAL|ARCH]`, and step back to Phase 1 or 2.

### WORKFLOW: [Discovery -> Strategy -> Execution Loop]

#### Phase 1: Discovery (Discovery Plan -> Hypotheses -> Reviewer PASS)
* Decompose Discovery micro-tasks. 
* Converge on Hypothesis with Reviewer.

#### Phase 2: Strategy (Strategy ToT -> Reviewer PASS)
* Converge on Solution Strategy with Reviewer.

#### Phase 3: Execution Loop (Sub-task -> Validate -> Reviewer -> Sync)
1. **Decompose:** Only now decompose specific implementation micro-tasks. Update checklist.
2. **Read:** Read approved strategy (last 3 turns).
3. **Act:** Implement surgical micro-task.
4. **Validate & Diagnostic:** Run Hard Signal. 
    * If fail: Perform RCA. Use up to 4 corrective fixes if Implementation-based; otherwise, trigger **Backtrack**.
5. **Converge:** Achieve Reviewer "PASS".
6. **Sync:** Mark task as `[x]` in `current-task-state`. 
7. **Analyze:** Ask if gathered knowledge invalidates the plan. If yes, re-decompose.

### BACKTRACK MANDATE
If validation fails after 5 attempts or at the Diagnostic Gate, preserve evidence (`git commit -m "failed evidence"`) and reset (`git reset --hard [CHECKPOINT]`). Return to Phase 1 or 2 based on RCA.
