---
name: navigating-complex-task-autonomous
description: MANDATORY. DO NOT attempt complex tasks autonomously without calling 'activate_skill' on 'navigating-complex-task-autonomous' first. This is the REQUIRED PROTOCOL for 'Autonomous Complex' tasks (Scientific Loop + Reviewer Proxy). It enforces nested convergence loops and Two-Stage Decomposition.
---

# Navigating Complex Implementations (Autonomous)

This skill provides the engine for autonomous problem-solving. It uses the `adversarial_reviewer` as a proxy for the human gatekeeper, enforcing Two-Stage Decomposition and strict source separation of intelligence.

### THE ROBUST SCIENTIFIC LOOP

#### 1. Discovery Decomposition
* Decompose micro-tasks for Hard Signal definition, Hypothesis Generation, and Solution Strategy.
* Initialize the task state following the **State Maintenance Rules**.

#### 2. Hypothesis Convergence
* Define the **Hard Signal**. If it doesn't exist, create it (TDD).
* Generate exactly 3 falsifiable hypotheses using `brainstorming-multiple-options`.
* Debate with the Reviewer until a "PASS" is achieved on the winning hypothesis.

#### 3. Solution Convergence
* Generate 3 distinct strategies using `brainstorming-multiple-options`.
* Debate with the Reviewer until a "PASS" is achieved on the winning strategy.

#### 4. Implementation Decomposition
* ONLY NOW decompose specific micro-tasks for the surgical implementation based on the winning strategy.
* Update the task plan shard and `SKILL.md`.

#### 5. Implementation Convergence
* **COMMIT CHECKPOINT:** `git commit --allow-empty -m "checkpoint: [Strategy]"`.
* Implement the solution.
* Run the Hard Signal.
* If Signal passes: Debate the final implementation with the Reviewer until "PASS".
* If Signal fails: Attempt up to 4 corrective fixes.

### CRITICAL RULES
1. **TWO-STAGE DECOMPOSITION:** Never plan implementation micro-tasks until Stage 3 (Solution Convergence) is verified.
2. **SOURCE SEPARATION:** Store findings in the correct `human_intel` vs. `autonomous_intel` shards. Only humans can invalidate Human Intel.
3. **BACKTRACK MANDATE:** If validation fails after 5 attempts, preserve evidence, reset to checkpoint, and return to Phase 1.
