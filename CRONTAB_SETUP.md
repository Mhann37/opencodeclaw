# 📅 Crontab Setup Guide — Health Brief Automation

## Quick Install

### 1. **Set Environment Variables** (if needed)

If you have a WHOOP API token and want to send to Telegram, add to your shell profile or `.env`:

```bash
export WHOOP_API_TOKEN="your_token_here"
export TELEGRAM_HEALTH_BRIEF_TARGET="telegram_user_id_or_channel"
```

Or create `.env` in `/var/lib/openclaw/.openclaw/workspace/`:
```bash
WHOOP_API_TOKEN=your_token
TELEGRAM_HEALTH_BRIEF_TARGET=your_chat_id
```

### 2. **Install Crontab Entry**

Run `crontab -e` and add this line:

```
# Health Brief Generation — Daily at 07:30 AEDT (Australia/Sydney)
30 07 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh
```

**Key Points:**
- **Time:** `30 07` = 07:30 (7:30 AM)
- **Frequency:** `* * *` = Every day
- **Timezone:** `TZ=Australia/Sydney` ensures AEDT/AEST correct timing
- **Path:** Full path to the script (adjust if different)

### 3. **Verify Installation**

Check it's in your crontab:
```bash
crontab -l | grep health-brief
```

You should see:
```
30 07 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh
```

### 4. **Manual Testing**

Before relying on cron, test manually:

```bash
TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh
```

Check logs:
```bash
tail -f /var/lib/openclaw/.openclaw/workspace/logs/health-brief-cron.log
```

Check output:
```bash
cat /var/lib/openclaw/.openclaw/workspace/daily-health-brief.md
```

---

## Timezone Notes

### AEDT vs AEST
- **AEDT** (Oct–Apr): UTC+11
- **AEST** (Apr–Oct): UTC+10

The cron entry uses `TZ=Australia/Sydney` which automatically handles both. Linux `cron` respects the `TZ` variable per-job.

### Verification

To confirm the time will be correct:
```bash
TZ=Australia/Sydney date
```

Should show Sydney local time.

---

## Troubleshooting

### Cron Not Running?

1. **Check cron daemon:**
   ```bash
   sudo service cron status
   ```

2. **Check cron logs:**
   ```bash
   sudo tail /var/log/syslog | grep CRON
   ```

3. **Health brief logs:**
   ```bash
   tail /var/lib/openclaw/.openclaw/workspace/logs/health-brief-cron.log
   ```

### WHOOP API Failing?

If `[WHOOP] ✗ All retries exhausted`, the script falls back to cache. This is normal if:
- No internet connection
- WHOOP API is down
- Token expired

Check cache:
```bash
cat /var/lib/openclaw/.openclaw/workspace/.whoop-cache.json
```

### StrengthInsight Not Auto-Detecting?

Verify files exist in the inbound directory:
```bash
ls -lah /var/lib/openclaw/.openclaw/media/inbound/strengthinsight*
```

The script automatically picks the latest file (by filename, reverse-sorted).

---

## Advanced: Run at Different Time

To change from 07:30 to a different time (e.g., 06:00):

```
00 06 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh
```

Format: `MM HH * * *` where:
- `MM` = minutes (0-59)
- `HH` = hours (0-23, 24-hour format)

### Examples:
- **08:00 AEDT:** `00 08 * * *`
- **12:30 AEDT:** `30 12 * * *`
- **18:15 AEDT:** `15 18 * * *`

---

## Monitoring

### Check When It Last Ran

```bash
stat /var/lib/openclaw/.openclaw/workspace/daily-health-brief.md | grep Modify
```

### View Recent Logs

```bash
tail -20 /var/lib/openclaw/.openclaw/workspace/logs/health-brief-cron.log
```

### Follow Logs in Real-Time

```bash
tail -f /var/lib/openclaw/.openclaw/workspace/logs/health-brief-cron.log
```

---

## Manual Runs

You can run the generator anytime (not just via cron):

```bash
TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh
```

Or directly:
```bash
TZ=Australia/Sydney node /var/lib/openclaw/.openclaw/workspace/health-brief-generator-v2.js
```

Output always goes to:
```
/var/lib/openclaw/.openclaw/workspace/daily-health-brief.md
```

---

## Summary

| Component | Location | Purpose |
|-----------|----------|---------|
| **Generator** | `health-brief-generator-v2.js` | Core logic: fetch WHOOP, load StrengthInsight, analyze, format |
| **Cron Wrapper** | `health-brief-cron-v2.sh` | Scheduler wrapper: setup, logging, error handling |
| **Crontab Entry** | `crontab -e` | Schedule: daily at 07:30 AEDT |
| **Output** | `daily-health-brief.md` | Generated brief (updated daily) |
| **Logs** | `logs/health-brief-cron.log` | Execution logs |
| **Cache** | `.whoop-cache.json` | Fallback WHOOP data |

**Ready to deploy!** Copy the crontab entry above into `crontab -e` and you're done.
