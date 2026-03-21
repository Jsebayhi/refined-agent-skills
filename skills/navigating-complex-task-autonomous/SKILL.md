---
name: navigating-complex-task-autonomous
description: MANDATORY. DO NOT attempt complex tasks autonomously without calling 'activate_skill' on 'navigating-complex-task-autonomous' first. This is the REQUIRED PROTOCOL for 'Autonomous Complex' tasks. It enforces nested convergence loops and Two-Stage Decomposition with a Reviewer Proxy.
---

# Navigating Complex Implementations (Autonomous)

This engine handles autonomous problem-solving using the Reviewer as a proxy for the human gatekeeper. It enforces a strict scientific method to search the solution space and prove results through hard signals.

### CRITICAL RULES
1. **REVIEWER PROXY:** The `adversarial_reviewer` acts as the definitive gatekeeper for all design and implementation phases. You MUST achieve a "PASS" at every stage.
2. **TWO-STAGE DECOMPOSITION:** 
    * Stage 1: Decompose Hard Signal and Hypothesis steps ONLY.
    * Stage 2: Decompose Implementation steps ONLY after the Strategy is verified.
3. **DIAGNOSTIC RCA GATE:** If validation fails, you MUST perform a Root Cause Analysis (RCA) to determine if the failure is in the Implementation, Strategy, or Hypothesis.
4. **BACKTRACK MANDATE:** If validation fails after 5 attempts or at the Diagnostic Gate, preserve evidence (`git commit -m "failed evidence"`) and reset to checkpoint.

### THE ROBUST SCIENTIFIC LOOP

#### 1. Discovery Planning
* Decompose micro-tasks for Hard Signal definition and Hypothesis Generation.
* Initialize task state following the **State Maintenance Rules**.

#### 2. Hypothesis Convergence
* Define the **Hard Signal**.
* Generate exactly 3 falsifiable hypotheses using `brainstorming-multiple-options`.
* **Loop:** Debate with Reviewer until hardened ("PASS").

#### 3. Strategy Convergence
* Generate 3 distinct strategies using `brainstorming-multiple-options`.
* **Loop:** Debate with Reviewer until hardened ("PASS").

#### 4. Implementation Planning
* NOW decompose the specific implementation micro-tasks based on the winning strategy.
* Update the plan shard and sync the task-state skill.

#### 5. Implementation & Diagnostic Gate
* **COMMIT CHECKPOINT:** `git commit --allow-empty -m "checkpoint: [Strategy]"`.
* Implement and run the Hard Signal.
* If Signal passes: Converge with Reviewer until final "PASS".
* If Signal fails: Perform Diagnostic RCA. Use up to 4 corrective fixes if Implementation-based; otherwise, trigger **Backtrack**.
