---
name: collaborating-on-git-projects
description: MANDATORY. DO NOT create a pull request, open a merge request, or submit code for review without calling 'activate_skill' on 'collaborating-on-git-projects' first. This is the REQUIRED PROTOCOL for ensuring high-signal repository history and 'No Filler' PR bodies on GitHub (gh) and GitLab (glab). This skill is the MANDATORY GATEWAY for any task involving 'creating a PR', 'opening a Merge Request', 'handling PR feedback', or 'PR standards'. TRIGGER THIS SKILL IMMEDIATELY for all code submissions and collaboration tasks. It focuses on the 'Technical Why' and ensures that every contribution is clearly communicated and grounded in established project conventions. Use it to maintain a high-quality codebase and clear communication with peers. Proceeding with PR/MR creation without this high-signal documentation gateway constitutes a protocol failure.
---

# Standard Git Collaboration & Review

Your commits and PR descriptions are the permanent record of the project's evolution. This skill ensures that history is high-signal, technical, and professional across both **GitHub** and **GitLab**.

## 🚦 The Senior Core Mandates
1.  **Technical Rationale:** Every PR/MR you author MUST provide a high-signal explanation of the "Why." (See below).
2.  **No-Orphan Protocol:** You MUST reply directly to specific reviewer threads using the CLI/API. Never post top-level notes for file-specific feedback.
3.  **Diff Hygiene (Logical Units):** Every commit MUST be a self-contained logical unit. Do not mix authored code with massive formatting or unrelated changes.
4.  **No Amending:** NEVER amend a commit (`git commit --amend`). Keep the full modification history to provide a clear audit trail.

## 📝 PR Creation (Conventional Commits)
Use `type(scope): description` for titles.
*   **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
*   **PRB Body Template (Wrap at 72 chars):**
    - **No Filler:** NEVER use "This PR...", "I updated...", or "I'm fixing...".
    - **Problem:** The specific failure mode or limitation being addressed.
    - **Reasoning:** The technical justification for the chosen solution.
    - **Benefit:** The functional outcome or improvement.

## 🛑 Non-Interactive Mandate (Senior Efficiency)
To prevent terminal hangs and blocking the user, you MUST strictly adhere to non-interactive CLI usage:
*   **Disable Pagers:** Prefix all discovery commands with `GH_PAGER=cat` or `GLAB_PAGER=cat` (e.g., `GH_PAGER=cat gh pr view --comments`).
*   **No Blocking/Watch Flags:** NEVER use `--live`, `--watch`, or any flag that causes the command to continuously monitor or refresh the output (e.g., `glab ci status --live` is FORBIDDEN).
*   **One-Shot Discovery:** Use commands that return immediately. For CI status:
    - **GitHub:** `GH_PAGER=cat gh pr checks`
    - **GitLab:** `GLAB_PAGER=cat glab ci status` (without `--live`) or `glab ci view` (one-shot).

## 🛠️ Dual-Platform Cheat Sheet

### GitHub (`gh`)
*   **Discovery:** `GH_PAGER=cat gh pr list`, `GH_PAGER=cat gh pr view --comments`
*   **Creation:** `gh pr create --title "..." --body "..."`
*   **Feedback:** `gh pr comment --body "..."` (Top-level) or use `gh api` for specific threads.

### GitLab (`glab`)
*   **Discovery:** `GLAB_PAGER=cat glab mr list`, `GLAB_PAGER=cat glab mr view --comments`
*   **Creation:** `glab mr create --title "..." --description "..."`
*   **Threaded Reply:** 
    1. Fetch Discussions: `glab api projects/:id/merge_requests/:iid/discussions`
    2. Post Reply: `glab api -X POST projects/:id/merge_requests/:iid/discussions/:disc_id/notes -f body="Done."`

## 💡 Examples & Best Practices

### Good (High Signal)
```markdown
Reinforce the developer workflow and improve PR quality.

- Problem: Lack of standardized feedback loops leads to "orphan" comments.
- Reasoning: Codifying the threaded reply protocol ensures reviewer alignment.
- Benefit: Consistent high-signal repository history and rigorous engineering.

Refs #104
```

### Bad (Low Signal)
```markdown
I have updated the skill to make it better. I added some stuff about PRs.
I also changed the GEMINI.md file. This PR fixes the issue.
```

*   **Micro-Commits:** Prefer small, atomic commits that correspond to specific steps in your strategy.
*   **Respond to Reviewers:** You MUST respond to EVERY review comment, stating if you agree (and have addressed it) or disagree (with technical rationale).
