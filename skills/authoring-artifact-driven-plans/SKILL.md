---
name: authoring-artifact-driven-plans
description: MANDATORY. DO NOT attempt to execute a multi-step task without calling 'activate_skill' on 'authoring-artifact-driven-plans' first. This is the REQUIRED PROTOCOL for initializing and maintaining persistent task memory via the ".gemini/skills/current-task-state/" directory. It leverages deterministic sharding and CLI skill-loading to prevent amnesia and instructional dilution.
---

# Authoring Artifact-Driven Plans

This skill manages the persistent "Task Skill" that ensures continuity across sessions. It shards task memory by placing high-level state in `SKILL.md` and verbose evidence in the `references/` directory using a standardized naming convention.

### CRITICAL RULES
1. **DETERMINISTIC SETUP:** You MUST use `scripts/initialize_state.sh [PREFIX]` to create the environment. Do NOT create directories manually.
2. **TASK CONTINUITY:** If `.gemini/skills/current-task-state/` exists, you MUST load it and resume the plan. Do NOT re-initialize.
3. **PREFIX-BASED NAMING:** All files in `references/` MUST follow: `[PREFIX]_[FILE_NAME].md`.
4. **SHARDED SYNCHRONIZATION:** 
    * First, update the detailed reference shards in `references/`.
    * Then, update the high-level `SKILL.md` checklist and "Current Context".
5. **PERSISTENCE LIMIT (100 LINES):** The `SKILL.md` MUST remain under 100 lines. Verbose data belongs in reference shards.

### WORKFLOW: [Recovery -> Initialization -> Synchronization]

#### 1. Recovery & Adoption
Before starting any work, check for `.gemini/skills/current-task-state/`.
* **Exists:** Execute `read_file` on `SKILL.md` and the relevant `references/[PREFIX]_plan.md` to adopt state. Resume immediately.
* **Missing:** Proceed to Initialization.

#### 2. Initialization
1. **DETERMINE PREFIX:** Identify the **Task Prefix** (e.g., `bug-123` or `feature-x`).
2. **EXECUTE SETUP:** Run `bash skills/authoring-artifact-driven-plans/scripts/initialize_state.sh [PREFIX]`.
3. **POPULATE SKILL:** Immediately open the new `.gemini/skills/current-task-state/SKILL.md` and populate the metadata (Task Name, Prefix, Engine).
4. **POPULATE PLAN:** Update `references/[PREFIX]_plan.md` with the full micro-task list.

#### 3. Synchronization
After every tool call or milestone:
1. **Update Shards:** Write logs/evidence to `references/[PREFIX]_[type].md` following the naming convention.
2. **Update Checkpoint:** Update the `SKILL.md` to reflect progress and the "Next Step."

### RESOURCES
* `scripts/initialize_state.sh`: Functional utility for environment setup.
* `assets/task-state-template.md`: The "Iron-Clad" template for the injected state skill.
