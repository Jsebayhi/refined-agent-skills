# Evaluation and Iteration

Building a robust skill requires test-driven development and systematic iteration. Do not write extensive documentation before verifying the skill solves real problems.

## 1. Build Evaluations First (Evaluation-Driven Development)
Before finalizing the skill instructions, define an evaluation rubric:
1. **Identify gaps:** Run the agent on representative tasks *without* a skill to establish a baseline. Note where it fails or requires excessive prompting.
2. **Create evaluations:** Define 3 core scenarios (queries) that test these specific gaps.
3. **Write minimal instructions:** Create just enough content in `SKILL.md` to address the gaps and pass the evaluations.

## 2. Iterative Development with Two Instances
The most effective way to refine a skill is to use two separate agent instances (or contexts):
*   **The Architect (Instance A):** The agent you use to write, format, and organize the `SKILL.md` and reference files.
*   **The Tester (Instance B):** A fresh agent instance loaded *with* your draft skill. 
Provide Instance B with a real task. Observe its behavior. If it misses a step, struggles with an error, or hallucinates, bring those observations back to Instance A to refine the skill instructions.

## 3. Testing Dimensions
When verifying the skill, ensure you test across these dimensions:
- **Triggering Tests:** Does the skill trigger when the user asks obvious queries? Does it trigger on paraphrased requests? Ensure it *doesn't* trigger on unrelated topics (preventing over-triggering).
- **Functional Tests:** Does it produce the correct output? Do API/MCP calls succeed? Are edge cases properly handled?
- **Model Variability:** If the skill will be used by different underlying models (e.g., Haiku vs. Opus), test across them. A fast model might need more explicit guidance, while a reasoning-heavy model might overcomplicate things if instructions are too prescriptive.

## 4. Observe Navigation Paths
Pay attention to how the agent navigates the skill's filesystem:
- **Missed connections:** Does the agent fail to follow references? Links might need to be more prominent.
- **Overreliance on sections:** If the agent repeatedly reads the same reference file, consider moving that critical information into the main `SKILL.md`.
- **Ignored content:** If a bundled file is never accessed, it is either unnecessary or poorly signaled.