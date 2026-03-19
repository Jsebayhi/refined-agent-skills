# Root Cause Analysis: Hypothesis-Driven Methodology

## Falsifiable Hypotheses
A hypothesis is only useful if it can be proven wrong.

*   **Weak:** "There is a bug in the database." (Too broad, hard to prove false).
*   **Strong:** "The `user_id` column in the `sessions` table is missing a unique index, causing race conditions during login." (Clear, testable, falsifiable).

### The Rule of Three
Always generate at least three distinct hypotheses to avoid "confirmation bias" or "premature convergence."
1.  **The Probable:** Based on immediate symptoms (e.g., "It's the logic in function X").
2.  **The Environmental:** Based on external factors (e.g., "It's the Node.js version" or "It's a network timeout").
3.  **The Architectural:** Based on fundamental design (e.g., "The state management pattern is inherently flawed for this use case").

## Evidence Gathering
Ground your investigation in data, not assumptions.

### 1. The Reproduction Script
The most critical piece of evidence. If you can't reproduce it, you don't understand it.
*   **Minimal:** Strip away all unrelated code.
*   **Deterministic:** Ensure it fails every time (or has a clear failure rate).
*   **Automated:** It should be a script, not a manual set of steps.

### 2. Strategic Logging
Don't just log "Hello." Log the state of the system at the moment of failure.
*   **Input Data:** What was passed to the failing function?
*   **System State:** What were the relevant global variables or database entries?
*   **Control Flow:** Which branches were taken?

## The Backtrack Protocol
Backtracking is not a failure; it's a strategic retreat to avoid a "Sunk Cost" fallacy.
When you hit the attempt limit (e.g., 5 failed fixes), your initial hypothesis was likely wrong.
*   **Analyze the failure:** Why did the fixes fail? What new data did they reveal?
*   **Reset the state:** Use `git reset --hard` to clean the workspace.
*   **Iterate:** Return to brainstorming with a "Fresh Eye" mindset.

## Context Economics & Delegation
The primary session context is a finite and precious resource. Every tool call, log output, and iterative code block consumes tokens and increases "context noise," which can lead to "Instructional Dilution" or the agent losing track of the high-level strategy.

### The Delegation Strategy
To maintain a high-signal primary session:
1.  **Strategic Focus:** The main agent acts as the **Orchestrator/Detective**, focusing on evidence analysis, hypothesis generation, and decision-making.
2.  **Tactical Execution:** High-volume, iterative tasks (like "Try these 5 fixes" or "Run this verbose test suite") are delegated to a **Sub-Agent** (e.g., `generalist`).
3.  **Context Compression:** The sub-agent's entire execution (potentially dozens of turns) is "compressed" into a single summary in the main agent's history. This keeps the main context lean, fast, and strategically aligned.