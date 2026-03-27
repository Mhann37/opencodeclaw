# Mission Control

Minimal dark-mode operations dashboard for your OpenClaw setup.

## Live data sources
- `openclaw sessions --json`
- `openclaw channels status --json`
- `openclaw nodes status --json`
- `openclaw cron list --json`
- `second-brain/projects/projects.json` (preferred)
- `mission-control/data/projects.json` (fallback)

## Run
```bash
python3 server.py
```

Then open on the Pi or any reachable device:
- `http://<pi-or-tailscale-ip>:8080`

## Projects source of truth
Edit:
- `second-brain/projects/projects.json`

This is the main file for tracked work items and statuses:
- backlog
- in-progress
- completed
- cancelled

## Notes
- The UI renders live operational data only.
- Empty states are shown where no real data exists.
- There is no frontend dummy state anymore.
