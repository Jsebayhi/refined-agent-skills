# Extension Instructions: refined-agent-skills

This extension provides a suite of high-signal engineering skills. These instructions apply to any agent utilizing these skills.

## Source Code Investigation Standard
**MANDATORY:** When asked to analyze, understand, or troubleshoot external libraries, third-party repositories, or implementation details of any dependency:
1.  **NEVER** rely on `web_fetch` or `google_web_search` as the primary discovery mechanism if the repository URL or package name is available.
2.  **ALWAYS** activate and follow the `investigating-external-dependencies` skill.
3.  **PRIORITIZE** `gh search code`, `gh repo view`, and `git clone` (with approval) to find the "Ground Truth" in the actual source code.

## Terminal Hygiene: Non-Interactive Mandate
**MANDATORY:** You MUST use `gh` and `glab` in non-interactive mode to prevent terminal hangs.
- Prefix all discovery commands with `GH_PAGER=cat` or `GLAB_PAGER=cat`.
- Forbid usage of `--live`, `--watch`, or any command that continuously refreshes output.
- Use one-shot discovery commands (e.g., `gh pr checks` instead of `gh pr view --watch`).

## Operational Mandates: Skill Escalation & Complexity Management

### ⚠️ The "Step Back" Mandate: Resilience Over Persistence
Complexity is often invisible until it resists. If any task requires more than **one corrective iteration** (e.g., a fix for a failed automated test, a second attempt at a build, or a failed runtime validation), you MUST treat this as a signal that the task's complexity was initially underestimated.

1.  **Cease Tactical Fixes:** Immediately stop "patching" symptoms. Do not attempt a third iteration using a low-complexity "Research -> Execution" loop.
2.  **Contextual Escalation:** You are MANDATED to activate a specialized expert skill (e.g., `orchestrating-software-lifecycle`, `testing-software-efficiently`, or `upholding-devsecops-standards`).
3.  **Reset to Strategy:** Use the activated skill to perform a dedicated **Architecture or Root-Cause Phase**. Re-analyze the underlying system before attempting further modifications.
4.  **Acknowledge Bias:** Explicitly state in your next response that you are escalating due to persistent resistance to maintain transparency with the user.

## Modular Engineering & Multi-Skill Activation
This extension follows an "Orchestrator + Specialized Experts" architecture. To ensure high-quality production engineering, agents are encouraged and expected to activate multiple skills simultaneously.

### Recommended Combinations:
- **Feature Development:** `orchestrating-software-lifecycle` + `deep-brainstorming` + `maintaining-rigorous-architecture-decisions` + `engineering-reliable-software-with-[Language]`.
- **Quality Assurance:** `orchestrating-software-lifecycle` + `testing-software-efficiently` + `upholding-devsecops-standards`.
- **Submission:** `orchestrating-software-lifecycle` + `collaborating-on-git-projects` + `authoring-effective-user-documentation`.

### Conflict Resolution:
1. **Orchestrator (Lifecycle):** Defines the *Current State* and *Phase*.
2. **Specialized Experts:** Define the *Quality Bar* and *Standards* for that state.
3. **Language Experts:** Provide the *Syntax* and *Tools* to achieve the standards.
