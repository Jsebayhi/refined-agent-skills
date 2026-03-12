#!/bin/bash

# Universal Router for GitLab Management
# Follows the standard multi-tiered fallback pattern.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INTERNAL_LOGIC="${SCRIPT_DIR}/manage_gitlab_internal.js"

# Check for Node.js
if ! command -v node >/dev/null 2>&1; then
    echo "Error: Node.js is required to run the internal logic."
    exit 1
fi

# Route to the internal logic
node "$INTERNAL_LOGIC" "$@"
