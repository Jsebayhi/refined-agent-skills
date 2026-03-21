# Part 13: The Execution Loop and Feedback Re-entry

*This document captures the mechanical constraints for the "Micro-Loop" within implementation phases and the "System Interrupt" protocol for human feedback and approval gates.*

## 1. The Turn-Start "Flight Deck" Header
Every response MUST begin with a standardized mechanical header to force synchronization with the disk-based state and the approved strategy.

**Format:**
> **STEP_ID:** [PHASE].[TASK].[SUB] | **STATE_REF:** [FILE_PATH] | **PROGRESS:** [X of Y] | **APPROVAL:** [PENDING|RECEIVED]

*   **STEP_ID Schema:** `[PHASE_NUM].[TASK_NUM].[SUB_NUM]` (e.g., `3.2.1` for Phase 3, Task 2, Sub-task 1).
*   **STATE_REF:** The path of the specific plan or strategy file the agent just read to orient itself.

## 2. The Phase 3 Micro-Loop (The "Act-Validate-Converge" Loop)
Once an engine enters the Execution phase, it executes this sub-routine for every micro-task in the plan. The agent does NOT restart the engine workflow.

1.  **Read:** Read the current plan and the approved strategy shard.
2.  **Act:** Perform the surgical implementation.
3.  **Validate:** Run the Hard Signal (tests).
4.  **Converge:** 
    *   **If Autonomous:** Achieve a Reviewer "PASS" via the convergence protocol.
    *   **If Supervised:** Achieve a Human "PASS" (Halt and wait for approval).
5.  **Sync:** Update the plan shard (mark `[x]`) and the Flight Deck header.
6.  **Analyze:** After every sync, ask: *"Does the gathered knowledge from this step invalidate the remaining plan?"* If yes, trigger a **Phase 2: Strategy** reset.

## 3. The Feedback Intercept (System Interrupt)
Human feedback is a system interrupt that mandates a physical and cognitive "Step Back." When feedback is received:
1.  **Halt:** Stop the current loop immediately.
2.  **Reset:**
    *   **Cognitive:** Output a `REASONING_RESET: [GOAL|ARCH|TACTIC]` token.
    *   **Physical:** If in Phase 3, execute `git reset --hard` to clear failed implementation context.
3.  **Re-Orient:** Read the Goal/Architecture/Tactics files immediately to 'flush' the previous context and re-run convergence with the Reviewer.

## 4. Implementation Gating (The "No Map, No Move" Rule)
*   **The Rule:** You are PROHIBITED from using modification tools (`write_file`, `replace`) unless you have called `read_file` on the **"Winning Strategy"** shard within the **last 3 turns**.
*   **The Penalty:** Failure to provide the strategy read-receipt in the session history constitutes a mechanical failure of the framework.

## 5. Reinforced Approval Gate (Supervised Mode)
*   **The Rule:** Even after a Reviewer "PASS," you are PROHIBITED from starting the Execution Plan until the user explicitly provides a command to proceed (e.g., "Proceed", "Go", "Yes").
*   **The Confirmation:** You MUST confirm receipt of this token in the Flight Deck Header: `APPROVAL: RECEIVED`.
