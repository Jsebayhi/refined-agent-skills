---
name: navigating-complex-task-supervised
description: MANDATORY. DO NOT attempt complex tasks with human oversight without calling 'activate_skill' on 'navigating-complex-task-supervised' first. This is the REQUIRED PROTOCOL for 'Supervised Complex' tasks (Architectural Sparring). It enforces human-in-the-loop gates and Two-Stage Decomposition.
---

# Navigating Complex Implementations (Supervised)

This skill provides the engine for complex, human-led engineering. It focuses on collaborative design, using the agent as a rigorous researcher and the human as the final architect.

### CRITICAL RULES
1. **TWO-STAGE DECOMPOSITION:** 
    * Stage 1: Decompose only Discovery (Research/Design) micro-tasks upon entry.
    * Stage 2: Decompose Implementation micro-tasks ONLY after the Strategy is approved.
2. **SOURCE SEPARATION:** Store findings in the correct `human_intel` vs. `autonomous_intel` shards following the rules in `current-task-state`.
3. **GATEKEEPING:** You MUST halt and wait for human approval after generating Hypotheses and after generating Solutions.
4. **CONVERGENCE:** Before presenting to the human, you MUST achieve a "PASS" from the `adversarial_reviewer`.

### WORKFLOW: [Discovery Plan -> Research -> Design -> Implementation Plan -> Act]

#### 1. Discovery Decomposition
* Decompose micro-tasks for Research, Hypothesis Generation, and Solution Strategy.
* Initialize the task state following the **State Maintenance Rules**.

#### 2. Evidence Gathering & Hypothesizing
* Use `codebase_investigator` to map the problem space.
* Generate exactly 3 falsifiable hypotheses using `brainstorming-multiple-options`.
* Converge with Reviewer -> Present to human -> **WAIT FOR APPROVAL.**

#### 3. Solution Design
* Generate 3 solution strategies using `brainstorming-multiple-options`.
* Converge with Reviewer -> Present to human -> **WAIT FOR APPROVAL.**

#### 4. Implementation Decomposition
* ONLY NOW decompose specific micro-tasks for the surgical implementation.
* Update the task plan shard and `SKILL.md`.

#### 5. Implementation & Validation
* Act -> Validate -> Converge with Reviewer -> Present final diff to human.
* **WAIT FOR APPROVAL** -> Finalize with high-signal commit.
