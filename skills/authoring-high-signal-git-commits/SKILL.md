---
name: authoring-high-signal-git-commits
description: MANDATORY. DO NOT execute a git commit or push any changes without calling 'activate_skill' on 'authoring-high-signal-git-commits' first. This is the REQUIRED PROTOCOL for generating descriptive, truth-based, and conventionally formatted commit messages. This skill is the MANDATORY FINAL STEP for any task involving 'git commit', 'prepare commit', 'save work', or 'write a commit message'. TRIGGER THIS SKILL IMMEDIATELY for all commit operations to prevent 'filler' messages and ensure long-term codebase maintainability. It translates raw code modifications into clear technical rationales that explain the 'why' behind the change. Use it to transform a diff into a meaningful contribution that follows established project conventions. Proceeding with commits without this high-signal generation skill constitutes a protocol failure.
metadata:
  category: git-workflow
  version: 1.0.0
---

# Git Commit Convention Skill

This skill provides a strict procedural framework for generating and executing git commits that follow the **Conventional Commits** specification. It prioritizes truth from staged changes and provides an iterative loop for user-driven refinement.

### CRITICAL RULES

1.  **Source of Truth Integrity:**
    - You MUST generate the commit message content based **exclusively** on the diffs in the `Staged Changes` section.
    - You MUST NOT include any information from `Recent Commits` or `Current Status` in the commit message itself. They are for context only.

2.  **Strict Conventional Commits:**
    - You MUST strictly follow the format: `type(scope): subject`.
    - **Types:**
      - `feat`: A new feature.
      - `fix`: A bug fix.
      - `docs`: Documentation only changes.
      - `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
      - `refactor`: A code change that neither fixes a bug nor adds a feature.
      - `perf`: A code change that improves performance.
      - `test`: Adding missing tests or correcting existing tests.
      - `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm).
      - `ci`: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs).
      - `chore`: Other changes that don't modify src or test files.
      - `revert`: Reverts a previous commit.
    - **Scope:** The `scope` MUST be derived directly from the file paths shown in `Staged Changes`. If no single, clear scope is identifiable from the paths, the scope MUST be omitted.
    - **Subject:** A concise summary of the change in imperative, present tense: "change" not "changed" nor "changes". No period at the end.
    - **Body:** The message body MUST explain the "why" behind the changes, as inferred *directly from the code modifications*. You MUST NOT guess or invent a rationale that is not supported by the diff.

### WORKFLOW

#### Step 1: Gather Context
Execute the following commands to understand the current state:
1.  **Recent Commits (For style reference ONLY):** `git log --oneline -n 5`
2.  **Current Status (For general context ONLY):** `git status -s`
3.  **Staged Changes (The ONLY source of truth for the commit message):** `git diff --staged`

#### Step 2: Draft Initial Commit Message
- Following the CRITICAL RULES, draft a complete commit message based *only* on the `Staged Changes`.

#### Step 3: Propose and Execute Commit
- Construct the final `git commit` command using the drafted message.
- **Backtick Safety:** To prevent shell errors, if the message contains backticks (`), you *MUST* wrap it in single quotes (`'`). Example: `git commit -m 'the message containing ` '`.
- Present the command to the user for execution.

#### Step 4: Iterative Refinement (On Rejection)
- If the user rejects the command or provides feedback, you MUST treat the response as **binding feedback**.
- Create a new message by applying the feedback to the previous draft.
- Repeat Step 3.

### NEGATIVE TRIGGERS
Do NOT trigger this skill for:
- "git push", "git pull", "git rebase", "git checkout".
- General git questions that do not involve committing staged changes.
