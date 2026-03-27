#!/bin/bash

###############################################################################
# DASHBOARD UPDATE — Every 30 minutes
# Regenerates dashboard HTML and pushes to GitHub Pages
###############################################################################

set -e

export TZ=Australia/Sydney
LOG_DIR="/var/lib/openclaw/.openclaw/workspace/logs"
LOG_FILE="$LOG_DIR/dashboard-update.log"
mkdir -p "$LOG_DIR"

log_entry() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"
}

log_entry "=== Dashboard Update Started ==="

# Regenerate dashboard with current data
DASHBOARD_FILE="/var/lib/openclaw/.openclaw/workspace/dashboard/index.html"
REPO_DIR="/tmp/dashboardME"

# Pull latest from GitHub
cd "$REPO_DIR"
git pull origin main > /dev/null 2>&1 || true

# Copy updated dashboard
cp "$DASHBOARD_FILE" "$REPO_DIR/index.html"

# Check if there are changes
if ! git diff --quiet index.html; then
  log_entry "Changes detected. Pushing to GitHub..."
  
  git add index.html
  git config user.email "jarvis@openclaw.local"
  git config user.name "Jarvis"
  git commit -m "Auto-update dashboard — $(date '+%Y-%m-%d %H:%M AEDT')" > /dev/null
  
  if git push origin main > /dev/null 2>&1; then
    log_entry "✅ Dashboard pushed successfully"
  else
    log_entry "⚠️ Push failed (may be rate limited or network issue)"
  fi
else
  log_entry "ℹ️ No changes to push"
fi

log_entry "=== Dashboard Update Complete ==="
