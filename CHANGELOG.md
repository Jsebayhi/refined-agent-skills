# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.5] - 2026-03-21

### Added
- **Visual Progress Map**: Integrated high-density progress tracking into the Flight Deck header.
- **Prefix-Based Sharding**: Mandated `human_gathered_` and `auto_gathered_` prefixes for intelligence shards.

### Changed
- **Hardened Handover**: Simplified `selecting-optimal-methodology` by removing the redundant Reviewer gate.
- **Header Standardization**: Unified all engine headers to use `FILE_PATH` and expanded `APPROVAL` enums.

## [0.4.1] - 2026-03-20

### Added
- **Mode Matrix Framework**: Implemented a new "Mode-Aware Stateful Orchestration" architecture.
- **Selecting Optimal Methodology**: Mandatory entrypoint for task quadrant establishment.
- **Artifact-Driven State Machine**: Implemented sharded task memory in `.gemini/skills/current-task-state/`.
- **4-Quadrant Engines**: Specialized skills for `linear-task-supervised`, `linear-task-autonomous`, `complex-task-supervised`, and `complex-task-autonomous`.
- **Adversarial Convergence**: New protocol for iterative agent-reviewer hardening.
- **Intelligence Split**: Formalized separation between Human (Guaranteed) and Autonomous (Scrutinized) intelligence.
- **Two-Stage Decomposition**: Enforced sequential planning (Discovery then Implementation) for complex tasks.

### Changed
- **Hardened Reviewer**: Updated `adversarial-reviewer.md` to forbid shadow coding and require explicit PASS criteria.
- **Standardized Naming**: Unified `STEP_ID` across all scripts, skills, and documentation.

### Removed
- **Legacy Lifecycle**: Deprecated `orchestrating-software-lifecycle`.
- **Legacy RCA**: Deprecated `performing-systematic-root-cause-analysis`.

## [0.3.0] - 2026-03-19
...
