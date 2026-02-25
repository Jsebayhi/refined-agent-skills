# Fundamentals and Planning

A skill is a packaged set of instructions (a simple folder) that teaches an agent how to handle specific tasks or workflows. Instead of re-explaining preferences, processes, and domain expertise in every conversation, skills let you teach the agent once.

## Progressive Disclosure (Core Design Principle)
Skills use a three-level system to manage context window usage:
1. **First level (YAML frontmatter):** Always loaded in the agent's system prompt. Provides just enough information for the agent to know *when* the skill should be used.
2. **Second level (SKILL.md body):** Loaded only when the agent thinks the skill is relevant to the current task. Contains the full instructions and guidance.
3. **Third level (Linked files in `references/`):** Additional files bundled within the skill directory that the agent can choose to navigate and discover only as needed.

## Common Skill Use Case Categories

Before writing code, identify 2-3 concrete use cases. Skills generally utilize techniques from one or more of the following three categories. **Note that these categories are not mutually exclusive; a complex skill will often blend elements of all three** (e.g., using an MCP tool to fetch data, following an automated workflow to process it, and creating a formatted document as the final asset).

### Category 1: Document & Asset Creation
Used for creating consistent, high-quality output including documents, presentations, apps, designs, code, etc.
*Key techniques:*
- Embedded style guides and brand standards.
- Template structures for consistent output.
- Quality checklists before finalizing.
- No external tools required - uses the agent's built-in capabilities.

### Category 2: Workflow Automation
Used for multi-step processes that benefit from consistent methodology, including coordination across multiple MCP (Model Context Protocol) servers.
*Key techniques:*
- Step-by-step workflow with validation gates.
- Templates for common structures.
- Built-in review and improvement suggestions.
- Iterative refinement loops.

### Category 3: MCP Enhancement
Used for workflow guidance to enhance the tool access an MCP server provides. (e.g., Automatically analyzes and fixes detected bugs using Sentry's error monitoring data).
*Key techniques:*
- Coordinates multiple MCP calls in sequence.
- Embeds domain expertise.
- Provides context users would otherwise need to specify.
- Error handling for common MCP issues.

## Define Success Criteria
How will you know your skill is working?
- **Quantitative:** The skill triggers on 90% of relevant queries. It completes workflows in fewer tool calls than without the skill. Zero failed API calls per workflow.
- **Qualitative:** Users don't need to prompt the agent about next steps. Workflows complete without user correction. Results are consistent across sessions.