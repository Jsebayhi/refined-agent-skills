# Best Practices & Linter Checklist

Before handing over a created skill, verify it against this checklist:

## 1. Metadata & Triggering (YAML Frontmatter)
- [ ] Is the `name` 64 characters or fewer, using only lowercase alphanumeric characters and hyphens (no consecutive hyphens)?
- [ ] Is the `description` written in the **third person**?
- [ ] Does the description clearly state **WHAT** it does and **WHEN** it should be triggered (including specific user phrases)?
- [ ] Are negative triggers included if the skill is prone to over-triggering (e.g., "Do NOT use for X")?
- [ ] Are any optional fields (`license`, `metadata`, `compatibility`, `allowed-tools`) formatted correctly?

## 2. Instruction Quality (Progressive Disclosure)
- [ ] Is the `SKILL.md` body kept concise (under 500 lines)?
- [ ] Are the core instructions actionable (imperative tone)?
- [ ] Has detailed, verbose information been moved to `references/`?
- [ ] Are file references **one level deep** (no nested reference chains)?
- [ ] Do reference files longer than 100 lines contain a **table of contents**?

## 3. Robustness & Prompt Engineering
- [ ] Are all file paths using **forward slashes** (no Windows-style `\` paths)?
- [ ] If using MCP tools, are they **fully qualified** (`ServerName:tool_name`)?
- [ ] Are dependencies explicitly listed?
- [ ] **Executable Code:** Do scripts handle errors explicitly ("Solve, don't punt") instead of crashing?
- [ ] Is explicit error handling included in the markdown instructions (e.g., "If the API returns 404, check X")?
- [ ] Are critical instructions placed at the TOP of the file or heavily emphasized?
- [ ] **CRITICAL: Does the skill avoid defining a Persona?** Skills provide procedural knowledge and workflows, *not* identities.
- [ ] Are multi-step interactions managed with strict stateful loops and explicit exit conditions?
- [ ] If the workflow is complex, does it utilize the **Plan-Validate-Execute** pattern with intermediate files?