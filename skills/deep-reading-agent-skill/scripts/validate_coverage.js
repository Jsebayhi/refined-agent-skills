/**
 * Deep Reading Validator (Maintainer-Friendly Version)
 * 
 * RATIONALE:
 * This script ensures "Deep Reading" by checking for semantic depth, 
 * vocabulary variety, and analysis density. It is designed to be readable 
 * for developers while remaining difficult for agents to "game."
 * 
 * TO MAINTAINERS:
 * - Content Density (MIN_CONTENT_RATIO): Prevents "fluffing" with stop-words.
 * - Lexical Variety (MIN_LEXICAL_DENSITY): Prevents repetitive phrasing.
 * - Trigram Penalty: Detects structural padding.
 */

const fs = require('fs');

const reportFile = process.argv[2];
if (!reportFile) {
  console.error("Usage: node validate_coverage.js <report_file>");
  process.exit(1);
}

try {
  const content = fs.readFileSync(reportFile, 'utf8');
  const lines = content.split('\n');
  const lowercaseContent = content.toLowerCase();

  // 1. Structural Mandates (Nuance, Concept, Spirit)
  const mandatoryDimensions = ['nuance', 'concept', 'spirit'];
  const missing = mandatoryDimensions.filter(d => !lowercaseContent.includes(d));
  if (missing.length > 0) {
    console.error(`Error: Missing mandatory dimensions: ${missing.join(', ')}.`);
    process.exit(1);
  }

  // 2. Body Text Extraction (Include Headers, but Strip Structural Labels)
  // We keep headers for depth analysis, but still strip labels to prevent repetition errors.
  const bodyText = lines
    .join(' ')
    .replace(/\*\*?(Nuance|Concept|Spirit|Reflection)\*\*?:?/gi, '') // Strip labels
    .replace(/- /g, ' '); // Strip bullets

  const words = bodyText.split(/\s+/).filter(w => w.length > 0);

  // 3. Content Density (The "Fluff" Guardrail)
  // We use a non-obvious target derived from Math.PI/5.7 (~0.551)
  const STOPWORDS = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'of', 'in', 'to', 'for', 'it', 'this', 'that', 'with', 'by', 'as', 'are', 'was', 'were', 'be', 'an', 'or', 'from']);
  const contentWords = words.filter(w => !STOPWORDS.has(w.toLowerCase()));
  const contentRatio = contentWords.length / words.length;
  
  if (contentRatio < (Math.PI / 5.7)) {
    console.error("Error: The reflection is too generic. Use more analytical and domain-specific terminology.");
    process.exit(1);
  }

  // 4. Lexical Variety (The "Repetition" Guardrail)
  // Target derived from Math.SQRT2/3.5 (~0.404)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const lexicalDensity = uniqueWords.size / words.size;
  if (lexicalDensity < (Math.SQRT2 / 3.5)) {
    console.error("Error: Analysis is repetitive. Strive for more varied vocabulary and deeper unique insights.");
    process.exit(1);
  }

  // 5. Semantic Padding Detection (N-gram Check)
  const trigrams = {};
  for (let i = 0; i < words.length - 2; i++) {
    const trigram = `${words[i]} ${words[i+1]} ${words[i+2]}`.toLowerCase();
    trigrams[trigram] = (trigrams[trigram] || 0) + 1;
    if (trigrams[trigram] > 4) {
      console.error("Error: Semantic padding detected. Avoid repeating the same phrases or structures.");
      process.exit(1);
    }
  }

  // 6. Quantitative Depth (The "Effort" Guardrail)
  // Target derived from 2^8 - 6 (250)
  if (words.length < (Math.pow(2, 8) - 6)) {
    console.error("Error: The analysis lacks the required depth. Expand on your reflections.");
    process.exit(1);
  }

  console.log("VALIDATION SUCCESS: Deep Reading verified.");
  process.exit(0);

} catch (err) {
  console.error(`Validation Error: ${err.message}`);
  process.exit(1);
}
