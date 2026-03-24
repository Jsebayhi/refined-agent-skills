#!/bin/bash
# initialize_state.sh: Safe, deterministic task-state initialization

# Resolve absolute path to the skill directory
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR=".gemini/skills/current-task-state"
ASSET_FILE="$SKILL_DIR/assets/task-state-template.md"
STEP_ID="${1:-discovery}"

# 1. Create directory structure
mkdir -p "$TARGET_DIR/references"

# 2. Update .gitignore safely
if ! grep -q "$TARGET_DIR/" .gitignore 2>/dev/null; then
    echo "$TARGET_DIR/" >> .gitignore
fi

# 3. Copy/Initialize SKILL.md safely
if [ ! -f "$TARGET_DIR/SKILL.md" ]; then
    if [ -f "$ASSET_FILE" ]; then
        cp "$ASSET_FILE" "$TARGET_DIR/SKILL.md"
        echo "SUCCESS: Task state initialized at $TARGET_DIR/SKILL.md"
    else
        echo "ERROR: Template asset not found at $ASSET_FILE"
        exit 1
    fi
fi

# 4. Initialize Core Shards safely (No overwrite)
declare -a shards=("original_goal" "plan" "strategies")

for shard in "${shards[@]}"; do
    FILE="$TARGET_DIR/references/${STEP_ID}_${shard}.md"
    if [ ! -f "$FILE" ]; then
        case $shard in
            "original_goal") echo "# Original Goal" > "$FILE" ;;
            "plan") echo "# Detailed Execution Plan" > "$FILE" ;;
            "strategies") echo "# Solution Strategies (Hardened)" > "$FILE" ;;
        esac
        echo "SUCCESS: Created $FILE"
    fi
done

# 5. Initialize First Intelligence Shards
if [ ! -f "$TARGET_DIR/references/human_gathered_context.md" ]; then
    echo "# Human Intelligence (Guaranteed)" > "$TARGET_DIR/references/human_gathered_context.md"
fi
if [ ! -f "$TARGET_DIR/references/auto_gathered_initial_research.md" ]; then
    echo "# Autonomous Intelligence (Scrutinized Evidence)" > "$TARGET_DIR/references/auto_gathered_initial_research.md"
fi
