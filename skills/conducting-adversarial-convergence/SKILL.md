---
name: conducting-adversarial-convergence
description: MANDATORY. DO NOT present code or architectures to the human without calling 'activate_skill' on 'conducting-adversarial-convergence' first. This is the REQUIRED ORCHESTRATOR for the "Convergence Loop" between the Main Agent and the Reviewer. It enforces an iterative debate that concludes only when the 'adversarial_reviewer' issues a definitive "Pass."
---

# Conducting Adversarial Convergence

This skill manages the iterative feedback loop between you (the Main Agent) and your sub-agent (the Reviewer). It acts as the "Pre-Human Filter" to ensure only hardened propositions reach the user.

## CRITICAL RULES
1.  **THE LOOP IS FINAL:** You are PROHIBITED from presenting work to the human until the `adversarial_reviewer` explicitly states "PASS."
2.  **TWO-STAGE LENSES:** You MUST explicitly tell the reviewer which "Lens" to use in the delegation prompt:
    *   **Logic Lens:** For hypotheses and solution strategies (Phases 1 & 2 of exploration).
    *   **Quality Lens:** For final implementation and code (Phase 3 of exploration or Fast Track).
3.  **FIDELITY HANDOFF:** You MUST provide the full context (Current Goal + Diff/Hypotheses) to the sub-agent.

## WORKFLOW: [Submission -> Attack -> Hardening]

### Step 1: Submit to Reviewer
Activate the `adversarial_reviewer` sub-agent. Provide the following prompt structure:
> "ACT AS A PRECISION AUDITOR. Review the following [Hypothesis|Solution|Code] using the [Logic|Quality] Lens. 
> **Goal:** [Target Objective]
> **Artifacts:** [Paste content or diff]
> **Criteria:** Do not stop until this proposition is flawless. Issue 'PASS' only if no critical flaws remain."

### Step 2: Analyze & Implement Feedback
*   Receive the reviewer's critique.
*   If the reviewer finds flaws, address them surgically in your work.
*   Update the `.gemini/state/plan.md` context.

### Step 3: Iterate
Repeat Step 1 with the hardened work. Continue until the reviewer issues a definitive "PASS."

**PASS CRITERIA:**
A "PASS" is only valid if:
1.  The Reviewer explicitly confirms all identified flaws are resolved.
2.  The Reviewer identifies ZERO new critical flaws.
3.  The agent provides proof (logs/output) that the "Hard Signal" is passing.

### Step 4: Human Gatekeeping
Once passed, present the final, converged result to the human for final approval.

## INTERACTION STYLE
*   **Adversarial Collaboration:** Treat the reviewer's feedback as high-signal data to improve your work.
*   **Conciseness:** Do not summarize the reviewer's feedback for the human; only present the final converged outcome.
