---
name: current-task-state
description: MANDATORY. DO NOT proceed with any task without calling 'activate_skill' on 'current-task-state' first. This is the REQUIRED PROTOCOL for resuming an active task in progress. Proceeding without loading this state constitutes a protocol failure.
---

# RESUMPTION PROTOCOL: [Task Name]
**Current STEP_ID:** [STEP_ID]
**Engine:** [Engine Name]

## Original Goal
*(The North Star. sharded to references/[STEP_ID]_original_goal.md. NEVER modify without human approval.)*

## Execution Plan
*(Detailed micro-tasks sharded to references/[STEP_ID]_plan.md)*

## Task Intelligence (Sharded)
- **Human Intel:** [references/[STEP_ID]_human_intel.md] (Guaranteed Guidance - Agent Immutable)
- **Autonomous Intel:** [references/[STEP_ID]_autonomous_intel.md] (Scrutinized Evidence - Transient/Suspect)

---

## STATE MAINTENANCE RULES (FOR AGENT)
1. **SOURCE SEPARATION:** Never mix Human Intel with Autonomous Intel.
2. **ONLY HUMANS INVALIDATE:** Human Intel is immutable. Flag contradictions but WAIT for human approval to update.
3. **AUTONOMOUS RELIABILITY:** Autonomous Intel is transient. It MUST be discarded or re-verified during backtracking or strategy resets.
4. **DISK IS TRUTH:** Read all sharded files in `references/` before every action.
5. **PREFIX-BASED NAMING:** All files in `references/` MUST follow: `[STEP_ID]_[FILE_NAME].md`.
6. **PERSISTENCE LIMIT:** This `SKILL.md` MUST remain under 100 lines.
7. **SYNCHRONIZATION:** Update this `SKILL.md` checklist and "Current Context" immediately after updating shards.
