---
name: testing-software-efficiently
description: Teaches the "Testing Trophy" methodology and language-agnostic testing strategies. Enforces high confidence-to-cost ratios, boundary mocking, and contract testing.
---

# Standard Testing Philosophy: The Testing Trophy

We prioritize tests that provide the highest confidence-to-cost ratio. This philosophy ensures the codebase remains maintainable and reliable without the burden of brittle test suites.

## 🏆 The Testing Trophy
Follow this hierarchy when designing your verification strategy:

1.  **Static Analysis (The Base):** Use linters and type checkers for instant feedback.
2.  **Integration Tests (The Bulk):** The core of the suite. Verify service interfaces, system boundaries, and the glue between modules.
3.  **Unit Tests (The Precision):** Focus on complex logic, edge cases, and deterministic transformations.
4.  **E2E / UI Tests (The Cap):** High confidence, but expensive. Only for critical "Happy Paths" and user flows.

## 🎭 Mocking & Boundary Philosophy
*   **Mock at the Boundary:** Only mock slow, non-deterministic, or dangerous external systems (e.g., Auth services, Payment gateways, real file systems in performance-critical paths).
*   **Favor Realism:** Do not mock internal services. Let the code execute through the full stack whenever possible.
*   **Golden Files/Snapshots:** For complex outputs, use "Golden Data" snapshots from the real system instead of manually writing mock strings. This prevents mocks from drifting out of sync with reality.

## 📝 Contract Testing
Enforce JSON Schemas or API contracts for all service interactions. Verify that any mocks used in testing match the actual schemas to prevent "Silent Breakage."

## 🧠 Test Qualities
*   **Atomicity:** Each test verifies a single logical outcome.
*   **Synchronization:** Use polling/probes to ensure services are ready before starting tests (avoid "Sleep/Wait" race conditions).
*   **Clean Slate:** Every test starts with a fresh, predictable environment.
*   **Parallel Readiness:** NEVER mutate global shared state. Use local overrides or scoped fixtures.

## 🛡️ Verification via Sub-Agent: The "Fresh Eye" Review
For all significant code changes, you MUST leverage the **Adversarial Reviewer** sub-agent to perform an independent audit of your work.

### When to Invoke
- Before submitting a feature or bug fix.
- When working on security-critical paths (Auth, Permissions, Encryption).
- When a change affects multiple files or core architectural layers.

### How to Invoke
Call the  tool with a detailed query containing:
1.  **Original Objective:** The task you were assigned.
2.  **Implementation Summary:** A concise explanation of the changes you made.
3.  **The Diff:** The exact code changes (use `git diff` or describe them clearly).

### Integration Goal
Use the sub-agent's feedback to refine your implementation. If the sub-agent identifies a risk or edge case you missed, you MUST address it before completing the task. This eliminates "Coder's Bias" and ensures a high-signal contribution.
