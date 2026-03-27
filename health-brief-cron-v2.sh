#!/bin/bash

###
# Health Brief Cron Wrapper v2
#
# Runs at 07:30 AEDT daily
# - Executes the health-brief-generator-v2.js
# - Sends output to Telegram
# - Logs all activity to health-brief-cron.log
# - Timezone: Australia/Sydney
###

set -e

# Configuration
SCRIPT_DIR="/var/lib/openclaw/.openclaw/workspace"
GENERATOR="${SCRIPT_DIR}/health-brief-generator-v2.js"
OUTPUT="${SCRIPT_DIR}/daily-health-brief.md"
LOG_DIR="${SCRIPT_DIR}/logs"
LOG_FILE="${LOG_DIR}/health-brief-cron.log"

# Ensure log directory exists
mkdir -p "${LOG_DIR}"

# Logging function with timezone
log() {
  local timestamp=$(TZ='Australia/Sydney' date '+%Y-%m-%d %H:%M:%S')
  echo "[${timestamp}] $1" | tee -a "${LOG_FILE}"
}

log "=========================================="
log "Health Brief Generation Started (Cron)"
log "=========================================="

# Set timezone for Node.js
export TZ=Australia/Sydney

# Load environment (if .env exists)
if [ -f "${SCRIPT_DIR}/.env" ]; then
  set -a
  source "${SCRIPT_DIR}/.env"
  set +a
  log "✓ Loaded environment from .env"
fi

# Run the generator
if [ ! -f "${GENERATOR}" ]; then
  log "✗ Generator script not found: ${GENERATOR}"
  exit 1
fi

log "Executing generator..."
if node "${GENERATOR}" >> "${LOG_FILE}" 2>&1; then
  log "✓ Generator completed successfully"
  
  # Check if output was generated
  if [ -f "${OUTPUT}" ]; then
    log "✓ Output file created: ${OUTPUT}"
    
    # Optional: Send to Telegram via openclaw message tool
    if [ -n "${TELEGRAM_HEALTH_BRIEF_TARGET}" ]; then
      log "Sending to Telegram..."
      # Note: The generator handles this internally, but can add extra confirmation here
    fi
  else
    log "⚠ Warning: Output file not created"
  fi
else
  log "✗ Generator failed with exit code $?"
  exit 1
fi

log "=========================================="
log "Health Brief Generation Complete"
log "=========================================="
