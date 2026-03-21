# Part 11: Skills vs. References (Progressive Disclosure)

*This document captures the architectural rationale for sharding the engines into dedicated skills rather than using disk-based references.*

## 1. The Question
Should the four quadrant engines (`executing-linear-task-supervised`, etc.) be implemented as dedicated Gemini CLI skills or as sharded documentation files in the `references/` directory?

## 2. The Analysis

### Dedicated Skills (The Chosen Model)
*   **High Instructional Pressure:** The `activate_skill` tool call acts as a hard state change. The `MANDATORY. DO NOT...` lead in the frontmatter provides "always-on" constraints that the agent is physically compelled to respect.
*   **Semantic Nudging:** The skill name itself acts as a constant anchor in the agent's memory, reminding it of its current operational quadrant.
*   **Risk:** Contributes to context window bloat as every skill appends its full text.

### References (Progressive Disclosure Model)
*   **Context Economics:** Instructions are only loaded on-demand via `read_file`. This allows for a leaner active context.
*   **Risk:** "Instructional Dilution." References are "Read-Once" context. Without being pinned as a mandatory skill constraint, the agent is prone to "forgetting" the protocol after 3-4 turns and reverting to un-methodical behavior.

## 3. The Recommendation: The Hybrid "Brain/Memory" Model
The framework adopts a hybrid approach to maximize both fidelity and efficiency:

1.  **Skills = The "Brain" (How):** All core orchestration protocols and "Always-On" rules are implemented as **Dedicated Skills**. This ensures the "Rules of the Game" remain pinned in the context window with maximum saliency.
2.  **References = The "Memory" (What):** All verbose, task-specific data (Detailed Plans, Gathering Evidence, Hypotheses lists) is stored in **Disk-Based References**. This keeps the "Brain" clean of temporary, high-volume noise.

## 4. Conclusion
By using skills for the engines, we ensure the agent's core reasoning is permanently anchored to the chosen scientific loop, while using references to prevent that loop from collapsing under the weight of its own evidence logs.
