# ✅ Health Brief System — Setup Checklist

**Status:** Ready to install  
**Time Required:** 2–30 minutes (depending on path)  
**Difficulty:** Easy (copy-paste for basic setup)

---

## 🚀 Quick Path (2 minutes)

### Pre-Setup
- [ ] You have SSH access to the machine
- [ ] You have terminal open

### Step 1: See the Example
```bash
cat /var/lib/openclaw/.openclaw/workspace/EXAMPLE_HEALTH_BRIEF.md
```
- [ ] Read through the example brief
- [ ] Understand the format (Recovery, Sleep, Strain, Strength, Recommendations, Checklist)

### Step 2: Install Crontab Entry
```bash
crontab -e
```
- [ ] Editor opens (vim or nano)
- [ ] Paste this line at the end:
```
30 07 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh
```
- [ ] Save and exit (vim: `:wq` then Enter)

### Step 3: Verify Installation
```bash
crontab -l | grep health-brief
```
- [ ] You see the line you just added
- [ ] Output looks like: `30 07 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh`

### Done! ✓
Tomorrow at 07:30 AEDT, you get the first brief.

---

## 📚 Full Path (30 minutes)

### Pre-Setup
- [ ] You have SSH access
- [ ] Terminal open
- [ ] You want to understand everything

### Step 1: Read the Documentation
- [ ] Open: `README_HEALTH_BRIEF.md` (full overview)
- [ ] Open: `EXAMPLE_HEALTH_BRIEF.md` (see the output)
- [ ] Open: `QUICK_START.md` (2-min summary)
- [ ] Open: `HEALTH_BRIEF_SYSTEM.md` (if you want all details)

### Step 2: Optional — Configure WHOOP Token (if you have one)
```bash
cd /var/lib/openclaw/.openclaw/workspace
echo "WHOOP_API_TOKEN=your_token_here" >> .env
echo "TELEGRAM_HEALTH_BRIEF_TARGET=your_chat_id" >> .env
```
- [ ] You have a WHOOP API token (optional, not required)
- [ ] You know your Telegram chat ID (optional, not required)
- [ ] .env file created (check: `ls -la .env`)

### Step 3: Test Manually
```bash
cd /var/lib/openclaw/.openclaw/workspace
TZ=Australia/Sydney ./health-brief-cron-v2.sh
```
- [ ] Script executes without errors
- [ ] Check the output:
```bash
cat daily-health-brief.md
```
- [ ] Brief is generated and looks good

### Step 4: Check Logs
```bash
tail -20 logs/health-brief-cron.log
```
- [ ] Logs show:
  - `[WHOOP] ✓ Using cached data...`
  - `[STRENGTH] ✓ Loaded XX workouts`
  - `[OUTPUT] ✓ Brief written to...`
  - `[HEALTH-BRIEF] Analysis complete.`

### Step 5: Install Crontab Entry
```bash
crontab -e
```
- [ ] Editor opens
- [ ] Paste: `30 07 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/health-brief-cron-v2.sh`
- [ ] Save and exit (vim: `:wq`)

### Step 6: Verify Installation
```bash
crontab -l | grep health-brief
```
- [ ] Line appears in output
- [ ] Matches what you just added

### Step 7: Customize (Optional)
- [ ] Want different time? Edit crontab, change `30 07` to desired time
- [ ] Want to add WHOOP token? Update .env file
- [ ] Want Telegram target? Add to .env file
- [ ] Want logs in different location? Check HEALTH_BRIEF_SYSTEM.md for details

### Done! ✓
System is fully configured and running.

---

## 🔧 Troubleshooting Path (As Needed)

### If Generator Won't Run
```bash
# Test manually
TZ=Australia/Sydney node /var/lib/openclaw/.openclaw/workspace/health-brief-generator-v2.js
```
- [ ] Check error message
- [ ] See: CRONTAB_SETUP.md → Troubleshooting section

### If Cron Isn't Triggering
```bash
# Check cron daemon
sudo service cron status
```
- [ ] Cron daemon is running
- [ ] Check logs: `tail /var/log/syslog | grep CRON`

### If Output File Missing
```bash
# Check if file exists
ls -la daily-health-brief.md
```
- [ ] File exists and has recent modification time
- [ ] Can read it: `cat daily-health-brief.md`

### If Logs Show Errors
```bash
# View logs
tail -50 logs/health-brief-cron.log
```
- [ ] Read error messages
- [ ] See: CRONTAB_SETUP.md → Troubleshooting section

---

## 📋 Post-Setup Verification

### After Installation, Verify:

- [ ] **Cron is installed:** `crontab -l | grep health-brief`
- [ ] **Generator works manually:** `TZ=Australia/Sydney ./health-brief-cron-v2.sh`
- [ ] **Output file exists:** `ls -la daily-health-brief.md`
- [ ] **Logs show success:** `tail logs/health-brief-cron.log`
- [ ] **Files are executable:** `ls -la health-brief*.* | grep x`
- [ ] **Timezone is correct:** `TZ=Australia/Sydney date`

### All Checked? ✓
You're ready. Tomorrow at 07:30 AEDT, first brief arrives.

---

## 🎯 Timeline

| Time | What |
|------|------|
| **Today (whenever you install)** | Crontab installed, system ready |
| **Tomorrow 07:30 AEDT** | First brief generated and sent |
| **Every morning 07:30 AEDT** | New brief arrives automatically |

---

## 💡 Tips

**Tip 1: Keep Example Handy**
If you forget what the brief looks like:
```bash
cat EXAMPLE_HEALTH_BRIEF.md
```

**Tip 2: Check Logs Anytime**
To see what happened yesterday:
```bash
tail -30 logs/health-brief-cron.log
```

**Tip 3: Manual Test Anytime**
To generate a brief manually (any time of day):
```bash
TZ=Australia/Sydney ./health-brief-cron-v2.sh
```

**Tip 4: Change Time**
To run at different time (e.g., 06:00 instead of 07:30):
```bash
crontab -e
# Change: 30 07 → 00 06
```

**Tip 5: Add WHOOP Token Later**
You don't need it installed. System works with cached data.
If you get a token later, just add to .env:
```bash
echo "WHOOP_API_TOKEN=..." >> .env
```

---

## ❓ FAQ

**Q: Do I need to do anything after installation?**
A: No. It's completely automatic. Just read the brief when it arrives.

**Q: What if I'm away tomorrow at 07:30?**
A: Brief still generates. You can read it anytime with: `cat daily-health-brief.md`

**Q: Can I change the time?**
A: Yes. Edit crontab (`crontab -e`) and change `30 07` to desired time.

**Q: What if my WHOOP API is down?**
A: System uses cached data. Brief still generates. No problem.

**Q: Can I run it manually anytime?**
A: Yes. Run: `TZ=Australia/Sydney ./health-brief-cron-v2.sh`

**Q: Where are my outputs saved?**
A: `/var/lib/openclaw/.openclaw/workspace/daily-health-brief.md`

**Q: Can I customize the recommendations?**
A: Yes. Edit `health-brief-generator-v2.js` and modify the recommendations section. See HEALTH_BRIEF_SYSTEM.md for details.

---

## 🆘 Need Help?

**Quick issues:**
- Check logs: `tail logs/health-brief-cron.log`
- Test manually: `TZ=Australia/Sydney ./health-brief-cron-v2.sh`
- See docs: `cat CRONTAB_SETUP.md`

**Complex issues:**
- Read: HEALTH_BRIEF_SYSTEM.md (full troubleshooting guide)
- Check cron daemon: `sudo service cron status`
- Verify crontab: `crontab -l`

---

## ✅ You're All Set!

**Pick your path:**
- **Quick (2 min)?** → Follow "Quick Path" above
- **Thorough (30 min)?** → Follow "Full Path" above
- **Troubleshooting?** → Use "Troubleshooting Path" as needed

**Next step:** Run one of the paths above, then you're done.

Starting tomorrow, daily briefs arrive at 07:30 AEDT. 🎉

---

*Checklist created: 26 March 2026*  
*System status: Ready for installation*  
*Difficulty: Easy (2-3 copy-paste operations)*
