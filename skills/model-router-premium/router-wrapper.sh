#!/bin/bash
# router-wrapper.sh — auto-select model based on task complexity
# Usage: ./router-wrapper.sh "Your task description here"

TASK="$1"
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODELS_FILE="$SKILL_DIR/models-matt.json"

if [[ -z "$TASK" ]]; then
    echo "anthropic/claude-haiku-4-5" # default
    exit 0
fi

# Run router and extract model name
MODEL=$(python3 "$SKILL_DIR/scripts/router.py" --models "$MODELS_FILE" --task "$TASK" 2>/dev/null | grep -m1 '"name"' | grep -oP ':\s*"\K[^"]+')

if [[ -z "$MODEL" ]]; then
    echo "anthropic/claude-haiku-4-5" # fallback to haiku if router fails
else
    echo "$MODEL"
fi
