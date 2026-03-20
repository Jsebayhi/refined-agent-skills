---
name: navigating-complex-autonomous
description: MANDATORY. DO NOT attempt complex tasks autonomously without calling 'activate_skill' on 'navigating-complex-autonomous' first. This is the REQUIRED PROTOCOL for 'Autonomous Complex' tasks (Scientific Loop + Reviewer Proxy). It enforces nested convergence loops for Hypotheses, Solutions, and Implementation with a mandatory 5-attempt backtrack threshold.
---

# Navigating Complex Implementations (Autonomous)

This skill provides the engine for autonomous problem-solving. It uses the `adversarial_reviewer` as a proxy for the human gatekeeper, enforcing a strict scientific method to search the solution space and prove results through hard signals.

### THE ROBUST SCIENTIFIC LOOP

#### 1. Hypothesis Convergence
* Define the **Hard Signal** (test/script). If it doesn't exist, create it (TDD).
* Generate exactly 3 falsifiable hypotheses using `brainstorming-multiple-options`.
* Debate with the Reviewer until a "PASS" is achieved on the winning hypothesis.

#### 2. Solution Convergence
* Generate 3 distinct strategies using `brainstorming-multiple-options`.
* Debate with the Reviewer until a "PASS" is achieved on the winning strategy.

#### 3. Implementation Convergence
* **COMMIT CHECKPOINT:** `git commit --allow-empty -m "checkpoint: [Strategy]"`.
* Implement the solution.
* Run the Hard Signal.
* If Signal passes: Debate the final implementation with the Reviewer until "PASS".
* If Signal fails: Attempt up to 4 corrective fixes.

### CRITICAL RULES
1. **BACKTRACK MANDATE:** If validation fails after 5 attempts, you MUST preserve evidence (`git commit -m "failed evidence"`) and reset (`git reset --hard [CHECKPOINT]`), then return to Phase 1.
2. **DISK STATE:** You MUST maintain high-fidelity shards in `references/` following the `[STEP_ID]` prefix convention.
3. **SYNC LOOP:** Update detailed reference shards FIRST, then update the high-level task state skill.

### WORKFLOW: [Hypothesize -> Strategize -> Implement -> Validate -> Revert]
(Follow the loops defined above with mechanical precision.)
