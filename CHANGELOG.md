# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-19

### Added
- **Dual-Platform MCP Ecosystem**: Established production-grade GitHub and GitLab MCP servers with total tool parity (38 tools each).
- **GitHub MCP Server**: Implemented a high-fidelity GitHub MCP server and skill (`interacting-with-github`) mirroring the GitLab implementation.
- **Semantic Naming Standard**: Introduced explicit, deterministic parameter names (e.g., `pull_request_id`, `mr_id`, `project_id`) across all platform tools.
- **Instructional Duality**: Introduced `EXTENSION-GEMINI.md` for user-facing instructions, separating them from internal maintenance docs (`GEMINI.md`) via `contextFileName` in `gemini-extension.json`.
- **Precision Feedback**: Implemented high-fidelity multi-line comment support via `start_line` (GitHub) and `line_range` (GitLab) payloads.
- **Security & Quality Auditing**: Integrated automated security checks (`list_vulnerabilities`) and deep-dive review tools (`get_pull_request_details` with full context).
- **Resilient Execution Engine**: Transitioned all MCP interactions to a robust `spawnSync` engine to eliminate shell-quoting and argument-splitting errors.
- **MR/PR Lifecycle**: Full support for reviewer and submitter lifecycles, including auto-merge, thread management, and pipeline monitoring.

### Changed
- **Context Economy**: Implemented intelligent response distillation for discovery tools and 5,000-character truncation for pipeline logs to maximize context utility.
- **Terminal Hygiene**: MCP servers now handle `PAGER=cat` and non-interactive enforcement automatically via environment injection.
- **Platform Modularity**: Refactored core collaboration and devsecops skills to be strictly platform-agnostic, mandating the use of specialized interaction servers.

## [0.1.0] - 2026-02-25

### Added
- Initial extension setup.
- Added `gemini-extension.json` manifest.
- Added `package.json` for Node.js compatibility.
- Added `GEMINI.md` for project documentation.
- Added `universal-skill-architect` skill.
- Added `LICENSE` (MIT) and `CHANGELOG.md`.
