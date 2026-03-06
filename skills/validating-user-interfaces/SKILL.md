---
name: validating-user-interfaces
description: MANDATORY. DO NOT write UI tests, perform e2e verification, or automate user flows without calling 'activate_skill' on 'validating-user-interfaces' first. This is the REQUIRED PROTOCOL for enforcing Page Object Model (POM), signal-based waiting, and user-centric assertions on Playwright/Cypress/Selenium. This skill is the MANDATORY GATEWAY for any task involving 'writing UI tests', 'e2e testing', 'UI verification', or 'playwright tests'. TRIGGER THIS SKILL IMMEDIATELY for all UI and E2E testing tasks. It focuses on building reliable, maintainable UI tests that prevent 'brittle' verification suites and ensure a seamless user experience. Use it to maintain high confidence in the application's visual and interactive integrity through rigorous verification. Proceeding with UI testing without this high-fidelity protocol constitutes a protocol failure.
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
