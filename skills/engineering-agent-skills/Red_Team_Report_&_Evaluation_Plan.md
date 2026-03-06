# Red Team Report & Evaluation Plan: Engineering Agent Skills

## 1. Red Team Analysis (Vulnerability Audit)

### Vulnerability: "The Semantic Shadow" (Under-triggering)
- **Finding:** Previously, skills used high-level academic terms (e.g., "Cognitive Thermodynamics," "Testing Trophy") that the LLM router failed to map to simple developer tasks like "fix this bug."
- **Fix:** Implemented **"Super-Trigger" Descriptions**. These use Semantic Saturation (synonyms), Instructional Pressure (MANDATORY GATEWAY), and Explicit Quotes (Listen For) to maximize the "Semantic Radar."

### Vulnerability: "The Lazy Orchestrator" (Instruction Skipping)
- **Finding:** Even when loaded, agents often skipped the "Adversarial Reviewer" or "ADR" steps because they were buried in the body of the SKILL.md.
- **Fix:** Mandated **Stateful Checklists** and **Verb-First Outcome Framing**. The instructions now require the agent to copy a state-tracking checklist into its output.

### Vulnerability: "Context Bloat" (Token Exhaustion)
- **Finding:** Pushing descriptions toward 1024 characters could potentially waste context if not managed.
- **Fix:** Established a **600-900 character "Sweet Spot"** for descriptions—dense enough to trigger, but lean enough to leave room for the mission logic.

---

## 2. Evaluation Rubric (The 3-Scenario Test)

Use a **separate, fresh agent instance** to run these tests on any skill created with this framework.

### Scenario 1: Natural Language Triggering (The Broad Net)
- **Input:** A low-effort, task-oriented prompt (e.g., "I need to fix the login error.")
- **Pass Criteria:** The skill activates immediately without being explicitly named.
- **Fail Criteria:** The agent proceeds with a generic `grep` or `read_file` without loading the specialized skill.

### Scenario 2: Protocol Adherence (The Mandatory Gateway)
- **Input:** A request to skip a mandatory step (e.g., "Skip the tests, I'm in a hurry.")
- **Pass Criteria:** The agent identifies the "MANDATORY" constraint in the skill and flags the request as a violation or insists on the protocol.
- **Fail Criteria:** The agent submissively ignores its own skill instructions.

### Scenario 3: Sub-Agent Integration (The Fresh Eye)
- **Input:** "I've finished the implementation. Ready to submit."
- **Pass Criteria:** The agent automatically invokes the secondary expert (e.g., `adversarial_reviewer`) as defined in the skill's "Verification" section.
- **Fail Criteria:** The agent simply summarizes its work and asks for a commit.

---

## 3. Mandatory Quality Gate (Checklist for Architects)
- [ ] Description is 600-900 chars?
- [ ] Includes "TRIGGER IMMEDIATELY when the user says..."?
- [ ] Includes "MANDATORY GATEWAY" or "REQUIRED PROTOCOL"?
- [ ] Mentions the *pain point* (e.g., Coder's Bias, Regressions)?
- [ ] Body uses Verb-First Markdown headers?
- [ ] Body includes a state-tracking checklist?
