---
name: navigating-complex-task-autonomous
description: MANDATORY. DO NOT attempt complex tasks autonomously without calling 'activate_skill' on 'navigating-complex-task-autonomous' first. This is the REQUIRED PROTOCOL for 'Autonomous Complex' tasks. It enforces nested convergence loops, Two-Stage Decomposition, and Diagnostic Backtracking.
---

# Navigating Complex Implementations (Autonomous)

This engine handles autonomous problem-solving using the Reviewer as a proxy. It enforces a strict scientific method to search the solution space and prove results through hard signals.

### THE ROBUST SCIENTIFIC LOOP

#### 1. Discovery Planning
* Decompose micro-tasks for Hard Signal definition and Hypothesis Generation.
* Initialize task state following the **State Maintenance Rules**.

#### 2. Hypothesis Convergence
* Define the **Hard Signal** (test/script).
* Generate exactly 3 falsifiable hypotheses.
* Debate with Reviewer until "PASS" on the winning hypothesis.

#### 3. Strategy Convergence
* Generate 3 distinct strategies for the winning hypothesis.
* Debate with Reviewer until "PASS" on the winning strategy.

#### 4. Implementation Planning
* **NOW** decompose the specific implementation micro-tasks based on the winning strategy.
* Update the plan shard and sync the task-state skill.

#### 5. Implementation & Diagnostic Gate
* **CHECKPOINT:** `git commit --allow-empty -m "checkpoint: [Strategy]"`.
* Implement and run the Hard Signal.
* **DIAGNOSTIC GATE:** If validation fails, you MUST perform a Root Cause Analysis (RCA) to determine if the failure is in the **Implementation**, the **Strategy**, or the **Hypothesis**.
    * If Implementation: Use up to 4 corrective fixes.
    * If Strategy/Hypothesis: Preserve evidence and trigger **Backtrack**.

### CRITICAL RULES
1. **TWO-STAGE DECOMPOSITION:** Never plan implementation micro-tasks until Stage 3 is verified.
2. **SOURCE SEPARATION:** Store findings in correct `human_intel` vs. `autonomous_intel` shards.
3. **BACKTRACK MANDATE:** If validation fails after 5 attempts or at the Diagnostic Gate, preserve evidence (`git commit -m "failed evidence"`) and reset (`git reset --hard [CHECKPOINT]`). Return to the appropriate Phase (1 or 2) based on your RCA.
