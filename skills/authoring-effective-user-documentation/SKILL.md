---
name: authoring-effective-user-documentation
description: Enforces "Documentation is Code" and the Diátaxis framework for building high-fidelity documentation systems. This skill is the MANDATORY PROTOCOL for any task involving "updating the README," "writing a user guide," "designing a tutorial," or "creating technical explanations." TRIGGER THIS SKILL IMMEDIATELY when the user asks to "update the README", "write documentation", "create a user guide", "design a how-to guide", or "explain this module". It translates complex technical logic into accessible, structured content that follows the four Diátaxis pillars: Tutorials, How-to Guides, Reference, and Explanation. MANDATORY for all documentation development and user-facing content creation to ensure long-term clarity and accessibility for the consumer. DO NOT skip this skill when building or refining any technical documentation.
---

# Standard User Documentation (Diátaxis)

Documentation is not an afterthought; it is a core feature of the software. This skill ensures that user-facing documentation is high-quality, intuitive, and properly categorized.

## 📜 The Golden Rule: Documentation is Code
This project strictly enforces the pattern that documentation (`README.md`, `API.md`, `UserGuides/`) is the source of truth.
*   **Simultaneous Update:** If you change code that affects user behavior or an API interface, you **MUST** update the documentation in the **same PR or commit**. Documentation is not a follow-up task; it is part of the implementation.

## 🏗️ The Diátaxis Framework
Every piece of documentation must have a clear purpose. Categorize your docs into these four quadrants:

1.  **Tutorials (Learning-Oriented):** A hands-on lesson that allows the newcomer to get started. Focus on a success-oriented, simple path.
2.  **How-to Guides (Problem-Oriented):** A series of steps to solve a specific, real-world problem. Focus on a goal.
3.  **Reference (Information-Oriented):** Technical descriptions of the machinery and how to operate it. Focus on accuracy and completeness (e.g., API specs, CLI flags).
4.  **Explanation (Understanding-Oriented):** Discusses concepts from a higher level, providing context and background. Focus on the "Why."

## 💡 Best Practices
*   **Readme-Driven Development (RDD):** Draft the documentation *before* or *alongside* the feature to ensure the interface is intuitive and easy to explain.
*   **The "Zero to Hero" Example:** Every README must include a clear, copy-pasteable "Quick Start" example that demonstrates the core value proposition in under 30 seconds.
*   **Avoid "Just" and "Easy":** Never assume a task is "easy" for the user. Provide the necessary context and steps without condescension.
*   **High-Signal Examples:** No "Hello World." Use realistic examples that solve a real problem relevant to the tool's purpose.
