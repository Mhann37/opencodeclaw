# 📋 Health Brief System v2 — Complete File Index

**Status:** ✅ Production-Ready  
**Generated:** 26 March 2026, 08:55 AEDT  
**Last Test:** ✅ PASSED

---

## 🎯 Start Here

### For Quick Setup (2 minutes)
👉 **[QUICK_START.md](QUICK_START.md)** — Copy-paste crontab line, done.

### For Understanding the Output (5 minutes)
👉 **[EXAMPLE_HEALTH_BRIEF.md](EXAMPLE_HEALTH_BRIEF.md)** — Real example of what you get daily.

### For Complete Setup & Customization (15 minutes)
👉 **[HEALTH_BRIEF_SYSTEM.md](HEALTH_BRIEF_SYSTEM.md)** — Full documentation with all details.

### For Troubleshooting
👉 **[CRONTAB_SETUP.md](CRONTAB_SETUP.md)** — Advanced setup, timezone handling, debugging.

### For Technical Overview
👉 **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** — What was built, test results, architecture.

---

## 📁 All Files

### Documentation (Read These)

| File | Size | Purpose | Read If... |
|------|------|---------|-----------|
| **QUICK_START.md** | 4.5K | 2-min setup guide | You want to get running immediately |
| **EXAMPLE_HEALTH_BRIEF.md** | 5.9K | Sample daily brief | You want to see what's coming each morning |
| **HEALTH_BRIEF_SYSTEM.md** | 15K | Complete documentation | You want to understand how everything works |
| **CRONTAB_SETUP.md** | 4.5K | Installation & troubleshooting | You have questions about cron/timezone/setup |
| **DEPLOYMENT_SUMMARY.md** | 11K | Technical overview | You're curious about architecture/testing |
| **HEALTH_BRIEF_INDEX.md** | This file | File guide | You're lost and need a map |

**Read order:** QUICK_START → EXAMPLE → HEALTH_BRIEF_SYSTEM → others as needed

### Code (Executable Scripts)

| File | Size | Purpose | Runs... |
|------|------|---------|---------|
| **health-brief-generator-v2.js** | 16K | Core logic | Manually or via cron |
| **health-brief-cron-v2.sh** | 1.9K | Cron wrapper | Daily at 07:30 AEDT (after installing in crontab) |

**These are executable. No edits needed unless customizing.**

### Data (Generated/Cached)

| File | Purpose | Updated |
|------|---------|---------|
| **daily-health-brief.md** | Latest generated brief | Daily (07:30 AEDT) or after manual run |
| **.whoop-cache.json** | WHOOP data fallback (10 days) | When WHOOP API succeeds, or uses existing |
| **logs/health-brief-cron.log** | Execution log | Every cron run + manual runs |

---

## 🚀 Installation (Choose Your Path)

### Path 1: I Just Want It Running (2 minutes)

```bash
# 1. Read the example to see what's coming
cat EXAMPLE_HEALTH_BRIEF.md

# 2. Install crontab entry
crontab -e
# Paste: 30 07 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh
# Save: :wq

# 3. Verify
crontab -l | grep health-brief

# Done! Starting tomorrow at 07:30 AEDT.
```

### Path 2: I Want to Understand Everything (30 minutes)

```bash
# 1. Quick start guide
cat QUICK_START.md

# 2. See the example output
cat EXAMPLE_HEALTH_BRIEF.md

# 3. Full system documentation
cat HEALTH_BRIEF_SYSTEM.md

# 4. Follow QUICK_START installation

# 5. Optional: Configure WHOOP token
echo "WHOOP_API_TOKEN=..." >> .env
echo "TELEGRAM_HEALTH_BRIEF_TARGET=..." >> .env

# 6. Test manually
TZ=Australia/Sydney ./health-brief-cron-v2.sh

# 7. Check output
cat daily-health-brief.md
tail logs/health-brief-cron.log

# 8. Install crontab entry as in Path 1
```

### Path 3: I'm Troubleshooting (As Needed)

```bash
# Check if cron is running
crontab -l

# Check cron daemon
sudo service cron status

# Check logs
tail -50 logs/health-brief-cron.log

# Test manually
TZ=Australia/Sydney ./health-brief-cron-v2.sh

# See the output
cat daily-health-brief.md

# For detailed help, see CRONTAB_SETUP.md
```

---

## 📊 What Each Script Does

### health-brief-generator-v2.js (Core Engine)

```
Input:
  1. WHOOP API (or cache if API fails)
  2. Latest StrengthInsight JSON (auto-detected)
  3. Cached weight data (optional)

Processing:
  - Fetch last 10 days WHOOP data (recovery, sleep, strain)
  - Load latest strength workouts
  - Analyze 7-day recovery trend + 14-day training volume
  - Detect plateaus (weight unchanged 14+ days)
  - Calculate muscle group distribution
  - Generate coaching-level recommendations

Output:
  - Telegram-friendly Markdown brief (~1000 words)
  - Written to: daily-health-brief.md
  - Sent to Telegram (if target configured)
  - Logs to health-brief-cron.log
```

### health-brief-cron-v2.sh (Scheduler Wrapper)

```
When: Daily at 07:30 AEDT (via crontab)

Does:
  - Set timezone to Australia/Sydney
  - Load .env file (if exists)
  - Execute health-brief-generator-v2.js
  - Log all activity with timestamps
  - Handle errors gracefully

Logs to: health-brief-cron.log
```

---

## 🔄 Daily Workflow

```
07:30 AEDT
  ↓
cron triggers health-brief-cron-v2.sh
  ↓
Loads environment (WHOOP token, Telegram target)
  ↓
health-brief-generator-v2.js starts:
  ├─ Fetches WHOOP data (recovery, sleep, strain)
  │  └─ If API fails: uses cache (.whoop-cache.json)
  ├─ Loads latest StrengthInsight JSON
  │  └─ Auto-detected from /media/inbound/
  ├─ Analyzes trends:
  │  ├─ 7-day recovery + HRV
  │  ├─ 14-day training volume
  │  ├─ Plateau detection
  │  └─ Muscle balance analysis
  ├─ Generates recommendations
  └─ Formats as Markdown (Telegram-friendly)
  ↓
Writes to: daily-health-brief.md
  ↓
Sends to Telegram (if configured)
  ↓
Logs completion: health-brief-cron.log
  ↓
Complete ✓
```

---

## 📈 What Gets Analyzed

### From WHOOP API (or Cache)

- **Recovery Score:** Daily % (40–100)
- **HRV:** Heart rate variability trend
- **Sleep Duration:** Hours slept each night
- **Strain Score:** Training intensity

**Calculated:**
- 7-day recovery average + trend
- Sleep consistency (tight band = stable)
- 14-day strain progression
- Recovery patterns

### From StrengthInsight JSON

- **Total Workouts:** Count since upload start
- **Muscle Group Volume:** % distribution (Chest, Back, Legs, Shoulders, Arms)
- **Personal Best Lifts:** Max weight per exercise
- **Training Volume Trends:** 14-day cumulative kg
- **Plateaus:** Exercises stuck 14+ days at same weight

**Calculated:**
- Session averages
- Muscle imbalances
- Progression trends
- Strength patterns

---

## 🛠️ Common Tasks

### View Today's Brief
```bash
cat daily-health-brief.md
```

### Check Logs
```bash
tail -20 logs/health-brief-cron.log
```

### Test Generator Manually
```bash
TZ=Australia/Sydney ./health-brief-cron-v2.sh
```

### Change Time (e.g., to 06:00)
```bash
crontab -e
# Change: 30 07 → 00 06
```

### Add WHOOP Token
```bash
echo "WHOOP_API_TOKEN=your_token" >> .env
```

### View WHOOP Cache
```bash
cat .whoop-cache.json | head -20
```

---

## ✅ Verification Checklist

- [ ] Read QUICK_START.md
- [ ] Read EXAMPLE_HEALTH_BRIEF.md
- [ ] Installed crontab entry: `crontab -l | grep health-brief`
- [ ] Tested manually: `TZ=Australia/Sydney ./health-brief-cron-v2.sh`
- [ ] Output generated: `cat daily-health-brief.md`
- [ ] Logs exist: `tail logs/health-brief-cron.log`
- [ ] Files are executable: `ls -la health-brief*.* | grep ^.*x`

---

## 📞 Quick Help

| Issue | Command |
|-------|---------|
| Cron not running | `sudo service cron status` |
| Test generator | `TZ=Australia/Sydney ./health-brief-cron-v2.sh` |
| View output | `cat daily-health-brief.md` |
| View logs | `tail logs/health-brief-cron.log` |
| Check crontab | `crontab -l` |
| Edit crontab | `crontab -e` |
| Change time | Edit crontab, change `30 07` |
| Add WHOOP token | `echo "WHOOP_API_TOKEN=..." >> .env` |

---

## 🎯 Summary

**Everything is ready.** Pick your path above:
- **2 minutes?** → QUICK_START.md
- **Curious?** → HEALTH_BRIEF_SYSTEM.md
- **Troubleshooting?** → CRONTAB_SETUP.md

**Installation:** One crontab line. Done.

**Result:** Daily 07:30 AEDT briefs with recovery, sleep, strength, and personalized recommendations.

---

*Last updated: 26 March 2026*  
*System tested and verified working*  
*Ready for production* ✅
