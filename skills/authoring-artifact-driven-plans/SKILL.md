---
name: authoring-artifact-driven-plans
description: MANDATORY. DO NOT attempt to execute a multi-step task without calling 'activate_skill' on 'authoring-artifact-driven-plans' first. This is the REQUIRED PROTOCOL for initializing and maintaining persistent task memory via the ".gemini/skills/current-task-state/" directory. It enforces source separation between Human and Autonomous intelligence.
---

# Authoring Artifact-Driven Plans

This skill manages the persistent "Task Skill" that ensures continuity across sessions. It enforces a strict separation between Human Intelligence (Guaranteed) and Autonomous Intelligence (Scrutinized).

### CRITICAL RULES
1. **DETERMINISTIC SETUP:** Use `scripts/initialize_state.sh [STEP_PREFIX]` to create the environment.
2. **SOURCE SEPARATION:** You MUST store Human Guidance in `references/[PREFIX]_human_intel.md` and Autonomous Findings in `references/[PREFIX]_autonomous_intel.md`. Never mix them.
3. **ONLY HUMANS INVALIDATE:** Human Intel is immutable by the agent. If you identify a contradiction in the code, flag it but wait for human approval before updating the human_intel shard.
4. **ORIGINAL GOAL:** You MUST log the user's initial request and subsequent refinements in `references/[PREFIX]_original_goal.md`.
5. **SHARDED SYNCHRONIZATION:** Update reference shards FIRST, then sync the high-level `SKILL.md`.

### WORKFLOW: [Recovery -> Initialization -> Synchronization]

#### 1. Recovery & Adoption
If `.gemini/skills/current-task-state/` exists, load `SKILL.md` and all shards. Resume immediately.

#### 2. Initialization
1. **PREFIX:** Identify the Step Prefix (e.g., `discovery`).
2. **SETUP:** Run `bash skills/authoring-artifact-driven-plans/scripts/initialize_state.sh [PREFIX]`.
3. **LOG GOAL:** Populate `references/[PREFIX]_original_goal.md` with the full task description.
4. **LOG GUIDANCE:** Populate `references/[PREFIX]_human_intel.md` with all context provided by the human so far.
5. **POPULATE SKILL:** Update the metadata in the new `.gemini/skills/current-task-state/SKILL.md`.

#### 3. Synchronization
After every tool call:
1. **Distill Intel:** Determine if the finding is Human Guidance (e.g., "I want X") or Autonomous Evidence (e.g., "Grep shows Y").
2. **Write to Shards:** Update the appropriate `[PREFIX]_intel.md` file using prefix-based naming.
3. **Sync Checkpoint:** Update the `SKILL.md` checklist and "Next Step."

### RESOURCES
* `scripts/initialize_state.sh`: Environment setup.
* `assets/task-state-template.md`: Injected memory template.
