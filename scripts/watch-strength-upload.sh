#!/bin/bash

# Watch for StrengthInsight JSON uploads and auto-trigger health brief
# Place in cron: @daily, or use systemd timer

STRENGTH_DIR="/var/lib/openclaw/.openclaw/media/inbound"
GENERATOR_SCRIPT="/var/lib/openclaw/.openclaw/workspace/scripts/health-brief-generator.js"
LAST_BRIEF_FILE="/var/lib/openclaw/.openclaw/workspace/.last-brief-timestamp"

# Only run once per day
if [ -f "$LAST_BRIEF_FILE" ]; then
  LAST_RUN=$(cat "$LAST_BRIEF_FILE")
  TODAY=$(date +%Y-%m-%d)
  if [ "$LAST_RUN" = "$TODAY" ]; then
    exit 0
  fi
fi

# Find latest StrengthInsight upload
LATEST_UPLOAD=$(find "$STRENGTH_DIR" -name "*strengthinsight*" -type f 2>/dev/null | sort -r | head -1)

if [ -z "$LATEST_UPLOAD" ]; then
  echo "❌ No StrengthInsight upload found"
  exit 1
fi

echo "✅ Found StrengthInsight: $LATEST_UPLOAD"

# Run generator with the upload
export TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
export TELEGRAM_CHAT_ID="${TELEGRAM_CHAT_ID}"

node "$GENERATOR_SCRIPT" --strength-path "$LATEST_UPLOAD"

# Record today
date +%Y-%m-%d > "$LAST_BRIEF_FILE"

echo "✅ Health brief generated"
