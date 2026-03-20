---
name: navigating-complex-implementations
description: MANDATORY. DO NOT attempt to "hack" or "guess" your way through a complex task without calling 'activate_skill' on 'navigating-complex-implementations' first. This is the REQUIRED PROTOCOL for tasks requiring exploration, architectural shifts, or where linear execution has failed. It enforces a strict 3-Phase Scientific Loop: Hypothesis Convergence, Solution Convergence, and Implementation with Mandatory Backtracking.
---

# Navigating Complex Implementations

This skill provides the "Exploration Engine." It is designed to navigate uncertainty by forcing the agent to prove its ideas through adversarial review and hard signals (tests).

## THE ROBUST SCIENTIFIC LOOP

### Phase 1: Hypothesis Convergence
1.  **Define Signal:** Identify the "Hard Signal" (e.g., unit test, reproduction script) that defines success.
2.  **Hypothesize:** Call `brainstorming-multiple-options` to generate exactly 3 falsifiable hypotheses.
3.  **Debate:** Engage in a Convergence Loop with the `adversarial_reviewer` (Logic Lens).
4.  **Winning Hypothesis:** Conclude only when a hypothesis is verified as the most likely root cause or architectural path.

### Phase 2: Solution Convergence
1.  **Strategize:** Call `brainstorming-multiple-options` to generate 3 distinct solution strategies for the winning hypothesis.
2.  **Debate:** Engage in a Convergence Loop with the `adversarial_reviewer` (Logic & Quality Lenses).
3.  **Winning Strategy:** Select the strategy that maximizes simplicity and robustness.

### Phase 3: Implementation Convergence
1.  **COMMIT CHECKPOINT:** Execute `git commit --allow-empty -m "checkpoint: [Short Strategy Name]"`.
2.  **Implement:** Apply the chosen strategy surgically.
3.  **Validate:** Run the Hard Signal.
4.  **CONVERGENCE REVIEW:** Debate the implementation with the `adversarial_reviewer`.
5.  **BACKTRACK MANDATE:** If validation fails after 5 corrective attempts, you MUST execute `git reset --hard HEAD` and return to Phase 1.

## CRITICAL RULES
1.  **NO YAK SHAVING:** If the "Hard Signal" doesn't exist, your first micro-task in the plan MUST be to create it (TDD).
2.  **DISK STATE:** You MUST maintain the `.gemini/state/` files (plan, hypotheses, evidence) with high fidelity.
3.  **SUB-AGENT PERSONA:** When calling the reviewer, provide the "Tactical Specialist" context.

## INTERACTION STYLE
*   **Scientific Rigor:** Prioritize evidence over intuition.
*   **Adversarial:** Treat your own ideas as suspects to be cleared.
