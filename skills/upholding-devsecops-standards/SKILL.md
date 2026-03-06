---
name: upholding-devsecops-standards
description: MANDATORY. DO NOT modify environment variables, handle secrets, write Dockerfiles, or update CI/CD pipelines without calling 'activate_skill' on 'upholding-devsecops-standards' first. This is the REQUIRED PROTOCOL to enforce production-grade security hardening and secret detection. This skill is the MANDATORY SECURITY SENTINEL for any task involving API keys, 'is this safe to commit?', 'harden the security', or 'set up CI/CD'. TRIGGER THIS SKILL IMMEDIATELY for repository audits and pipeline engineering tasks. Use it to implement 'Shift-Left' security, performing exhaustive audits for leaked credentials and ensuring that no sensitive data ever enters the version control system. MANDATORY for all security audits and infrastructure-as-code modifications. Proceeding without activation constitutes a protocol failure.
---

# Standard DevSecOps & Security Hardening

Security is not a final step; it is integrated into every phase of the lifecycle. This skill ensures that your code and CI/CD pipelines are hardened and free of common vulnerabilities.

## 🔐 The "No Secrets" Mandate
*   **Prevent, Don't React:** You MUST never commit secrets, API keys, or sensitive credentials to the repository history.
*   **Secret Detection:** Before every commit, use a tool like `trufflehog`, `gitleaks`, or the project's own secret-scanning utility.
*   **Environment Variables:** All secrets MUST be managed via environment variables or a dedicated secret manager.

## 🛡️ Dependency Hardening
*   **Zero-Debt Suppressions:** Never suppress a vulnerability to simply "get it done." Every suppression MUST be justified and time-bound (e.g., 90-day TTL) directly within the project's ignore file (e.g., `.trivyignore`).
*   **Auditing:** Regularly audit dependencies (e.g., `npm audit`, `pip-audit`, `cargo audit`).
*   **Lockfiles:** You MUST always commit lockfiles (`package-lock.json`, `Cargo.lock`, `poetry.lock`) to ensure deterministic and verifiable builds.
*   **Minimum Versioning:** Avoid using "latest" or wide version ranges (`*`). Use specific, pinned versions when security is paramount.

## 🏗️ Infrastructure & CI/CD Integrity
*   **Local-CI Alignment:** You MUST strive to design CI/CD pipelines where the core steps (build, lint, test, scan) are runnable locally by developers. This allows agents to "catch errors early" before pushing code. Use tools like `Makefiles`, `Taskfiles`, or local runner emulators (e.g., `act` for GitHub Actions) to ensure parity between local and remote environments.
*   **Least Privilege:** Ensure CI/CD roles and service accounts have the minimum permissions necessary to perform their tasks.
*   **Verifiable Pipelines:** Use checksums or signed hashes for all external artifacts or binaries downloaded during a build.
*   **Infrastructure as Code (IaC):** Treat IaC files (e.g., Terraform, Dockerfiles) with the same rigor as application code. Perform static analysis on them (e.g., `checkov`, `hadolint`).

## 💡 Best Practices
*   **Shift Left:** Address security concerns as early as Phase 1 (Alignment) and Phase 2 (Architecture). If a decision introduces a security risk, it MUST be documented in an ADR.
*   **Mandatory Scanning:** If the project provides a "scan" command (e.g., `make scan`), it MUST be run during Phase 4 (Validation).
