# Standard Skills (std-skills)

A collection of standard agent skills for the Gemini CLI. This extension allows you to install all these skills at once or cherry-pick individual ones.

## Installation

To make all the skills in this repository available in your Gemini CLI at once:

```bash
# Install from a remote git repository
gemini extensions install <git-repo-url>

# Or link the entire repository of skills locally (updates reflect immediately)
gemini skills link /path/to/std-skills-gemini-cli-extensions
```

## Available Skills

You can choose to install or link individual skills if you prefer not to install the entire repository.

### [Engineering Agent Skills](skills/engineering-agent-skills/SKILL.md)
*   **Description**: Engineers, scaffolds, and validates agent skills using production-grade patterns.
*   **Triggers**: "create a skill", "build a workflow", "design an agent tool".

**Installation:**
```bash
# Install from a remote git repository
gemini skills install <git-repo-url> --path skills/engineering-agent-skills

# Or link from a local directory (updates reflect immediately)
gemini skills link ./skills/engineering-agent-skills
```

### [Deep Reading Agent Skill](skills/deep-reading-agent-skill/SKILL.md)
*   **Description**: Teaches agents to deeply analyze and reflect on resources (PDFs, docs, web pages) section by section.
*   **Triggers**: "read the following resources deeply", "deeply read this PDF section by section", "analyze the nuances and spirit of these documents".

**Installation:**
```bash
# Install from a remote git repository
gemini skills install <git-repo-url> --path skills/deep-reading-agent-skill

# Or link from a local directory (updates reflect immediately)
gemini skills link ./skills/deep-reading-agent-skill
```

### [Git Commit Convention Skill](skills/git-commit-convention/SKILL.md)
*   **Description**: Commits staged changes conventionally.
*   **Triggers**: "git commit", "prepare commit", "draft a commit message", "commit changes conventionally".

**Installation:**
```bash
# Install from a remote git repository
gemini skills install <git-repo-url> --path skills/git-commit-convention

# Or link from a local directory (updates reflect immediately)
gemini skills link ./skills/git-commit-convention
```
