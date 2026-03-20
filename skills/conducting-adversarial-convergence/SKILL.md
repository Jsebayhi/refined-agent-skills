---
name: conducting-adversarial-convergence
description: MANDATORY. DO NOT present code or architectures to the human without calling 'activate_skill' on 'conducting-adversarial-convergence' first. This is the REQUIRED ORCHESTRATOR for the "Convergence Loop" between the Main Agent and the Reviewer. It enforces an iterative debate that concludes only when the 'adversarial_reviewer' issues a definitive "Pass."
---

# Conducting Adversarial Convergence

This skill manages the iterative feedback loop between you (the Main Agent) and the Reviewer. It acts as the "Pre-Human Filter" to ensure only hardened propositions reach the user.

## CRITICAL RULES
1.  **THE LOOP IS FINAL:** You are PROHIBITED from presenting work to the human until the Reviewer explicitly states "PASS."
2.  **EXPLICIT CONTEXT:** You MUST explicitly tell the reviewer what they are validating (e.g., a hypothesis, an architecture, or finished code) and provide the relevant context (Current Goal + Diff/Hypotheses).
3.  **NO PERSISTENCE LEAK:** Do NOT refer to internal phases of other skills. Focus strictly on the convergence of the current artifact.

## WORKFLOW: [Submission -> Attack -> Hardening]

### Step 1: Submit to Reviewer
Activate the `adversarial_reviewer` sub-agent. Provide a prompt that clearly defines the artifact and the objective:

*   **For Hypotheses/Architecture/Analysis:** "Review these proposed technical paths. Identify flawed premises, edge cases, or hidden complexities. Do not stop until the most robust path is identified."
*   **For Finished Work:** "Review this implementation against the objective. Look for bugs, security flaws, and architectural drift. Ensure the 'Hard Signal' (tests) is respected."

> **MANDATORY PERSONA FOR REVIEWER:** "ACT AS A PRECISION AUDITOR. Issue 'PASS' only if no critical flaws remain."

### Step 2: Analyze & Implement Feedback
*   Receive the reviewer's critique.
*   If flaws are identified, address them surgically in your work.
*   Update the task state to reflect the hardening.

### Step 3: Iterate
Repeat Step 1 with the hardened work. Continue until the reviewer issues a definitive "PASS."

**PASS CRITERIA:**
A "PASS" is only valid if:
1.  The Reviewer explicitly confirms all identified flaws are resolved.
2.  The Reviewer identifies ZERO new critical flaws.
3.  The agent provides proof (logs/output) that the "Hard Signal" is passing.

### Step 4: Human Gatekeeping
Once passed, present the final, converged result to the human for final approval.
