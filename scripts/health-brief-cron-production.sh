#!/bin/bash

###############################################################################
# PRODUCTION HEALTH BRIEF CRON — FIXED
# 1. Generate brief (always)
# 2. Save to file (guaranteed)
# 3. Send to Telegram (best effort)
###############################################################################

export TZ=Australia/Sydney
export TELEGRAM_BOT_TOKEN="8671614374:AAGRB06e0rpS1Pzr0-v1ocTbEJzzxOXF75s"
export WHOOP_CLIENT_ID="28d62430-ca2d-4c3f-81bf-1a0513b242f5"
export WHOOP_CLIENT_SECRET="3ecbd1b2d5f575553ba5da5d7a7c7437b6541a743e4b6cc7f3805e94a5148349"
LOG_DIR="/var/lib/openclaw/.openclaw/workspace/logs"
LOG_FILE="$LOG_DIR/health-brief-cron.log"
mkdir -p "$LOG_DIR"

log_entry() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"
}

log_entry "=== Health Brief Generation Started ==="

GENERATOR="/var/lib/openclaw/.openclaw/workspace/scripts/health-brief-production.js"
TELEGRAM_SEND="/var/lib/openclaw/.openclaw/workspace/scripts/health-brief-telegram-send.js"
OUTPUT_FILE="/var/lib/openclaw/.openclaw/workspace/daily-health-brief.md"

# Step 1: Generate brief
if BRIEF=$(node "$GENERATOR" 2>&1); then
  log_entry "✓ Generator completed successfully"
  
  # Step 2: Save to file
  echo "$BRIEF" > "$OUTPUT_FILE"
  log_entry "✓ Brief saved to $OUTPUT_FILE"
  
  # Step 3: Send to Telegram (best effort, doesn't block)
  log_entry "Attempting Telegram delivery..."
  bash /var/lib/openclaw/.openclaw/workspace/scripts/health-brief-telegram-send.sh >> "$LOG_FILE" 2>&1
  
  if [ $? -eq 0 ]; then
    log_entry "✓ Telegram delivery successful"
  else
    log_entry "⚠ Telegram delivery failed (brief still generated to file)"
  fi
  
  log_entry "=== Health Brief Generation Completed Successfully ==="
  exit 0
else
  log_entry "✗ Generator failed"
  log_entry "$BRIEF"
  exit 1
fi
