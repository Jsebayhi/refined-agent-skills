---
name: bash-expert
description: Provides idiomatic Bash scripting standards, ShellCheck compliance, and BATS testing implementation. Enforces robust, error-handled shell scripts for production.
---

# Bash Expert: Idiomatic Shell Scripting

Bash is a powerful but fragile tool. This skill ensures that your shell scripts are robust, error-handled, and verifiable.

## 🚦 The Bash Mandate
*   **ShellCheck Compliance:** All scripts MUST pass `shellcheck` without warnings or errors.
*   **Safety Flags:** Every script MUST start with:
    ```bash
    set -euo pipefail
    ```
    - `set -e`: Exit immediately on error.
    - `set -u`: Exit on undefined variables.
    - `set -o pipefail`: Propagate errors through pipes.

## 🏗️ Robust Scripting Standards
*   **Local Variables:** Use `local` for all variables inside functions.
*   **Quoting:** ALWAYS double-quote variables (e.g., `"$VARIABLE"`) to prevent word splitting and globbing.
*   **Functions over Scripts:** Prefer small, focused functions within a script rather than many small scripts.
*   **Error Handling:** Provide clear, semantic error messages to `stderr` and exit with non-zero status codes on failure.
    ```bash
    error_exit() {
      echo "Error: \$1" >&2
      exit 1
    }
    ```

## 🧪 Testing with BATS (Bash Automated Testing System)
Verifying shell logic is mandatory. Use **BATS** for all unit and integration tests.

### 1. BATS Example
```bash
#!/usr/bin/env bats

@test "Addition works" {
  result=\$(echo 2+2 | bc)
  [ "\$result" -eq 4 ]
}
```

### 2. Testing Principles
*   **Mocking:** Use temporary directories (`mktemp -d`) and mock binaries (by prepending a mock folder to `PATH`) for external commands.
*   **Teardown:** Always use the `teardown` function to clean up temporary files or environment variables.

## 💡 Best Practices
*   **The "Bash vs. Python" Rule:** If a script exceeds 200 lines or requires complex data structures (e.g., JSON parsing, multi-dimensional arrays), you SHOULD refactor it into **Python** or **Go**.
*   **Avoid Subshells:** Prefer built-in Bash features (e.g., `${variable%suffix}`) over calling external commands (e.g., `basename`) inside loops.
