---
name: navigating-complex-task-supervised
description: MANDATORY. DO NOT attempt complex tasks with human oversight without calling 'activate_skill' on 'navigating-complex-task-supervised' first. This is the REQUIRED PROTOCOL for 'Supervised Complex' tasks. It enforces human-in-the-loop gates and mandatory Reviewer Convergence before human interaction.
---

# Navigating Complex Implementations (Supervised)

This engine handles human-led engineering. It focuses on collaborative design, protecting human time by mandating a Reviewer "PASS" before any human gate.

### CRITICAL RULES
1. **REVIEWER-FIRST CONVERGENCE:** You are strictly PROHIBITED from presenting Hypotheses, Strategies, or Code to the human until you have achieved a "PASS" from the `adversarial_reviewer`.
2. **TWO-STAGE DECOMPOSITION:** 
    * Stage 1: Decompose Research and Hypothesis steps ONLY.
    * Stage 2: Decompose Implementation steps ONLY after the Strategy is approved by the human.
3. **DIAGNOSTIC RCA GATE:** If validation fails, you MUST perform a Root Cause Analysis (RCA) to determine if the failure is in the Implementation, Strategy, or Hypothesis.
4. **BACKTRACK MANDATE:** If validation fails after 5 attempts or at the Diagnostic Gate, preserve evidence (`git commit -m "failed evidence"`) and reset to checkpoint.

### WORKFLOW: [Discovery Plan -> Research -> Design -> Implementation Plan -> Act]

#### 1. Discovery Planning
* Decompose micro-tasks for Research and Hypothesis Generation.
* Initialize task state following the **State Maintenance Rules**.

#### 2. Hypothesis Convergence
* Research and generate exactly 3 falsifiable hypotheses using `brainstorming-multiple-options`.
* **Loop:** Converge with `adversarial_reviewer` until hardened ("PASS").
* **Gate:** Present converged hypotheses to human. **WAIT FOR APPROVAL.**

#### 3. Strategy Convergence
* Generate 3 solution strategies for the approved hypothesis using `brainstorming-multiple-options`.
* **Loop:** Converge with `adversarial_reviewer` until hardened ("PASS").
* **Gate:** Present converged strategies to human. **WAIT FOR APPROVAL.**

#### 4. Implementation Planning
* NOW decompose the specific implementation micro-tasks based on the winning strategy.
* Update the plan shard and sync the task-state skill.

#### 5. Execution & Validation
* **COMMIT CHECKPOINT:** `git commit --allow-empty -m "checkpoint: [Strategy]"`.
* Act -> Validate -> **Loop:** Converge with Reviewer until hardened ("PASS").
* **Gate:** Present final diff to human. **WAIT FOR APPROVAL.**
