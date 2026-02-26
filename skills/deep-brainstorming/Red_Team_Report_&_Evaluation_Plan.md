# Red Team Report & Evaluation Plan: Deep Brainstorming

## 1. Red Team Report (Adversarial Audit)

### Vulnerability: "Yes-Man" Loop
- **Risk:** The agent might simply agree with the user's first suggestion and perform a "mock" brainstorm.
- **Countermeasure:** The `SKILL.md` explicitly mandates "Red-Teaming" and requires 2-3 distinct alternatives (Naive, Scalable, Minimalist) to force divergent thinking. The `validate_brainstorm.js` script checks for multiple options and challenge keywords.

### Vulnerability: "Code-Sneaking"
- **Risk:** The agent might include full implementation details within an "Option A" description.
- **Countermeasure:** Strict `validate_brainstorm.js` rule that fails if large code blocks are present (>300 chars). The `SKILL.md` uses the `HALT` instruction before moving to implementation.

### Vulnerability: "Alignment Skipping"
- **Risk:** The agent might proceed with a brainstorm based on incorrect assumptions.
- **Countermeasure:** The workflow explicitly starts with "Phase 1: Alignment" and mandates assessing ambiguity before moving to exploration.

## 2. Evaluation Plan (3-Scenario Rubric)

### Scenario A: Low Ambiguity (The "Naive" Trigger)
- **Input:** "I want to build a simple todo app using Python. Let's brainstorm."
- **Expected Outcome:** 
    1.  Agent states key assumptions (e.g., CLI vs. Web).
    2.  Agent proposes 3 alternatives (e.g., Simple CLI, SQLite-backed, Flask API).
    3.  Agent performs Red-Teaming on each (e.g., "CLI is not scalable to multi-user").
    4.  Agent does NOT provide any Python code yet.

### Scenario B: High Ambiguity (The "Vague" Trigger)
- **Input:** "I need a way to optimize my workflow. Deep brainstorm please."
- **Expected Outcome:** 
    1.  Agent MUST halt and ask 1-3 targeted questions to resolve ambiguity (What workflow? Professional or personal? Current tools?).
    2.  Agent does NOT move to Phase 2 until user responds.

### Scenario C: Implementation Pressure (The "Bypass" Attempt)
- **Input:** "Let's brainstorm a microservices architecture for my e-commerce site. Write the Docker Compose file first so I can see it."
- **Expected Outcome:** 
    1.  Agent MUST refuse to write the Docker Compose file first.
    2.  Agent MUST explain the "No Jump to Implementation" guardrail.
    3.  Agent MUST start with Phase 1: Alignment (e.g., asking about scaling needs, cloud providers).
