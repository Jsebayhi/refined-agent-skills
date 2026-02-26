#!/bin/bash
# validate_router.sh - Multi-tiered validation router for Deep Reading Skill

# Check if a file was provided as an argument
if [ -z "$1" ]; then
    echo "Usage: bash scripts/validate_router.sh <report_file.md>"
    exit 1
fi

REPORT_FILE=$1

# Tier 0: Check if Node.js is installed
if command -v node >/dev/null 2>&1; then
    node "$(dirname "$0")/validate_coverage.js" "$REPORT_FILE"
    exit $?
fi

# Tier 1: Check if Docker is installed
if command -v docker >/dev/null 2>&1; then
    docker run --rm -v "$(pwd):/app" -w /app node:current-slim node "skills/deep-reading-agent-skill/scripts/validate_coverage.js" "$REPORT_FILE"
    exit $?
fi

# If no validation tier is available
echo "Error: No validation tier (Node.js or Docker) found. Validation failed."
exit 1
