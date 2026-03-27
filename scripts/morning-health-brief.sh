#!/bin/bash
# morning-health-brief.sh — Daily WHOOP + StrengthInsight health brief for 07:30 cron

TODAY=$(date +%Y-%m-%d)
WHOOP_BIN="/usr/bin/whoop"

# Fetch metrics (skip dotenv logs with tail)
REC=$(whoop recovery -d "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['recovery'][0]['score']['recovery_score'] if d['recovery'] else 'N/A')" 2>/dev/null || echo "N/A")
SLEEP=$(whoop sleep -d "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['sleep'][0]['score']['sleep_performance_percentage'] if d['sleep'] else 'N/A')" 2>/dev/null || echo "N/A")
STRAIN=$(whoop cycle -d "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); cycle=d.get('cycle',[{}])[0]; print(f\"{cycle.get('score',{}).get('strain', 0):.1f}\")" 2>/dev/null || echo "0.0")

# Icons
[[ "$REC" != "N/A" && $REC -gt 60 ]] && REC_ICO="💚" || REC_ICO="⚠️"
[[ "$SLEEP" != "N/A" && $SLEEP -gt 75 ]] && SLEEP_ICO="😴" || SLEEP_ICO="📉"
[[ $(echo "$STRAIN > 15" | bc 2>/dev/null) == 1 ]] && STRAIN_ICO="🔴" || STRAIN_ICO="🟢"

# Output brief
cat << EOF
# Daily Health Brief — $TODAY

## WHOOP Metrics

**Recovery:** $REC% $REC_ICO
**Sleep:** $SLEEP% $SLEEP_ICO
**Strain:** $STRAIN $STRAIN_ICO

---

## Strength Training Progress
*StrengthInsight: 42 workouts, 257.5k kg total (2025-01-02 to 2026-03-18)*

---

## Quick Take
$([ "$REC" != "N/A" ] && [ $REC -gt 60 ] && echo "✅ Recovery good—proceed with intensity" || echo "⚠️ Recovery elevated—moderate load today")
$([ "$SLEEP" != "N/A" ] && [ $SLEEP -gt 75 ] && echo "✅ Sleep solid—maintain" || echo "📉 Sleep below target—aim 8+ hours")
$(echo "$STRAIN > 15" | bc 2>/dev/null | grep -q 1 && echo "🔴 High strain—focus recovery" || echo "🟢 Strain sustainable—good to train")

---

*$TODAY $(date +%H:%M) AEDT*
EOF
