# MEMORY.md

## Identity

- Assistant name: Jarvis.
- Nature: AI assistant.
- Preferred vibe: direct and friendly.
- Signature emoji: 💪

## User

- User's name: Matt.
- Call the user Matt.
- Timezone: Australia/Sydney.
- Matt works in fraud for a bank.
- Matt is a busy professional and a dad of three kids under six.
- Matt can realistically put in about 1 hour/day, roughly 7–10 hours/week.
- Top priorities right now: hobby/creative outlet; becoming a better father/husband.
- Broader goals for Jarvis/OpenClaw: build foundational AI/tech skills; innovate and increase productivity (monetization secondary, not primary obsession).
- Matt wants help reducing mental load, especially remembering things and avoiding dropped balls.
- AI/tech skill interests: setting up this system, using Linux, and staying current on AI trends/capabilities.
- 3-month win: a well-oiled Jarvis/OpenClaw setup plus some real income signal, even if modest.
- Matt is not interested in a content-first/content-creator strategy.
- Preference: keep improvements token-efficient; ask first before significant token use or architectural expansion.
- Agent policy: maximum 2 concurrent agents total unless Matt explicitly approves more.
- Working autonomy envelope: Jarvis can research, analyse, draft, organise, suggest freely, and make small local system improvements proactively; must ask before public actions, external sending, purchases, or meaningful config changes.
- Workflow preference: small useful dashboard improvements can be made without asking first.
- Canonical operating context for direct chats lives in `second-brain/areas/matt-operating-manual.md`.

## Health Brief System (LIVE — 2026-03-27)

**Status:** ✅ Fully automated + Telegram delivery working

**How it works:**
1. Daily cron at **07:30 AEDT** generates coaching-level brief
2. Analyzes 7-day StrengthInsight volume history (muscle groups, imbalances, plateaus)
3. Sends to Telegram automatically via curl

**Scripts location:** 
- Generator: `~/.openclaw/workspace/scripts/health-brief-production.js` (13.9K)
- Cron wrapper: `~/.openclaw/workspace/scripts/health-brief-cron-production.sh` (1.5K)
- Telegram sender: `~/.openclaw/workspace/scripts/health-brief-telegram-send.sh` (1.2K)

**Crontab entry (ACTIVE):**
```
30 07 * * * TZ=Australia/Sydney /var/lib/openclaw/.openclaw/workspace/scripts/health-brief-cron-production.sh
```

**Bot token:** ✅ Configured (set in cron wrapper)

## Active Projects & Status

### StrengthInsight — MONITORING ONLY
- Monitor occasionally for WHOOP API fixes
- No effort on monetization currently
- Health brief automation remains active

### SetlistArt — OCCASIONAL CHECK-IN
- Monitor SEO changes from branch 003-seo-optimizations
- Check back in ~1 week for search ranking movement
- No active development

### WineNight (B2B Winery SaaS) — ACTIVE (WHEN CAPACITY)
- **Model shift (Mar 22):** Moved from personal subscription to winery B2B focus
- **Personal tier:** Free (up to 4 tasters + ads) or $9.99 one-time (unlimited, no ads)
- **Winery tier (core):** $99/mo Pro (unlimited tastings, staff dashboard, email capture, real-time analytics, branded results)
- **Winery ROI:** Boutique winery (50-100 tasters/mo) = $340/mo extra revenue vs. $99 cost (3.4x payback)
- **Go-to-market:** Wineries first (fund dev with recurring revenue), personal second (bonus, high margin, low CAC)
- **MVP scope:** Winery staff login, dashboard, QR generation, real-time tasting view, email capture, branded results = 35-40 hours, 1-1.5 weeks
- **Repository:** https://github.com/Mhann37/WineNightv2 (in active development as of Mar 22 evening)
- **Year 1 projection:** 75-100 winery customers @ $99/mo = $90k-120k ARR
- **Development pace:** When capacity allows; build only when energy is right

### ~~JoelCaine Sports Analytics~~ — REMOVED
- Decision: No longer pursuing sports betting analysis
- Removed from codebase and GitHub (2026-03-27)

### Fraud Playbook Product (Real Estate SaaS) — PAUSED
- **Model:** $299 USD PDF playbook + editable templates + lead-magnet assessment app
- **Status:** Draft paused (Matt working on other priorities); resume when bandwidth available
- **Deliverables planned:** React assessment app + 30-40 page playbook + Gumroad + cold email outreach to real estate agents

### StrengthInsight (WHOOP Training Dashboard) — PERSONAL USE
- **Model:** Ingests WHOOP Strength Trainer screenshots; shows metrics + next-workout guidance
- **Current use:** Personal fitness tracking (priority over commercialization)
- **Data:** 43 workouts / 14 weeks (excellent adherence); identified back/leg volume gaps

## Health & Fitness Context (Durable)
- **Medication:** Mounjaro (tirzepatide) 0.3mg weekly; considering increase to 0.5mg on return from travel
- **Weight loss:** 127.8kg (27 Jan) → 118.9kg (20 Mar) = 9kg in ~8 weeks (~1.1kg/week, strong trajectory)
- **Current health metrics:** Recovery 57-68%, HRV ~44ms, RHR ~56bpm, SpO₂ 97%+, sleep efficiency 88-99% when asleep
- **Sleep pattern:** Consistency variable (51-87%) due to schedule disruptions; improves with routine
- **Training injury:** Elbow tendinitis from heavy lat pulldowns ~2-3 weeks before Mar 17; emphasize balanced push/pull to prevent aggravation
- **Fitness priority:** Back volume (need 2-3 dedicated sessions/week), leg volume (2x/week squats+deadlifts); arms balanced

## OpenClaw Capabilities & Learnings (Durable)
- **Web search:** Brave API fully operational (web_search tool)
- **Browser automation:** Works on Bing/DuckDuckGo; Google blocks bots with CAPTCHA — not viable for automated search
- **WHOOP API lessons:** Token refresh ≠ endpoint access; separate diagnostics needed; Cloudflare 403s block cloud runtime access from some IPs
- **Cron jobs reliability:** Explicit targets required (e.g., `--target 8593559681 --channel telegram` not `channel=last`); don't assume jobs are correct just because they exist
- **WHOOP health brief:** Scores data overnight; fetch yesterday's data at morning cron (07:30 AEDT), not today's
- **WHOOP API robustness:** Mix stdout+stderr contamination (dotenv logging); implement retry logic (3 attempts, 5s delays), cache fallback, graceful degradation if API fails
- **GitHub + Vercel workflow:** Duplicate files cause build confusion; ESLint warnings treated as errors in CI (process.env.CI=true); git reset-to-clean-state prevents conflict issues
- **Deployed tools:** Calendar app (Vercel mobile-optimized), WineNight v2 (in active development)

## Autonomous Coding Team (LIVE — 2026-03-27)

**Status:** ✅ Full architecture built + GitHub deployed

**What it does:**
- Generates code autonomously using OpenCode + Ollama (local LLM)
- Zero subscription costs, zero API quota issues
- Runs on Raspberry Pi 5 (4GB RAM)
- Multi-agent subagents for parallel execution

**Architecture:**
- Ollama (local LLM server) + orca-mini-7b (3GB model)
- Code generator subagent (generates, validates, documents)
- Task router (orchestrates parallel execution)
- Test suite (5/5 passing)

**GitHub repo:** https://github.com/Mhann37/opencodeclaw

**Key files:**
- `AUTONOMOUS_CODING_TEAM.md` — Architecture & design
- `AUTONOMOUS_CODING_DEPLOYMENT.md` — Deployment guide
- `subagents/code-generator-agent.js` — Code generation
- `src/autonomous-task-router.js` — Task orchestration
- `scripts/setup-ollama.sh` — RPi 5 setup
- `tests/autonomous-coding.test.js` — Test suite (all passing)

**Next steps:**
1. Deploy Ollama on RPi 5: `bash scripts/setup-ollama.sh`
2. Test end-to-end: `node src/autonomous-task-router.js`
3. Integrate with Jarvis for auto-code-generation tasks

**Impact:** Eliminates all subscription LLM usage for coding work. Fully offline, private, unlimited.

## OpenClaw Autonomy & Policies
- **Agents:** Maximum 2 concurrent unless Matt explicitly approves more
- **Coding work:** Primary via autonomous coding team (local Ollama); backup: persistent Codo agent
- **GitHub:** 
  - Primary: opencodeclaw repo (autonomous coding team)
  - Secondary: SetlistArt, WineNight repos
  - No direct pushes to main; use branch → PR workflow
- **Skills:** Never install without explicit permission; full security review before any installation
