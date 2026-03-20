# Gemini CLI Extension: refined-agent-skills

This extension provides a collection of distilled, high-signal experts for the Gemini CLI.

## Project Structure

- `skills/`: Contains the individual skills.
    - `engineering-agent-skills/`: Expert system for building and designing agent skills.
    - `deep-reading-agent-skill/`: Teaches agents to deeply analyze and reflect on resources (PDFs, docs, web pages) section by section.
    - `git-commit-convention/`: Commits staged changes conventionally.
    - `deep-brainstorming/`: Guides the agent through a rigorous brainstorming process.
    - `working-with-gitlab-mr/`: Enforces a high-transparency Merge Request lifecycle (Opening, Handling Feedback, Reviewing) on GitLab.

## Configuration

- `gemini-extension.json`: Extension metadata for Gemini CLI.

## Workflows

### GEMINI.md Maintenance
**CRITICAL:** This `GEMINI.md` file must be actively maintained by any agent working on this extension. It serves as the primary repository for project-specific operational intelligence, developer notes, and conventions. Update it whenever new workflows, gotchas, or structural patterns are introduced.

**SEPARATION OF CONCERNS:**
- **`GEMINI.md` (This file):** Strictly for **maintenance and development** of the extension itself. It contains internal rules for developers/agents working ON the skills (e.g., commit conventions, repo-specific discovery).
- **`EXTENSION-GEMINI.md`:** Strictly for **user guidance and cross-skill operational standards**. It contains instructions for any agent USING the extension's skills in their own project (e.g., the "Source Code Investigation Standard").

### MCP Development Gotchas
*   **Tool Naming Mandate:** All MCP tools MUST be alphanumeric (underscores/hyphens only). Colons (`:`) in tool names will crash the Discovery phase.
*   **Unified Interface:** Tools for GitHub and GitLab MUST maintain parity in naming suffixes and parameter names.
    *   **Suffixes:** `_search`, `_view`, `_list_pull_requests`, `_create_pull_request`, `_get_pull_request_details`, `_list_workflow_runs`, `_list_vulnerabilities`.
    *   **Generic Parameters:** Use `id` for PR/MR numbers across all tools. Use `project` for repository paths/IDs.
*   **Stdout Isolation:** The `stdout` stream is reserved for JSON-RPC messages only. All logging, debugging, or standard command output MUST be redirected to `stderr`. Failure to do so will corrupt the JSON-RPC stream and break the connection.
*   **Non-Interactive Enforcement:** All underlying CLI commands (e.g., `glab`, `gh`) MUST be executed with flags that disable interactive prompts (e.g., `--yes`, `--fill`) and suppress pagers (`GLAB_PAGER=cat`, `GH_PAGER=cat`).
*   **Line-Buffered Stdio:** Use a line-by-line reading interface (like `readline`) for `stdin` to ensure the server processes each JSON-RPC request atomically.
*   **Response Distillation:** All discovery and search tools MUST distill raw API responses to return only the essential fields (e.g., `id`, `title`, `state`, `url`). This prevents agent context window bloat.

### Git Conventions
**MANDATORY:** One commit per skill. A commit must never touch multiple skills. 
- When adding or updating a skill, only changes within that skill's directory (and relevant top-level files like `README.md` or `.gitignore` if required for that skill) should be included.
- Fixes or improvements to existing skills must be in their own dedicated commits.

**NON-INTERACTIVE MANDATE:** You MUST use `gh` and `glab` in non-interactive mode to prevent terminal hangs.
- Prefix all discovery commands with `GH_PAGER=cat` or `GLAB_PAGER=cat`.
- Forbid usage of `--live`, `--watch`, or any command that continuously refreshes output.
- Use one-shot discovery commands (e.g., `gh pr checks` instead of `gh pr view --watch`).

### Adding a New Skill
Create a new directory in `skills/` with a `SKILL.md` file following the kebab-case naming convention.

## MCP Development Gotchas

**CRITICAL:** When building or maintaining MCP servers within this extension, adhere to these hard rules to prevent discovery and connection failures.

### 1. Tool Naming Schema
- **Constraint:** Tool names MUST contain ONLY alphanumeric characters, underscores, or hyphens.
- **Forbidden:** Do NOT use colons (`:`) or special characters.
- **Failure Mode:** Violating this causes the Gemini CLI to determine the server provides "no usable tools" and instantly close the connection.

### 2. Stdout Isolation
- **Constraint:** `stdout` is reserved EXCLUSIVELY for JSON-RPC protocol messages.
- **Action:** Redirect all logging, debug info, and raw errors to `stderr` (e.g., `process.stderr.write` or `console.error`).
- **Failure Mode:** Any non-JSON text on `stdout` corrupts the protocol stream and causes a "Connection closed" error.

### 3. Sensitive Environment Variables
- **Constraint:** Gemini CLI redacts sensitive environment variables (e.g., `*TOKEN*`, `*SECRET*`) by default for `stdio` servers.
- **Action:** Explicitly list and expand required variables in the `mcpServers` block of `gemini-extension.json`:
  ```json
  "env": { "GITLAB_TOKEN": "$GITLAB_TOKEN" }
  ```

### 4. Robust Path Resolution
- **Action:** Always use the `${extensionPath}` variable in `gemini-extension.json` to define the path to the server script.
- **Benefit:** Ensures the CLI can find the server regardless of where the extension is linked or installed.

### 5. Protocol Implementation (Node.js)
- **Line Buffering:** Use the `readline` module to process `stdin` line-by-line. This ensures stability if multiple JSON-RPC messages are received in a single chunk.
- **Initialization:** The `initialize` result MUST include `protocolVersion` (e.g., `"2024-11-05"`) and a valid `serverInfo` object.
