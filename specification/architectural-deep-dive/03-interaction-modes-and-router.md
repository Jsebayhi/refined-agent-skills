# Part 3: The Interaction Modes (The Mode Matrix)

A second fundamental dichotomy was identified: **Supervised vs. Autonomous operation modes.**

There are tasks where the human wants to be intimately involved in the architecture and design phases. Conversely, there are times when the human wants the agent to autonomously run the discovery phase, using the reviewer agent to challenge it and find a good way to solve the issue independently.

## Synthesizing the Constraints
We have two major forces that must dictate the skill architecture:
1.  **The Task Nature:** Linear (Brute-forceable) vs. Complex (Requires the Scientific Method/Exploration loop).
2.  **The Operational Mode:** Supervised (Human-in-the-loop, reviewing architecture) vs. Autonomous (Let it run, use the `adversarial_reviewer` as the "human proxy").

Our current skills (`orchestrating-software-lifecycle`, RCA, etc.) try to handle all four of these quadrants simultaneously, leading to bloated instructions and agent confusion.

## The Proposed Architecture: The "Mode Matrix" Router
Instead of a single "God Skill" or overlapping workflows, the core orchestration should be structured explicitly around these quadrants. We replace the rigid lifecycle with a **Decision Router** that forces the agent to explicitly establish the operational contract *before* it begins work.

### Quadrant 1: Supervised Execution (The "Pair Programmer")
*   **When:** The task is straightforward, and the human is actively driving.
*   **The Workflow:** "Find the pattern -> Implement -> Wait for Human Approval -> Commit."
*   **The Guardrail:** High velocity. The agent acts fast and asks the user to review the diff before proceeding.

### Quadrant 2: Autonomous Execution (The "Background Worker")
*   **When:** Linear tasks that don't need supervision: "Fix all the linting errors," "Add JSDoc to these 50 files."
*   **The Workflow:** "Define success (e.g., `npm run lint` passes) -> Execute in a loop -> Stop when signal is green."
*   **The Guardrail:** The `adversarial_reviewer` is NOT needed here. The signal is purely mechanical (tests/lint).

### Quadrant 3: Supervised Exploration (The "Architectural Sparring")
*   **When:** Designing a new system, major refactors, or incredibly tricky bugs where human domain knowledge is paramount.
*   **The Workflow:** This is where `deep-brainstorming` lives.
*   **The Guardrail:** The agent MUST present 3+ hypotheses/architectures to the **Human**. The human is the reviewer. No code is written until the human approves an approach.

### Quadrant 4: Autonomous Exploration (The "Autoresearch" / "Scientific Method")
*   **When:** The agent is stuck, the human is asleep/busy, or the human just wants the agent to "figure it out" (The scenario where the brute-force deadlock was broken).
*   **The Workflow (The Robust Loop):** 
    1. Define the hard signal (e.g., unit test).
    2. Generate 3 hypotheses (ToT).
    3. **Peer Review:** Debate hypotheses with `adversarial_reviewer` to kill flawed premises early.
    4. Generate 3 potential solutions for the winning hypothesis.
    5. **Peer Review:** Debate solutions with `adversarial_reviewer` to enforce simplicity.
    6. Checkpoint (`git commit --allow-empty`).
    7. Implement Solution A.
    8. Validate. If fail, Revert (`git reset --hard`) & Try Solution B.
*   **The Guardrail:** Because the human is absent, the `adversarial_reviewer` acts as the explicit proxy. Debating *before* writing code is crucial for context economics—it is much cheaper to kill a bad idea in text than to execute, fail, and revert it.

## Conclusion
By adopting this Mode Matrix, the agent's first action is to ask: "Is this linear or complex?" and "Am I supervised or autonomous?". Once that contract is established, it executes the specific, constrained loop for that quadrant, eliminating the mess of conflicting procedural checklists.
