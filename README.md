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

## 🏗️ The Mode Matrix Framework

This repository follows a **"Mode-Aware Stateful Orchestration"** architecture. It eliminates "Instructional Dilution" by forcing the agent to establish an operational contract before work begins.

### 1. Orchestration & State (The Foundation)
*   **[Orchestrating Decision Router](skills/orchestrating-decision-router/SKILL.md)**: The required entrypoint for establishing the task contract (Linear vs. Complex).
    *   *Triggers*: "fix", "implement", "build", "update", "investigate".
*   **[Authoring Artifact-Driven Plans](skills/authoring-artifact-driven-plans/SKILL.md)**: Enforces disk-based task memory in `.gemini/state/`.
    *   *Triggers*: "plan the work", "initialize state", "task memory".

### 2. The Engines (The "Dual-Piston" Prowess)
*   **[Executing Linear Tasks](skills/executing-linear-tasks/SKILL.md)**: High-velocity "Fast Track" for predictable work.
    *   *Triggers*: "fast path", "pattern implementation", "predictable task".
*   **[Navigating Complex Implementations](skills/navigating-complex-implementations/SKILL.md)**: The Robust Scientific Loop for exploration and uncertainty.
    *   *Triggers*: "complex feature", "obscure bug", "exploration loop".
*   **[Brainstorming Multiple Options](skills/brainstorming-multiple-options/SKILL.md)**: Mechanical sub-routine for generating exactly 3 technical paths.
    *   *Triggers*: "generate hypotheses", "solution strategies", "3-option path".

### 3. The Convergence Layer (The Filter)
*   **[Conducting Adversarial Convergence](skills/conducting-adversarial-convergence/SKILL.md)**: Orchestrates the iterative debate between the Main Agent and the Reviewer.
    *   *Triggers*: "converge with reviewer", "pre-human filter", "logic/quality pass".

---

## 🛠️ Specialized Experts

### 1. Strategy & Architecture
*   **[Deep Brainstorming](skills/deep-brainstorming/SKILL.md)**: Standalone creative partner for free-form Socratic design sessions.
*   **[Maintaining Rigorous Architecture Decisions](skills/maintaining-rigorous-architecture-decisions/SKILL.md)**: Convergent codification of decisions using ADRs.

### 2. Implementation Experts
*   **[Engineering Reliable Software with Python](skills/engineering-reliable-software-with-python/SKILL.md)**: Python excellence (Ruff/Black/Pytest).
*   **[Engineering Reliable Scripts with Bash](skills/engineering-reliable-scripts-with-bash/SKILL.md)**: Robust shell scripting (ShellCheck/BATS).
*   **[Authoring High-Signal Git Commits](skills/authoring-high-signal-git-commits/SKILL.md)**: High-fidelity, truth-based commit messages.

### 3. Quality & Security
*   **[Testing Software Efficiently](skills/testing-software-efficiently/SKILL.md)**: The "Testing Trophy" methodology.
*   **[Validating User Interfaces](skills/validating-user-interfaces/SKILL.md)**: POM-based UI and E2E verification.
*   **[Upholding DevSecOps Standards](skills/upholding-devsecops-standards/SKILL.md)**: Security-first engineering and Local-CI Alignment.

### 4. Delivery & Collaboration
*   **[Collaborating on Git Projects](skills/collaborating-on-git-projects/SKILL.md)**: High-signal PR/MR lifecycle management (GitHub/GitLab).
*   **[Interacting with GitHub](skills/interacting-with-github/SKILL.md)** / **[Interacting with GitLab](skills/interacting-with-gitlab/SKILL.md)**: Production-grade platform management via MCP.
*   **[Authoring Effective User Documentation](skills/authoring-effective-user-documentation/SKILL.md)**: Diátaxis-based user guides and READMEs.

### 5. Research & Meta
*   **[Investigating External Dependencies](skills/investigating-external-dependencies/SKILL.md)**: Source-first library discovery.
*   **[Deep Reading Agent Skill](skills/deep-reading-agent-skill/SKILL.md)**: High-fidelity resource analysis.
*   **[Engineering Agent Skills](skills/engineering-agent-skills/SKILL.md)**: The expert system for building new skills.
