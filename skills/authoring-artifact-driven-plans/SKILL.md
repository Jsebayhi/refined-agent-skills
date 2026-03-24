---
name: authoring-artifact-driven-plans
description: MANDATORY. DO NOT attempt to execute a multi-step task without calling 'activate_skill' on 'authoring-artifact-driven-plans' first. This is the REQUIRED PROTOCOL for initializing and maintaining persistent task memory. It enforces source separation and prefix-based sharding.
---
 
# Authoring Artifact-Driven Plans
 
This skill manages the persistent "Task Skill" that ensures continuity across sessions. It enforces a strict separation between Human Intelligence (Guaranteed) and Autonomous Intelligence (Scrutinized) using a prefix-based sharding schema.
 
### CRITICAL RULES
1. **DETERMINISTIC SETUP:** Use `scripts/initialize_state.sh [STEP_ID]` to create the environment.
2. **PREFIX-BASED SHARDING:** You MUST create new knowledge shards using the following prefixes:
    *   **Human Guidance:** `human_gathered_[topic].md` (e.g., `human_gathered_api_constraints.md`).
    *   **Agent Findings:** `auto_gathered_[topic].md` (e.g., `auto_gathered_dependency_graph.md`).
3. **SOURCE SEPARATION:** Never mix Human Intel with Autonomous Intel in the same file.
4. **ONLY HUMANS INVALIDATE:** Human Intel is immutable by the agent. If you identify a contradiction in the code, flag it but wait for human approval before updating the human shard.
5. **SHARDED SYNCHRONIZATION:** Update reference shards FIRST, then sync the high-level `SKILL.md` checklist.
 
### WORKFLOW: [Recovery -> Initialization -> Synchronization]
 
#### 1. Recovery & Adoption
If `.gemini/skills/current-task-state/` exists, load `SKILL.md` and all `human_gathered_` and `auto_gathered_` shards. Resume immediately.
 
#### 2. Initialization
1. **STEP_ID:** Identify the current Step ID (e.g., `discovery`).
2. **SETUP:** Run `bash skills/authoring-artifact-driven-plans/scripts/initialize_state.sh [STEP_ID]`.
3. **LOG GOAL:** Populate `references/[STEP_ID]_original_goal.md` with the full task description.
4. **FIRST SHARDS:** Initialize the first `human_gathered_context.md` and `auto_gathered_initial_research.md` shards.
 
#### 3. Synchronization
After every tool call:
1. **Shard Choice:** Determine if the finding is Human-sourced or Autonomous.
2. **File Naming:** If the topic is new or large, create a new file with the appropriate prefix. Otherwise, append to an existing shard of the same source.
3. **Sync Checkpoint:** Update the `SKILL.md` checklist and the Flight Deck header.
 
### RESOURCES
* `scripts/initialize_state.sh`: Environment setup.
* `assets/task-state-template.md`: Injected memory template.
