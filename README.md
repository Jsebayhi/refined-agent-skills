# Refined Agent Skills (refined-agent-skills)

A collection of high-signal engineering and professional agent skills for the Gemini CLI. This extension provides a curated suite of "distilled experts" designed to build grounded, reliable, and maintainable software through senior-level protocols.

## Installation

To make all the skills in this repository available in your Gemini CLI at once:

```bash
# Install from a remote git repository
gemini extensions install <git-repo-url>

# Or link the entire repository of skills locally (updates reflect immediately)
gemini skills link /path/to/refined-agent-skills
```

---

## 🏗️ The Production-Grade Software Lifecycle

This suite follows an **"Orchestrator + Specialized Experts"** architecture. For complex tasks, agents are encouraged to activate multiple skills simultaneously.

### 1. Orchestration (The Framework)
*   **[Orchestrating Software Lifecycle](skills/orchestrating-software-lifecycle/SKILL.md)**: Manages the full 5-phase SDLC (Alignment, Architecture, Implementation, Validation, Submission).
    *   *Triggers*: "fix a bug", "implement a feature", "address PR feedback".

### 2. Strategy & Architecture (The "Why")
*   **[Deep Brainstorming](skills/deep-brainstorming/SKILL.md)**: Divergent thinking using Tree of Thought and Red Teaming during Phase 2.
    *   *Triggers*: "brainstorm", "explore possibilities", "think deeply".
*   **[Maintaining Rigorous Architecture Decisions](skills/maintaining-rigorous-architecture-decisions/SKILL.md)**: Convergent codification of decisions using ADRs. Mandates 3+ alternatives.
    *   *Triggers*: "create an ADR", "architectural decision", "analyze alternatives".

### 3. Implementation Experts (The "Hands")
*   **[Engineering Reliable Software with Python](skills/engineering-reliable-software-with-python/SKILL.md)**: Production-grade Python, Ruff/Black compliance, and Pytest implementation.
    *   *Triggers*: "write a python script", "fix the python code", "test with pytest".
*   **[Engineering Reliable Scripts with Bash](skills/engineering-reliable-scripts-with-bash/SKILL.md)**: Robust shell scripting, ShellCheck compliance, and BATS testing.
    *   *Triggers*: "write a bash script", "fix the shell script", "test with BATS".
*   **[Authoring High-Signal Git Commits](skills/authoring-high-signal-git-commits/SKILL.md)**: Generates descriptive, truth-based commit messages from staged changes.
    *   *Triggers*: "git commit", "prepare commit", "commit changes conventionally".

### 4. Quality & Testing (The "Validation")
*   **[Testing Software Efficiently](skills/testing-software-efficiently/SKILL.md)**: The language-agnostic "Testing Trophy" methodology.
    *   *Triggers*: "testing strategy", "testing trophy", "mocking philosophy".
*   **[Validating User Interfaces](skills/validating-user-interfaces/SKILL.md)**: Enforces POM, signal-based waiting, and user-centric assertions for UI/E2E testing.
    *   *Triggers*: "write a ui test", "e2e testing", "playwright tests".

### 5. Infrastructure & Security (The "Hardening")
*   **[Upholding DevSecOps Standards](skills/upholding-devsecops-standards/SKILL.md)**: Shift-Left security, secret detection, and Local-CI Alignment.
    *   *Triggers*: "security audit", "harden the pipeline", "check for secrets", "local ci alignment".

### 6. Delivery & Collaboration (The "Submission")
*   **[Collaborating on Git Projects](skills/collaborating-on-git-projects/SKILL.md)**: Dual-platform (gh/glab) support, Conventional Commits, and PRB rationale.
    *   *Triggers*: "create a PR", "open a merge request", "PR standards".
*   **[Authoring Effective User Documentation](skills/authoring-effective-user-documentation/SKILL.md)**: Enforces Diátaxis and "Documentation is Code."
    *   *Triggers*: "update the readme", "write documentation", "create a user guide".

### 7. External Research & Discovery
*   **[Investigating External Dependencies](skills/investigating-external-dependencies/SKILL.md)**: Senior-Level library investigation (source code, APIs, best practices).
    *   *Triggers*: "how does this library handle [X]?", "weird error from [Dependency]", "discover the grain".

### 8. Agentic Systems & Architecture
*   **[Engineering Multi-Agent Systems](skills/engineering-multi-agent-systems/SKILL.md)**: The "Standard Model" of agentic architecture, topologies, and cognitive thermodynamics.
    *   *Triggers*: "multi-agent system", "synergistic agents", "agentic architecture", "coordination tax".

---

## 🛠️ Meta-Engineering

*   **[Engineering Agent Skills](skills/engineering-agent-skills/SKILL.md)**: The expert system for designing and scaffolding new agent skills.
    *   *Triggers*: "create a skill", "build a workflow", "design an agent tool".

---

## 🔍 Analysis & Research Utilities

*   **[Deep Reading Agent Skill](skills/deep-reading-agent-skill/SKILL.md)**: Section-by-section analysis and reflection on complex resources.
    *   *Triggers*: "read deeply", "analyze the nuances", "reflect on the spirit".
