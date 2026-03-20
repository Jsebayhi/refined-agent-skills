#!/bin/bash
# initialize_state.sh: Router for task-state initialization

# Resolve the absolute path to the skill directory
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR=".gemini/skills/current-task-state"
ASSET_FILE="$SKILL_DIR/assets/task-state-template.md"
PREFIX="${1:-STEP}"

# 1. Create directory structure
mkdir -p "$TARGET_DIR/references"

# 2. Update .gitignore if needed
if ! grep -q "$TARGET_DIR/" .gitignore 2>/dev/null; then
    echo "$TARGET_DIR/" >> .gitignore
    echo "Added $TARGET_DIR/ to .gitignore"
fi

# 3. Copy the template
if [ -f "$ASSET_FILE" ]; then
    cp "$ASSET_FILE" "$TARGET_DIR/SKILL.md"
    echo "SUCCESS: Task state initialized at $TARGET_DIR/SKILL.md"
else
    echo "ERROR: Template asset not found at $ASSET_FILE"
    exit 1
fi

# 4. Initialize sharded plan
PLAN_SHARD="$TARGET_DIR/references/${PREFIX}_plan.md"
if [ ! -f "$PLAN_SHARD" ]; then
    echo "# Execution Plan: $PREFIX" > "$PLAN_SHARD"
    echo "## Detailed Micro-Tasks" >> "$PLAN_SHARD"
    echo "- [ ] Initial Research" >> "$PLAN_SHARD"
    echo "SUCCESS: Initial plan shard created at $PLAN_SHARD"
fi
