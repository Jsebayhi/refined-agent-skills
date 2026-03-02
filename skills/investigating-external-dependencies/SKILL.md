---
name: investigating-external-dependencies
description: Enforces a "Senior-Level" workflow for investigating library source code, APIs, and best practices. Use when encountering cryptic errors, unfamiliar APIs, or "magic" behavior in third-party frameworks. Mandates using `gh`, `glab`, and `git clone` to find the "Truth" in the source code.
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

### 1. Phase 1: Identification & Version Match
**Mandate:** You MUST match the source code to the exact version running in your project.
- Find version in lockfiles: `package-lock.json`, `poetry.lock`, `go.sum`, `Cargo.lock`.
- Find repo URL: `npm view <pkg> repository.url`, `pip show <pkg>`, etc.

### 2. Phase 2: Idiom Discovery (The "Grain")
**Goal:** Discover the API and best practices as intended by the library authors.
- **Example Mining:** Look for `examples/`, `samples/`, or `demo/` folders in the source. These contain the "Happy Paths" and recommended patterns.
- **Test-Driven Research:** Read the `tests/` or `spec/` directory. Tests are the most reliable, up-to-date documentation of how an API is intended to be used.
- **Internal Usage:** See how the library uses its own internal utilities to handle async, errors, or configuration.

### 3. Phase 3: The Deep Dive (Troubleshooting)
**Goal:** Resolve cryptic errors or "magic" behavior.
- **Local Triage:** Inspect code in `node_modules/`, `venv/`, or equivalent. This is the fastest way to see the actual executing code.
- **Remote Search (`gh`/`glab`):**
    - Search for error strings or internal function names: `gh search code "error message" --repo <owner/repo>`.
    - Check Issues/PRs for context on the specific code path.
- **Strategic Clone:** If the library is complex or local files are bundled, `git clone --depth 1 --branch <version>` into `artifacts/external/` for full-project `grep` and navigation.

### 4. Phase 4: Synthesis & Application
- Apply discovered patterns to the local project.
- **Cleanup:** Delete external clones once investigation is complete.

## 🛡️ Guardrails & Hygiene
- **Temporary Workspace:** ALWAYS clone into `artifacts/external/`. NEVER pollute project root.
- **Negative Triggers:** Do NOT trigger for simple cloning of the current project or downloading non-code assets.

## 🏁 Exit Condition
The investigation is complete when the "Truth" of the behavior is confirmed in the source and a verifiable solution or pattern is applied to the local project.
