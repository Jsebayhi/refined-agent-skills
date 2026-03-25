# Part 9: Framework Orchestration Logic (Integration of Plugins)

*This document explains how the new Framework acts as the "Conductor" for the existing skill catalog.*

## 1. The Conductors (The Engines)
The two Engines (`executing-linear-tasks` and `navigating-complex-implementations`) are the primary users of other skills. They orchestrate the catalog based on the current micro-task in the `.gemini/plan.md`.

## 2. The Integration Points

### A. The Research Phase (Exploration Engine)
*   Calls **`deep-reading-agent-skill`** for analyzing complex docs.
*   Calls **`investigating-external-dependencies`** if the task involves third-party code.
*   Calls **`codebase_investigator`** (Sub-agent) for mapping code paths.

### B. The Architecture Phase (Exploration Engine)
*   Calls **`brainstorming-multiple-options`** to generate the 3 hypotheses/solutions.
*   Calls **`maintaining-rigorous-architecture-decisions`** to save the converged strategy.

### C. The Implementation Phase (Both Engines)
*   Calls **`engineering-reliable-software-with-[Language]`** to apply coding standards.
*   Calls **`validating-user-interfaces`** if UI changes are involved.
*   Calls **`upholding-devsecops-standards`** for security audits.

### D. The Validation Phase (Both Engines)
*   Uses **`testing-software-efficiently`** as the verification philosophy.
*   Calls the **`adversarial_reviewer`** (Agent) via the `conducting-adversarial-convergence` protocol.

### E. The Submission Phase (Both Engines)
*   Calls **`authoring-high-signal-git-commits`** for the final commit message.
*   Calls **`collaborating-on-git-projects`** to open the PR/MR.
*   Calls **`authoring-effective-user-documentation`** to update READMEs/Guides.

## 3. Benefits of this Integration
*   **Context Isolation:** Skills are only "activated" when needed for a specific task in the plan, then summarized and "flushed" (mentally) by the agent.
*   **Recursive Power:** This allows for a "nested" orchestration where the Conductors handle the strategy, and the specialized Experts handle the tactics.
