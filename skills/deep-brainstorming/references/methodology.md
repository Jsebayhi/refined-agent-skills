# Brainstorming Methodology

## Tree of Thoughts (ToT)
Tree of Thoughts is a framework for solving complex problems by exploring multiple reasoning paths. Instead of a linear sequence of thoughts, the agent generates several "thoughts" at each step, evaluates them, and explores the most promising ones.

### Application in Brainstorming:
1.  **Branching:** Generate 3 diverse high-level strategies for the problem.
2.  **Pruning:** Eliminate strategies that don't meet hard constraints.
3.  **Refinement:** Deepen the most promising strategy.

## Red-Teaming (The Adversarial Approach)
Red-Teaming involves taking an adversarial perspective to stress-test a proposed solution.

### Core Questions:
- "What if the primary dependency fails?"
- "Where is the single point of failure?"
- "Does this solution introduce more complexity than the problem it solves?"
- "What are the unspoken assumptions here?"
- "If we had to build this in half the time, what would change?"
