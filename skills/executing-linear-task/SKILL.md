---
name: executing-linear-task
description: MANDATORY. DO NOT attempt predictable updates without calling 'activate_skill' on 'executing-linear-task' first. This is the REQUIRED PROTOCOL for 'Linear' tasks. It enforces a high-velocity "Micro-Loop" with mandatory Flight Deck Headers and a 10-attempt threshold.
---

# Executing Linear Tasks

### CRITICAL RULES
1. **FLIGHT DECK HEADER:** Every response MUST begin with: `STEP_ID: 3.[TASK].[SUB] | STATE_REF: [PATH] | PROGRESS: [X of Y] | APPROVAL: N/A`.
2. **10-ATTEMPT THRESHOLD:** You are allowed 10 corrective iterations to achieve a passing signal. At the 11th attempt, you MUST stop and escalate to the **Complex** engine.
3. **FEEDBACK INTERCEPT:** Human feedback is a system interrupt. Halt the loop, output `REASONING_RESET: TACTIC`, and re-evaluate the task nature.
4. **CONVERGENCE MANDATE:** Achieve a Reviewer "PASS" before every commit.

### WORKFLOW: [Phase 3 Micro-Loop]

#### 1. Initial Setup
* Decompose surgical micro-tasks. Update the `current-task-state` checklist.
* Establish the Hard Signal (test/lint).

#### 2. The Execution Loop
For every micro-task in the checklist:
1. **Read:** Read the plan and relevant task intelligence.
2. **Act:** Implement the surgical change.
3. **Validate:** Run the Hard Signal. Apply up to 10 corrective fixes.
4. **Converge:** Achive a Reviewer "PASS" via the convergence protocol.
5. **Sync:** Mark the task as `[x]` and update the Flight Deck header progress.

#### 3. Finalize
* Commit using `authoring-high-signal-git-commits`.
* Report completion to the human.
