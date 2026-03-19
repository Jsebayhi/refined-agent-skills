# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-19

### Added
- **GitHub MCP Server**: Implemented a production-grade GitHub MCP server and skill (`interacting-with-github`) with 100% tool parity mirroring the GitLab implementation.
- **Dual-Platform Ecosystem**: Established a unified, high-fidelity interaction standard across 76 tools for both GitHub and GitLab.
- **Semantic Naming Standard**: Introduced explicit, deterministic parameter names (e.g., `pull_request_id`, `mr_id`, `project_id`) across all platform tools.
- **Instructional Duality**: Introduced `EXTENSION-GEMINI.md` for user-facing instructions, separating them from internal maintenance docs (`GEMINI.md`) via `contextFileName` in `gemini-extension.json`.
- **Precision Feedback**: Implemented high-fidelity multi-line comment support via `start_line` (GitHub) and `line_range` (GitLab) payloads.
- **Security & Quality Auditing**: Integrated automated security checks (`list_vulnerabilities`) and deep-dive review tools (`get_pull_request_details` with full context).
- **Resilient Execution Engine**: Transitioned all MCP interactions to a robust `spawnSync` engine to eliminate shell-quoting and argument-splitting errors.

### Changed
- **Context Economy**: Implemented intelligent response distillation for discovery tools and 5,000-character truncation for pipeline logs to maximize context utility.
- **Terminal Hygiene**: MCP servers now handle `PAGER=cat` and non-interactive enforcement automatically via environment injection.
- **Platform Modularity**: Refactored core collaboration and devsecops skills to be strictly platform-agnostic, mandating the use of specialized interaction servers.

### Fixed
- Fixed **HTTP 415** (Unsupported Content-Type) by enforcing explicit JSON headers in all API POST/PUT requests.
- Fixed 404 errors during draft note deletion and improved error handling for missing platform CLI binaries.
- Fixed invalid `--state` flag usage and inconsistent state mapping in GitLab MR discovery.

## [0.4.2] - 2026-03-12

### Added
- Automated authentication failure detection and user guidance in GitLab MCP tools.
- Improved "Fail-Fast" behavior in `interacting-with-gitlab` skill for unauthenticated environments.

## [0.4.1] - 2026-03-12

### Added
- Added mandatory authentication check to `interacting-with-gitlab` skill.
- Added specialized "Draft Mode" workflow for reviewers using `gitlab:create_draft_note` and `gitlab:submit_review`.

## [0.4.0] - 2026-03-12

### Added
- Expanded `interacting-with-gitlab` MCP tools to support full reviewer and submitter lifecycles.
- Added `gitlab:create_draft_note` and `gitlab:submit_review` for multi-comment review workflows.
- Added `gitlab:set_auto_merge` and `gitlab:update_mr` for MR management.
- Added `only_unresolved` filter to `gitlab:list_discussions`.
- Added `gitlab:get_mr_details` for comprehensive MR state inspection.

## [0.3.1] - 2026-03-12

### Added
- Added `resolved` and `resolvable` status to `gitlab:list_discussions` tool for better thread management.

## [0.3.0] - 2026-03-12

### Changed
- Upgraded `interacting-with-gitlab` to an MCP-first architecture.
- Replaced standalone scripts with a zero-dependency Node.js MCP server in `skills/interacting-with-gitlab/scripts/server.js`.
- Exposed `gitlab:*` tools for precision line comments, discussion management, and pipeline job/log retrieval.

## [0.2.0] - 2026-03-12

### Added
- Added `interacting-with-gitlab` skill for production-grade GitLab management, including precise line-level feedback and discussion thread management.
- Added `manage_gitlab.sh` router and `manage_gitlab_internal.js` logic for GitLab API abstraction.
- Added `Red_Team_Report_&_Evaluation_Plan.md` for the new skill.
- Updated `README.md` to include the new skill.

## [0.1.0] - 2026-02-25

### Added
- Initial extension setup.
- Added `gemini-extension.json` manifest.
- Added `package.json` for Node.js compatibility.
- Added `GEMINI.md` for project documentation.
- Added `universal-skill-architect` skill.
- Added `LICENSE` (MIT) and `CHANGELOG.md`.
