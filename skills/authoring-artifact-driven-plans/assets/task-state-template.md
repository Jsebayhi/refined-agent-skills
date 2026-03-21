---
name: current-task-state
description: MANDATORY. DO NOT proceed with any task without calling 'activate_skill' on 'current-task-state' first. This is the REQUIRED PROTOCOL for resuming an active task in progress. Proceeding without loading this state constitutes a protocol failure.
---

# RESUMPTION PROTOCOL: [Task Name]
**Current Step Prefix:** [STEP_ID]
**Engine:** [Engine Name]

## Original Goal
*(Ground Truth sharded to references/[PREFIX]_original_goal.md)*

## Execution Plan
- [ ] [Micro-task 1]
*(Detailed plan sharded to references/[PREFIX]_plan.md)*

## Task Intelligence (Sharded)
- **Human Intel:** [references/[PREFIX]_human_intel.md] (Guaranteed Guidance)
- **Autonomous Intel:** [references/[PREFIX]_autonomous_intel.md] (Scrutinized Evidence)

---

## STATE MAINTENANCE RULES (FOR AGENT)
1. **SOURCE SEPARATION:** Never mix Human Intel with Autonomous Intel. Only Humans can invalidate Human Intel.
2. **DISK IS TRUTH:** Read all sharded files in `references/` before every step.
3. **PREFIX-BASED NAMING:** All files in `references/` MUST follow: `[STEP_ID]_[FILE_NAME].md`.
4. **PERSISTENCE LIMIT (100 LINES):** This `SKILL.md` MUST remain under 100 lines.
5. **SYNCHRONIZATION:** Update this `SKILL.md` immediately after updating reference shards.
6. **CLEANUP:** Delete `.gemini/skills/current-task-state/` ONLY when the task is 100% complete and verified.
