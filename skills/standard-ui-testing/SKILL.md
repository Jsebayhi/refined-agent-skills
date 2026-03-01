---
name: standard-ui-testing
description: Enforces Page Object Model (POM), signal-based waiting, and user-centric assertions for UI and E2E testing. Focused on Playwright/Cypress/Selenium reliability.
---

# Standard UI Testing & E2E Reliability

UI tests are the most valuable End-to-End (E2E) tests. They verify that the system correctly fulfills the user's intent. This skill ensures your UI tests are fast, robust, and maintainable.

## 🏆 The UI Testing Mandate
For any user-facing feature, **comprehensive UI test coverage is mandatory**. While unit and integration tests ensure component reliability, only a full UI test verifies the final user experience.

## 🏗️ Page Object Model (POM) & Composition
*   **Decoupling:** Test files should contain user intent (e.g., `user.login("admin")`); Page Objects should contain implementation details (e.g., `page.click("#login-btn")`).
*   **Composition over God Objects:** Split the POM into modular, nested components (e.g., `HubPage` containing a nested `LaunchWizard`).
*   **Functional Interface:** Tests interact via these components: `hub.wizard.launch()`.

## 🎭 Deterministic Interactivity
*   **Signal-Based Waiting:** NEVER use static timers (e.g., `time.sleep(5)`).
*   **Wait for State:** Wait for specific UI state changes (visibility, text, counts) to ensure tests are fast and robust.
*   **Locators:** Use scoped locators: `page.locator("#container").get_by_text(...)`.

## 🔍 Observability & Zero-Noise Policy
*   **Rich Artifacts:** Enable automatic failure tracing (screenshots, video, console logs).
*   **Zero-Console-Error:** UI tests MUST fail if unexpected errors are detected in the browser console, even if all assertions pass.

## 🧼 State Management & Resilience
*   **Persistence Reset:** Explicitly clear client-side storage (`localStorage`, cookies) between tests.
*   **Stable Entry Points:** Every test MUST start from a known stable URL to prevent cascading failures.
*   **Retries:** Use framework-level retries (e.g., `pytest-rerunfailures`) in CI to mitigate browser flakiness.

## 🧠 Semantic Assertions
*   **User-Centric Assertions:** Don't test internal IDs or CSS properties. Test what the user sees (e.g., `hub.expect_active_session("proj1")`).
*   **Domain Helpers:** Add domain-specific assertion methods to your POM for cleaner test code.
