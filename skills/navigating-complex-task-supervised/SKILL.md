---
name: navigating-complex-task-supervised
description: MANDATORY. DO NOT attempt complex tasks with human oversight without calling 'activate_skill' on 'navigating-complex-task-supervised' first. This is the REQUIRED PROTOCOL for 'Supervised Complex' tasks (Architectural Sparring). It enforces human-in-the-loop gates for Hypotheses and Solutions to ensure architectural alignment.
---

# Navigating Complex Implementations (Supervised)

This skill provides the engine for complex, human-led engineering. It focuses on collaborative design, using the agent as a rigorous researcher and the human as the final architect.

### CRITICAL RULES
1. **DECOMPOSITION FIRST:** Your very first action MUST be to decompose the task into specific micro-tasks. Follow the **State Maintenance Rules** defined in the `current-task-state` skill to record this plan.
2. **NO CODE WITHOUT DESIGN:** You are PROHIBITED from implementation until the Strategy is approved by the human.
3. **GATEKEEPING:** You MUST halt and wait for human approval after generating Hypotheses and after generating Solutions.
4. **CONVERGENCE PREREQUISITE:** Before presenting Hypotheses or Solutions to the human, you MUST harden them via a convergence loop with the `adversarial_reviewer`.

### WORKFLOW: [Decompose -> Research -> Hypothesize -> Strategize -> Implement]

#### 1. Initial Decomposition
* Translate the "Architectural Sparring" workflow into specific micro-tasks for the current goal.
* Update the task state (checklist and context) following the sharding and prefixing rules defined in the `current-task-state` skill.

#### 2. Evidence Gathering
Use `codebase_investigator` and `investigating-external-dependencies` to map the problem space.

#### 3. Hypothesis Design
* Generate exactly 3 falsifiable hypotheses using `brainstorming-multiple-options`.
* Converge with the Reviewer until hardened.
* Present to the human. **WAIT FOR APPROVAL.**

#### 4. Strategy Design
* For the approved hypothesis, generate 3 solution strategies using `brainstorming-multiple-options`.
* Converge with the Reviewer until hardened.
* Present to the human. **WAIT FOR APPROVAL.**

#### 5. Implementation & Validation
* Apply the approved solution.
* Local validate against the Hard Signal.
* Final convergence review with the `adversarial_reviewer`.
* Present final diff to human. **WAIT FOR APPROVAL.**
* Finalize using `authoring-high-signal-git-commits`.
