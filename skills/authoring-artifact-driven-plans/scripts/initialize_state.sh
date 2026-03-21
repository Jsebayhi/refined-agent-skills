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
fi

# 3. Copy the template
if [ -f "$ASSET_FILE" ]; then
    cp "$ASSET_FILE" "$TARGET_DIR/SKILL.md"
else
    exit 1
fi

# 4. Initialize Core Shards
echo "# Original Goal" > "$TARGET_DIR/references/${PREFIX}_original_goal.md"
echo "# Human Intelligence (Guaranteed)" > "$TARGET_DIR/references/${PREFIX}_human_intel.md"
echo "# Autonomous Intelligence (Scrutinized)" > "$TARGET_DIR/references/${PREFIX}_autonomous_intel.md"
echo "# Detailed Execution Plan" > "$TARGET_DIR/references/${PREFIX}_plan.md"
