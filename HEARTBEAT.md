# HEARTBEAT.md — Periodic Checks & Tasks

## Rotating Tasks (perform 1-2 per heartbeat cycle)

### Daily Checks
- **Email:** Any urgent unread messages? (once per day)
- **Calendar:** Upcoming events in next 24-48h? (once per day)

### Biweekly (every 14 days)
- **Memory Compaction:** Review `memory/YYYY-MM-DD.md` from past 2 weeks
  - Extract decisions, lessons, failures, constraints
  - Distill into MEMORY.md
  - You review additions before I commit
  - Archive old daily notes via `scripts/memory-archive.sh`

### Monthly
- **MEMORY.md Audit:** Review MEMORY.md for stale entries
  - Remove outdated constraints
  - Consolidate duplicate entries
  - Reflect any evolved preferences or context

## Tracking

Store last-run dates in `memory/heartbeat-state.json`:

```json
{
  "lastCompaction": "2026-03-18",
  "lastEmailCheck": "2026-03-18",
  "lastCalendarCheck": "2026-03-18"
}
```

## When to Alert

- Urgent email (from known sender, high priority keywords)
- Calendar event <2h away
- Memory compaction review ready (I'll draft and ask for approval)
- Anything that needs your immediate attention

## When to Stay Silent (HEARTBEAT_OK)

- No urgent items
- Routine activity
- Recent check (<30 min ago)
- Late night (23:00-08:00) unless critical
