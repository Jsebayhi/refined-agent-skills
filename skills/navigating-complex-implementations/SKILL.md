---
name: navigating-complex-implementations
description: MANDATORY. DO NOT attempt to "hack" or "guess" your way through a complex task without calling 'activate_skill' on 'navigating-complex-implementations' first. This is the REQUIRED PROTOCOL for tasks requiring exploration, architectural shifts, or where linear execution has failed. It enforces a strict 3-Phase Scientific Loop: Hypothesis Convergence, Solution Convergence, and Implementation with Mandatory Backtracking.
---

# Navigating Complex Implementations

This skill provides the "Exploration Engine." It navigates uncertainty by forcing the agent to prove its ideas through adversarial review and hard signals (tests) while maintaining high-fidelity state shards.

### THE ROBUST SCIENTIFIC LOOP

#### Phase 1: Hypothesis Convergence
1. **Define Signal:** Identify the "Hard Signal" (e.g., unit test, reproduction script) that defines success. If it doesn't exist, your FIRST task in the plan shard MUST be to create it (TDD).
2. **Hypothesize:** Call `brainstorming-multiple-options` to generate exactly 3 falsifiable hypotheses. Write these to `references/[PREFIX]_hypotheses.md`.
3. **Debate:** Engage in a Convergence Loop with the `adversarial_reviewer` (Logic Lens).
4. **Winning Hypothesis:** Conclude only when a hypothesis is verified as the most likely path.

#### Phase 2: Solution Convergence
1. **Strategize:** Call `brainstorming-multiple-options` to generate 3 distinct solution strategies for the winning hypothesis. Write these to `references/[PREFIX]_strategies.md`.
2. **Debate:** Engage in a Convergence Loop with the `adversarial_reviewer` (Logic & Quality Lenses).
3. **Winning Strategy:** Select the strategy that maximizes simplicity and robustness.

#### Phase 3: Implementation Convergence
1. **COMMIT CHECKPOINT:** Execute `git commit --allow-empty -m "checkpoint: [Short Strategy Name]"`.
2. **Implement:** Apply the chosen strategy surgically.
3. **Validate:** Run the Hard Signal. Update `references/[PREFIX]_evidence.md` with results.
4. **CONVERGENCE REVIEW:** Debate the implementation with the `adversarial_reviewer` (Quality Lens).
5. **BACKTRACK MANDATE:** If validation fails after 5 corrective attempts, you MUST preserve evidence and reset:
    * `git add . && git commit -m "temp: failed exploration evidence"`
    * `git reset --hard [CHECKPOINT_HASH]`
    * Return to Phase 1 to re-evaluate premises with the new evidence.

### CRITICAL RULES
1. **SHARDED STATE:** You MUST maintain high-fidelity shards in `references/` (e.g., `_plan.md`, `_hypotheses.md`, `_evidence.md`).
2. **SYNC LOOP:** First update reference shards, then update the high-level `current-task-state` skill.
3. **PRECISION AUDIT:** Provide the "Tactical Specialist" context to the reviewer in every convergence loop.
4. **PROHIBITION:** You are strictly forbidden from proceeding to Phase 3 until Phase 2 has achieved a formal "PASS" from the reviewer.
