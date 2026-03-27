#!/bin/bash

###############################################################################
# Send health brief to Telegram via curl (plain text, no HTML)
###############################################################################

TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN}"
CHAT_ID="8593559681"
BRIEF_FILE="/var/lib/openclaw/.openclaw/workspace/daily-health-brief.md"

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
  echo "❌ TELEGRAM_BOT_TOKEN not set"
  exit 1
fi

if [ ! -f "$BRIEF_FILE" ]; then
  echo "❌ Brief file not found"
  exit 1
fi

# Save brief to temp JSON file (avoids shell escaping issues)
TEMP_JSON=$(mktemp)
cat > "$TEMP_JSON" << 'EOF'
{
  "chat_id": "8593559681",
  "text": "
EOF

# Escape newlines and quotes in the message
sed 's/\\/\\\\/g' "$BRIEF_FILE" | sed 's/"/\\"/g' | sed ':a;N;$!ba;s/\n/\\n/g' >> "$TEMP_JSON"

cat >> "$TEMP_JSON" << 'EOF'
"
}
EOF

# Send via curl
RESPONSE=$(curl -s -X POST \
  "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -H 'Content-Type: application/json' \
  -d @"$TEMP_JSON" \
  2>&1)

rm -f "$TEMP_JSON"

if echo "$RESPONSE" | grep -q '"ok":true'; then
  echo "✓ Telegram delivery successful"
  exit 0
else
  echo "❌ Telegram error: $RESPONSE"
  exit 1
fi
