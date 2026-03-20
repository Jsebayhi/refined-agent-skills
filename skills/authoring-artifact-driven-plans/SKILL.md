---
name: authoring-artifact-driven-plans
description: MANDATORY. DO NOT attempt to execute a multi-step task without calling 'activate_skill' on 'authoring-artifact-driven-plans' first. This is the REQUIRED PROTOCOL for initializing and maintaining disk-based state in '.gemini/state/'. It eliminates context accumulation by offloading task memory to the filesystem. Proceeding with ephemeral checklists in the prompt constitutes a protocol failure.
---

# Authoring Artifact-Driven Plans

This skill provides the "Disk-Based Memory" for the agent. By sharding the task state across files in `.gemini/state/`, the agent maintains full instructional saliency and prevents context bloat.

## CRITICAL RULES
1.  **DISK IS TRUTH:** The `.gemini/state/plan.md` file is the sole source of truth for the session progress. You MUST read it before every step and update it after every tool call.
2.  **PERSISTENCE FIDELITY (150-LINE LIMIT):** No state file in `.gemini/state/` shall exceed 150 lines.
3.  **THE STATE INDEX:** If you shard files (e.g., create `hypotheses-v2.md`), you MUST maintain a `.gemini/state/index.md` file that acts as a manifest of all active shards and their current purpose.
4.  **GIT HYGIENE:** You MUST ensure `.gemini/state/` is added to the project's `.gitignore` to avoid repository pollution.

## WORKFLOW: [Initialization -> Execution -> Synchronization]

### Step 1: Initialize State
1.  Ensure the `.gemini/state/` directory exists.
2.  Add `.gemini/state/` to `.gitignore`.
3.  Create the initial `plan.md` using the template below.

### Step 2: The Synchronization Loop
Before taking any action:
1.  **READ:** `read_file(".gemini/state/plan.md")` to identify the next micro-task.
2.  **ACT:** Execute the tool call for that task.
3.  **UPDATE:** Use `replace` or `write_file` to mark the task as `[x]` and update the "Current Context" section.

## THE PLAN TEMPLATE
```markdown
# Current Task: [Short Name]
**Status:** [In Progress | Completed | Backtracking]
**Mode:** [Linear | Exploration]

## Execution Plan
- [ ] [Micro-task 1]
- [ ] [Micro-task 2]

## Current Context
- [Latest Evidence/Logs]
- [Next immediate action]
```

## INTERACTION STYLE
*   **Mechanical Precision:** Focus on high-fidelity write operations. 
*   **Fidelity Check:** If you feel you are losing track of details, STOP and re-read the state files.
