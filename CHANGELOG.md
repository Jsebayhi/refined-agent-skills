# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2026-03-13

### Added
- **GitHub MCP Server**: Implemented a production-grade GitHub MCP server and skill (`interacting-with-github`) mirroring the GitLab implementation.
- **Security Auditing**: Added `gitlab_list_vulnerability_findings` and `github_list_vulnerability_findings` tools to enable automated security checks during reviews.
- **Draft Management**: Added specialized tools for managing pending review comments (`gitlab_edit_review_comment`, `gitlab_delete_review_comment`, etc.) to prevent API conflicts.
- **Iterative Feedback**: Added `gitlab_get_comment` and `gitlab_edit_comment` for precise refinement of live feedback.
- **Safety Hatch**: Introduced `gitlab_run_command` and `github_run_command` for executing custom CLI flags while maintaining environment hygiene.

### Changed
- **Platform Modularity**: Refactored `collaborating-on-git-projects` and `upholding-devsecops-standards` to be strictly platform-agnostic, mandating the use of specialized interaction skills.
- **Context Optimization**: Implemented response distillation for all search and discovery tools, reducing context token consumption by ~80% for complex MRs/PRs.
- **Auto-Hygiene**: MCP servers now handle `PAGER=cat` and non-interactive enforcement automatically, removing the need for manual terminal prefixing.
- **Refined Discovery**: Updated `gitlab_list_mrs` with `project` filtering and correct flag mapping for MR states.

### Fixed
- Fixed **HTTP 415** (Unsupported Content-Type) by explicitly setting JSON headers in all API POST/PUT requests.
- Fixed 404 errors when attempting to delete draft notes using the standard notes API.
- Fixed invalid `--state` flag usage in GitLab MR discovery.
- Improved error handling for missing `glab`/`gh` binaries with user-friendly installation guidance.

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
