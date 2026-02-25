# Architectural Patterns & Troubleshooting

## 6 Core Architectural Patterns

When designing the workflow within `SKILL.md`, choose the pattern that fits the problem.

### Pattern 1: Sequential Workflow Orchestration
**Use when:** Your users need multi-step processes in a specific order.
**Structure Example:**
```markdown
## Workflow: Onboard New Customer
### Step 1: Create Account
Call tool: `create_customer`. Parameters: name, email, company.
### Step 2: Setup Payment
Call tool: `setup_payment_method`. Wait for: payment method verification.
### Step 3: Create Subscription
Call tool: `create_subscription`. Parameters: plan_id, customer_id (from Step 1).
```
*Key techniques:* Explicit step ordering, dependencies between steps, validation at each stage, rollback instructions for failures.

### Pattern 2: Multi-MCP Coordination
**Use when:** Workflows span multiple services.
**Structure Example:**
```markdown
### Phase 1: Design Export (Figma MCP)
1. Export design assets from Figma. 2. Generate design specifications.
### Phase 2: Asset Storage (Drive MCP)
1. Create project folder in Drive. 2. Upload all assets.
### Phase 3: Task Creation (Linear MCP)
1. Create development tasks. 2. Attach asset links to tasks.
```
*Key techniques:* Clear phase separation, data passing between tools, centralized error handling.

### Pattern 3: Iterative Refinement
**Use when:** Output quality improves with iteration.
**Structure Example:**
```markdown
### Initial Draft
1. Fetch data. 2. Generate first draft report. 3. Save to temporary file.
### Quality Check
1. Run validation script: `scripts/check_report.py`.
2. Identify issues: Missing sections, Inconsistent formatting.
### Refinement Loop
1. Address each identified issue. 2. Regenerate affected sections. 3. Re-validate. 4. Repeat until quality threshold met.
```

### Pattern 4: Context-aware tool selection
**Use when:** Same outcome, different tools depending on context.
**Structure Example:**
```markdown
### Decision Tree
1. Check file type and size.
2. Determine best storage location:
   - Large files (>10MB): Use cloud storage tool.
   - Code files: Use GitHub tool.
   - Temporary files: Use local storage.
### Execute Storage
Based on decision, call appropriate tool and explain to user why that storage was chosen.
```

### Pattern 5: Domain-specific intelligence
**Use when:** Your skill adds specialized knowledge beyond tool access.
**Structure Example:**
```markdown
### Before Processing (Compliance Check)
1. Fetch transaction details.
2. Apply compliance rules: Check sanctions lists, Verify jurisdiction allowances, Assess risk level.
3. Document compliance decision.
### Processing
IF compliance passed: Process transaction.
ELSE: Flag for review, Create compliance case.
```

### Pattern 6: Verifiable Outputs (Plan-Validate-Execute)
**Use when:** Performing batch operations, destructive changes, complex validation rules, or high-stakes operations where errors are costly.
**Structure Example:**
```markdown
### Step 1: Create Plan
1. Analyze input data.
2. Generate a structured plan file (e.g., `changes.json`).
### Step 2: Validate Plan
1. Run validation script: `python scripts/validate_changes.py changes.json`.
2. If errors are found, fix `changes.json` and re-run validation.
### Step 3: Execute
1. Only when validation passes, run `python scripts/apply_changes.py changes.json`.
```
*Key techniques:* Catches errors early, provides objective machine-verifiable checks, enables reversible planning.

---

## Troubleshooting Guide

### Skill Doesn't Trigger / Undertriggering
**Symptom:** Skill loads automatically when it shouldn't, or users have to ask for it explicitly.
**Fix:** Add more detail and nuance to the `description` field in the YAML frontmatter. This may include keywords particularly for technical terms. Ensure it includes trigger phrases users actually say.

### Skill Triggers Too Often / Overtriggering
**Symptom:** Skill loads for irrelevant queries.
**Fix:** Add negative triggers to the description, be more specific. Example: `description: Advanced data analysis for CSV files. Use for statistical modeling. DO NOT use for simple data exploration.`

### Instructions Not Followed
**Symptom:** Skill loads but the agent doesn't follow instructions.
**Common causes & Fixes:**
1. **Instructions too verbose:** Keep instructions concise. Use bullet points and numbered lists. Move detailed reference to separate files in `references/`.
2. **Instructions buried:** Put critical instructions at the top. Use `## Important` or `## CRITICAL` headers. Repeat key points if needed.
3. **Ambiguous language:** Make sure to validate things properly.
   *Bad:* `Make sure to validate things properly`
   *Good:* `CRITICAL: Before calling create_project, verify: Project name is non-empty, At least one team member assigned.`
4. **Model "laziness":** Add explicit encouragement (e.g., `## Performance Notes: Take your time to do this thoroughly. Quality is more important than speed. Do not skip validation steps.`)

### Large Context Issues
**Symptom:** Skill seems slow or responses degraded.
**Causes:** Skill content too large, or all content loaded instead of progressive disclosure.
**Solutions:** Move detailed docs to `references/`. Link to references instead of inline. Keep `SKILL.md` under 500 lines.

### Script Failures & Executable Code Issues
**Symptom:** Bundled scripts crash, causing the agent to get stuck or hallucinate fixes.
**Solutions:** 
- **Solve, don't punt:** Write scripts that handle error conditions explicitly (e.g. creating default files if missing) rather than crashing and relying on the agent to fix it. 
- **Avoid Voodoo Constants:** Justify and document configuration parameters within the script so the agent understands them.
- **Differentiate usage:** Clearly tell the agent whether a script should be *executed* (`Run analyze.py to extract fields`) or *read as reference* (`See analyze.py for the algorithm`).

### MCP Connection / Tool Not Found Errors
**Symptom:** Skill attempts to call an MCP tool but fails with "tool not found".
**Solutions:** Always use **fully qualified tool names** (`ServerName:tool_name`, e.g., `GitHub:create_issue`). Ensure tool names are case-sensitive. Check if the tool relies on packages that need to be explicitly installed via bash first.