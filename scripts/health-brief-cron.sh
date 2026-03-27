#!/bin/bash

# Daily Health Brief Cron Wrapper
# Runs at 07:30 AEDT (21:30 UTC previous day)
# Fetches WHOOP + StrengthInsight data, generates coaching brief, sends to Telegram

set -e

WORKSPACE="/var/lib/openclaw/.openclaw/workspace"
MEDIA_DIR="/var/lib/openclaw/.openclaw/media/inbound"
LOG_FILE="$WORKSPACE/logs/health-brief-cron.log"
mkdir -p "$WORKSPACE/logs"

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Health brief generation started" >> "$LOG_FILE"

# Refresh StrengthInsight cache (find latest export, copy to workspace)
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Refreshing StrengthInsight cache..." >> "$LOG_FILE"
LATEST_SI=$(ls -t "$MEDIA_DIR"/strengthinsight-ai-export*.json 2>/dev/null | head -1)
if [ ! -z "$LATEST_SI" ]; then
  cp "$LATEST_SI" "$WORKSPACE/.strengthinsight-latest.json"
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] ✓ Cache refreshed: $(basename $LATEST_SI)" >> "$LOG_FILE"
else
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️ No StrengthInsight export found, using existing cache" >> "$LOG_FILE"
fi

# Run generator
cd "$WORKSPACE"
node health-brief-generator.js >> "$LOG_FILE" 2>&1

if [ $? -eq 0 ]; then
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] ✓ Brief generated successfully" >> "$LOG_FILE"
  
  # Send to Telegram via OpenClaw message tool (local, no external API needed)
  # Usage: openclaw message send --target <user-id> --message <text> --channel telegram
  
  BRIEF_CONTENT=$(cat "$WORKSPACE/daily-health-brief.md")
  
  # Use openclaw CLI to send message
  echo "Sending brief to Telegram..." >> "$LOG_FILE"
  openclaw message send \
    --target "8593559681" \
    --message "$BRIEF_CONTENT" \
    --channel telegram >> "$LOG_FILE" 2>&1
  
  if [ $? -eq 0 ]; then
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ✓ Brief sent to Telegram (message tool)" >> "$LOG_FILE"
  else
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️ Telegram send failed, but brief generated OK" >> "$LOG_FILE"
  fi
else
  echo "[$(date +'%Y-%m-%d %H:%M:%S')] ✗ Brief generation failed" >> "$LOG_FILE"
  exit 1
fi
