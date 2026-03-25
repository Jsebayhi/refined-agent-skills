# Part 5.2 & 5.3: Context Traps and Proposed Solutions

As we move towards a modular, reviewer-gated architecture, we trigger a fatal secondary consequence: **Context Accumulation**.
## 1. The Context Accumulation Problem (The "Bloat Trap")
If we solve the "Heaviness" problem by making skills modular (e.g., branching from RCA to TDD, then to Refactoring), the context window fills up with thousands of lines of competing instructions.
*   **The Danger:** The agent suffers from the "Lost in the Middle" phenomenon, starts hallucinating, forgets the rules of the initial skill, and loses track of the user's original goal.

## 2. The Persistence Trap (Information Trashing)
Empirical evidence shows that as a single file accumulates too much text, the agent's ability to maintain high-fidelity during edits diminishes.
*   **The Danger:** During `write_file` or `replace` operations on large files, the agent is prone to "trashing" information—unintentionally omitting details, collapsing sections, or failing to match complex strings. 
*   **The Lesson:** Agents must prioritize **Atomic Persistence**. Instead of appending to a single "God File," information should be sharded across multiple, specialized files to ensure the agent maintains full "Instructional Saliency" over the content it is modifying.

## 3. Proposed Solutions for Context Accumulation
...
If we go modular, we cannot stack skills infinitely. We need mechanisms for **Context Flushing** or **Stateful Handoffs**.

### Idea A: Sub-Agent Task Delegation (Context Isolation)
Instead of the *main* agent activating the TDD skill and absorbing its instructions, it delegates the task.
*   **Mechanism:** The main agent says, "Sub-agent, go write a failing test for this bug." The sub-agent loads the TDD skill, executes the ReAct loop, and dies. The main agent only receives the resulting code summary.
*   **Verdict:** High context safety, but reliant on sub-agents maintaining the "vibe" of the main session.

### Idea B: Explicit Skill Deactivation (Instruction Shedding)
Currently, `activate_skill` appends text permanently. 
*   **Mechanism:** Teach the agent to formally "Deactivate" or "Shed" a skill. Once the TDD loop is done, the agent summarizes the result, and the system drops the `<activated_skill>` block from the active prompt.
*   **Verdict:** Keeps the agent fast, but requires core system/CLI modifications.

### Idea C: The "Artifact-Driven" State Machine (Filesystem over RAM)
Instead of relying on ephemeral prompt instructions, we rely on the filesystem.
*   **Mechanism:** A `.gemini/state.md` file tracks the "Current Phase" and "Micro-Goal." The agent holds a tiny "God Prompt" instructing it to read the state file. When switching modes, it updates the state file, reads a tiny reference guide for the current micro-goal, executes, and updates the state file again.
*   **Verdict:** The source of truth is the stable file system, not the LLM's volatile context window. Highly resilient.
