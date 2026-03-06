---
name: engineering-reliable-software-with-python
description: Provides idiomatic Python engineering standards, Ruff/Black compliance, and Pytest implementation for building high-fidelity software. This skill is the MANDATORY EXPERT HAND for any task involving "writing python," "fixing python code," "refactoring python," or "pytest implementation." TRIGGER THIS SKILL IMMEDIATELY when the user asks to "write a python script", "fix the python code", "refactor this python", "test with pytest", or "Ruff compliance". It enforces high-fidelity Python development, ensuring that code is type-safe, modular, and follows all established project conventions. MANDATORY for all python-related tasks to prevent "quick and dirty" code and ensure long-term maintainability through rigorous verification.
---

# Python Expert: Production-Grade Python

Python is the backbone of many services. This skill ensures your Python code is maintainable, type-safe, and production-ready.

## 🐍 The Pythonic Mandate
*   **Type Safety:** You MUST use type hints for all function parameters and return values.
*   **Linting & Style:** Code must pass `ruff` linting and follow PEP 8. Use `black` or `ruff format` for deterministic formatting.
*   **Dependency Pinning:** All dependencies MUST be pinned to specific versions (e.g., `flask==3.0.0`) in a `requirements.txt` or `pyproject.toml`.

## 🏗️ Architectural Patterns
*   **App Factory:** Use the Application Factory pattern for web services to enable easy testing and prevent circular imports.
*   **Service Layer:** Keep business logic in pure Python modules (`app/services/`) that do not depend on the web framework.
*   **Subprocess Safety:** Always use list-based arguments `["cmd", "arg"]` instead of `shell=True`.
*   **Fail Fast Config:** Use a central `Config` class to load and validate environment variables at startup.

## 🧪 Testing with Pytest
Verify your logic using the `pytest` ecosystem.

### 1. Toolchain
*   **Runner:** `pytest` with `pytest-mock`.
*   **Parallelism:** Use `pytest-xdist` for large suites.
*   **Coverage:** Maintain a **>90% coverage** threshold using `pytest-cov`.

### 2. Testing Principles
*   **Mocking:** Use the `mocker` fixture. The live HTTP server should run in the same process memory as the test runner for easier mocking.
*   **Fixtures:** Use `conftest.py` for shared fixtures. Prefer `tmp_path` for filesystem testing.
*   **Monkeypatching:** Use the `monkeypatch` fixture for thread-safe configuration overrides.

## 💡 Best Practices
*   **Logging Hygiene:** Use a `suppress_logs` fixture to silence expected errors during tests.
*   **Async Handling:** If using `playwright-python`, prefer the synchronous API (`playwright.sync_api`) for test simplicity unless async is explicitly required.
