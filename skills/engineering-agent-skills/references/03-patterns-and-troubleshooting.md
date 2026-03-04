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
**Use when:** Performing batch operations, destructive changes, or high-stakes operations where errors are costly (e.g., mass database updates, financial transactions).
**Structure Example:**
1. **Plan:** LLM creates `changes.json`.
2. **Validate:** `python scripts/validate_changes.py changes.json`.
3. **Execute:** `python scripts/apply_changes.py changes.json`.

### Pattern 7: Centralized Coordination (Orchestrator-Subagent)
**Use when:** Tasks are parallelizable (e.g., financial analysis, multi-source extraction) and require strong error containment.
**Structure Example:**
- **Orchestrator:** Decomposes task, assigns subtasks to workers.
- **Subagents:** Execute specialized subtasks (e.g., Worker 1: Extract Revenue, Worker 2: Analyze Risk).
- **Validation Bottleneck:** Orchestrator reviews all subagent outputs before synthesizing final response.
*Key techniques:* **Error Absorption** (containing errors to 4.4x vs 17.2x in independent systems), hierarchical task decomposition.

### Pattern 8: Decentralized Debate (Peer-to-Peer)
**Use when:** Tasks require dynamic exploration of high-entropy search spaces (e.g., web navigation, open-ended research).
**Structure Example:**
- **Agents:** Multiple agents perform independent exploration.
- **Debate Loop:** Agents exchange findings and challenge/verify each other's conclusions.
- **Consensus:** Final output derived from peer consensus or voting.
*Key techniques:* Parallel discovery, peer verification, consensus formation.

---

## Critical Scaling Trade-offs

To avoid performance degradation, monitor these research-validated trade-offs.

### The Tool-Coordination Trade-off
Multi-agent systems fragment the per-agent token budget. For tool-heavy tasks (e.g., 10+ tools), the coordination tax often outweighs the benefits.
*   **Fix:** If $T > 10$, prefer Single-Agent (SAS) or highly efficient Centralized architectures with a slim orchestrator.

### Topology-Dependent Error Amplification
Without a verification mechanism, Independent MAS amplifies errors **17.2x** versus a Single-Agent baseline.
*   **Fix:** Always include a validation bottleneck (Pattern 7) or peer-debate loop (Pattern 8) to catch and correct cascading errors.

---

## Strategic Scripting: Functional vs. Validation

To build efficient skills, you must distinguish between scripts that **perform logic** and scripts that **check logic**.

### Functional Utility Scripts (The "Muscles")
**MANDATORY FOR:** Any deterministic data manipulation.
- **Why?** It is faster, more accurate, and more token-efficient than asking an LLM to parse text or transform JSON.
- **Examples:**
  - `scripts/extract_metrics.py`: Parses a 1,000-line log file to find errors.
  - `scripts/format_table.js`: Converts a JSON array into a specific Markdown table format.
  - `scripts/fetch_metadata.sh`: Uses `curl` to grab API headers.

### Validation Scripts (The "Checkpoints" and "Nudges")
**SITUATIONAL FOR:** Quality control and behavioral modification.
- **Why?** To provide a machine-verifiable gate and to prevent "lazy agent syndrome."
- **Examples of Meaningful Validation:**
  - **Syntactic/Schema Correctness:** Verifying that generated YAML or JSON is valid and includes all mandatory fields. The script is the "Ground Truth," not the LLM.
  - **Heuristic "Red Flags":** Identifying low-quality output (e.g., word count too low, repetitive phrasing, missing domain keywords). These scripts act as behavioral nudges, forcing the agent to try again when its first attempt is too thin.
  - **High-Stakes Gating:** Required for any task involving `rm`, destructive `POST` requests, or complex multi-file refactors.
- **Avoid "Ceremonial Validation":** Do not create a `validate.sh` script for simple, low-stakes text-generation tasks that provide no objective check.

### Resilient Script Execution (The Universal Router)
**MANDATORY FOR:** ALL scripts (Functional Utility and Validation).
- **Why?** Agent environments vary wildly (bare metal vs. containerized vs. browser-based).
- **The Script Pair Naming Convention:**
  - **The Router (The Interface):** Expressive, outcome-oriented (e.g., `scripts/enforce_quality_standards.sh`). This is the only script the agent should call.
  - **The Logic (The Implementation):** Use the base name suffixed with `_internal` (e.g., `scripts/enforce_quality_standards_internal.js`). This signals that the script is a dependency of the router.
- **The Router Pattern (Tiered Fallback):**
  - **Tier 0 (Local/NPX):** Attempt to run using local package runners (e.g., `npx`, `pipx`).
  - **Tier 1 (Native):** Attempt to run using the native runtime if available (`node`, `python3`).
  - **Tier 2 (Docker):** Pull a slim container image and execute the `_internal` script in isolation.

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