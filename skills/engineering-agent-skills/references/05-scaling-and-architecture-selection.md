# Scaling and Architecture Selection

This guide provides quantitative principles for deciding between Single-Agent Systems (SAS) and Multi-Agent Systems (MAS), and selecting the optimal coordination topology based on the "Science of Scaling Agent Systems" framework.

## 1. The Core Decision: SAS vs. MAS

The primary factor in determining if a multi-agent approach will provide value is the **Baseline Paradox**.

### The Capability Ceiling ($P_{SA} \approx 0.45$)
Multi-agent coordination yields diminishing or negative returns once the Single-Agent baseline ($P_{SA}$) exceeds an empirical threshold of **~45% accuracy**.
*   **If $P_{SA} < 0.45$:** Multi-agent systems can potentially provide significant gains through error absorption and distributed reasoning.
*   **If $P_{SA} > 0.45$:** The "Coordination Tax" (overhead, fragmentation) often exceeds the benefits of collaboration. A Single-Agent System is likely more efficient.

### The Tool-Coordination Trade-off
Tool-heavy tasks suffer disproportionately from multi-agent overhead. MAS fragments the per-agent token budget and increases orchestration complexity.
*   **Rule:** As tool count ($T$) increases, the efficiency of MAS decreases relative to SAS. For tasks with high tool counts (e.g., $T > 10$), prioritize SAS or highly efficient Centralized architectures.

---

## 2. Topology Selection Guide

If you decide to use MAS, choose the topology that matches your **Task Structure**.

| Topology | Best For... | Performance Impact | Key Mechanism |
| :--- | :--- | :--- | :--- |
| **SAS (Single-Agent)** | Sequential reasoning, high-baseline tasks, high tool counts. | Baseline reference. | Unified memory, no overhead. |
| **Centralized** | Parallelizable tasks (e.g., Finance, Analysis). | +80.9% on parallel tasks. | Orchestrator validation bottleneck. |
| **Decentralized** | Dynamic environments (e.g., Web navigation), high-entropy search. | +9.2% on dynamic tasks. | Peer-to-peer debate/consensus. |
| **Independent** | Simple ensembling (Non-agentic tasks). | **-35% to -70%** on agentic tasks. | No communication; error amplification. |

### Critical Topology Risks
1.  **Independent MAS is Dangerous:** Without a verification mechanism, Independent agents amplify errors **17.2x** through unchecked propagation.
2.  **Sequential Tasks Fail in MAS:** For tasks requiring strictly sequential state-dependent reasoning (e.g., complex planning), MAS variants consistently degrade performance by **39% to 70%**.

---

## 3. Coordination Metrics & Scaling Laws

Use these metrics to audit and optimize your agentic systems.

### Error Amplification ($A_e$)
Measures whether MAS corrects or propagates errors ($A_e = E_{MAS} / E_{SAS}$).
*   **Goal:** $A_e < 1.0$ (Error absorption).
*   **Centralized:** $A_e \approx 4.4$ (contained).
*   **Independent:** $A_e \approx 17.2$ (catastrophic).

### Message Density ($c$)
The number of inter-agent messages per reasoning turn.
*   **Saturation Point:** Performance plateaus at **$c \approx 0.39$ messages/turn**.
*   **Optimization:** Increasing communication beyond this point yields diminishing returns and increases cost without improving success.

### Turn Scaling (Power Law)
The total number of reasoning turns ($T$) grows super-linearly with the number of agents ($n$):
$$T = 2.72 	imes (n + 0.5)^{1.724}$$
*   **Implication:** Beyond 3–4 agents, the communication cost typically dominates reasoning capability, creating a "hard resource ceiling."

---

## 4. Summary Checklist for Architects
1.  **Establish Baseline:** What is the $P_{SA}$? If $>0.45$, stick to SAS.
2.  **Analyze Decomposability:** Is the task parallelizable? Use **Centralized**.
3.  **Check Sequential Depth:** Is it a strict sequence of state-dependent actions? Use **SAS**.
4.  **Audit Tool Count:** Does the task require many tools? Use **SAS** or a very slim **Centralized** model.
5.  **Enforce Validation:** If using MAS, ensure there is an orchestrator (Centralized) or debate loop (Decentralized) to prevent error amplification. **Never use Independent MAS for agentic tasks.**
