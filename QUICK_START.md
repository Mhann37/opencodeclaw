# ⚡ Health Brief System — Quick Start (2 minutes)

## What You Get

Every morning at **07:30 AEDT**, receive a personalized health brief including:
- 💚 Recovery score + HRV trend
- 😴 Sleep quality + consistency
- 🔥 Training strain + volume trends
- 💪 Strength analysis + plateau detection
- 🎯 3–5 actionable recommendations
- ✅ Daily checklist

Totally automatic. No setup needed beyond installing crontab.

---

## See Example First

```bash
cat /var/lib/openclaw/.openclaw/workspace/EXAMPLE_HEALTH_BRIEF.md
```

This is what you'll get every morning. Read it to understand the format.

---

## Installation (90 seconds)

### Step 1: Open crontab editor
```bash
crontab -e
```

### Step 2: Add one line (paste this):
```
30 07 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh
```

### Step 3: Save and exit (vim: type `:wq` and press Enter)

### Step 4: Verify it worked
```bash
crontab -l | grep health-brief
```

**Done!** 🎉 You're scheduled.

---

## Test It Now

```bash
TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh
```

Then check the output:
```bash
cat /var/lib/openclaw/.openclaw/workspace/daily-health-brief.md
```

---

## Optional: Add WHOOP API Token

If you have a WHOOP token, the system will fetch live data instead of using cached data.

Create `.env` file:
```bash
cat > /var/lib/openclaw/.openclaw/workspace/.env << 'EOF'
WHOOP_API_TOKEN=your_token_here
TELEGRAM_HEALTH_BRIEF_TARGET=your_chat_id_here
EOF
```

Or just set in shell before cron:
```bash
export WHOOP_API_TOKEN="..."
export TELEGRAM_HEALTH_BRIEF_TARGET="..."
```

---

## What Happens

| Time | What |
|------|------|
| **Daily 07:30** | Cron triggers |
| **07:30:05** | Script fetches WHOOP data (or uses cache) |
| **07:30:06** | Loads latest StrengthInsight JSON |
| **07:30:07** | Analyzes trends + generates brief |
| **07:30:08** | Brief appears in Telegram (if configured) |
| **Also:** | File saved to `daily-health-brief.md` |

---

## Troubleshooting (5 minutes)

### It's not running?

Check cron is scheduled:
```bash
crontab -l
```

Check cron daemon is running:
```bash
sudo service cron status
```

### Need to change the time?

Edit crontab:
```bash
crontab -e
```

Change `30 07` to desired time (24-hour format):
- **06:00** → `00 06`
- **08:30** → `30 08`
- **12:00** → `00 12`

### Want to see logs?

```bash
tail -20 /var/lib/openclaw/.openclaw/workspace/logs/health-brief-cron.log
```

Follow in real-time:
```bash
tail -f /var/lib/openclaw/.openclaw/workspace/logs/health-brief-cron.log
```

---

## Files (Keep These)

| File | Purpose | Location |
|------|---------|----------|
| **EXAMPLE_HEALTH_BRIEF.md** | Sample output (don't delete!) | workspace/ |
| **health-brief-generator-v2.js** | Generator logic | workspace/ |
| **health-brief-cron-v2.sh** | Cron wrapper | workspace/ |
| **.whoop-cache.json** | WHOOP data cache | workspace/ |
| **daily-health-brief.md** | Latest brief | workspace/ |
| **logs/health-brief-cron.log** | Execution log | workspace/logs/ |

---

## If Something's Wrong

1. **Check logs:**
   ```bash
   tail -50 /var/lib/openclaw/.openclaw/workspace/logs/health-brief-cron.log
   ```

2. **Test manually:**
   ```bash
   TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh
   ```

3. **Check output:**
   ```bash
   cat /var/lib/openclaw/.openclaw/workspace/daily-health-brief.md
   ```

4. **Check crontab:**
   ```bash
   crontab -l | grep health-brief
   ```

---

## FAQ

**Q: Do I need to do anything daily?**  
A: Nope. It's automatic. Just read the brief when it arrives.

**Q: What if WHOOP API fails?**  
A: System uses cached data. Brief still generates. No crashes.

**Q: How often should I upload StrengthInsight?**  
A: Whenever you want. System auto-detects the latest file.

**Q: Can I change the time?**  
A: Yes. Edit crontab and change `30 07` to your desired time.

**Q: Is my data private?**  
A: All local. No cloud storage (unless you send to Telegram).

---

## Full Documentation

For detailed info:
- **HEALTH_BRIEF_SYSTEM.md** — Complete system guide
- **CRONTAB_SETUP.md** — Advanced crontab help
- **DEPLOYMENT_SUMMARY.md** — Technical details

---

## Next Step

**Install now:**
```bash
crontab -e
# Paste: 30 07 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh
# Save: :wq
```

**You're done.** 🚀 Starting tomorrow at 07:30 AEDT, health briefs arrive automatically.
