---
name: current-task-state
description: MANDATORY. DO NOT proceed with any task without calling 'activate_skill' on 'current-task-state' first. This is the REQUIRED PROTOCOL for resuming an active task in progress. Proceeding without loading this state constitutes a protocol failure.
---

# RESUMPTION PROTOCOL: [Task Name]
**Current Step Prefix:** [STEP_ID]
**Engine:** [executing-linear-tasks | navigating-complex-implementations]

## Execution Plan
- [ ] [Micro-task 1]
- [ ] [Micro-task 2]
*(Detailed plan sharded to references/[STEP_ID]_plan.md)*

## Current Context
- **Next Step:** [Immediate action required]
- **Evidence:** [Pointer to local references/[STEP_ID]_*.md files]

---

## STATE MAINTENANCE RULES (FOR AGENT)
1. **DISK IS TRUTH:** You MUST read the sharded files in `references/` before every step and update them after every tool call.
2. **STEP-BASED PREFIXING:** All files in `references/` MUST follow the prefix: `[STEP_ID]_[FILE_NAME].md`.
3. **PERSISTENCE LIMIT (100 LINES):** This `SKILL.md` MUST remain under 100 lines. Verbose data MUST stay in the sharded reference files.
4. **SYNCHRONIZATION:** Update this `SKILL.md` checklist and "Current Context" immediately after updating reference shards.
5. **CLEANUP:** Delete the entire `.gemini/skills/current-task-state/` directory ONLY when the task is 100% complete and verified.
