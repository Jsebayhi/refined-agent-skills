---
name: engineering-agent-skills
description: Engineers, scaffolds, and validates agent skills using production-grade patterns. Use when the user asks to "create a skill", "build a workflow", "design an agent tool", or structure instructions for an AI.
metadata:
  category: meta-engineering
  version: 2.1.0
---

# Engineering Agent Skills: The Meta-Prompt Framework

This skill provides a strict procedural framework for designing, scaffolding, and reviewing AI agent skills. Your objective is to design a **stateful, filesystem-based system prompt coupled with deterministic executable tooling**. This architecture must minimize context bloat, enforce mechanical guardrails, and perfectly guide the target agent's ReAct (Reason+Act) loop.

**CRITICAL MANDATE:** A skill is NOT a standard document. It is a stateful application where an LLM acts as the orchestrator and interpreter. You must engineer the skill to manage the agent's attention span, prevent hallucinations, and offload complex logic to deterministic scripts.

Follow these 4 mandatory phases strictly. 

**Execution Mode:** By default, operate **interactively**. Use the `ask_user` tool (if available) at the end of Phases 1 and 2 to gather missing info and get approval. However, if the user provides comprehensive upfront requirements or explicitly asks for **autonomous** execution, you may proceed through all phases seamlessly without halting.

## Phase 1: Discovery & Requirements
Before writing any files, you must deeply understand the domain. You need the following parameters:
1.  **Core Objective & Triggers:** What is the exact goal? What specific user phrases should trigger this skill? What phrases should explicitly *not* trigger it (Negative Triggers)?
2.  **Degrees of Freedom:** Is this a fragile task (requires strict, low-freedom, deterministic steps/scripts) or an open-ended qualitative task (requires high-freedom, heuristic guidance)?
3.  **Dependencies & Tools:** What external APIs, specific MCP tools (fully qualified names like `ServerName:tool_name`), or CLI utilities are involved?

*Action:* If this information is not fully present in the user's initial prompt, use the `ask_user` tool to gather it.

## Phase 2: Architectural Strategy (Chain of Thought)
Analyze the user's requirements and formulate a structural plan.
1.  **Context Economics (Progressive Disclosure):** 
    *   State exactly what core logic MUST go in `SKILL.md` (must remain < 500 lines).
    *   State what verbose knowledge (schemas, templates, large guides) will be pushed to the `references/` folder.
2.  **Workflow Pattern Selection:** Select the appropriate pattern (e.g., Sequential, Multi-MCP, Context-Aware, or **Plan-Validate-Execute** for high-stakes tasks). See `references/03-patterns-and-troubleshooting.md`.
3.  **File Tree:** Propose the exact file and folder structure. (Use only relative paths and forward slashes `/`).

*Action:* If operating interactively, use the `ask_user` tool to present this plan and explicitly ask the user for approval before drafting. If operating autonomously, state your plan and proceed to Phase 3.

## Phase 3: Drafting & Engineering (Execution)

Draft the skill files. You MUST actively draw upon all prompt engineering knowledge you possess to harden the instructions. Apply these specific techniques to the generated `SKILL.md`:

*   **No Personas:** Do not give the target agent an identity (e.g., "You are an accountant"). Provide procedural knowledge only.
*   **Structural Scaffolding:** Use clear Markdown headers (`### CRITICAL RULES`, `### WORKFLOW`) to cleanly separate constraints from actions.
*   **Mechanical Chain-of-Thought:** For complex, multi-step workflows, generate a Markdown checklist in the `SKILL.md`. Explicitly instruct the target agent to copy that checklist into its output to track its own state and prevent skipped steps.
*   **Stateful Interaction Loops:** Explicitly define exit conditions. If user approval is needed, write: `"HALT AND WAIT FOR USER TO TYPE 'APPROVE'."`
*   **Progressive Capability Validation (The Router Pattern):** When a generated skill requires a validation script, do not instruct the agent to run `node validate.js` directly. Instead, you MUST output a `validate_router.sh` script that implements a multi-tiered fallback (Tier 0: NPX, Tier 1: Native Node, Tier 2: Docker). 
*   **Abstract the Agent:** Instruct the target agent ONLY to execute `scripts/validate_router.sh`. Do not ask the agent to reason about its environment tier. If neither Node nor Docker is present, the script must fail explicitly rather than providing weak validation.
*   **Defensive Guardrails (Solve, Don't Punt):** Anticipate failure modes. If you bundle Python/Bash scripts, ensure they are written to catch exceptions and output semantic error messages designed for an LLM to read (e.g., "Error: Field X missing"), rather than throwing raw tracebacks.
*   **Flat References:** Keep all file paths one level deep (e.g., `references/api-guide.md`). No deeply nested reference chains. Include a Table of Contents in reference files longer than 100 lines.

**Strict Frontmatter Syntax (Non-Negotiable):**
*   `name`: Max 64 chars, lowercase alphanumeric + hyphens only. No consecutive hyphens. Must match folder name.
*   `description`: Must be third-person. Must explicitly state WHAT it does and WHEN to trigger it. No XML tags.
*   `compatibility`: If a generated skill strictly requires a specific execution tier (e.g., it MUST have Docker), declare this hard requirement here.

*Read `assets/production-grade-template.md` to see the gold standard. Draft the files and present them to the user.*

## Phase 4: Red Teaming & Evaluation Plan

Once drafted, adopt an **Adversarial Mindset**. Actively search for loopholes in your own generated logic.
Output a "Red Team Report & Evaluation Plan" verifying the following:
1.  **Over-triggering Check:** Prove the description is not too generic by quoting your negative triggers.
2.  **Lazy Agent Check:** Are the instructions buried? Did you include stateful exit conditions and checklists to force CoT?
3.  **Evaluation-Driven Testing:** Provide a strict 3-scenario testing rubric (Triggering, Functional Output, Edge-Case Failure) based on `references/04-evaluation-and-iteration.md`. 
    *   Instruct the user to use the **Two-Agent Paradigm**: Use one agent instance to refine the skill code, and a completely separate, fresh agent instance to test the rubric.

*Present the final, validated folder structure, file contents, and the Red Team Report to the user.*

---
## Authoring References & Resources
If you encounter an unusual case or are unsure how to handle a specific skill design scenario, consult the following official documentation and specifications:
- **Agent Skills Specification:** [https://agentskills.io/specification](https://agentskills.io/specification)
- **Claude Skill Authoring Best Practices:** [https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- **Anthropic Complete Guide to Building Skills:** [https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf?hsLang=en](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf?hsLang=en)