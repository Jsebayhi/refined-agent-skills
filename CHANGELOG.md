# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.3] - 2026-03-19

### Added
- **Dual-Platform MCP Ecosystem**: Established production-grade GitHub and GitLab MCP servers with total tool parity (38 tools each).
- **GitHub MCP Server**: Implemented a high-fidelity GitHub MCP server and skill (`interacting-with-github`) mirroring the GitLab implementation.
- **Security Auditing**: Integrated `gitlab_list_vulnerability_findings` and `github_list_vulnerability_findings` for automated security checks.
- **Draft Management**: Added specialized tools for managing pending review comments (Draft Mode, Bulk Publish) to prevent API conflicts.
- **Iterative Feedback**: Added precision tools for live feedback refinement (`gitlab_get_comment`, `gitlab_edit_comment`).
- **Safety Hatch**: Introduced `gitlab_run_command` and `github_run_command` for executing custom CLI flags while maintaining hygiene.
- **MR/PR Lifecycle**: Full support for reviewer and submitter lifecycles, including auto-merge, thread management, and pipeline monitoring.

### Changed
- **Platform Modularity**: Refactored `collaborating-on-git-projects` and `upholding-devsecops-standards` to be strictly platform-agnostic.
- **Context Optimization**: Implemented response distillation for all search/discovery tools, reducing token consumption by ~80%.
- **Auto-Hygiene**: MCP servers now handle `PAGER=cat` and non-interactive enforcement automatically.
- **Refined Discovery**: Updated MR/PR discovery with improved filtering, `project` scoping, and correct state mapping.

### Fixed
- Fixed **HTTP 415** (Unsupported Content-Type) by enforcing JSON headers in all API requests.
- Fixed 404 errors during draft note deletion and improved error handling for missing CLI binaries.
- Fixed invalid `--state` flag usage in GitLab MR discovery.

## [0.1.0] - 2026-02-25

### Added
- Initial extension setup.
- Added `gemini-extension.json` manifest.
- Added `package.json` for Node.js compatibility.
- Added `GEMINI.md` for project documentation.
- Added `universal-skill-architect` skill.
- Added `LICENSE` (MIT) and `CHANGELOG.md`.
