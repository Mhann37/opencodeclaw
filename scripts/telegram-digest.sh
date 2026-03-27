#!/bin/bash

###############################################################################
# TELEGRAM DAILY DIGEST — 6pm (18:00 AEDT)
# Sends daily summary: items for attention, backlog, upcoming tasks, wins
###############################################################################

set -e

export TZ=Australia/Sydney
export TELEGRAM_BOT_TOKEN="8671614374:AAGRB06e0rpS1Pzr0-v1ocTbEJzzxOXF75s"
CHAT_ID="8593559681"
LOG_DIR="/var/lib/openclaw/.openclaw/workspace/logs"
LOG_FILE="$LOG_DIR/telegram-digest.log"
mkdir -p "$LOG_DIR"

log_entry() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" >> "$LOG_FILE"
}

log_entry "=== Daily Digest Started ==="

# Generate digest message
cat > /tmp/digest.txt << 'EOF'
📋 **DAILY DIGEST — Fri 27 Mar, 6:00 PM AEDT**

━━ **Items for Your Attention** ━━

⚠️ **WHOOP API:** Still using fallback. Need token to get live data.

📌 **Articles 2-4:** Ready for Claude Code + publishing (target: this week)

🔄 **JoelCaine Framework:** Underperforming (40% vs 60-65% predicted). Needs monthly recalibration.

📊 **SetlistArt SEO:** 2 weeks in, no CTR improvements yet on target keywords. Monitoring.

━━ **This Week's Backlog** ━━

1. Process articles 2-4 through Claude Code
2. Publish to StrengthInsight (Fri-Sun target)
3. Create article tracking spreadsheet
4. Batch write articles 5-7
5. WineNight MVP scoping

━━ **Today's Wins** ━━

✅ Operating system rebuild complete
✅ CRON_JOBS.md registry created
✅ Dashboard HTML live (auto-updates every 30 min)
✅ Telegram digest cron activated
✅ OPERATING_SYSTEM.md finalized

━━ **Tomorrow's Focus** ━━

📝 Suggest: Publish article #2 to StrengthInsight + track GSC performance

Any priorities or updates? Reply and I'll adjust.

✨ Still here, 24/7.
EOF

# Send digest
TEMP_JSON=$(mktemp)
cat > "$TEMP_JSON" << 'HEREDOC'
{
  "chat_id": "8593559681",
  "text": "
HEREDOC

sed 's/\\/\\\\/g' /tmp/digest.txt | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g' >> "$TEMP_JSON"

cat >> "$TEMP_JSON" << 'HEREDOC'
"
}
HEREDOC

RESPONSE=$(curl -s -X POST \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H 'Content-Type: application/json' \
  -d @"$TEMP_JSON" 2>&1)

rm -f "$TEMP_JSON" /tmp/digest.txt

if echo "$RESPONSE" | grep -q '"ok":true'; then
  log_entry "✅ Digest sent successfully"
  exit 0
else
  log_entry "❌ Digest send failed: $RESPONSE"
  exit 1
fi
