function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    return Object.assign(clone(seed), JSON.parse(localStorage.getItem('khuselalink-intelligence-demo') || '{}'));
  } catch {
    return clone(seed);
  }
}

function saveState() {
  localStorage.setItem('khuselalink-intelligence-demo', JSON.stringify(state));
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function statusClass(value) {
  const text = String(value).toLowerCase();
  if (/approved|fulfilled|active|verified|allowed|completed|recovered|cleared|interviewed/.test(text)) return 'success';
  if (/pending|review|planning|submitted|lead|bolo/.test(text)) return 'warning';
  if (/denied|rejected|expired|high/.test(text)) return 'danger';
  return 'info';
}

function badge(value) {
  return `<span class="badge ${statusClass(value)}">${escapeHtml(value)}</span>`;
}

function bytes(number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = number ? Math.min(Math.floor(Math.log(number) / Math.log(1024)), 3) : 0;
  return `${(number / (1024 ** index) || 0).toFixed(index ? 1 : 0)} ${units[index]}`;
}

function currentRoleName() {
  return ({
    investigator: 'Abongile Goci — Intelligence Investigator',
    tech: 'Technical Analyst (Demo)',
    supervisor: 'Unit Supervisor (Demo)',
    legal: 'Legal & POPIA Officer (Demo)',
    custodian: 'Data Custodian (Demo)',
    admin: 'System Administrator (Demo)'
  })[state.role];
}

function addAudit(action, resource, outcome = 'Allowed') {
  state.audit.unshift({
    time: new Date().toLocaleString('sv-SE').replace(',', ''),
    user: currentRoleName(),
    action,
    resource,
    outcome
  });
  state.audit = state.audit.slice(0, 150);
  saveState();
}

function toast(title, message) {
  const item = document.createElement('div');
  item.className = 'toast';
  item.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span>`;
  $('#toastStack').append(item);
  setTimeout(() => item.remove(), 3800);
}

function metric(label, value, note, colour) {
  return `<div class="card metric" style="--metric-color:${colour}"><div class="metric-label">${escapeHtml(label)}</div><div class="metric-value">${escapeHtml(value)}</div><div class="metric-note">${escapeHtml(note)}</div></div>`;
}

function selectedCase() {
  return state.cases.find(item => item.id === state.selectedCase) || state.cases[0];
}

function caseOptions() {
  return state.cases.map(item => `<option value="${item.id}" ${item.id === state.selectedCase ? 'selected' : ''}>${escapeHtml(item.id)} — ${escapeHtml(item.title)}</option>`).join('');
}

function setView(view) {
  currentView = view;
  $$('.nav-item').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  $('#viewTitle').textContent = viewMeta[view][0];
  $('#viewSubtitle').textContent = viewMeta[view][1];
  $('#sidebar').classList.remove('open');
  render();
}
