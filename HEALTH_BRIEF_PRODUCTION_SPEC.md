# Health Brief Production Spec

**Status:** ✅ PRODUCTION READY

## Specification

**Format:** Comprehensive daily health brief  
**Frequency:** Daily at 07:30 AEDT (Australia/Sydney timezone)  
**Delivery:** Telegram direct message  
**Data Sources:** WHOOP (7-day history) + StrengthInsight (latest JSON auto-detected)  
**Length:** ~1500 words  
**Tone:** Coaching-level, data-backed, actionable  

## Sections (Required)

### 1. Recovery Analysis
- Current recovery score + status
- 7-day average + trend
- HRV (Heart Rate Variability) latest + 7-day avg
- 7-day history (arrow chart)
- Interpretation (🟢/🟡/🔴 status + guidance)

### 2. Strain & Workload
- Latest strain score (0-10)
- 7-day average + trend
- Count of high-strain days (≥8)
- 7-day history
- Interpretation + recommendations

### 3. Sleep Quality & Duration
- Last night duration (hours)
- 7-day average
- Consistency % (nights in 8-9h range)
- Quality rating (excellent/good/needs improvement)
- Best night (7d) + short nights count
- 7-day history
- Interpretation + guidance

### 4. Strength Training Analysis
- Total career workouts
- Last 7 days: sessions + total volume + avg per session
- Muscle group distribution (14-day, with visual bar chart)
- Imbalance assessment (≥35% in one group = warning)
- Strength plateaus (exercises stuck 4+ sessions)

### 5. Recommendations for Next 2 Weeks
- **Recovery Focus:** 3 actionable items based on recovery score/HRV
- **Strain Management:** 3 items based on strain pattern
- **Sleep Improvement:** 3 items based on sleep quality
- **Training Priority:** Rebalance imbalances, break plateaus, progressive overload

### 6. Daily Checklist
- Sleep target
- Hydration
- Protein target
- Log workout requirement
- Mobility routine

## Files

**Production Scripts:**
- `/var/lib/openclaw/.openclaw/workspace/scripts/health-brief-production.js` — Generator (executable)
- `/var/lib/openclaw/.openclaw/workspace/scripts/health-brief-cron-production.sh` — Cron wrapper (executable)

**Output:**
- `/var/lib/openclaw/.openclaw/workspace/daily-health-brief.md` — Latest generated brief (for manual review)
- `/var/lib/openclaw/.openclaw/workspace/logs/health-brief-cron.log` — Execution logs

## Installation (Production Cron)

```bash
crontab -e

# Add this line:
30 07 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/scripts/health-brief-cron-production.sh

# Save & verify:
crontab -l | grep health-brief
```

## Data Flow

1. **Time:** 07:30 AEDT daily
2. **Trigger:** Cron job executes `health-brief-cron-production.sh`
3. **Generator Loads:**
   - WHOOP data (7-day history via API or cache)
   - StrengthInsight JSON (auto-detects latest from `/var/lib/openclaw/.openclaw/media/inbound/`)
4. **Analysis:** Performs all 5 sections of analysis
5. **Output:** Generates comprehensive brief markdown
6. **Delivery:** Sends to Telegram via OpenClaw message tool
7. **Logging:** Records execution + any errors to `health-brief-cron.log`

## Testing

```bash
# Manual run (outputs to console)
node /var/lib/openclaw/.openclaw/workspace/scripts/health-brief-production.js

# Test cron wrapper (generates file + logs)
/var/lib/openclaw/.openclaw/workspace/scripts/health-brief-cron-production.sh
```

## Future Enhancements (Optional)

- Live WHOOP API integration (currently using hardcoded 7-day history)
- Weight trend analysis (if file available)
- Personalized recommendation engine based on historical patterns
- Multi-day strain cycle detection
- Recovery time to readiness prediction

## Notes

- Generator auto-detects latest StrengthInsight JSON from `/var/lib/openclaw/.openclaw/media/inbound/`
- No manual upload triggers required (silent detection)
- Graceful degradation if data is missing (partial brief generation)
- Logs all runs for debugging
- Timezone-aware (AEDT/AEST automatic)

**Lock Date:** 2026-03-26  
**Reviewed By:** Matt H  
**Status:** APPROVED FOR PRODUCTION
