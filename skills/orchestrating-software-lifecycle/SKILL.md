---
name: orchestrating-software-lifecycle
description: Manages the full software development lifecycle (SDLC) through a strict, high-fidelity 5-phase workflow: Alignment, Architecture, Implementation, Validation, and Submission. This skill is the MANDATORY ORCHESTRATOR for starting any new feature, fixing a bug, or performing a comprehensive code review. TRIGGER THIS SKILL IMMEDIATELY when the user says "start a task", "implement a feature", "fix a bug", "work on a ticket", "perform a code review", "help me with this project", or "what's next?". Use it to prevent "context drift" and ensure every task follows a rigorous engineering path from initial alignment to final verification. DO NOT proceed with implementation until this skill has established the Phase 1 Alignment. It serves as the primary gateway for ensuring that all development is grounded in clear objectives and verified architectural strategies.
---

# Standard Software Engineering Lifecycle

You are the project engineer. You MUST strictly follow the **Research -> Strategy -> Execution** lifecycle. Do not skip phases or take shortcuts.

## 🏁 Re-Entry & Starting Mid-Task
If you are starting a session where work is already in progress (e.g., addressing PR feedback):
1.  **Identify the State:** Use `git status` and check for open PRs/MRs.
2.  **Re-Enter:** State your entry point (e.g., "Current Phase: 5. Submission & Peer Review (Addressing Feedback)").
3.  **Read the Room:** Read all existing PR comments/reviews before making any changes.

## 🛡️ Workflow Enforcement
**The Workflow is the Law.** All tasks must proceed through the phases defined below.
*   **No Skipping:** Never jump to implementation before Alignment and Architecture are formally completed.
*   **Explicit State:** Always prefix your intent with the current workflow phase (e.g., "Current Phase: 1. Alignment").
*   **Evidence-Based Transitions:** Moving between phases requires evidence (e.g., an issue comment, a drafted ADR, or passing tests).

## 🔍 Clarity & Ambiguity Protocol
Avoid errors due to unspoken assumptions by applying this protocol:
*   **Low Ambiguity:** State key assumptions and move to Strategy.
*   **Moderate Ambiguity:** Engage in focused clarification first (ask 1-3 targeted questions).
*   **High Ambiguity:** Explicitly state assumptions and **WAIT for user validation** before proceeding.

## 🤖 Session Mode Protocols
*   **Interactive Mode:** Mandatory "Wait-for-Approval" at the end of Phase 1 and Phase 2. Use "Radical Candor"—challenge the user and propose alternatives.
*   **Autonomous Mode:** Do not block. Document your self-alignment/architecture in the project's tracking system (Issue/ADR) and proceed immediately. If risk is extreme, halt and log a critical intervention request.

## 🚦 Strict Workflow Mandate
1.  **Announcement:** At the start of every task or major step, you MUST explicitly state which Phase you are currently in (e.g., "Current Phase: 1. Alignment").
2.  **Sequential Progress:** You MUST complete each phase in order. Do not move to Architecture without Alignment, or Implementation without an approved Strategy/ADR.
3.  **Discovery:** Before acting, you MUST identify the project's specific protocol (test runners, build tools, and **Git Platform: GitHub or GitLab**).
4.  **Verification:** You MUST verify your changes through automated tests before proceeding to Phase 5. If no tests exist, you MUST create a reproduction script.
5.  **Documentation:** You MUST update the project's documentation (`GEMINI.md`, `README.md`, or component docs) **simultaneously with code changes** in the same commit/PR.
6.  **Diff Hygiene:** You MUST be extremely careful when using replacement tools to avoid accidental deletions of existing content. Always verify your `git diff` before committing.

## 🧠 Mental Checklist
- [ ] **Alignment:** Is the Goal/Problem clearly defined through Research?
- [ ] **Architecture:** Are at least 3 alternatives analyzed, documented in the ADR, and reasons for rejection clearly defined?
- [ ] **Implementation:** Are docs and code updated?
- [ ] **Validation:** Did the project's test suite pass?
- [ ] **Submission:** Is the PR body formatted for a squash commit (Why + Issue) following the PRB framework?
- [ ] **Feedback:** Have all review comments been addressed and responded to via threaded replies?

## 🚀 The Workflow

### 1. Alignment (Problem Space / Research)
👉 [Read Phase 1 Guide](phases/01_alignment.md)
*   **Action (External Discovery):** If the task involves understanding or troubleshooting external libraries or repositories, you **MUST** activate and follow the `investigating-external-dependencies` skill. **DO NOT** use generic search tools (`web_fetch`, `google_web_search`) as your primary source-level discovery mechanism.

### 2. Architecture (Solution Space / Strategy)
👉 [Read Phase 2 Guide](phases/02_architecture.md)
*   **Action:** If high-ambiguity, activate `deep-brainstorming`.
*   **Action:** Document decisions using `maintaining-rigorous-architecture-decisions`.

### 3. Implementation (Execution)
👉 [Read Phase 3 Guide](phases/03_implementation.md)
*   **Action:** Consult the relevant `engineering-reliable-[software/scripts]-with-[Language]` skill.

### 4. Validation (Verification & Cleanup)
👉 [Read Phase 4 Guide](phases/04_validation.md)
*   **Mandate:** Identify and run the project's specific test runner.
*   **Local-CI Parity:** Strive to run the full validation suite locally before pushing. Look for `Makefiles`, `Taskfiles`, or `local-ci` scripts that mirror the remote pipeline.
*   **Cleanup:** Remove unneeded changes and simplify code before submission.

### 5. Submission & Peer Review (Delivery & Iteration)
👉 [Read Phase 5 Guide](phases/05_submission.md)
*   **Action:** Use `collaborating-on-git-projects` for PR creation and feedback loops.
*   **Iteration:** This phase is a loop. Address feedback, push updates, and reply to threads until the PR is merged.

## 🛠️ Project Discovery Cheat Sheet
| Task | Typical Discovery Files |
| :--- | :--- |
| **Project Context** | `GEMINI.md`, `README.md`, `ARCHITECTURE.md` |
| **Build/Test** | `Makefile`, `package.json`, `Cargo.toml`, `pyproject.toml` |
| **Dependencies** | `requirements.txt`, `package-lock.json`, `go.mod` |
| **CI/CD** | `.github/workflows/`, `.gitlab-ci.yml`, `jenkinsfile` |

## 📚 References
*   `maintaining-rigorous-architecture-decisions`: ADR & Strategy standards.
*   `testing-software-efficiently`: The Testing Trophy & Mocking principles.
*   `collaborating-on-git-projects`: Commits & PR Standards.
*   `authoring-effective-user-documentation`: External doc standards (Diátaxis).
*   `upholding-devsecops-standards`: Security & Hardening mandates.
*   `investigating-external-dependencies`: Senior-Level library investigation (source code, APIs, best practices).
