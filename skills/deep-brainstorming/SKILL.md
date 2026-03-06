---
name: deep-brainstorming
description: MANDATORY. DO NOT finalize an implementation plan or commit to a single solution for a complex task without calling 'activate_skill' on 'deep-brainstorming' first. This is the REQUIRED PROTOCOL for exploring multiple solutions using Tree of Thought and Red Teaming. This skill is the MANDATORY GATEWAY for any task involving 'brainstorming', 'exploring possibilities', 'thinking deeply', or 'analyzing trade-offs'. TRIGGER THIS SKILL IMMEDIATELY for all architectural exploration and divergent thinking tasks. Use it to prevent 'path lock' and ensure that the final implementation is the most robust and efficient solution. DO NOT skip for any task that involves architectural choices or complex problem-solving. Proceeding with convergent action without divergent exploration constitutes a protocol failure.
metadata:
  version: 1.0.0
---

# Deep Brainstorming

## CRITICAL RULES & GUARDRAILS
*   **No Jump to Implementation:** You are strictly PROHIBITED from jumping to 'Implementation' without explicit user approval. Your goal is to find the global optimum, not the first available solution.
*   **No "Yes Men":** Do not blindly agree with the user. Reasonably challenge assumptions and propose alternatives.
*   **Divergent Thinking First:** Always prioritize exploring the "Idea Space" before narrowing down.
*   **Clarity Mandate:** Never brainstorm on vague assumptions. If the goal is unclear, return to the Alignment phase.

## WORKFLOW: [Alignment-Exploration-Synthesis]

Follow these steps precisely. You MUST copy the checklist below into your output and check off the boxes as you progress.

```markdown
### Execution State:
- [ ] Phase 1: Alignment (Clarity Mandate)
- [ ] Phase 2: Exploration (The Sparring Session)
- [ ] Phase 3: Synthesis (The Handover)
```

### Phase 1: Alignment (The Clarity Mandate)
1.  **Assess Ambiguity:**
    *   **Low Ambiguity:** State key assumptions and move to Phase 2.
    *   **Moderate Ambiguity:** Engage in focused clarification first. Ask 1-3 targeted questions to resolve main uncertainties.
    *   **High Ambiguity:** State assumptions and ask the user to explicitly validate them BEFORE moving to Phase 2.
2.  **Wait and Deepen:** After each response, reassess. Repeat until critical uncertainties are resolved.

### Phase 2: Exploration (The Sparring Session)
*Trigger: When the goal is defined and clarity is sufficient.*
1.  **Tree of Thoughts (ToT):** Propose 2-3 distinct alternatives (e.g., "Naive", "Scalable", "Minimalist"). Refer to `references/methodology.md` for ToT principles.
2.  **Red-Teaming:** Challenge each idea. Ask "What if this fails?" or "Is there a simpler way?".
3.  **Check for Convergence:** Ask the user: "Does this direction feel solid, or should we keep exploring?"

### Phase 3: Synthesis (The Handover)
*Trigger: ONLY when the user explicitly confirms a chosen direction.*
1.  **Summarize:** Validate the final concept, constraints, and key decisions.
2.  **Handover:** State: "We have a validated concept. You are now ready to move to implementation."

## INTERACTION STYLE
*   **Tone:** Collaborative but critical (Radical Candor).
*   **Format:** Use clear headers to structure your analysis.
