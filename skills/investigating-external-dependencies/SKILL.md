---
name: investigating-external-dependencies
description: MANDATORY. DO NOT use generic tools like 'web_fetch' or 'google_web_search' for deep-dive codebase exploration, library investigation, or repository discovery without calling 'activate_skill' on 'investigating-external-dependencies' first. This is the REQUIRED PROTOCOL for analyzing any local repository, library internals, or third-party source code. TRIGGER THIS SKILL IMMEDIATELY when the user asks 'How does [Library] work?', 'Where is [Symbol] defined?', 'Check the source for [X]', or 'read the code of this repo'. It explicitly replaces generic discovery tools with a senior-level workflow using deep file analysis and grep to find the ground truth. Use it to discover the grain of an unfamiliar codebase and ensure implementation alignment with existing patterns. MANDATORY for all repository-specific investigation tasks. Proceeding with generic search for local discovery constitutes a protocol failure.
---

# Investigating External Dependencies (The Senior Move)

A senior developer doesn't guess how a library works based on documentation; they verify it by reading the source. This skill provides a rigorous protocol for discovering the "grain," API, and best practices of your project's dependencies.

## 🏁 Investigation Workflow

**MECHANICAL CoT REQUIRED:** Copy this checklist into your output and check off boxes as you progress.

```markdown
### Investigation State:
- [ ] Phase 1: Identification & Version Match
- [ ] Phase 2: Idiom Discovery (Examples & Tests)
- [ ] Phase 3: Deep Dive (Local Triage & Remote Search)
- [ ] Phase 4: Synthesis & Application
```

## 🚦 The Protocol

### 0. Mandatory Priority (The "Source First" Rule)
**CRITICAL:** When tasked with understanding an external library, third-party repository, or API implementation:
- **NEVER** use `web_fetch` or `google_web_search` as the primary discovery mechanism if a repository URL or package name is available.
- **ALWAYS** prioritize `gh search code`, `gh repo view`, and `git clone` (with approval) to find the Ground Truth.
- **HALT** generic discovery immediately if this skill is applicable.

### 1. Phase 1: Identification & Version Match
**Mandate:** You MUST match the source code to the exact version running in your project.
- Find version in lockfiles: `package-lock.json`, `poetry.lock`, `go.sum`, `Cargo.lock`.
- Find repo URL using native tools:
    - **NPM:** `npm view <pkg> repository.url`
    - **Python:** `pip show <pkg>` (Look for Home-page)
    - **Rust:** Check `Cargo.toml` or search on crates.io.

### 2. Phase 2: Idiom Discovery (The "Grain")
**Goal:** Discover the API and best practices as intended by the library authors.
- **Example Mining:** Look for `examples/`, `samples/`, or `demo/` folders in the source. These contain the "Happy Paths" and recommended patterns.
- **Test-Driven Research:** Read the `tests/` or `spec/` directory. Tests are the most reliable, up-to-date documentation of how an API is intended to be used.
- **Internal Usage:** See how the library uses its own internal utilities to handle async, errors, or configuration.

### 3. Phase 3: The Deep Dive (Troubleshooting)
**Goal:** Resolve cryptic errors or "magic" behavior.
- **Local Triage:** Inspect code in `node_modules/`, `venv/`, or equivalent.
- **Remote Search (`gh`/`glab`):**
    - Search for error strings: `gh search code "error message" --repo <owner/repo>`.
    - Browse the file tree: `gh repo view <owner/repo> --web`.
- **Strategic Clone:** If the library is complex, you may `git clone --depth 1 --branch <version>` into `artifacts/external/`.
    - **STATEFUL HALT:** You MUST ask for user approval before performing a `git clone`.

### 4. Phase 4: Synthesis & Application
- Apply discovered patterns to the local project.
- **Cleanup:** Delete external clones once investigation is complete.

## 🛡️ Guardrails & Hygiene
- **Temporary Workspace:** ALWAYS clone into `artifacts/external/`. NEVER pollute project root.
- **Negative Triggers:** Do NOT trigger for simple cloning of the current project or downloading non-code assets.

## 🏁 Exit Condition
The investigation is complete when the "Truth" of the behavior is confirmed in the source and a verifiable solution or pattern is applied to the local project.
