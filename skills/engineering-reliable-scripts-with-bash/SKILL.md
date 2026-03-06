---
name: engineering-reliable-scripts-with-bash
description: MANDATORY. DO NOT write, fix, or refactor any shell script without calling 'activate_skill' on 'engineering-reliable-scripts-with-bash' first. This is the REQUIRED PROTOCOL for idiomatic Bash engineering, ShellCheck compliance, and BATS testing implementation. This skill is the MANDATORY EXPERT HAND for any task involving 'writing a bash script', 'fixing a shell script', 'refactoring bash', or 'bash testing'. TRIGGER THIS SKILL IMMEDIATELY for all bash-related development tasks. It enforces robust, error-handled shell script development, ensuring that scripts are production-ready and follow all established project conventions. Use it to prevent 'spaghetti' shell code and ensure system reliability through rigorous verification. Proceeding with Bash modifications without this expert hand constitutes a protocol failure.
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
