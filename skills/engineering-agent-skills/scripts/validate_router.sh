#!/bin/bash
# validate_router.sh - Universal Skill Validation Router

SKILL_DIR=$1
SCRIPT_DIR="$(dirname "$0")"

if [ -z "$SKILL_DIR" ]; then
    echo "Usage: bash scripts/validate_router.sh <path_to_skill>"
    exit 1
fi

echo "Initiating Progressive Validation for: $SKILL_DIR..."

# --- TIER 0: NPX SKILLS-REF (GOLD STANDARD) ---
if command -v npx >/dev/null 2>&1; then
    echo "📦 [Tier 0] Node/NPX detected. Running official 'skills-ref' validator..."
    if npx skills-ref validate "$SKILL_DIR"; then
        # Proceed to our opinionated JS linter for deeper checks
        node "$SCRIPT_DIR/validate.js" "$SKILL_DIR"
        exit $?
    fi
fi

# --- TIER 1: NATIVE NODE FALLBACK ---
if command -v node >/dev/null 2>&1; then
    echo "🌱 [Tier 1] Native Node detected. Running opinionated JS linter..."
    node "$SCRIPT_DIR/validate.js" "$SKILL_DIR"
    exit $?
fi

# --- TIER 2: DOCKER ISOLATION (BROWSER/SANDBOX) ---
if command -v docker >/dev/null 2>&1; then
    echo "🐳 [Tier 2] Docker detected. Running in sandboxed node container..."
    docker run --rm -v "$(pwd):/app" -w /app node:current-slim node "skills/engineering-agent-skills/scripts/validate.js" "$SKILL_DIR"
    exit $?
fi

echo "❌ [FATAL] No validation tiers available. Please install Node.js or Docker."
exit 1
