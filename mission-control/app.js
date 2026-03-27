const el = (tag, cls, html) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html !== undefined) node.innerHTML = html;
  return node;
};

function formatAge(ageMs) {
  if (ageMs == null) return 'unknown activity';
  const mins = Math.floor(ageMs / 60000);
  if (mins < 1) return 'active just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatTokenUsage(total, context) {
  if (!total || !context) return 'token usage unavailable';
  return `${Math.round((total / context) * 100)}% of ${Math.round(context / 1000)}k ctx`;
}

function formatRelativeTime(value) {
  if (!value) return 'unknown';
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return value;
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function scheduleLabel(schedule) {
  if (!schedule || !schedule.kind) return 'No schedule details';
  if (schedule.kind === 'cron') return `Cron: ${schedule.expr}`;
  if (schedule.kind === 'every') return `Every ${Math.round((schedule.everyMs || 0) / 60000)} min`;
  if (schedule.kind === 'at') return `At ${schedule.at}`;
  return schedule.kind;
}

function renderKpis(items) {
  const root = document.getElementById('kpis');
  root.innerHTML = '';
  items.forEach(item => {
    const card = el('div', 'card metric');
    card.innerHTML = `<p class="eyebrow">${item.label}</p><div class="value">${item.value}</div><div class="delta">${item.delta || ''}</div>`;
    root.appendChild(card);
  });
}

function renderAlerts(items) {
  const root = document.getElementById('alerts');
  root.innerHTML = '';
  if (!items.length) {
    root.appendChild(el('div', 'row', `<div class="row-main"><div class="row-title">No live alerts</div><div class="row-sub">Nothing currently looks degraded from the available runtime signals.</div></div>`));
    return;
  }
  items.forEach(item => {
    const row = el('div', 'row');
    row.innerHTML = `
      <div class="row-main">
        <div class="row-title">${item.title}</div>
        <div class="row-sub">${item.detail || ''}</div>
      </div>
      <span class="status ${item.level === 'warn' ? 'warn' : item.level === 'bad' ? 'bad' : 'ok'}">${item.level}</span>
    `;
    root.appendChild(row);
  });
}

function renderSessions(items) {
  const root = document.getElementById('sessions');
  root.innerHTML = '';
  if (!items.length) {
    root.appendChild(el('div', 'row', `<div class="row-main"><div class="row-title">No sessions found</div></div>`));
    return;
  }
  items.forEach(item => {
    const status = item.status === 'active' ? 'ok' : 'warn';
    const row = el('div', 'row');
    row.innerHTML = `
      <div class="row-main">
        <div class="row-title">${item.key}</div>
        <div class="row-sub">${item.model || 'unknown model'} · ${formatAge(item.ageMs)} · ${formatTokenUsage(item.totalTokens, item.contextTokens)}</div>
      </div>
      <span class="status ${status}">${item.status}</span>
    `;
    root.appendChild(row);
  });
}

function renderChannels(items) {
  const root = document.getElementById('channels');
  root.innerHTML = '';
  if (!items.length) {
    root.appendChild(el('div', 'row', `<div class="row-main"><div class="row-title">No channels configured</div></div>`));
    return;
  }
  items.forEach(item => {
    const row = el('div', 'row');
    row.innerHTML = `
      <div class="row-main">
        <div class="row-title">${item.label}</div>
        <div class="row-sub">${item.mode || 'unknown mode'} · ${item.accounts} account(s)</div>
      </div>
      <span class="status ${item.running ? 'ok' : 'bad'}">${item.running ? 'running' : 'down'}</span>
    `;
    root.appendChild(row);
  });
}

function renderNodes(items) {
  const root = document.getElementById('nodes');
  root.innerHTML = '';
  if (!items.length) {
    root.appendChild(el('div', 'row', `<div class="row-main"><div class="row-title">No paired nodes</div><div class="row-sub">Pair a node to see device status here.</div></div>`));
    return;
  }
  items.forEach(item => {
    const caps = (item.capabilities || []).slice(0, 3).join(', ') || 'No capabilities listed';
    const row = el('div', 'row');
    row.innerHTML = `
      <div class="row-main">
        <div class="row-title">${item.name}</div>
        <div class="row-sub">${caps}</div>
      </div>
      <span class="status ${item.connected ? 'ok' : 'warn'}">${item.connected ? 'online' : 'offline'}</span>
    `;
    root.appendChild(row);
  });
}

function renderProjects(items) {
  const root = document.getElementById('projects');
  root.innerHTML = '';
  if (!items.length) {
    root.appendChild(el('div', 'project-card', `<div class="row-main"><div class="row-title">No tracked projects</div><div class="row-sub">Add items to second-brain/projects/projects.json to make this your live project board.</div></div>`));
    return;
  }
  items.forEach(item => {
    const card = el('div', 'project-card');
    card.innerHTML = `
      <div class="project-top">
        <div class="row-main">
          <div class="row-title">${item.title}</div>
          <div class="row-sub">${item.summary || ''}</div>
        </div>
        <span class="status ${item.status}">${item.status.replace('-', ' ')}</span>
      </div>
      <div class="project-meta">
        <span class="mini-pill">Priority: ${item.priority || 'unknown'}</span>
        <span class="mini-pill">Next: ${item.nextAction || 'not set'}</span>
      </div>
      <div class="subtle">Updated ${formatRelativeTime(item.updatedAt)}</div>
    `;
    root.appendChild(card);
  });
}

function renderTasks(items) {
  const root = document.getElementById('tasks');
  root.innerHTML = '';
  if (!items.length) {
    root.appendChild(el('div', 'row', `<div class="row-main"><div class="row-title">No next actions</div><div class="row-sub">Add items to second-brain/tasks/next-actions.json.</div></div>`));
    return;
  }
  items.forEach(item => {
    const row = el('div', 'row');
    row.innerHTML = `
      <div class="row-main">
        <div class="row-title">${item.title}</div>
        <div class="row-sub">${item.projectId || 'unassigned'} · ${item.priority || 'no priority'} · updated ${formatRelativeTime(item.updatedAt)}</div>
      </div>
      <span class="status ${item.status}">${item.status.replace('-', ' ')}</span>
    `;
    root.appendChild(row);
  });
}

function renderAutomations(items) {
  const root = document.getElementById('automations');
  root.innerHTML = '';
  if (!items.length) {
    root.appendChild(el('div', 'row', `<div class="row-main"><div class="row-title">No cron jobs</div><div class="row-sub">Automation will appear here once jobs exist.</div></div>`));
    return;
  }
  items.forEach(item => {
    const row = el('div', 'row');
    row.innerHTML = `
      <div class="row-main">
        <div class="row-title">${item.name}</div>
        <div class="row-sub">${scheduleLabel(item.schedule)}</div>
      </div>
      <span class="status ${item.enabled ? 'ok' : 'warn'}">${item.enabled ? 'enabled' : 'disabled'}</span>
    `;
    root.appendChild(row);
  });
}

function renderActivity(data) {
  const root = document.getElementById('activity');
  root.innerHTML = '';
  const events = [
    `Dashboard refresh generated ${formatRelativeTime(data.generatedAt)}`,
    `${data.sessions.length} session(s) loaded from OpenClaw session store`,
    `${data.channels.length} channel status record(s) loaded`,
    `${data.projects.length} tracked project(s) loaded`,
    `${(data.tasks || []).length} next action(s) loaded`
  ];
  events.forEach(text => {
    root.appendChild(el('div', 'event', `<div class="row-title">${text}</div>`));
  });
}

async function refresh() {
  const response = await fetch('./api/overview', { cache: 'no-store' });
  const data = await response.json();
  renderKpis(data.kpis || []);
  renderAlerts(data.alerts || []);
  renderSessions(data.sessions || []);
  renderChannels(data.channels || []);
  renderNodes(data.nodes || []);
  renderProjects(data.projects || []);
  renderTasks(data.tasks || []);
  renderAutomations(data.automations || []);
  renderActivity(data);
  document.getElementById('alertCount').textContent = `${(data.alerts || []).length} open`;
}

document.getElementById('refreshBtn').addEventListener('click', refresh);
document.getElementById('themeToggle').addEventListener('click', e => {
  e.target.textContent = 'Dark';
});

refresh();
setInterval(refresh, 30000);
