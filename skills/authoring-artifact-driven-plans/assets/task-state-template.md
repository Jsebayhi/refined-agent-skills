---
name: current-task-state
description: MANDATORY. DO NOT proceed with any task without calling 'activate_skill' on 'current-task-state' first. This is the REQUIRED PROTOCOL for resuming an active task. You MUST prepend the 'Flight Deck' header with a Visual Map to every response.
---

# RESUMPTION PROTOCOL: [Task Name]
**Current STEP_ID:** [STEP_ID] | **PHASE:** [1|2|3] | **PROGRESS:** [X of Y] | **APPROVAL:** [Status]

## Flight Deck Mandate
You MUST begin every response with this mechanical header including the Visual Map:
> **STEP_ID:** [PHASE].[TASK].[SUB] | **STATE_REF:** [FILE_PATH] | **APPROVAL:** [Status] | **MAP:** [x][x][>][ ][ ] (Discovery > Strategy > Execution)

## Original Goal
*(Ground Truth sharded to references/[STEP_ID]_original_goal.md. Agent Immutable.)*

## Active Checklist
- [ ] [Micro-task 1]
- [ ] [Micro-task 2]
*(Detailed plan sharded to references/[STEP_ID]_plan.md)*

## Task Intelligence (Prefix-Based Shards)
- **Human Intel:** `human_gathered_[topic].md` (Guaranteed Guidance)
- **Autonomous Intel:** `auto_gathered_[topic].md` (Scrutinized Evidence)

---

## STATE MAINTENANCE RULES
1. **TURN-START SYNC:** Prepend the Flight Deck header. Highlight the current phase in the **MAP**.
2. **PREFIX-BASED SHARDING:** Use `human_gathered_` for user-provided intel and `auto_gathered_` for codebase findings. Create new files for new topics.
3. **FEEDBACK INTERCEPT:** If the human provides feedback, STOP and output `REASONING_RESET: [GOAL|ARCH|TACTIC]`.
4. **ONLY HUMANS INVALIDATE:** Human Intel is immutable. Flag contradictions but WAIT for human approval.
5. **CHECKBOX FIDELITY:** Mark tasks `[x]` ONLY after a formal Reviewer or Human PASS.
