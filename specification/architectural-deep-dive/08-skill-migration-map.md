# Part 8: Skill Migration Map (Modified, Deleted, Merged)

*This document details the impact of the Mode Matrix Framework on the existing skill catalog.*

## 1. Deprecated / Deleted Skills
*   **`orchestrating-software-lifecycle`**: **DELETED**. Its linear waterfall logic is the source of "Heaviness." Its responsibilities are split between the new `orchestrating-decision-router` and the two Engines (Linear vs. Exploration).
*   **`performing-systematic-root-cause-analysis`**: **MERGED**. The "Debug Detective" persona and the RCA loop are generalized into the universal `navigating-complex-implementations` engine.

## 2. Modified / Refactored Skills
*   **`deep-brainstorming`**: **UNTOUCHED**. Remains the primary tool for free-form, human-led creative sessions.
*   **`brainstorming-multiple-options`**: **NEW**. A specialized sub-routine for the Engines. It takes the "Tree of Thoughts" logic and generates the strict 3-option format required for automated convergence.
*   **`maintaining-rigorous-architecture-decisions`**: **FOCUS REFINED**. It will no longer concern itself with "starting a task." It becomes a dedicated "ADR Writing Routine" triggered when the Exploration Engine identifies a Winning Strategy that requires persistence.
*   **`adversarial-reviewer` (Agent)**: **UNTOUCHED**. Remains a high-performing general critic. Its behavior will be driven dynamically by the Main Agent (via the `conducting-adversarial-convergence` protocol), which will provide specific "Lenses" and "Convergence Goals" in the delegation prompt.

## 3. Persistent Tactical Skills (No Change)
These skills remain as modular "Implementation Experts" called by the Engines:
*   **`engineering-reliable-software-with-python`**
*   **`engineering-reliable-scripts-with-bash`**
*   **`engineering-agent-skills`** (Standard remains untouched)
*   **`testing-software-efficiently`**
*   **`authoring-high-signal-git-commits`**
*   **`authoring-effective-user-documentation`**
*   **`interacting-with-github` / `interacting-with-gitlab`**
*   **`investigating-external-dependencies`**
