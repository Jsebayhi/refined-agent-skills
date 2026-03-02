---
name: orchestrating-client-onboarding-pipelines
description: End-to-end client onboarding and validation workflow. Use when the user asks to "onboard a new client", "process new user data", or "run the intake pipeline". DO NOT use for querying existing user data, updating passwords, or simple data exploration.
compatibility: "Requires Node.js or Docker for reliable validation."
metadata:
  version: 1.0.0
  author: AI-Engineering-Team
---

# Orchestrating Client Onboarding Pipelines

## CRITICAL RULES & GUARDRAILS
*   **Negative Constraint:** Do NOT skip the validation phase under any circumstances. Regulatory compliance is mandatory.
*   **Progressive Disclosure:** For detailed API schemas and acceptable data formats, you MUST read `references/api-schema.md` before executing any network calls. Do not hallucinate the schema.
*   **Tool Usage:** Always use the fully qualified tool name `BillingServer:create_account` when interacting with the billing system.
*   **Error Handling:** If the API returns a `404 Not Found`, do not retry blindly. Check the formatting of the `legal_entity_name`. If it contains special characters, strip them and try again.

## WORKFLOW: [Plan-Validate-Execute Pattern]

Follow these steps precisely. 

**MECHANICAL CoT REQUIRED:** You MUST copy the checklist below into your output and check off the boxes as you progress to track your state.

```markdown
### Execution State:
- [ ] Step 1: Data Discovery
- [ ] Step 2: Plan Generation
- [ ] Step 3: Validation Loop
- [ ] Step 4: Final Execution
```

### Step 1: Data Extraction & Syntactic Gate (Functional Utility)
1. Use the `scripts/extract_data_resiliently.sh` tool to ingest the client documents. This script follows the **Universal Router** pattern (Tiered Fallback) and calls `scripts/extract_data_resiliently_internal.js` to handle format conversion.
2. **Syntactic Check:** The script will also verify that all mandatory YAML/JSON fields are present. If the script fails, you MUST fix the source data or extraction logic before proceeding.

### Step 2: Plan Generation & Quality Nudge
1. Analyze the fetched data.
2. Generate a structured JSON plan mapping the client data to the required billing format.
3. Save this plan locally as `proposed_onboarding.json`.
4. **Behavioral Nudge:** Run `scripts/check_detail_level.py proposed_onboarding.json`. This script is a "Red Flag Detector" that checks if the plan is too thin. If it fails, expand the plan with more detail before the final validation.

### Step 3: High-Stakes Validation (Situational)
This step is required because billing account creation is a **High-Stakes, Destructive Operation**.
1. Run the progressive validation router: `bash scripts/enforce_quality_standards.sh proposed_onboarding.json`.
2. **Review Output:** 
    *   If the script outputs semantic errors (e.g., "Error: Field 'jurisdiction' is missing"), modify `proposed_onboarding.json` and re-run the script.
    *   You MUST repeat this loop until the script outputs: `VALIDATION SUCCESS`.

### Step 4: Final Execution
1. Present the validated JSON plan to the user in a readable Markdown format.
2. **STATEFUL HALT:** You must explicitly ask the user to type "APPROVE" before proceeding. Do not execute the tool calls until this explicit confirmation is received.
3. Upon approval, execute the `BillingServer:create_account` tool using the validated JSON data.