# Memory Maintenance Guidelines

## Signal vs Noise

**KEEP (high signal):**
- Explicit decisions ("Use haiku for daily chat, opus for complex")
- Constraints ("Max 2 concurrent agents")
- Patterns learned ("Single-arm exercises help with elbow recovery")
- Preferences ("Direct, friendly vibe")
- Failures & lessons ("WHOOP API endpoint changed—fallback needed")
- Standing rules ("Ask before external actions")
- Context that affects judgment ("Matt has 1h/day, 3 kids under 6")

**DISCARD (low signal):**
- Routine activity logs ("Ran cron job at 07:30")
- Solved problems ("Fixed git merge conflict on branch X")
- Temporary notes ("Waiting for response from user")
- Redundant entries (same fact stated twice)
- Command outputs unless they reveal a pattern
- Session-specific debug info

## Compaction Rules

### Source: Daily Notes → MEMORY.md

1. **Read** `memory/YYYY-MM-DD.md` (all files since last compaction)
2. **Extract** decisions, lessons, constraints, preferences
3. **Deduplicate** against existing MEMORY.md entries
4. **Append** new high-signal content to MEMORY.md
5. **Archive** old daily notes to `memory/archive/YYYY-WW/`

### Example

**Daily note (raw):**
```
- Ran whoop keepalive cron, token refreshed successfully
- Investigated API timeout issue: endpoint changed
- Fallback: use stored metrics if live fetch fails
- Matt wants haiku for daily, opus for complex tasks
```

**MEMORY.md entry (distilled):**
```
## WHOOP Integration
- API endpoint `/developer/v2/...` returns 404 (changed)
- Keepalive cron refreshes token ~45 min intervals
- Fallback: load metrics from StrengthInsight export if API unavailable
```

## Schedule

- **Daily:** I capture events in `memory/YYYY-MM-DD.md` (raw, chronological)
- **Biweekly:** Heartbeat task reviews and distills into MEMORY.md
- **Weekly:** Cron job archives daily notes older than 7 days
- **Monthly:** Review MEMORY.md for stale entries (preferences change, constraints evolve)

## File Sizes

- **MEMORY.md:** Keep <2kb (distilled essence only)
- **Daily notes:** No limit (raw logs are cheap)
- **Archive:** Auto-cleaned after 90 days if needed

## What I Do

- Load MEMORY.md on every session startup (foundational context)
- Load today's + yesterday's daily notes (recent context)
- Archive checks happen via cron (automatic, no manual work)
- Compaction happens biweekly via heartbeat (I distill, you review)
- You have final say on what stays in MEMORY.md

---

_Last reviewed: 2026-03-18_
