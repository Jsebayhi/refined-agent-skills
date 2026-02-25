# Technical Requirements and Instruction Design

## File Structure & Critical Rules
The skill is a folder containing:
- `SKILL.md` (Required): Main instructions. **Must be exactly SKILL.md (case-sensitive). No variations accepted.**
- `scripts/` (Optional): Executable code.
- `references/` (Optional): Documentation loaded as needed.
- `assets/` (Optional): Templates, fonts, icons used in output.

**Skill Folder & Name Naming:**
- Use **kebab-case** only (e.g., `notion-project-setup`).
- No spaces, no underscores, no capitals.

**No README.md:**
- Don't include a `README.md` inside your skill folder. All documentation goes in `SKILL.md` or `references/`.

## YAML Frontmatter: The Most Important Part
The YAML frontmatter is how the agent decides whether to load your skill. Get this right.

### Required Fields
**`name`:**
- Max 64 characters.
- Lowercase unicode alphanumeric characters and hyphens only (`a-z` and `-`).
- Must not start or end with a hyphen.
- Must not contain consecutive hyphens (`--`).
- Should match the folder name exactly.

**`description`:**
- MUST include BOTH: What the skill does AND when to use it (trigger conditions).
- Under 1024 characters and non-empty.
- **Always write in the third person** (e.g., "Processes files", not "I process files" or "Helps you process files").
- Include specific tasks users might say. Mention file types if relevant.

### Optional Fields
- **`license`**: Specifies the license applied to the skill (e.g., `Apache-2.0` or `Proprietary. LICENSE.txt has complete terms`).
- **`compatibility`**: Max 500 characters. Indicates environment requirements (intended product, required system packages, network access needs, etc.).
- **`metadata`**: Arbitrary key-value mapping for additional metadata (e.g., `author`, `version`).
- **`allowed-tools`**: Space-delimited list of pre-approved tools the skill may use (e.g., `Bash(git:*) Read`).

### Security Restrictions (Forbidden in frontmatter)
- XML angle brackets (`<` or `>`). Malicious content could inject instructions.
- Skills with "claude" or "anthropic" in the name are reserved.

### Examples of Descriptions

**Good - specific and actionable:**
`description: Analyzes Figma design files and generates developer handoff documentation. Use when user uploads .fig files, asks for "design specs", "component documentation", or "design-to-code handoff".`

**Good - clear value proposition:**
`description: End-to-end customer onboarding workflow for PayFlow. Handles account creation, payment setup, and subscription management. Use when user says "onboard new customer", "set up subscription", or "create PayFlow account".`

**Bad - Too vague:**
`description: Helps with projects.`

**Bad - Missing triggers:**
`description: Creates sophisticated multi-page documentation systems.`

## Writing Effective Instructions (`SKILL.md` body)

After the frontmatter, write the actual instructions in Markdown.

### Recommended Structure Example
```markdown
# Your Skill Name

## Instructions

### Step 1: [First Major Step]
Clear explanation of what happens.
Example:
```bash
python scripts/fetch_data.py --project-id PROJECT_ID
```
Expected output: [describe what success looks like]

### Step 2: [Second Major Step]
...
```

### Best Practices for Instructions
- **Keep `SKILL.md` Concise:** Aim to keep the body under 500 lines. Token budgets are limited.
- **Be Specific and Actionable:** Don't say "Validate the data before proceeding." DO say: "Run \`python scripts/validate.py --input {filename}\` to check data format. If validation fails, common issues include: Missing required fields, Invalid date formats."
- **Include Error Handling:** Anticipate failures. e.g., `### MCP Connection Failed: 1. Verify MCP server is running... 2. Confirm API key is valid.`
- **Use Progressive Disclosure:** Keep SKILL.md focused on core instructions. Move detailed documentation to `references/` and link to it.
- **Reference Bundled Resources Clearly:** Keep file references **one level deep** from `SKILL.md` (avoid deeply nested reference chains where a reference links to another reference). For reference files longer than 100 lines, include a **table of contents** at the top.
- **No Windows-style Paths:** Always use forward slashes in file paths, even on Windows (`scripts/helper.py`, not `scripts\helper.py`).
- **Dependencies:** Do not assume packages or tools are available. Explicitly list required packages and provide installation instructions if necessary.

### Advanced Prompt Engineering for Skills
Because `SKILL.md` acts as a dynamic system prompt, you must apply rigorous prompt engineering:
- **Structural Scaffolding:** Use explicit Markdown delimiters (like `### Step 1`) or XML-like tags to cleanly separate context from tasks.
- **Negative Constraints:** Use explicit "Do NOT" rules to forbid common errors instead of relying on the agent to infer what is wrong.
- **Stateful Interaction Loops:** If the skill requires user input mid-workflow, explicitly define a strict loop and an exit condition (e.g., "CRITICAL: Halt execution and wait for the user to type 'APPROVE' before proceeding").
- **Output Formatting:** Dictate the exact structure the agent should use to respond (e.g., "Output the analysis in a Markdown table").