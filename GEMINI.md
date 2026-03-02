# Gemini CLI Extension: refined-agent-skills

This extension provides a collection of distilled, high-signal experts for the Gemini CLI.

## Project Structure

- `skills/`: Contains the individual skills.
    - `engineering-agent-skills/`: Expert system for building and designing agent skills.
    - `deep-reading-agent-skill/`: Teaches agents to deeply analyze and reflect on resources (PDFs, docs, web pages) section by section.
    - `git-commit-convention/`: Commits staged changes conventionally.
    - `deep-brainstorming/`: Guides the agent through a rigorous brainstorming process.
    - `working-with-gitlab-mr/`: Enforces a high-transparency Merge Request lifecycle (Opening, Handling Feedback, Reviewing) on GitLab.

## Configuration

- `gemini-extension.json`: Extension metadata for Gemini CLI.

## Workflows

### GEMINI.md Maintenance
**CRITICAL:** This `GEMINI.md` file must be actively maintained by any agent working on this extension. It serves as the primary repository for project-specific operational intelligence, developer notes, and conventions. Update it whenever new workflows, gotchas, or structural patterns are introduced.

**SEPARATION OF CONCERNS:**
- **`GEMINI.md` (This file):** Strictly for **maintenance and development** of the extension itself. It contains internal rules for developers/agents working ON the skills (e.g., commit conventions, repo-specific discovery).
- **`EXTENSION-GEMINI.md`:** Strictly for **user guidance and cross-skill operational standards**. It contains instructions for any agent USING the extension's skills in their own project (e.g., the "Source Code Investigation Standard").

### Git Conventions
**MANDATORY:** One commit per skill. A commit must never touch multiple skills. 
- When adding or updating a skill, only changes within that skill's directory (and relevant top-level files like `README.md` or `.gitignore` if required for that skill) should be included.
- Fixes or improvements to existing skills must be in their own dedicated commits.

**NON-INTERACTIVE MANDATE:** You MUST use `gh` and `glab` in non-interactive mode to prevent terminal hangs.
- Prefix all discovery commands with `GH_PAGER=cat` or `GLAB_PAGER=cat`.
- Forbid usage of `--live`, `--watch`, or any command that continuously refreshes output.
- Use one-shot discovery commands (e.g., `gh pr checks` instead of `gh pr view --watch`).

### README Maintenance
When adding a new skill to the `skills/` directory:
1. Update the `Available Skills` section in `README.md`.
2. Include the skill name, a brief description, and its primary trigger phrases.
3. Provide the specific installation and linking commands for that skill, matching the existing examples.

### Adding a New Skill
Create a new directory in `skills/` with a `SKILL.md` file following the kebab-case naming convention.
