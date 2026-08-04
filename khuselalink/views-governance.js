function requestsView() {
  return `
    <div class="section-title"><div><h3>External data-request register</h3><p>No connector releases data until every required gate is complete</p></div><button class="primary-button spacer" id="newRequest">+ New request</button></div>
    <div class="table-wrap"><table><thead><tr><th>Request</th><th>Case</th><th>Custodian</th><th>Dataset</th><th>Legal basis</th><th>Sensitivity</th><th>Status</th><th></th></tr></thead><tbody>
      ${state.requests.map(request => `<tr><td class="mono">${request.id}</td><td class="mono">${request.caseId}</td><td>${escapeHtml(request.department)}</td><td>${escapeHtml(request.dataset)}</td><td>${escapeHtml(request.basis)}</td><td>${badge(request.sensitivity)}</td><td>${badge(request.status)}</td><td><button class="secondary-button inspect-request" data-id="${request.id}">Inspect</button></td></tr>`).join('')}
    </tbody></table></div>
  `;
}

function evidenceView() {
  return `
    <div class="grid grid-2">
      <div class="card">
        <div class="card-header"><div><h3>Register evidence</h3><p>Hashing happens locally in the browser</p></div></div>
        <label class="upload-zone" id="uploadZone"><input type="file" id="evidenceFile"><span class="capability-icon">⬆</span><h4>Choose or drop a demonstration file</h4><p>The file is not uploaded to any server.</p></label>
        <div id="uploadPreview"></div>
        <label class="field-label">Case<select id="uploadCase">${caseOptions()}</select></label>
        <button class="primary-button" id="registerEvidence" disabled>Register hash and custody event</button>
      </div>
      <div class="card">
        <div class="card-header"><div><h3>Evidence-control principles</h3><p>Required before court or disciplinary use</p></div></div>
        <div class="kv-list">
          ${keyValue('Integrity', 'SHA-256 hash at intake')}
          ${keyValue('Custody', 'Named handler and timestamp')}
          ${keyValue('Source', 'Origin and legal authority')}
          ${keyValue('Review', 'Human confirmation of automated results')}
          ${keyValue('Retention', 'Case and law-specific policy')}
        </div>
      </div>
    </div>
    <div class="section-title"><div><h3>Evidence register</h3><p>${state.evidence.length} synthetic objects</p></div><button class="secondary-button spacer" id="exportEvidence">Export CSV</button></div>
    <div class="table-wrap"><table><thead><tr><th>ID</th><th>Case</th><th>File</th><th>Size</th><th>Hash</th><th>Source</th><th>Registered</th></tr></thead><tbody>${state.evidence.map(item => `<tr><td class="mono">${item.id}</td><td class="mono">${item.caseId}</td><td>${escapeHtml(item.name)}</td><td>${bytes(item.size)}</td><td class="mono">${escapeHtml(item.hash)}</td><td>${escapeHtml(item.source)}</td><td>${escapeHtml(item.time)}</td></tr>`).join('')}</tbody></table></div>
  `;
}

function authorisationsView() {
  return `
    <div class="notice"><strong>Current role:</strong> ${escapeHtml(currentRoleName())}. Investigators and technical analysts cannot approve their own requests.</div>
    <div class="section-title"><div><h3>Approval queue</h3><p>Legal, supervisory and custodian separation of duties</p></div></div>
    ${approvalTable()}
    <div class="section-title"><div><h3>Role access matrix</h3></div></div>
    <div class="card" style="overflow:auto"><div class="access-matrix">
      <div class="access-row"><strong>Capability</strong>${['Investigator','Tech analyst','Supervisor','Legal','Custodian','Admin'].map(item => `<div class="access-cell"><strong>${item}</strong></div>`).join('')}</div>
      ${accessRow('Create case', ['yes','no','yes','no','no','yes'])}
      ${accessRow('Run released-data search', ['condition','yes','condition','no','no','yes'])}
      ${accessRow('Approve legal basis', ['no','no','no','yes','no','condition'])}
      ${accessRow('Release external data', ['no','no','no','no','yes','condition'])}
      ${accessRow('Approve operation', ['no','no','yes','condition','no','condition'])}
      ${accessRow('Change policy', ['no','no','no','no','no','yes'])}
    </div></div>
  `;
}

function approvalTable() {
  return `<div class="table-wrap"><table><thead><tr><th>Request</th><th>Approval step</th><th>Assigned role</th><th>Due</th><th>Status</th><th>Decision</th></tr></thead><tbody>${state.approvals.map((approval, index) => `<tr><td class="mono">${approval.requestId}</td><td>${escapeHtml(approval.step)}</td><td>${escapeHtml(approval.label)}</td><td>${escapeHtml(approval.due)}</td><td>${badge(approval.status)}</td><td><div class="case-actions"><button class="secondary-button approve" data-index="${index}" ${approval.status !== 'Pending' ? 'disabled' : ''}>Approve</button><button class="danger-button reject" data-index="${index}" ${approval.status !== 'Pending' ? 'disabled' : ''}>Reject</button></div></td></tr>`).join('')}</tbody></table></div>`;
}

function accessRow(label, cells) {
  const symbol = { yes: '✓', no: '—', condition: 'Gate' };
  return `<div class="access-row"><strong>${escapeHtml(label)}</strong>${cells.map(cell => `<div class="access-cell access-${cell}">${symbol[cell]}</div>`).join('')}</div>`;
}

function auditView() {
  return `
    <div class="grid grid-3">
      ${metric('Recorded events', state.audit.length, 'Local browser demo', 'rgba(94,167,255,.16)')}
      ${metric('Denied actions', state.audit.filter(item => item.outcome === 'Denied').length, 'Control events', 'rgba(255,107,120,.16)')}
      ${metric('Illustrative retention', '7 years', 'Production policy required', 'rgba(53,197,161,.16)')}
    </div>
    <div class="section-title"><div><h3>Audit event register</h3><p>Production implementation should be append-only and cryptographically chained</p></div><button class="secondary-button spacer" id="exportAudit">Export JSON</button></div>
    <div class="table-wrap"><table><thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>Resource</th><th>Outcome</th></tr></thead><tbody>${state.audit.map(item => `<tr><td class="mono">${escapeHtml(item.time)}</td><td>${escapeHtml(item.user)}</td><td>${escapeHtml(item.action)}</td><td class="mono">${escapeHtml(item.resource)}</td><td>${badge(item.outcome)}</td></tr>`).join('')}</tbody></table></div>
  `;
}

function architectureView() {
  return `
    <div class="notice"><strong>Production boundary:</strong> every connector needs a lawful mandate, signed data-sharing agreement, security accreditation, least-privilege credentials, purpose limitation, retention rules and an independent audit trail.</div>
    <div class="section-title"><div><h3>Reference architecture</h3></div></div>
    <div class="card architecture-stack">
      ${architectureLayer('Users', ['Intelligence investigator', 'Technical analyst', 'Supervisor', 'Legal officer', 'Data custodian'])}
      ${architectureLayer('Identity & access', ['MFA', 'Role-based access', 'Case entitlements', 'Privileged access management'])}
      ${architectureLayer('Investigation core', ['Case room', 'People & vehicle register', 'Requests', 'Operations', 'Evidence vault'])}
      ${architectureLayer('Analytics sandbox', ['Timeline', 'Link graph', 'ANPR correlation', 'Visual-similarity lead', 'Human review'])}
      ${architectureLayer('Disabled until authorised', ['Mobile-network gateway', 'Municipal CCTV', 'Home Affairs verification', 'Vehicle registry', 'Forensic laboratory'])}
      ${architectureLayer('Security', ['Encryption', 'Key management', 'Immutable audit', 'DLP', 'SIEM', 'Retention enforcement'])}
    </div>
    <div class="section-title"><div><h3>Department onboarding process</h3></div></div>
    <div class="workflow">
      ${workflowStep('1', 'Mandate', 'Confirm the specific law and purpose')}
      ${workflowStep('2', 'Agreement', 'Define fields, users, retention and revocation')}
      ${workflowStep('3', 'Security', 'Threat model, architecture review and testing')}
      ${workflowStep('4', 'Sandbox', 'Synthetic data and controlled pilot')}
      ${workflowStep('5', 'Accreditation', 'Named owners, monitoring and production approval')}
    </div>
    <div class="grid grid-2" style="margin-top:18px">
      <div class="card"><div class="card-header"><div><h3>Suggested production stack</h3></div></div><div class="architecture-tags">${['React / TypeScript','.NET or Java API','PostgreSQL','Object storage','OpenSearch','Graph database','OIDC / SAML','Kubernetes'].map(item => `<span>${item}</span>`).join('')}</div></div>
      <div class="card"><div class="card-header"><div><h3>Founder contact</h3></div></div><div class="kv-list">${keyValue('Name','Abongile Goci')}${keyValue('Location','Bloemfontein, Free State')}${keyValue('Email','abongilegoci7@gmail.com')}${keyValue('Mobile','081 029 4973')}${keyValue('GitHub','github.com/abongile7')}</div></div>
    </div>
  `;
}

function architectureLayer(title, tags) {
  return `<div class="architecture-layer"><strong>${escapeHtml(title)}</strong><div class="architecture-tags">${tags.map(item => `<span>${escapeHtml(item)}</span>`).join('')}</div></div>`;
}
