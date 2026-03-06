---
name: deep-reading-agent-skill
description: Teaches agents to deeply analyze and reflect on complex resources (PDFs, docs, web pages) section by section. This skill is the MANDATORY PROTOCOL for any task involving "reading deeply," "analyzing nuances," "reflecting on the spirit," or "extracting deep insights." TRIGGER THIS SKILL IMMEDIATELY when the user asks to "read deeply", "analyze the nuances", "reflect on the spirit", "synthesize this paper", or "perform a deep audit of this document". It prevents "surface-level reading" and ensures a comprehensive understanding of the resource's core message and underlying details. MANDATORY for all deep-dive research and detailed analysis tasks to maintain high-signal synthesis. DO NOT skip for any complex or long-form resource that requires comprehensive understanding.
compatibility: "Requires Node.js or Docker for sectional coverage validation."
metadata:
  version: 1.1.0
  category: research
---

# Deep Reading Agent Skill: Nuance & Connection Framework

This skill provides a strict procedural framework for deeply reading and reflecting on resources. Your objective is to move beyond superficial summaries and instead strive to understand the underlying **nuances, concepts, and the spirit** of the material. This is a rigorous, multi-layered approach to comprehension.

**CRITICAL MANDATE:** You must read the resources **one by one, section by section**. Do not skip ahead or stop at summaries and conclusions. You must explicitly reflect on each section before moving to the next.

## CRITICAL RULES & GUARDRAILS
*   **File Hygiene:** You MUST save all intermediate and final reports to the `artifacts/` folder at the project root (it is already ignored by git). DO NOT pollute the root directory or system folders.
*   **Progressive Disclosure:** For verbose definitions of "Nuance," "Concept," and "Spirit," you MUST read `references/methodology.md` before starting Phase 1. 
*   **Negative Constraint:** Do NOT skip the sectional reflection phase. Superficial summaries are forbidden.
*   **Validation:** You MUST run the `validate_router.sh` script. It uses a proprietary heuristic to score the **depth, nuance, and semantic variety** of your reflection. It will fail if it detects word-padding, generic paraphrasing, or lack of genuine insight.
*   **Stateful Interaction:** You MUST maintain the Execution State checklist.

## WORKFLOW: [Deep Reading Protocol]

Follow these 4 mandatory phases precisely.

**MECHANICAL CoT REQUIRED:** You MUST copy the checklist below into your output and check off the boxes as you progress to track your state.

```markdown
### Execution State:
- [ ] Phase 1: Sectional Deep Reflection
- [ ] Phase 2: Holistic Resource Reflection
- [ ] Phase 3: Cross-Resource Synthesis (if multiple)
- [ ] Phase 4: Final Synthesis & Deep Insight
```

### Phase 1: Sectional Deep Reflection
For every section of a resource (e.g., chapters, headings, key segments):
1.  **Read the Section:** Read the entire text of the section carefully.
2.  **Reflect on Nuance:** What is the specific tone, the hidden assumptions, or the subtle distinctions the author is making?
3.  **Synthesize Concepts:** What are the core ideas introduced? How do they differ from similar concepts you've encountered?
4.  **Capture the Spirit:** What is the overarching intent or "soul" of this section?
5.  **Validation:** Run `bash scripts/validate_router.sh sectional_report.md` to ensure coverage.

### Phase 2: Holistic Resource Reflection
Once the entire resource has been read section by section:
1.  **Read the Whole Again (Mental Model):** Reflect on how the sections you've analyzed build upon each other.
2.  **Reflect on the Spirit of the Resource:** What is the ultimate goal or "spirit" of the entire work?
3.  **Identify Meta-Nuances:** Are there themes or messages that only emerge when looking at the complete resource?
4.  **Validation:** Run `bash scripts/validate_router.sh holistic_report.md`.

### Phase 3: Cross-Resource Synthesis (For Multiple Resources)
After completing Phases 1 and 2 for all provided resources:
1.  **Reflect on the Combination:** How do these resources interact? Do they complement, contradict, or extend each other?
2.  **Synthesize the "Combined Spirit":** If these resources were part of a single ecosystem or philosophy, what would that be?
3.  **Deep Connection Mapping:** Identify specific nuances in one resource that are clarified or challenged by another.

### Phase 4: Final Synthesis & Deep Insight
Produce a final report that captures the deepest insights gained from this entire process. This report must avoid generic summaries and instead focus on the **profound understanding** of the concepts and their interplay.

## Triggers
- "read the following resources deeply"
- "deeply read this PDF section by section"
- "analyze the nuances and spirit of these documents"
- "read [X] one by one, section by section"

## Negative Triggers
- "summarize this resource"
- "give me a TL;DR"
- "what are the main points of [X]?" (Too superficial)
