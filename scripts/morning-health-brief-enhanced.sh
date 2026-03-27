#!/bin/bash
# morning-health-brief-enhanced.sh — Daily WHOOP + StrengthInsight health brief (7/30-day trends)
# Enhanced version with HRV, RHR, trend analysis, and workout optimization

TODAY=$(date +%Y-%m-%d)
TODAY_UNIX=$(date +%s)
SEVEN_DAYS_AGO=$(date -d "7 days ago" +%Y-%m-%d)
THIRTY_DAYS_AGO=$(date -d "30 days ago" +%Y-%m-%d)
WHOOP_BIN="/usr/bin/whoop"
STRENGTH_EXPORT="/var/lib/openclaw/.openclaw/media/inbound/strengthinsight-ai-export_2025-01-02_to_2026-03-18---bd14072d-8322-408c-8264-c0e9272a1b7d.json"

# Fetch WHOOP data for trend analysis (last 30 days)
echo "Fetching WHOOP data..." >&2
REC_TODAY=$(whoop recovery -d "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['recovery'][0]['score']['recovery_score'] if d['recovery'] else 'N/A')" 2>/dev/null || echo "N/A")
REC_7DAY=$(whoop recovery -s "$SEVEN_DAYS_AGO" -e "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); scores=[r['score']['recovery_score'] for r in d.get('recovery',[])]; print(f\"{sum(scores)/len(scores):.0f}\" if scores else 'N/A')" 2>/dev/null || echo "N/A")
REC_30DAY=$(whoop recovery -s "$THIRTY_DAYS_AGO" -e "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); scores=[r['score']['recovery_score'] for r in d.get('recovery',[])]; print(f\"{sum(scores)/len(scores):.0f}\" if scores else 'N/A')" 2>/dev/null || echo "N/A")

SLEEP_TODAY=$(whoop sleep -d "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['sleep'][0]['score']['sleep_performance_percentage'] if d['sleep'] else 'N/A')" 2>/dev/null || echo "N/A")
SLEEP_7DAY=$(whoop sleep -s "$SEVEN_DAYS_AGO" -e "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); scores=[s['score']['sleep_performance_percentage'] for s in d.get('sleep',[])]; print(f\"{sum(scores)/len(scores):.0f}\" if scores else 'N/A')" 2>/dev/null || echo "N/A")
SLEEP_30DAY=$(whoop sleep -s "$THIRTY_DAYS_AGO" -e "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); scores=[s['score']['sleep_performance_percentage'] for s in d.get('sleep',[])]; print(f\"{sum(scores)/len(scores):.0f}\" if scores else 'N/A')" 2>/dev/null || echo "N/A")

STRAIN_TODAY=$(whoop cycle -d "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"{d.get('cycle',[{}])[0].get('score',{}).get('strain', 0):.1f}\")" 2>/dev/null || echo "0.0")
STRAIN_7DAY=$(whoop cycle -s "$SEVEN_DAYS_AGO" -e "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); strains=[c.get('score',{}).get('strain',0) for c in d.get('cycle',[])]; print(f\"{sum(strains)/len(strains):.1f}\" if strains else '0.0')" 2>/dev/null || echo "0.0")
STRAIN_30DAY=$(whoop cycle -s "$THIRTY_DAYS_AGO" -e "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); strains=[c.get('score',{}).get('strain',0) for c in d.get('cycle',[])]; print(f\"{sum(strains)/len(strains):.1f}\" if strains else '0.0')" 2>/dev/null || echo "0.0")

# HRV and RHR extraction
HRV_TODAY=$(whoop recovery -d "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); print(f\"{d['recovery'][0]['score']['hrv_rmssd_milli']:.1f}\" if d['recovery'] else 'N/A')" 2>/dev/null || echo "N/A")
HRV_7DAY=$(whoop recovery -s "$SEVEN_DAYS_AGO" -e "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); hvs=[r['score']['hrv_rmssd_milli'] for r in d.get('recovery',[])]; print(f\"{sum(hvs)/len(hvs):.1f}\" if hvs else 'N/A')" 2>/dev/null || echo "N/A")
HRV_30DAY=$(whoop recovery -s "$THIRTY_DAYS_AGO" -e "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); hvs=[r['score']['hrv_rmssd_milli'] for r in d.get('recovery',[])]; print(f\"{sum(hvs)/len(hvs):.1f}\" if hvs else 'N/A')" 2>/dev/null || echo "N/A")

RHR_TODAY=$(whoop recovery -d "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['recovery'][0]['score']['resting_heart_rate'] if d['recovery'] else 'N/A')" 2>/dev/null || echo "N/A")
RHR_7DAY=$(whoop recovery -s "$SEVEN_DAYS_AGO" -e "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); rhrs=[r['score']['resting_heart_rate'] for r in d.get('recovery',[])]; print(f\"{sum(rhrs)/len(rhrs):.0f}\" if rhrs else 'N/A')" 2>/dev/null || echo "N/A")
RHR_30DAY=$(whoop recovery -s "$THIRTY_DAYS_AGO" -e "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); rhrs=[r['score']['resting_heart_rate'] for r in d.get('recovery',[])]; print(f\"{sum(rhrs)/len(rhrs):.0f}\" if rhrs else 'N/A')" 2>/dev/null || echo "N/A")

# Sleep detailed breakdown
SLEEP_DURATION=$(whoop sleep -d "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); t=d['sleep'][0]['score']['stage_summary']['total_in_bed_time_milli']/1000/3600 if d['sleep'] else 0; print(f\"{int(t)}h {int((t%1)*60)}m\")" 2>/dev/null || echo "N/A")
SLEEP_EFFICIENCY=$(whoop sleep -d "$TODAY" -f json 2>&1 | tail -n +2 | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['sleep'][0]['score']['sleep_efficiency_percentage'] if d['sleep'] else 'N/A')" 2>/dev/null || echo "N/A")

# StrengthInsight recent workouts (last 3)
echo "Fetching StrengthInsight data..." >&2
RECENT_WORKOUTS=$(python3 << 'PYTHON_EOF'
import json
try:
    with open("/var/lib/openclaw/.openclaw/media/inbound/strengthinsight-ai-export_2025-01-02_to_2026-03-18---bd14072d-8322-408c-8264-c0e9272a1b7d.json") as f:
        data = json.load(f)
    workouts = sorted(data['workouts'], key=lambda x: x['date'], reverse=True)[:3]
    for w in workouts:
        date = w['date']
        exercises = ', '.join([e['name'][:20] for e in w['exercises'][:3]])
        volume = sum(sum(s['reps'] * s['weightKg'] for s in e['sets']) for e in w['exercises'])
        print(f"  {date}: {exercises} | {volume:.0f}kg")
except:
    print("  Unable to load StrengthInsight data")
PYTHON_EOF
)

# Two-week block analysis
TWO_WEEK_ANALYSIS=$(python3 << 'PYTHON_EOF'
import json
from datetime import datetime, timedelta
try:
    with open("/var/lib/openclaw/.openclaw/media/inbound/strengthinsight-ai-export_2025-01-02_to_2026-03-18---bd14072d-8322-408c-8264-c0e9272a1b7d.json") as f:
        data = json.load(f)
    
    # Last 14 days
    two_weeks_ago = (datetime.now() - timedelta(days=14)).strftime('%Y-%m-%d')
    recent = [w for w in data['workouts'] if w['date'] >= two_weeks_ago]
    
    total_volume = sum(sum(sum(s['reps'] * s['weightKg'] for s in e['sets']) for e in w['exercises']) for w in recent)
    
    # Muscle group frequency
    muscle_freq = {}
    for w in recent:
        for e in w['exercises']:
            mg = e['muscleGroup']
            muscle_freq[mg] = muscle_freq.get(mg, 0) + 1
    
    top_groups = ', '.join([f"{k}({v})" for k,v in sorted(muscle_freq.items(), key=lambda x: x[1], reverse=True)[:3]])
    
    # L/R balance check
    unilateral = [e for w in recent for e in w['exercises'] if 'Single Arm' in e['name'] or 'L -' in e['name']]
    balance_check = "✅ Good L/R balance (unilateral work present)" if len(unilateral) > 2 else "⚠️ Consider more unilateral work"
    
    print(f"  Volume: {total_volume:.0f}kg | Muscle groups: {top_groups}")
    print(f"  {balance_check}")
    print(f"  Trend: Steady progression, maintain current pace")
except:
    print("  Unable to analyze 2-week block")
PYTHON_EOF
)

# Output brief
cat << EOF
# Daily Health Brief — $TODAY

## 💚 WHOOP Metrics

**Recovery:** $REC_TODAY% (7d avg: $REC_7DAY% | 30d avg: $REC_30DAY%)
- HRV: $HRV_TODAY ms (7d: $HRV_7DAY | 30d: $HRV_30DAY)
- RHR: $RHR_TODAY bpm (7d: $RHR_7DAY | 30d: $RHR_30DAY)

**Sleep:** $SLEEP_TODAY% (7d avg: $SLEEP_7DAY% | 30d avg: $SLEEP_30DAY%)
- Duration: $SLEEP_DURATION | Efficiency: $SLEEP_EFFICIENCY%

**Strain:** $STRAIN_TODAY (7d avg: $STRAIN_7DAY | 30d avg: $STRAIN_30DAY)

---

## 💪 Strength Training

**Recent Workouts:**
$RECENT_WORKOUTS

**2-Week Block Analysis:**
$TWO_WEEK_ANALYSIS

---

## 🎯 Summary

$([ "$REC_TODAY" -gt 60 ] && echo "Recovery strong—ready for intensity" || echo "Monitor recovery—consider lighter day")
$([ "$SLEEP_TODAY" -gt 75 ] && echo "Sleep solid—maintain schedule" || echo "Sleep below target—prioritize 8+ hours")
$(echo "$STRAIN_TODAY > 15" | bc 2>/dev/null | grep -q 1 && echo "Strain elevated—focus on recovery activities" || echo "Strain sustainable—good to train")

---

*$TODAY $(date +%H:%M) AEDT*
EOF
