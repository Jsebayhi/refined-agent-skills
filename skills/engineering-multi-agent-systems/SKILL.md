---
name: engineering-multi-agent-systems
description: Orchestrates complex agentic systems using the "Standard Model" of multi-agent topologies and cognitive thermodynamics. This skill is MANDATORY for designing, analyzing, or optimizing any workflow involving multiple agents, synergistic collaboration, or agentic scaling. TRIGGER THIS SKILL when the user asks to "build a multi-agent system", "coordinate agents", "scale my agentic workflow", "analyze agent synergy", or "optimize coordination tax". It translates high-level concepts like "Potential Functions" and "Error Amplification" into actionable architecture decisions. Use it to eliminate "Agentic Bloat" and ensure that multi-agent systems provide positive returns over single-agent baselines. MANDATORY for all tasks involving agentic scaling analysis and topology selection.
---

# The Standard Model of Agentic Engineering

This skill provides the foundational laws and architectural patterns required to design high-effectiveness multi-agent systems. It moves beyond "Agentic Bloat" toward **Cognitive Thermodynamics**—the engineering of trajectories through energy landscapes.

## 1. The Philosophical Mandate: Context Segregation
The primary bottleneck in single-agent systems is **Coder's Bias**. Once an agent generates a solution, its internal "Potential Function" is locked into that path.
*   **Segregation Theory:** Effectiveness is derived from what an agent *doesn't* know. Sub-agents must be "Cognitively Isolated" from the main agent's scratchpad to provide an objective audit.
*   **Mandatory Context Injection:** You MUST load and inject any available prompt libraries, role definitions, or context engineering (e.g., from `.gemini/prompts/` or `references/`) before starting the loop. Coordination fails when agents lack a shared "Instructional Alignment."
*   **Reject Agentic Bloat:** Never add an agent unless it provides **Knowledge Heterogeneity**. Three identical agents are just a high-cost path to a single-model error.

## 2. The 4 Laws of Synergy
Before summoning a sub-agent, you must calculate the **Agentic ROI** using these principles:

1.  **Law of Confident-Knowledge Diversity:** Synergy only exists if Agent A is likely to be correct when Agent B is uncertain.
2.  **The Coordination Tax:** Every agent interaction incurs a "Communication Entropy" penalty. Turns ($T$) grow as a power-law with agent count ($n$): $T \approx 2.7 \cdot (n + 0.5)^{1.7}$. If turn count exceeds the orchestrator's "cooling capacity," performance degrades.
3.  **The Baseline Paradox:** High-performing models (e.g., Gemini 2.0 Pro) often achieve better results via **Self-MoA** (internal sampling). If SAS accuracy $> 45\%$, MAS coordination often yields **negative returns** due to an "Inverted-U" saturation effect.
4.  **Least Action Synergy:** $Synergy = (Diversity - Overlap) / CoordinationCost$.

## 3. Topology Patterns
Choose the correct "Shape of Intelligence" for the task:

*   **Centralized Orchestrator (The Standard):** A single Director delegates to narrow experts. Best for "Parallelizable/Decomposable" tasks (e.g., Finance). **Benefit:** Error containment to $4.4x$ via validation bottlenecks.
*   **Decentralized Debate:** Peer-level agents critique each other. Best for "Dynamic/High-Entropy" tasks (e.g., Web Navigation). **Benefit:** Error reduction of $\approx 22\%$ through explicit challenge-response loops.
*   **Hybrid (Hierarchical + Lateral):** Combines orchestrator control with limited peer exchange. Best for "Complex Systems" requiring both oversight and collaborative brainstorming.
*   **Mixture-of-Agents (MoA):** Layered proposers feeding an aggregator. Best for "High-Creativity/Generative" tasks. **Benefit:** Leveraging the "Collaborativeness" phenomenon.
*   **Independent Ensembles:** Isolated agents with simple voting. Best for "Ensemble-style" reasoning on non-agentic tasks. **Critical Warning:** Amplifies errors $17.2x$ on agentic tasks due to unchecked propagation.
*   **TUMIX (Tool Mixture):** Parallel agents using different *strategies* for the same tools. Best for "Debugging/Complex Implementation."

## 4. Landscape Engineering: Prompts as Energy Wells
Stop viewing prompts as "Instructions" and start viewing them as **Potential Functions** ($V_T$).
*   **Trajectory Guidance:** A prompt creates a gradient. The agent's reasoning is a trajectory moving toward the state of lowest energy (the Goal).
*   **Inception Prompting:** Use rigid, role-based constraints to "imprison" an agent in a specific cognitive style. This prevents "Role Flipping" and keeps the trajectory on-rails.
*   **Step-Back Engineering:** Before implementation, force a "Step-Back" turn to identify the **Implicit Constraints** of the environment. This shapes the landscape before the agent starts moving.

## 5. Calibration & Termination
*   **Uncertainty Extraction:** Force agents to output a **Confidence Score (1-5)**. If confidence is low, the potential function is "flat"—abort the trajectory and seek human grounding.
*   **Adaptive Termination (TUMIX-Style):** If Round $N$ and Round $N+1$ yield identical stable states, terminate immediately. Do not spend compute on redundant refinement.
*   **Consensus-Based Truth:** If three heterogeneous agents converge on the same "Energy Well," the signal is 100% verified.

---
## Design Workflow
1.  **Step-Back:** Analyze the task's "Decomposability."
    *   **Sequential Tasks** (e.g., state-dependent planning): Prefer **SAS (Single-Agent)** to avoid information fragmentation.
    *   **Parallel Tasks** (e.g., analysis, extraction): Use **Centralized Orchestration**.
2.  **Load & Inject:** Identify and load all existing prompt engineering, reference schemas, or role-based templates from the workspace.
3.  **Select Topology:** Based on the Task-Topology Fit (SAS, Orchestrator, or Debate).
3.  **Engineer Heterogeneity:** Assign sub-agents orthogonal roles (e.g., Security vs. Performance).
4.  **Enforce Segregation:** Pass only the *Result* of Turn $N$ to the sub-agent, never the *Monologue*.
5.  **Synthesize:** Merge trajectories into a final "Context Manifesto."

---
## 🧪 Scientific References
For deep dives into the underlying mechanics, consult the following foundational research:

1.  **CAMEL (2023):** *Communicative Agents for "Mind" Exploration of LLM Society*. (Concepts: Role-Playing, Inception Prompting).
2.  **Multiagent Debate (2023):** *Improving Factuality and Reasoning through Multiagent Debate*. (Concepts: Peer Critique, Consensus-Based Truth).
3.  **AutoGen (2023):** *Enabling Next-Gen LLM Applications via Multi-Agent Conversation*. (Concepts: Conversation Programming, Modular Intelligence).
4.  **MoA (2024):** *Mixture-of-Agents Enhances Large Language Model Capabilities*. (Concepts: LLM Collaborativeness, Layered Aggregation).
5.  **Self-MoA (2025):** *Rethinking Mixture-of-Agents: Is Mixing Different LLMs Beneficial?*. (Concepts: In-model Diversity vs. Cross-model Noise).
6.  **Knowledge Diversity (2025):** *Confident-Knowledge Diversity Drives Discussion Synergy*. (Concepts: Potential Conversation Synergy, Calibration).
7.  **TUMIX (2025):** *Multi-Agent Test-Time Scaling with Tool-Use Mixture*. (Concepts: Parallel Tool Strategies, Adaptive Termination).
8.  **Science of Scaling (2025):** *Towards A Science Of Scaling Agent Systems*. (Concepts: Coordination Tax, Baseline Paradox, Error Amplification).
9.  **Detailed Balance (2025):** *Detailed Balance In Large Language Model Driven Agents*. (Concepts: Macroscopic Potential Functions, Least Action Principle).
