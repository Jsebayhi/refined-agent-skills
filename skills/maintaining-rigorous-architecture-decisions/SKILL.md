---
name: maintaining-rigorous-architecture-decisions
description: Enforces a rigorous architectural design process using Architecture Decision Records (ADRs). Mandates analysis of 3+ alternatives and documentation of context, decisions, and consequences.
---

# Standard Architecture Decisions (ADR)

Architecture is about managing "Irreversible Decisions." This skill ensures that every significant technical choice is grounded in research, comparison, and long-term impact analysis.

## 🏛️ The ADR Mandate
For any change that significantly impacts the system's structure, performance, or maintainability, you MUST create an ADR.

### 1. Analysis of Alternatives
You MUST analyze at least **3 distinct alternatives** and more is better. Each alternatives must offer another view of the project, not be a slight variation of another alternative. You must complement at least 2 alternatives with at least one wild alterantive.

Once all alternatives are on the table, you must evaluate them, identify the strength and weakness of each and then think about a few alternatives that would combine all the strength if possible, or most of them.

### 2. The ADR Structure
Every ADR must include:
*   **Context:** The problem, constraints, and current state.
*   **Alternatives Considered:** 3+ options with Pros, Cons, the Status (Rejected/Selected) and the reasoning for rejection/selection.
*   **Decision:** The final choice and the technical rationale (Why).
*   **Consequences:** Both positive and negative impacts on the project.

## 📝 ADR Template
Use the following format when creating ADRs in the project's `adr/` folder.

```markdown
# NNNN. Title of Decision

## Status
Proposed | Accepted | Superseded by [NNNN](link) | Supersed by [NNNN](link)

## Context
What is the problem we are solving? What are the constraints?

## Alternatives Considered
List at least 3 alternatives explored (include all significant options considered).

### [Alternative Name 1]
*   **Description:** ...
*   **Pros/Cons:** ...
*   **Status:** Rejected
*   **Reason for Rejection:** Clearly define why this was not selected.

### [Alternative Name 2] (Selected)
*   **Description:** ...
*   **Pros/Cons:** ...
*   **Status:** Selected
*   **Reason for Selection:** Why is this the best choice?
...
```

## 🧠 Strategic Guidelines
*   **Identify Irreversibility:** Focus ADRs on things that are hard to change later (e.g., Database choice, API contracts, Frameworks).
*   **Be Radical:** Don't just list "Bad" ideas to fill the 3-alternative requirement. Genuinely try to make each alternative viable.
*   **Document Trade-offs:** Every decision has a cost. If you don't list a negative consequence, you haven't thought deeply enough.
