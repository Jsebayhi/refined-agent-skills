/**
 * Defensive Node.js Validator for Agent Skills.
 * Enforces agentskills.io spec + Universal Skill Architect opinionated best practices.
 */

const fs = require('node:fs');
const path = require('node:path');

function validate(skillDir) {
  const skillFile = path.join(skillDir, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    console.error('❌ Error: Missing main instruction file. Must be exactly "SKILL.md".');
    process.exit(1);
  }

  const content = fs.readFileSync(skillFile, 'utf8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  
  if (!fmMatch) {
    console.error('❌ Error: Invalid or missing YAML frontmatter separators (---).');
    process.exit(1);
  }

  const fmText = fmMatch[1];
  
  // Robust field extraction without external YAML dependency
  const getField = (key) => {
    const regex = new RegExp(`^${key}:\\s*(.*)$`, 'm');
    const match = fmText.match(regex);
    if (!match) return null;
    return match[1].replace(/^['"]|['"]$/g, '').trim();
  };

  const name = getField('name');
  const description = getField('description');

  // --- LINTING: ALLOWED FIELDS (Strict Whitelist) ---
  const ALLOWED_FIELDS = new Set(["name", "description", "license", "allowed-tools", "metadata", "compatibility"]);
  const lines = fmText.split('\n');
  lines.forEach(line => {
    const keyMatch = line.match(/^([a-z0-9-]+):/);
    if (keyMatch && !ALLOWED_FIELDS.has(keyMatch[1])) {
      console.error(`❌ Error: Unexpected field "${keyMatch[1]}" in frontmatter. Only ${[...ALLOWED_FIELDS].join(", ")} are allowed.`);
      process.exit(1);
    }
  });

  // --- LINTING: NAME (Unicode Support) ---
  if (!name) {
    console.error("❌ Error: 'name' field is missing from frontmatter.");
    process.exit(1);
  }
  if (name.length > 64) {
    console.error(`❌ Error: 'name' exceeds 64 characters (${name.length}).`);
    process.exit(1);
  }
  // Simplified Unicode check: No capitals, no invalid hyphen placement
  if (name !== name.toLowerCase()) {
    console.error("❌ Error: 'name' must be lowercase.");
    process.exit(1);
  }
  if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) {
    console.error("❌ Error: 'name' has invalid hyphen placement.");
    process.exit(1);
  }
  // Verify basic character set (alphanumeric + hyphen)
  if (!/^[\p{L}\p{N}-]+$/u.test(name)) {
    console.error("❌ Error: 'name' contains invalid characters. Only letters, digits, and hyphens allowed.");
    process.exit(1);
  }
  
  const parentDir = path.basename(path.resolve(skillDir));
  if (name !== parentDir) {
    console.error(`❌ Error: Frontmatter name "${name}" must match directory name "${parentDir}".`);
    process.exit(1);
  }

  // --- LINTING: DESCRIPTION ---
  if (!description) {
    console.error("❌ Error: 'description' field is missing.");
    process.exit(1);
  }
  if (description.length > 1024) {
    console.error("❌ Error: 'description' is too long (> 1024).");
    process.exit(1);
  }
  if (/<[^>]+>/.test(description)) {
    console.error("❌ Error: 'description' contains forbidden XML tags.");
    process.exit(1);
  }

  // --- OPINIONATED LINTING (SOLVE, DON'T PUNT) ---
  if (content.length > 25000 && !content.includes('[references/')) {
    console.warn("⚠️  Warning: SKILL.md is large but no references found. Consider progressive disclosure.");
  }

  console.log(`✅ Skill "${name}" is structurally valid.`);
  process.exit(0);
}

const target = process.argv[2] || '.';
validate(path.resolve(target));
