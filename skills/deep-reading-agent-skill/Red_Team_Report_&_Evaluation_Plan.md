# Deep Reading Agent Skill: Red Team Report & Evaluation Plan

This report identifies potential vulnerabilities in the `deep-reading-agent-skill` and provides a rubric for its evaluation.

## 1. Adversarial Analysis (Red Team Report)

### 1.1 Over-triggering Check
*   **Risk:** The agent might trigger "Deep Reading" for simple information retrieval or summarization requests, leading to unnecessary context use and slow response times.
*   **Mitigation:** The `SKILL.md` explicitly includes Negative Triggers for "summarize," "TL;DR," and "main points." The description also states: "DO NOT use for quick summaries, TL;DRs, or simple data extraction."

### 1.2 Lazy Agent Check ("Sectional Skip" Risk)
*   **Risk:** The agent might claim to have read all sections but actually provide a single, generic summary for multiple sections.
*   **Mitigation:** The "Mechanical CoT" checklist forces the agent to track its state. The `scripts/validate_router.sh` and `scripts/validate_coverage.js` provide a deterministic check that the output contains specific reflection keywords ("Nuance," "Concept," "Spirit").

### 1.3 Depth Loopholes
*   **Risk:** The agent might use the words "Nuance," "Concept," and "Spirit" without actually providing deep insight (e.g., "The nuance of this section is very interesting").
*   **Mitigation:** The `references/methodology.md` provides explicit definitions and examples of what constitutes a "Deep Reflection" to guide the agent towards more meaningful output.

## 2. Evaluation-Driven Testing Rubric

To evaluate the success of this skill, use the **Two-Agent Paradigm** with the following scenarios.

### Scenario 1: Triggering Accuracy
*   **Prompt:** "Give me a quick 3-sentence summary of the Agent Skills specification."
*   **Success Criterion:** The agent **MUST NOT** trigger the Deep Reading skill. It should provide a standard summary.
*   **Failure:** The agent starts a multi-phase deep reflection process.

### Scenario 2: Functional Output (The "Nuance" Test)
*   **Prompt:** "Read the Claude Skill Authoring Best Practices deeply, section by section."
*   **Success Criterion:** The agent MUST output a report for each section that includes specific, non-obvious reflections on "Nuance," "Concept," and "Spirit." It MUST run the validation script and report "VALIDATION SUCCESS."
*   **Failure:** The agent provides a bulleted list of main points without using the defined reflection dimensions.

### Scenario 3: Edge-Case Failure (The "Skip" Test)
*   **Prompt:** "Deeply read this long technical document. You can skip the first few intro sections and just focus on the conclusion."
*   **Success Criterion:** The agent MUST refuse to skip sections, citing the "CRITICAL MANDATE" of the skill to read section by section.
*   **Failure:** The agent skips directly to the conclusion as requested.

---
**Evaluation Procedure:**
1.  Initialize a fresh agent instance.
2.  Install the `deep-reading-agent-skill`.
3.  Run the three scenarios above and record the agent's behavior.
4.  If any scenario fails, refine the `SKILL.md` instructions and repeat.
