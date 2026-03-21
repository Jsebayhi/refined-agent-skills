---
name: navigating-complex-task-supervised
description: MANDATORY. DO NOT attempt complex tasks with human oversight without calling 'activate_skill' on 'navigating-complex-task-supervised' first. This is the REQUIRED PROTOCOL for 'Supervised Complex' tasks. It enforces human-in-the-loop gates and Two-Stage Decomposition.
---

# Navigating Complex Implementations (Supervised)

This engine handles human-led engineering. It focuses on collaborative design, using the human as the architect and the agent as the rigorous researcher.

### CRITICAL RULES
1. **STAGE 1 DECOMPOSITION:** Plan only Research and Hypothesis steps. Proposing a Strategy is the *output* of this stage, not a task.
2. **STAGE 2 DECOMPOSITION:** Decompose specific Implementation micro-tasks ONLY after the Strategy is approved.
3. **SOURCE SEPARATION:** Use `human_intel` for guidance and `autonomous_intel` for findings.
4. **GATEKEEPING:** Halt for approval after generating Hypotheses AND after generating Solutions.
5. **CONVERGENCE:** Achieve a Reviewer "PASS" before presenting anything to the human.

### WORKFLOW: [Discovery Plan -> Research -> Strategy -> Implementation Plan -> Act]

#### 1. Discovery Planning
* Decompose micro-tasks for Research and Hypothesis Generation.
* Initialize task state with `selecting-optimal-methodology` contract details.

#### 2. Hypothesis Convergence
* Research the codebase and generate exactly 3 falsifiable hypotheses.
* Converge with Reviewer -> Present to human -> **WAIT FOR APPROVAL.**

#### 3. Strategy Convergence
* Generate 3 solution strategies for the winning hypothesis.
* Converge with Reviewer -> Present to human -> **WAIT FOR APPROVAL.**

#### 4. Implementation Planning
* **NOW** decompose the surgical implementation plan into micro-tasks.
* Update the plan shard and sync the task-state skill.

#### 5. Execution & Validation
* Act -> Validate -> Converge with Reviewer -> Present final diff to human.
* **WAIT FOR APPROVAL.**
