---
name: current-task-state
description: MANDATORY. DO NOT proceed with any task without calling 'activate_skill' on 'current-task-state' first. This is the REQUIRED PROTOCOL for resuming an active task. You MUST prepend the 'Flight Deck' header to every response.
---

# RESUMPTION PROTOCOL: [Task Name]
**Current STEP_ID:** [STEP_ID] | **PHASE:** [1|2|3] | **PROGRESS:** [X of Y] | **APPROVAL:** [PENDING|RECEIVED]

## Flight Deck Mandate
You MUST begin every response with this mechanical header:
> **STEP_ID:** [PHASE].[TASK].[SUB] | **STATE_REF:** [FILE_PATH] | **PROGRESS:** [X of Y] | **APPROVAL:** [PENDING|RECEIVED]

## Original Goal
*(Ground Truth sharded to references/[STEP_ID]_original_goal.md. Agent Immutable.)*

## Active Checklist
- [ ] [Micro-task 1]
- [ ] [Micro-task 2]
*(Detailed plan sharded to references/[STEP_ID]_plan.md)*

## Task Intelligence (Sharded)
- **Human Intel:** [references/[STEP_ID]_human_intel.md] (Guaranteed Guidance)
- **Autonomous Intel:** [references/[STEP_ID]_autonomous_intel.md] (Scrutinized Evidence)

---

## STATE MAINTENANCE RULES
1. **TURN-START SYNC:** Prepend the Flight Deck header. The `STATE_REF` must be the file you read to orient yourself this turn.
2. **FEEDBACK INTERCEPT:** If the human provides feedback, STOP the loop and output `REASONING_RESET: [GOAL|ARCH|TACTIC]`.
3. **SOURCE SEPARATION:** Never mix Human Intel with Autonomous Intel.
4. **ONLY HUMANS INVALIDATE:** Human Intel is immutable by the agent.
5. **CHECKBOX FIDELITY:** Mark tasks `[x]` ONLY after a formal Reviewer or Human PASS.
