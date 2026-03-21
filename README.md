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

## 🏗️ The Mode Matrix Framework (v0.4.1)

This repository follows a **"Mode-Aware Stateful Orchestration"** architecture. It eliminates "Instructional Dilution" by forcing the agent to establish an operational contract before work begins.

### 1. Orchestration & State (The Foundation)
*   **[Selecting Optimal Methodology](skills/selecting-optimal-methodology/SKILL.md)**: The required entrypoint for establishing the task contract (Linear vs. Complex).
    *   *Triggers*: "fix", "implement", "build", "update", "investigate".
*   **[Authoring Artifact-Driven Plans](skills/authoring-artifact-driven-plans/SKILL.md)**: Enforces sharded task memory in `.gemini/skills/current-task-state/`.
    *   *Triggers*: "plan the work", "initialize state", "task memory".

### 2. The 4-Quadrant Engines (The "Dual-Piston" Prowess)
*   **[Executing Linear Task (Supervised)](skills/executing-linear-task/SKILL.md)**: Pattern matching with human sign-off.
*   **[Executing Linear Task (Autonomous)](skills/executing-linear-task/SKILL.md)**: Background worker driven by hard signals.
*   **[Navigating Complex Task (Supervised)](skills/navigating-complex-task-supervised/SKILL.md)**: Architectural sparring with human control.
*   **[Navigating Complex Task (Autonomous)](skills/navigating-complex-task-autonomous/SKILL.md)**: Scientific loop with Reviewer-Proxy gatekeeping.

### 3. Sub-Routines & Convergence
*   **[Conducting Adversarial Convergence](skills/conducting-adversarial-convergence/SKILL.md)**: Orchestrates the iterative debate between the Main Agent and the Reviewer.
*   **[Brainstorming Multiple Options](skills/brainstorming-multiple-options/SKILL.md)**: Mechanical sub-routine for generating exactly 3 technical paths.

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
