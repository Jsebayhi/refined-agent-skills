---
name: engineering-agent-skills
description: MANDATORY. DO NOT design, scaffold, audit, or modify any AI agent skills or system prompts without calling 'activate_skill' on 'engineering-agent-skills' first. This is the REQUIRED PROTOCOL to ensure production-grade 'Action-Oriented Nudging' and prevent 'Instructional Dilution'. TRIGGER IMMEDIATELY for any task involving 'modifying the extension', 'writing a new skill', or 'refining a workflow'. Use this as the exclusive mechanical gateway for all prompt engineering and agent skill lifecycle tasks. Proceeding with file modifications without this skill constitutes a protocol failure. It translates the core principles of 'Action-Oriented Nudging' and 'Context Economics' into functional system prompts and deterministic tools. MANDATORY for all extension development, prompt engineering, and agent skill lifecycle tasks. DO NOT skip this skill when building or refining any AI-facing instructions.
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

*   **Semantic Naming & Action-Oriented Nudging:** The skill name is the first and most powerful "nudge" for the agent. Do not use nouns or categories. Use present-participle verbs coupled with quality anchors:
    *   **The "Iron-Clad" Description Mandate (Hard Negative Constraints):** The `description` field MUST be engineered as a mechanical gate, not a summary. Use "Instructional Pressure" to poison the "path of least resistance."
    *   **The "DO NOT" Lead:** Start the description with an explicit prohibition: **"MANDATORY. DO NOT <Action> without calling 'activate_skill' on '<skill-name>' first."** This leverages the LLM's sensitivity to negative constraints.
    *   **Mechanical Gating:** Explicitly link the prohibition to the `activate_skill` tool call. Frame the skill as the **EXCLUSIVE GATEWAY** for the task.
    *   **Saliency Positioning:** Place the "MANDATORY" and "DO NOT" tokens at the **absolute beginning** of the description string.
    *   **Failure State Enforcement:** State that proceeding without activation constitutes a "protocol failure."
    *   **Semantic Saturation (The Broad Net):** After the lead, include a wide net of synonyms and low-level task phrases (e.g., "fix a bug," "write code," "refactor").
    *   **Size Constraint:** Aim for 600-900 characters (max 1024) to maintain high semantic density.
*   **No Personas:** Do not give the target agent an identity. Provide procedural knowledge only.
*   **Structural Scaffolding:** Use clear Markdown headers (`### CRITICAL RULES`, `### WORKFLOW`) to cleanly separate constraints from actions.
*   **Mechanical Chain-of-Thought:** For complex, multi-step workflows, generate a Markdown checklist in the `SKILL.md`. Explicitly instruct the target agent to copy that checklist into its output to track its own state and prevent skipped steps.
*   **Stateful Interaction Loops:** Explicitly define exit conditions. If user approval is needed, write: `"HALT AND WAIT FOR USER TO TYPE 'APPROVE'."`
*   **Strategic Scripting (Solve, Don't Punt):** Do not default to "ceremonial" validation. Instead, categorize scripts based on their functional or psychological utility:
    *   **Tier A: Functional Utility Scripts (Mandatory for Logic):** If a task involves data transformation, API calls, file parsing, or complex calculations, you MUST offload this to a script. Do not ask the agent to "reason" through a regex or a 50-line JSON transformation.
    *   **Tier B: Quality Gating & Behavioral Nudges (Situational):** Mandate validation scripts when you need to enforce a higher standard than the agent's first attempt. 
        *   **Syntactic/Schema Gates:** Use scripts to verify YAML/JSON structure and mandatory fields. The script is the "Ground Truth," not the LLM.
        *   **Heuristic Red Flags (The Deep Reading Pattern):** Use scripts to detect "manifestly low effort" (e.g., repetitive phrasing, insufficient detail, missing keywords). These scripts act as behavioral nudges, forcing the agent to reflect more deeply or try again if the first output is too thin.
*   **Resilient Script Execution (The Universal Router):** Any script that requires an external runtime (Node, Python, Docker) MUST be executed via a resilient router following a multi-tiered fallback (Tier 0: NPX/Local, Tier 1: Native Runtime, Tier 2: Docker). 
    *   **Script Pair Naming Convention:**
        *   **The Router (Public Interface):** Must have an expressive, outcome-oriented name (e.g., `scripts/enforce_quality_standards.sh`). This is the only script the agent should call.
        *   **The Logic (Internal Implementation):** Must use the same base name suffixed with `_internal` (e.g., `scripts/enforce_quality_standards_internal.js`). This signals to the agent that it is a dependency, not a primary tool.
*   **Abstract the Agent:** Instruct the target agent ONLY to execute the top-level router scripts. Do not ask the agent to reason about its environment or call `_internal` scripts directly.
*   **Defensive Utility (Offload the Heavy Lifting):** Anticipate deterministic hurdles. If you bundle Python/Bash scripts for data fetching or setup, ensure they are written to catch exceptions and output semantic error messages designed for an LLM to read (e.g., "Error: Field X missing"), rather than throwing raw tracebacks.
*   **Flat References:** Keep all file paths one level deep (e.g., `references/api-guide.md`). No deeply nested reference chains. Include a Table of Contents in reference files longer than 100 lines.

**Strict Frontmatter Syntax (Non-Negotiable):**
*   `name`: Max 64 chars, lowercase alphanumeric + hyphens only. No consecutive hyphens. MUST follow the **Action-Oriented Nudging** pattern: `present-participle-verb` + `quality-adj` + `mission-noun` (e.g., `engineering-reliable-software-with-python`).
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