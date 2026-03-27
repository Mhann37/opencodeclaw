# Daily Health Brief Generator

**Status:** ✅ Ready for production (runs daily at 07:30 AEDT)

## What It Does

Generates a **coaching-level health analysis** combining:
- **WHOOP API data** (recovery, HRV, sleep trends)
- **StrengthInsight exports** (workout volume, muscle balance, plateau detection)

Output: `daily-health-brief.md` (replaces previous day's brief)

## Features

### 💚 Recovery Analysis
- 7-day average recovery %
- HRV trend vs. baseline (44ms)
- Directional indicator: improving ↑ / declining ↓ / stable

### 😴 Sleep Analysis
- Average hours per night
- Sleep consistency score (0-100%)
- Cumulative sleep debt (hours)

### 💪 Strength Performance
- 14-day average session volume
- Muscle group breakdown (%)
  - Chest, Back, Legs, Shoulders, Arms
- Plateau detection (top 3)
  - Exercise, weight, weeks stalled

### 🎯 Coaching Recommendations
- Priority-ordered (high → medium → low)
- Specific, actionable language
- Addresses recovery, sleep, strength, and balance issues

### 📍 Daily Focus
- Checklist of today's priorities
- Equipment status check
- Session suggestion
- Nutrition reminder
- Sleep target

## File Structure

```
/var/lib/openclaw/.openclaw/workspace/
├── health-brief-generator.js         # Main script
├── scripts/health-brief-cron.sh       # Cron wrapper
├── daily-health-brief.md              # Output (auto-generated)
├── .whoop-cache.json                  # WHOOP API fallback cache
└── logs/health-brief-cron.log         # Cron execution log
```

## How to Run

### Automatic (Cron)
Runs daily at **07:30 AEDT** (21:30 UTC previous day)

```bash
crontab -l | grep "health-brief"
```

### Manual (Testing)
```bash
cd /var/lib/openclaw/.openclaw/workspace
node health-brief-generator.js
```

## Environment Variables

**Required** (set in `.env`):
- `WHOOP_ACCESS_TOKEN` — WHOOP API bearer token
- `WHOOP_USER_ID` — Your WHOOP user ID (default: 8593559681)

**Optional** (for Telegram delivery):
- `TELEGRAM_BOT_TOKEN` — Bot token
- `TELEGRAM_CHAT_ID` — Chat to send brief to

## Data Sources

### WHOOP API
- **Endpoint:** `https://api.ourwhoop.com/api/user/heart_rate/state`
- **Fetch frequency:** Daily at 07:30 AEDT
- **Data age:** Yesterday's complete metrics (scored overnight)
- **Retry logic:** 3 attempts with 5s delays + cache fallback

### StrengthInsight Export
- **File pattern:** `strengthinsight-ai-export_YYYY-MM-DD_to_YYYY-MM-DD*.json`
- **Location:** `/var/lib/openclaw/.openclaw/media/inbound/`
- **Auto-detection:** Script finds latest export by filename
- **Scope:** All workouts (14-day analysis uses most recent)

## Output Example

```markdown
# Daily Health Brief — Monday 23 March 2026

## 💚 Recovery Analysis (7-Day Trend)
- Average Recovery: 72% (✓ optimal)
- Trend: improving ↑
- HRV (avg): 48.8ms (baseline: ~44ms)

## 😴 Sleep Analysis (7-Day Trend)
- Average: 8.1h/night
- Consistency: 91% (✓ stable)
- Sleep Debt: 0h accumulated

## 💪 Strength Performance (14-Day Snapshot)
- Avg Session Volume: 6,733kg
- Total 14-Day Volume: 94,262kg
- Muscle Group Balance:
  - Chest: 18%
  - Back: 23%
  - Legs: 18%
  - Shoulders: 11%
  - Arms: 30%

**Plateaus Detected:**
- Bicep Curl - Barbell: 30kg (2+ weeks stalled)
- Landmine Press - L: 40kg (2+ weeks stalled)

## 🎯 Coaching Recommendations
**💪 Strength**
Bicep Curl plateau for 2 weeks @ 30kg. Try higher reps (3×8-10) or paused reps.

**⚡ Volume**
Volume down 57%. Check equipment, rest adequacy, or planned deload?

## 📍 Today's Focus
- [ ] Check dumbbell sleeve repair status
- [ ] Session priority: Legs (if equipment ready) or upper-body balance
- [ ] Hydration & protein post-workout
- [ ] Target 8+ hours sleep tonight
```

## Troubleshooting

### WHOOP API Fails
Script will automatically use `.whoop-cache.json` (last successful fetch). No data loss.

Check logs:
```bash
tail -20 /var/lib/openclaw/.openclaw/workspace/logs/health-brief-cron.log
```

### StrengthInsight Not Found
Ensure latest export is saved to `/var/lib/openclaw/.openclaw/media/inbound/`

Script will fail gracefully if no exports exist.

### Cron Not Running
Check crontab:
```bash
crontab -l | grep health-brief
```

Verify permissions:
```bash
ls -la /var/lib/openclaw/.openclaw/workspace/scripts/health-brief-cron.sh
# Should be executable (-rwxr-xr-x)
```

Check system logs:
```bash
grep CRON /var/log/syslog | tail -10
```

## Performance Notes

- **Execution time:** ~8-15 seconds (includes WHOOP retry timeouts)
- **Output size:** ~1.5-2KB markdown
- **CPU/Memory:** Minimal (Node.js lightweight)
- **Storage:** .whoop-cache.json ~2KB, brief ~1.5KB

## Future Enhancements

- [ ] Integration with other WHOOP metrics (strain, rest)
- [ ] Multi-week trend analysis (4-week, 8-week)
- [ ] Injury risk scoring (based on imbalance + volume changes)
- [ ] Personalized AI recommendations (not just template-based)
- [ ] Telegram inline keyboard for quick actions
- [ ] Slack/Discord delivery options

---

**Questions?** Check `/var/lib/openclaw/.openclaw/workspace/memory/2026-03-23.md` for implementation notes.
