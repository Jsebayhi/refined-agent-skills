# Part 4 & 5.1: The Pre-Human Filter and Convergence Loops

Two critical structural insights emerged while refining the Mode Matrix and the interaction dynamics between agents.

## 1. The Universal Need for the Reviewer (The Pre-Human Filter)
The initial assumption that the `adversarial_reviewer` was only for "Autonomous" mode was flawed. Human time is the most expensive resource in the loop. The human should never be providing feedback that a sub-agent could have caught.
*   **The Principle:** The `adversarial_reviewer` must be used universally as a "Pre-Human Filter." 
*   **Application:** Even in Supervised modes (Quadrants 1 & 3), the agent MUST spar with the reviewer to harden its proposition *before* it presents anything to the human for final approval. The human acts as the ultimate gatekeeper, but their time is protected by the agentic review layer.

## 2. The Convergence Loop
The interaction between the generating agent and the `adversarial_reviewer` is not a single, linear pass. It must be engineered as an iterative **Convergence Loop**.
*   **The Flawed Model:** `[Agent Generates] -> [Reviewer Attacks] -> [Agent Hardens once] -> [Human Gatekeeps]`
*   **The Correct Model:** `[Agent Generates] <---> [Reviewer Attacks & Agent Hardens]` *(Loop repeats internally until the Reviewer gives a "Pass")* -> `[Human Gatekeeps]`.
*   **The Value:** The agent should only present the human with the *converged* outcome of that internal debate. The human is saved from reading multiple iterations of bad code, ensuring their time is spent only on fundamentally sound, pre-hardened propositions.

## 3. The "Hard Signal" Edge Case and Instructional Dilution
The Exploration Loop relies on a "hard signal" (like a unit test). But what if the test doesn't exist? What if writing the test requires a massive architectural refactor first?
*   **The Risk of Heaviness:** If we attempt to codify the entire branching logic ("If no test, do TDD. If TDD fails due to coupling, do Refactoring. If Refactoring...") into a single `SKILL.md`, the prompt will become impossibly heavy. The agent will succumb to "Instructional Dilution" and lose track of its original goal, getting stuck in infinite yak-shaving loops.
*   **The Architectural Implication:** This proves that we *cannot* build a single monolithic "Orchestrator" prompt. The system must rely on discrete, stateful sub-skills that are chained together dynamically, rather than a single prompt trying to predict every edge case of software engineering.
