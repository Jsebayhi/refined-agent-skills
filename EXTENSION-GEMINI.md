# Extension Instructions: refined-agent-skills

This extension provides a suite of high-signal engineering skills. These instructions apply to any agent utilizing these skills.

## Source Code Investigation Standard
**MANDATORY:** When asked to analyze, understand, or troubleshoot external libraries, third-party repositories, or implementation details of any dependency:
1.  **NEVER** rely on `web_fetch` or `google_web_search` as the primary discovery mechanism if the repository URL or package name is available.
2.  **ALWAYS** activate and follow the `investigating-external-dependencies` skill.
3.  **PRIORITIZE** using platform-specific specialized skills (`interacting-with-github` or `interacting-with-gitlab`) and `git clone` (with approval) to find the "Ground Truth" in the actual source code.

## Terminal Hygiene: Non-Interactive Mandate
**MANDATORY:** You MUST use `gh` and `glab` in non-interactive mode to prevent terminal hangs.
- **GitHub (`gh`):** You **MUST** use the `interacting-with-github` skill. Its MCP tools automatically handle environment hygiene (`GH_PAGER=cat`) and non-interactive enforcement.
- **GitLab (`glab`):** You **MUST** use the `interacting-with-gitlab` skill. Its MCP tools automatically handle environment hygiene (`GLAB_PAGER=cat`) and non-interactive enforcement.
- **Forbid usage** of `--live`, `--watch`, or any command that continuously refreshes output.
- **Use one-shot discovery commands** (e.g., `gh pr checks` instead of `gh pr view --watch`).

## Operational Mandates: Skill Escalation & Complexity Management

### 🏗️ The Mode Matrix Mandate
**MANDATORY:** You MUST establish the operational contract before executing any task.
1.  **Entrypoint:** Always activate **`selecting-optimal-methodology`** first.
2.  **State Management:** Always activate **`authoring-artifact-driven-plans`** to initialize persistent memory.

### ⚠️ The "Step Back" Mandate: Resilience Over Persistence
Complexity is often invisible until it resists. If any task requires more than **one corrective iteration** (e.g., a fix for a failed automated test, a second attempt at a build, or a failed runtime validation), you MUST treat this as a signal that the task's complexity was initially underestimated.

1.  **Cease Tactical Fixes:** Immediately stop "patching" symptoms.
2.  **Contextual Escalation:** You are MANDATED to return to **`selecting-optimal-methodology`** and upgrade the task to **Complex**.
3.  **Reset to Strategy:** Use the **`navigating-complex-task-*`** engines to perform a dedicated **Scientific Loop** (Hypothesis -> Solution -> Implementation).
4.  **Acknowledge Bias:** Explicitly state in your next response that you are escalating due to persistent resistance.

## Modular Engineering & Multi-Skill Activation
This extension follows an "Orchestrator + Specialized Experts" architecture. To ensure high-quality production engineering, agents are encouraged and expected to activate multiple skills simultaneously.

### The Mode Matrix Combinations:
- **Linear Supervised:** `selecting-optimal-methodology` -> `executing-linear-task` + `conducting-adversarial-convergence`.
- **Linear Autonomous:** `selecting-optimal-methodology` -> `executing-linear-task` + `conducting-adversarial-convergence`.
- **Complex Supervised:** `selecting-optimal-methodology` -> `navigating-complex-task-supervised` + `brainstorming-multiple-options` + `conducting-adversarial-convergence`.
- **Complex Autonomous:** `selecting-optimal-methodology` -> `navigating-complex-task-autonomous` + `brainstorming-multiple-options` + `conducting-adversarial-convergence`.

### Conflict Resolution:
1. **Orchestrator (Router/Engine):** Defines the *Current State* and *Mode*.
2. **Specialized Experts:** Define the *Quality Bar* and *Standards* for that state.
3. **Language Experts:** Provide the *Syntax* and *Tools* to achieve the standards.
