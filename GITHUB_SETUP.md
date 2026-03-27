# GitHub Setup Instructions

## Push Autonomous Coding Team to GitHub

### Step 1: Create Repo on GitHub

Go to https://github.com/new

**Fill in:**
- Repository name: `autonomous-coding-team`
- Description: `Autonomous coding team with OpenCode, Ollama, and subagents (zero subscription costs)`
- Visibility: Public (or Private if preferred)
- Do NOT initialize with README (we already have one)

Click "Create repository"

### Step 2: Add Remote & Push

```bash
cd /var/lib/openclaw/.openclaw/workspace

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/autonomous-coding-team.git

# Verify
git remote -v

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Verify on GitHub

Visit: https://github.com/YOUR_USERNAME/autonomous-coding-team

Should show:
- ✅ AUTONOMOUS_CODING_TEAM.md
- ✅ AUTONOMOUS_CODING_DEPLOYMENT.md
- ✅ scripts/setup-ollama.sh
- ✅ subagents/code-generator-agent.js
- ✅ src/autonomous-task-router.js
- ✅ tests/autonomous-coding.test.js
- ✅ 2 commits with full history

---

## That's it!

Your autonomous coding team is now on GitHub, ready for deployment to RPi 5.

Next: Run `bash scripts/setup-ollama.sh` on your RPi 5
