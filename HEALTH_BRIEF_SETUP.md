# Health Brief System — Setup Guide

**Problem:** Old cron job was brittle. New system combines WHOOP API + your StrengthInsight JSON uploads to deliver coaching-level briefs.

**How It Works:**
1. You upload `strengthinsight-*.json` to Telegram
2. System detects upload → generates fresh brief → sends to you immediately
3. **Fallback:** Daily cron at **07:30 AEDT** fetches latest data and sends brief anyway

---

## Setup (One-Time)

### 1. **Set Environment Variables**

Add these to your shell profile (`~/.bashrc`, `~/.zshrc`, or OpenClaw config):

```bash
export TELEGRAM_BOT_TOKEN="YOUR_BOT_TOKEN"
export TELEGRAM_CHAT_ID="8593559681"  # Your chat ID (Matt)
```

If using OpenClaw, add to `.openclaw/config.toml`:
```toml
[env]
TELEGRAM_BOT_TOKEN = "..."
TELEGRAM_CHAT_ID = "8593559681"
```

### 2. **Install Cron Job**

```bash
crontab -e

# Add this line for 07:30 AEDT daily delivery:
30 7 * * * /var/lib/openclaw/.openclaw/workspace/cron/health-brief.cron >> /var/log/health-brief.log 2>&1
```

Test it:
```bash
bash /var/lib/openclaw/.openclaw/workspace/cron/health-brief.cron
```

### 3. **Wire Up Telegram Upload Handler** (Optional)

When you upload strengthinsight JSON to Telegram, it auto-triggers the brief.

Add to your OpenClaw webhook or message handler:
```bash
node /var/lib/openclaw/.openclaw/workspace/handlers/strength-upload-trigger.js /path/to/uploaded/file.json
```

---

## Manual Usage

### Generate Brief Now (Test Mode)
```bash
node /var/lib/openclaw/.openclaw/workspace/scripts/health-brief-generator.js --test
```

### Generate & Send Brief
```bash
node /var/lib/openclaw/.openclaw/workspace/scripts/health-brief-generator.js
```

### With Specific Data Files
```bash
node /var/lib/openclaw/.openclaw/workspace/scripts/health-brief-generator.js \
  --whoop-path /path/to/whoop.json \
  --strength-path /path/to/strength-export.json
```

---

## Data Sources

### WHOOP Data
- **Location:** `~/.openclaw/workspace/.whoop-cache.json`
- **Format:** Array of daily records with `recovery_score`, `hrv`, `sleep_duration_seconds`
- **Update:** Manually or via WHOOP CLI

Example:
```json
[
  {
    "date": "2026-03-26",
    "recovery": { "recovery_score": 72, "hrv": 48 },
    "sleep": { "sleep_duration_seconds": 29700 }
  }
]
```

### StrengthInsight Data
- **Location:** Upload via Telegram OR copy to `~/research/strengthinsight-*.json`
- **Format:** Standard StrengthInsight export (from the app)
- **Auto-Detection:** System finds latest file in:
  - `~/.openclaw/media/inbound/` (uploads)
  - `~/research/` (manual imports)

---

## Brief Output Example

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

## Coaching Logic (What the Brief Analyzes)

### Recovery (WHOOP)
- **70%+** = Green light (aggressive training OK)
- **50-69%** = Caution (moderate intensity)
- **<50%** = Low (recovery day recommended)

### Training (StrengthInsight)
1. **Volume Trend** — Total kg in last 7 days vs 2 weeks ago
2. **Muscle Imbalances** — Any muscle group >35% of sets in last 14 days
3. **Plateaus** — Lifts stagnant for 4+ weeks (same weight, same reps)

### Focus Areas
- **#1:** Address imbalances OR maintain balance
- **#2:** Break plateaus (rep/weight variation) OR progressive overload
- **#3:** Recovery/mobility OR hydration/form cues

---

## Troubleshooting

### Brief not sending?
Check logs:
```bash
tail -f /var/log/health-brief.log
```

Check Telegram config:
```bash
echo $TELEGRAM_BOT_TOKEN
echo $TELEGRAM_CHAT_ID
```

### Data not loading?
Verify file paths:
```bash
ls -la ~/.openclaw/workspace/.whoop-cache.json
find ~/research -name "*strengthinsight*.json" | head -1
```

### Files are corrupted binary?
Clean and rebuild:
```bash
rm -f ~/.openclaw/workspace/.whoop-cache.json
# Then re-upload StrengthInsight JSON or recreate cache
```

---

## Next Steps

1. **Upload your StrengthInsight JSON** to Telegram (will auto-trigger brief)
2. **Set environment variables** (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID)
3. **Test cron:** `bash /var/lib/openclaw/.openclaw/workspace/cron/health-brief.cron`
4. **Install cron job:** Add line to `crontab -e`

**Daily delivery starts at 07:30 AEDT tomorrow.**
