#!/usr/bin/env python3
import json
import os
import subprocess
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
import time
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / 'data'
PORT = int(os.environ.get('MISSION_CONTROL_PORT', '8080'))
CACHE_TTL_SECONDS = 15
CACHE = {'ts': 0.0, 'payload': None}


def run_json(cmd):
    try:
        out = subprocess.check_output(cmd, cwd=ROOT.parent, stderr=subprocess.DEVNULL, text=True, timeout=15)
        return json.loads(out)
    except Exception:
        return None


def iso_now():
    return datetime.now(timezone.utc).isoformat()


def load_projects():
    candidates = [
        ROOT.parent / 'second-brain' / 'projects' / 'projects.json',
        DATA_DIR / 'projects.json',
    ]
    for path in candidates:
        if path.exists():
            try:
                return json.loads(path.read_text())
            except Exception:
                return []
    return []


def load_tasks():
    path = ROOT.parent / 'second-brain' / 'tasks' / 'next-actions.json'
    if not path.exists():
        return []
    try:
        return json.loads(path.read_text())
    except Exception:
        return []


def build_sessions():
    payload = run_json(['openclaw', 'sessions', '--json']) or {}
    sessions = payload.get('sessions', [])
    items = []
    for s in sessions:
        items.append({
            'key': s.get('key'),
            'kind': s.get('kind'),
            'model': s.get('model'),
            'ageMs': s.get('ageMs'),
            'totalTokens': s.get('totalTokens'),
            'contextTokens': s.get('contextTokens'),
            'status': 'active' if (s.get('ageMs') or 10**12) < 30 * 60 * 1000 else 'idle'
        })
    return items


def build_channels():
    payload = run_json(['openclaw', 'channels', 'status', '--json']) or {}
    channels = []
    for channel_id in payload.get('channelOrder', []):
        ch = (payload.get('channels') or {}).get(channel_id, {})
        accounts = (payload.get('channelAccounts') or {}).get(channel_id, [])
        last_inbound = max([a.get('lastInboundAt') or 0 for a in accounts] or [0])
        channels.append({
            'id': channel_id,
            'label': (payload.get('channelLabels') or {}).get(channel_id, channel_id),
            'configured': ch.get('configured', False),
            'running': ch.get('running', False),
            'mode': ch.get('mode'),
            'accounts': len(accounts),
            'lastInboundAt': last_inbound or None,
            'status': 'ok' if ch.get('running') else 'down'
        })
    return channels


def build_nodes():
    payload = run_json(['openclaw', 'nodes', 'status', '--json']) or {}
    nodes = payload.get('nodes', []) or []
    items = []
    for n in nodes:
        items.append({
            'id': n.get('id') or n.get('nodeId') or n.get('name'),
            'name': n.get('name') or n.get('displayName') or n.get('id') or 'node',
            'connected': bool(n.get('connected') or n.get('online')),
            'capabilities': n.get('capabilities') or [],
            'raw': n
        })
    return items


def build_automations():
    payload = run_json(['openclaw', 'cron', 'list', '--json']) or {}
    jobs = payload.get('jobs', []) or []
    items = []
    for job in jobs:
        schedule = job.get('schedule') or {}
        items.append({
            'id': job.get('jobId') or job.get('id'),
            'name': job.get('name') or job.get('jobId') or 'cron job',
            'enabled': job.get('enabled', True),
            'schedule': schedule,
            'status': 'enabled' if job.get('enabled', True) else 'disabled'
        })
    return items


def build_alerts(channels, nodes, automations):
    alerts = []
    for c in channels:
        if not c.get('running'):
            alerts.append({'level': 'warn', 'title': f"{c['label']} is not running", 'detail': 'Channel is configured but not active.'})
    for n in nodes:
        if not n.get('connected'):
            alerts.append({'level': 'warn', 'title': f"{n['name']} is offline", 'detail': 'Node is known but not currently connected.'})
    disabled = [a for a in automations if not a.get('enabled')]
    if disabled:
        alerts.append({'level': 'info', 'title': f'{len(disabled)} automation(s) disabled', 'detail': 'Some cron jobs are present but disabled.'})
    return alerts


def build_overview_uncached():
    with ThreadPoolExecutor(max_workers=6) as pool:
        futures = {
            'sessions': pool.submit(build_sessions),
            'channels': pool.submit(build_channels),
            'nodes': pool.submit(build_nodes),
            'automations': pool.submit(build_automations),
            'projects': pool.submit(load_projects),
            'tasks': pool.submit(load_tasks),
        }
        sessions = futures['sessions'].result()
        channels = futures['channels'].result()
        nodes = futures['nodes'].result()
        automations = futures['automations'].result()
        projects = futures['projects'].result()
        tasks = futures['tasks'].result()
    alerts = build_alerts(channels, nodes, automations)
    return {
        'generatedAt': iso_now(),
        'kpis': [
            {'label': 'Active sessions', 'value': len([s for s in sessions if s['status'] == 'active']), 'delta': f"{len(sessions)} total"},
            {'label': 'Channels running', 'value': len([c for c in channels if c['running']]), 'delta': f"{len(channels)} configured" if channels else 'No channels configured'},
            {'label': 'Connected nodes', 'value': len([n for n in nodes if n['connected']]), 'delta': f"{len(nodes)} known" if nodes else 'No nodes paired'},
            {'label': 'Open alerts', 'value': len(alerts), 'delta': 'Derived from live operational state'}
        ],
        'alerts': alerts,
        'sessions': sessions,
        'channels': channels,
        'nodes': nodes,
        'automations': automations,
        'projects': projects,
        'tasks': tasks
    }


def build_overview():
    now = time.time()
    if CACHE['payload'] is not None and now - CACHE['ts'] < CACHE_TTL_SECONDS:
        return CACHE['payload']
    payload = build_overview_uncached()
    CACHE['ts'] = now
    CACHE['payload'] = payload
    return payload


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/api/overview':
            payload = build_overview()
            data = json.dumps(payload).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        return super().do_GET()


if __name__ == '__main__':
    httpd = ThreadingHTTPServer(('0.0.0.0', PORT), Handler)
    print(f'Mission Control serving on http://0.0.0.0:{PORT}', flush=True)
    httpd.serve_forever()
