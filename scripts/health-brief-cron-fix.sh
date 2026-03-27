#!/bin/bash

###############################################################################
# HEALTH BRIEF CRON — FIXED
# Generates brief + writes to file (guaranteed)
# Then attempts to send via background process (doesn't block on failure)
###############################################################################

export TZ=Australia/Sydney
LOG_DIR="/var/lib/openclaw/.openclaw/workspace/logs"
LOG_FILE="$LOG_DIR/health-brief-cron.log"
mkdir -p "$LOG_DIR"

log_entry() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"
}

log_entry "=== Health Brief Generation Started ==="

GENERATOR="/var/lib/openclaw/.openclaw/workspace/scripts/health-brief-production.js"
OUTPUT_FILE="/var/lib/openclaw/.openclaw/workspace/daily-health-brief.md"

# GENERATE BRIEF (primary goal — must succeed)
if BRIEF=$(node "$GENERATOR" 2>&1); then
  log_entry "✓ Generator completed"
  echo "$BRIEF" > "$OUTPUT_FILE"
  log_entry "✓ Brief saved to $OUTPUT_FILE"
  
  # SEND TO TELEGRAM (secondary — doesn't block if it fails)
  # Write brief to temp file for sending
  TEMP_BRIEF="/tmp/health-brief-$$.txt"
  echo "$BRIEF" > "$TEMP_BRIEF"
  
  # Attempt send in background (doesn't wait)
  {
    sleep 2  # Small delay to ensure cron has finished cleanup
    
    # Try to send via message tool directly
    if command -v message >/dev/null 2>&1; then
      message send \
        --channel telegram \
        --target 8593559681 \
        --message "$(cat $TEMP_BRIEF)" \
        2>> "$LOG_FILE"
      
      if [ $? -eq 0 ]; then
        log_entry "✓ Telegram delivery successful"
      else
        log_entry "⚠ Telegram delivery failed (but brief was generated)"
      fi
    else
      log_entry "⚠ message tool not available in cron environment"
    fi
    
    rm -f "$TEMP_BRIEF"
  } &
  
  log_entry "=== Health Brief Generation Completed ==="
  exit 0
else
  log_entry "✗ Generator failed"
  log_entry "$BRIEF"
  exit 1
fi
