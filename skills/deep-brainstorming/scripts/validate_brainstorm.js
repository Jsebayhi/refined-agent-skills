/**
 * Deep Brainstorming Validator
 * 
 * RATIONALE:
 * This script ensures the agent has actually explored the idea space 
 * and hasn't jumped to implementation.
 */

const fs = require('fs');

const reportFile = process.argv[2];
if (!reportFile) {
  console.error("Usage: node validate_brainstorm.js <report_file>");
  process.exit(1);
}

try {
  const content = fs.readFileSync(reportFile, 'utf8');
  const lowercaseContent = content.toLowerCase();

  // 1. Structural Mandates (Alignment, Exploration)
  const mandatorySections = ['alignment', 'exploration'];
  const missingSections = mandatorySections.filter(s => !lowercaseContent.includes(s));
  if (missingSections.length > 0) {
    console.error(`Error: Missing mandatory sections: ${missingSections.join(', ')}.`);
    process.exit(1);
  }

  // 2. Tree of Thought Mandate (At least 2 options/alternatives)
  const optionIndicators = ['option', 'alternative', 'strategy', 'approach'];
  const matches = content.match(new RegExp(optionIndicators.join('|'), 'gi')) || [];
  if (matches.length < 3) { // Expecting at least 2 options and some discussion
    console.error("Error: The brainstorm lacks divergent thinking. Propose at least 2-3 distinct alternatives.");
    process.exit(1);
  }

  // 3. Red-Teaming Mandate (Check for challenges/weaknesses)
  const challengeIndicators = ['red-team', 'challenge', 'weakness', 'risk', 'fail', 'assumption'];
  const challengeMatches = content.match(new RegExp(challengeIndicators.join('|'), 'gi')) || [];
  if (challengeMatches.length < 2) {
    console.error("Error: The brainstorm lacks critical analysis (Red-Teaming). Challenge each option.");
    process.exit(1);
  }

  // 4. Negative Constraint: No Implementation (Check for large code blocks)
  const codeBlockRegex = /```[a-z]*
[\s\S]{300,}
```/g; // Large code blocks (>300 chars)
  if (codeBlockRegex.test(content)) {
    console.error("Error: Brainstorming phase contains excessive implementation (large code blocks). Focus on design and strategy first.");
    process.exit(1);
  }

  console.log("VALIDATION SUCCESS: Deep Brainstorming verified.");
  process.exit(0);

} catch (err) {
  console.error(`Validation Error: ${err.message}`);
  process.exit(1);
}
