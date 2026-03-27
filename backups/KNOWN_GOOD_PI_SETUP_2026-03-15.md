# Known-good Pi setup snapshot — 2026-03-15 23:38 AEDT

Status at snapshot:
- Telegram chat working with PC shut down.
- Pi-only messaging confirmed in direct chat.
- OpenClaw primary model: `openai-codex/gpt-5.4`.
- Workspace: `/var/lib/openclaw/.openclaw/workspace`.

Live config file:
- `/var/lib/openclaw/.openclaw/openclaw.json`

Important non-public files backed up locally:
- `openclaw.json`
- identity files
- paired/pending device files
- telegram credential/pairing files (when present)

Operational notes:
- Gateway mode: local
- Gateway bind: loopback
- Telegram: enabled
- Tailscale: off
- Gateway service: systemd installed but status could not be verified from current permissions

Backup bundle created:
- `/var/lib/openclaw/.openclaw/workspace/backups/openclaw-backup-2026-03-15_23-38-16.tar.gz`

Restore strategy:
1. Stop OpenClaw/gateway if needed.
2. Extract the backup archive.
3. Restore the backed-up files to their original locations.
4. Start OpenClaw again.
5. Test Telegram chat from the Pi-only setup.

Change-control rule for future work:
- Treat this state as known-good.
- Before editing config, diff against this snapshot.
- Prefer reversible changes one at a time.
- Avoid touching auth, Telegram, gateway, or pairing settings casually.

Sensitive values intentionally omitted from this note.
