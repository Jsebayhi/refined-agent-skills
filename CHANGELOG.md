# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
