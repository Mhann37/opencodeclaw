# Health Brief System — Rebuilt ✅

**Date:** 2026-03-26 (Thu)  
**Status:** Ready to deploy  
**Files Created:** 6 scripts + 2 docs  
**Time to Setup:** ~5 minutes

---

## What Changed

### Problem
- Old cron job was fragile (file deps, timing issues)
- Didn't leverage your StrengthInsight data uploads
- No real-time triggering capability

### Solution
- **File-upload driven** — When you upload `strengthinsight-*.json` to Telegram, system auto-triggers
- **Cron fallback** — Daily 07:30 AEDT delivery (doesn't rely on uploads)
- **Coaching-level output** — Analyzes volume trends, muscle imbalances, plateaus + gives 3 focus cues
- **Two data sources** — Combines WHOOP recovery + StrengthInsight training metrics

---

## Architecture

```
StrengthInsight JSON Upload
         ↓
   (Telegram/Handler)
         ↓
  health-brief-generator.js
         ↓
  Loads WHOOP + Strength data
         ↓
  Analyzes & Generates Brief
         ↓
  Sends to Telegram (Chat ID: 8593559681)
```

**Parallel path:** Cron runs daily at 07:30 AEDT (same generator, automatic)

---

## Files Created

### Core Scripts
1. **`scripts/health-brief-generator.js`** (250 lines)
   - Main engine: loads data, analyzes, generates brief, sends to Telegram
   - Flags: `--test`, `--whoop-path`, `--strength-path`

2. **`cron/health-brief.cron`** (50 lines)
   - Daily trigger at 07:30 AEDT
   - Finds latest StrengthInsight export + runs generator

3. **`handlers/strength-upload-trigger.js`** (150 lines)
   - Webhook handler for Telegram uploads
   - Detects `strengthinsight-*.json` → auto-generates brief

### Documentation
4. **`HEALTH_BRIEF_SETUP.md`** (200 lines)
   - Full setup guide with environment vars, cron installation, troubleshooting

5. **`HEALTH_BRIEF_QUICKSTART.txt`** (100 lines)
   - Quick reference checklist

6. **`HEALTH_BRIEF_SUMMARY.md`** (this file)
   - Overview + next steps

---

## Data Analysis Logic

### WHOOP Recovery
```
Recovery Score:
  70%+ = ✅ Green (full intensity OK)
  50-69% = ⚠️ Caution (moderate)
  <50% = 🔴 Low (recovery day)

HRV + Sleep: Informational
```

### StrengthInsight Training
1. **Volume Trend** — Compare last 7 days vs 2 weeks ago
2. **Muscle Imbalances** — Flag any muscle group >35% of total sets
3. **Plateaus** — Detect lifts stagnant 4+ weeks (same weight/reps)

### Coaching Output
- **#1 Focus** — Address imbalance OR maintain balance
- **#2 Focus** — Break plateau (variation) OR progressive overload
- **#3 Focus** — Recovery/mobility OR form/hydration cues

---

## Example Output

```
💪 **Daily Health Brief** — Thu, 26 Mar

**RECOVERY**
• Recovery Score: 72% ✅ (Green light)
• Sleep: 8.3h (HRV: 48)

**TRAINING**
• Volume: 31,763kg total volume (-17.3% vs 2 weeks ago)
• ⚠️ Imbalances: Chest: 74 sets (36%)

**FOCUS — Next 2 Weeks**
1️⃣ Address muscle imbalance — more back/posterior work
2️⃣ Progressive overload — chase +2-3kg or +1-2 reps
3️⃣ Hydration & mobility between lifts
```

---

## Setup Checklist

### 1. Environment Variables (5 min)
```bash
export TELEGRAM_BOT_TOKEN="YOUR_BOT_TOKEN"
export TELEGRAM_CHAT_ID="8593559681"
```

### 2. Test Generator (2 min)
```bash
cd ~/.openclaw/workspace
node scripts/health-brief-generator.js --test
```

### 3. Install Cron (3 min)
```bash
crontab -e
# Add: 30 7 * * * /var/lib/openclaw/.openclaw/workspace/cron/health-brief.cron >> /var/log/health-brief.log 2>&1

# Test immediately:
bash ~/.openclaw/workspace/cron/health-brief.cron
```

### 4. Wire Upload Handler (Optional, 2 min)
Add to your Telegram webhook/handler config to auto-trigger on JSON uploads.

---

## Daily Usage

### Automatic (No Action)
- **07:30 AEDT** → Cron runs → Brief sends to Telegram

### Manual Trigger
```bash
node ~/.openclaw/workspace/scripts/health-brief-generator.js
```

### Upload Trigger
1. Export StrengthInsight data from app
2. Upload `strengthinsight-*.json` to Telegram chat
3. System detects → generates brief → sends immediately

---

## Data Files

### WHOOP Cache
- **Path:** `~/.openclaw/workspace/.whoop-cache.json`
- **Format:** JSON array with daily recovery/sleep
- **Update:** Manually OR via WHOOP API (if integrated)

### StrengthInsight Export
- **Auto-finds:** Latest JSON in `~/research/` or upload directory
- **Can specify:** `--strength-path /path/to/export.json`
- **Your latest:** Already detected from today's upload

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Brief not sending | Check `$TELEGRAM_BOT_TOKEN` + `$TELEGRAM_CHAT_ID` env vars |
| File not found | Verify StrengthInsight JSON in `~/research/` or `~/.openclaw/media/inbound/` |
| Cron not running | Check `crontab -l` && `tail -f /var/log/health-brief.log` |
| Corrupted cache | `rm -f ~/.openclaw/workspace/.whoop-cache.json` && re-upload data |

---

## Next Steps

1. ✅ **Add environment variables** to `~/.bashrc` (or OpenClaw config)
2. ✅ **Test generator** (`node scripts/... --test`)
3. ✅ **Install cron job** (`crontab -e`)
4. ✅ **Upload StrengthInsight JSON** to trigger first brief

**First automated brief:** Tomorrow at 07:30 AEDT  
**Manual trigger:** Anytime via upload or CLI

---

## Questions?

- **Full setup docs:** `HEALTH_BRIEF_SETUP.md`
- **Quick reference:** `HEALTH_BRIEF_QUICKSTART.txt`
- **Scripts location:** `~/.openclaw/workspace/scripts/`
- **Logs:** `/var/log/health-brief.log` (after first cron run)
