# Standard Skills (std-skills)

A collection of standard agent skills for the Gemini CLI. This extension provides a modular, production-grade engineering suite and specialized utilities.

## Installation

To make all the skills in this repository available in your Gemini CLI at once:

```bash
# Install from a remote git repository
gemini extensions install <git-repo-url>

# Or link the entire repository of skills locally (updates reflect immediately)
gemini skills link /path/to/std-skills-gemini-cli-extensions
```

---

## 🏗️ The Production-Grade Software Lifecycle

This suite follows an **"Orchestrator + Specialized Experts"** architecture. The `standard-software-lifecycle` manages the process, while specialized skills provide the high-rigor standards for each phase.

### 1. Orchestration (The Framework)
*   **[Standard Software Lifecycle](skills/standard-software-lifecycle/SKILL.md)**: Manages the full 5-phase SDLC (Alignment, Architecture, Implementation, Validation, Submission). Handles **Re-Entry Protocols** for starting mid-task.
    *   *Triggers*: "fix a bug", "implement a feature", "address PR feedback".

### 2. Strategy & Architecture (The "Why")
*   **[Deep Brainstorming](skills/deep-brainstorming/SKILL.md)**: Divergent thinking using Tree of Thought and Red Teaming during Phase 2.
    *   *Triggers*: "brainstorm", "explore possibilities", "think deeply".
*   **[Standard Architecture Decisions (ADR)](skills/standard-architecture-decisions/SKILL.md)**: Convergent codification of decisions. Mandates 3+ alternatives.
    *   *Triggers*: "create an ADR", "architectural decision", "analyze alternatives".

### 3. Implementation Experts (The "Hands")
*   **[Bash Expert](skills/bash-expert/SKILL.md)**: Idiomatic shell scripting, ShellCheck compliance, and BATS testing.
    *   *Triggers*: "write a bash script", "fix the shell script", "test with BATS".
*   **[Python Expert](skills/python-expert/SKILL.md)**: Production-grade Python, Ruff/Black compliance, and Pytest implementation.
    *   *Triggers*: "write a python script", "fix the python code", "test with pytest".

### 4. Quality & Testing (The "Validation")
*   **[Standard Testing Philosophy](skills/standard-testing-philosophy/SKILL.md)**: The language-agnostic "Testing Trophy" (Static -> Integration -> E2E).
    *   *Triggers*: "testing strategy", "testing trophy", "mocking philosophy".
*   **[Standard UI Testing](skills/standard-ui-testing/SKILL.md)**: Enforces POM, signal-based waiting, and user-centric assertions for UI/E2E testing.
    *   *Triggers*: "write a ui test", "e2e testing", "playwright tests".

### 5. Infrastructure & Security (The "Hardening")
*   **[Standard DevSecOps Expert](skills/standard-devsecops-expert/SKILL.md)**: Shift-Left security, secret detection, and **Local-CI Alignment** (reproducible pipelines).
    *   *Triggers*: "security audit", "harden the pipeline", "check for secrets", "local ci alignment".

### 6. Delivery & Collaboration (The "Submission")
*   **[Standard Git Collaboration](skills/standard-git-collaboration/SKILL.md)**: Dual-platform (gh/glab) support, Conventional Commits, and **PRB Framework** (Problem-Reasoning-Benefit).
    *   *Triggers*: "create a PR", "open a merge request", "PR standards".
*   **[Standard User Documentation](skills/standard-user-documentation/SKILL.md)**: Enforces **Diátaxis** (Tutorials, How-to, Reference, Explanation) and "Documentation is Code."
    *   *Triggers*: "update the readme", "write documentation", "create a user guide".

---

## 🛠️ Meta-Engineering

*   **[Engineering Agent Skills](skills/engineering-agent-skills/SKILL.md)**: The expert system for designing and scaffolding new agent skills.
    *   *Triggers*: "create a skill", "build a workflow", "design an agent tool".

---

## 🔍 Analysis & Research Utilities

*   **[Deep Reading Agent Skill](skills/deep-reading-agent-skill/SKILL.md)**: Section-by-section analysis and reflection on complex resources (PDFs, Docs, Web).
    *   *Triggers*: "read deeply", "analyze the nuances", "reflect on the spirit".

---

## 📦 Legacy & Simple Tools

*   **[Git Commit Convention](skills/git-commit-convention/SKILL.md)**: Lightweight tool for conventional commits without the full submission lifecycle.
    *   *Triggers*: "git commit", "conventional commit".
