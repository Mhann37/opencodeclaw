# CRON_JOBS.md — Automated Tasks Registry

## Active Crons

### 1. Health Brief (Daily)
- **Schedule:** `30 07 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/scripts/health-brief-cron-production.sh`
- **Frequency:** Daily at 07:30 AEDT
- **What it does:** Generates coaching-level health analysis (StrengthInsight volume, muscle balance, plateaus) + sends to Telegram
- **Status:** ✅ ACTIVE (working)
- **Last run:** 2026-03-27 08:38 AEDT
- **Next run:** 2026-03-28 07:30 AEDT
- **Owner:** Jarvis (auto-generated)
- **Output:** Telegram message + `/var/lib/openclaw/.openclaw/workspace/daily-health-brief.md`

### 2. Dashboard Update (Every 30 min)
- **Schedule:** `*/30 * * * * /var/lib/openclaw/.openclaw/workspace/scripts/dashboard-update.sh`
- **Frequency:** Every 30 minutes
- **What it does:** Regenerates dashboard HTML and pushes to GitHub Pages
- **Status:** ✅ ACTIVE (installed)
- **Last run:** 2026-03-27 15:48 AEDT
- **Next run:** 2026-03-27 16:18 AEDT
- **Owner:** Jarvis (auto-generated)
- **Output:** Pushed to `Mhann37/DashboardME` → https://mhann37.github.io/DashboardME/

### 3. Telegram Daily Digest (6pm)
- **Schedule:** `0 18 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/scripts/telegram-digest.sh`
- **Frequency:** Daily at 18:00 AEDT (6pm)
- **What it does:** Sends daily summary of items for attention, backlog, wins, upcoming tasks
- **Status:** ✅ ACTIVE (tested)
- **Last run:** 2026-03-27 15:20 AEDT (manual test)
- **Next run:** 2026-03-27 18:00 AEDT (today)
- **Owner:** Jarvis (auto-generated)
- **Output:** Telegram message

---

## Managing Crons

### Add a new cron:
```bash
./scripts/cron-add.sh "0 9 * * * /path/to/script.sh" "Morning task"
```

### Check status:
```bash
./scripts/cron-status.sh
```

### Remove a cron:
```bash
./scripts/cron-remove.sh "health-brief"
```

### View logs:
```bash
tail -f ./logs/cron.log
```

---

### 4. JoelCaine Predictions (Monday)
- **Schedule:** `0 9 * * 1 TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/scripts/joelcaine-fetch-fixtures.sh && /var/lib/openclaw/.openclaw/workspace/scripts/joelcaine-predictions.js`
- **Frequency:** Every Monday at 09:00 AEDT
- **What it does:** Fetches NRL fixtures + odds, runs through Phase 2 KPI framework, generates weekly predictions with confidence tiers
- **Status:** ✅ ACTIVE (installed)
- **Last run:** —
- **Next run:** 2026-03-31 09:00 AEDT (Monday)
- **Owner:** Jarvis (auto-generated)
- **Output:** `/var/lib/openclaw/.openclaw/workspace/data/joelcaine-predictions.json` + Telegram alert

## Upcoming Crons (To Add)

- [ ] Email check (frequency TBD)
- [ ] Article performance tracking (weekly)
- [ ] Memory compaction (biweekly)
- [ ] JoelCaine monthly recalibration (1st of month, 06:00 AEDT)

---

**Last updated:** 2026-03-27 15:19 AEDT
