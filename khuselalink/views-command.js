function commandView() {
  const pendingApprovals = state.approvals.filter(item => item.status === 'Pending').length;
  const activeOperations = state.operations.filter(item => item.status !== 'Completed').length;
  return `
    <div class="notice warning"><strong>Fiction versus production:</strong> television often compresses warrants, data requests and analysis into seconds. This demo makes those gates visible. It cannot access a phone, camera, identity record or vehicle database.</div>
    <div class="grid grid-4" style="margin-top:18px">
      ${metric('Priority cases', state.cases.length, 'Synthetic intelligence rooms', 'rgba(53,197,161,.16)')}
      ${metric('Open operations', activeOperations, 'Planning and readiness only', 'rgba(94,167,255,.16)')}
      ${metric('Pending approvals', pendingApprovals, 'Legal and supervisor gates', 'rgba(246,184,74,.16)')}
      ${metric('Evidence objects', state.evidence.length, 'Integrity records registered', 'rgba(181,156,255,.16)')}
    </div>

    <div class="grid grid-2" style="margin-top:18px">
      <div class="card">
        <div class="card-header"><div><h3>Priority intelligence picture</h3><p>${escapeHtml(selectedCase().id)} • ${escapeHtml(selectedCase().title)}</p></div>${badge(selectedCase().status)}</div>
        <div class="briefing-board">
          <div class="briefing-column"><span class="briefing-label">Objective</span><p>${escapeHtml(selectedCase().objective)}</p></div>
          <div class="briefing-column"><span class="briefing-label">Current lead</span><p>Fictional camera-to-vehicle correlation requires manual verification.</p></div>
          <div class="briefing-column"><span class="briefing-label">Blocked action</span><p>Identity verification remains unavailable until legal approval.</p></div>
        </div>
        <div class="case-actions" style="margin-top:16px"><button class="primary-button" data-go="caseRoom">Open case room</button><button class="secondary-button" data-go="techDesk">Open tech desk</button></div>
      </div>

      <div class="card">
        <div class="card-header"><div><h3>Simulated incident feed</h3><p>No real-time data source</p></div><button class="secondary-button spacer" id="simulateEvent">Simulate event</button></div>
        <div class="incident-feed">
          ${state.incidentFeed.slice(0, 6).map(item => `<div class="incident-row"><span class="incident-time">${escapeHtml(item.time)}</span><div><strong>${escapeHtml(item.type)}</strong><p>${escapeHtml(item.detail)}</p></div></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="grid grid-2" style="margin-top:18px">
      <div class="card">
        <div class="card-header"><div><h3>Fictional movement reconstruction</h3><p>Tower, camera and ANPR events from sample data</p></div><span class="badge info spacer">Not live</span></div>
        <div class="map-panel">
          <div class="map-route"><svg viewBox="0 0 1000 500" preserveAspectRatio="none"><path d="M90 390 C210 320 245 170 405 210 S610 390 720 250 S850 105 925 145" fill="none" stroke="#5ea7ff" stroke-width="8" stroke-linecap="round" stroke-dasharray="14 12" opacity=".75"/></svg></div>
          ${[['9','78','T1','Tower event'],['40','42','C12','Camera'],['71','50','A04','ANPR'],['92','29','V','Vehicle lead']].map(node => `<span class="map-node" style="left:${node[0]}%;top:${node[1]}%">${node[2]}</span><span class="map-label" style="left:${node[0]}%;top:${node[1]}%">${node[3]}</span>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div><h3>Unit workflow</h3><p>Television-inspired case flow with real-world controls</p></div></div>
        <div class="workflow vertical-workflow">
          ${workflowStep('1', 'Incident & case', 'Open a CAS-linked workspace')}
          ${workflowStep('2', 'Intelligence development', 'Record people, vehicles and hypotheses')}
          ${workflowStep('3', 'Authority', 'Supervisor, legal and custodian approvals')}
          ${workflowStep('4', 'Technical analysis', 'Search only released synthetic datasets')}
          ${workflowStep('5', 'Evidence package', 'Hash, custody, review and export')}
        </div>
      </div>
    </div>
    <div class="footer-note">Concept and demonstration by <strong>Abongile Goci</strong> • Bloemfontein • abongilegoci7@gmail.com • 081 029 4973</div>
  `;
}

function workflowStep(number, title, description) {
  return `<div class="workflow-step"><span class="badge info">${number}</span><strong style="margin-top:9px">${escapeHtml(title)}</strong><small>${escapeHtml(description)}</small></div>`;
}

function caseRoomView() {
  const caseItem = selectedCase();
  const casePeople = state.people.filter(item => item.caseId === caseItem.id);
  const caseVehicles = state.vehicles.filter(item => item.caseId === caseItem.id);
  const caseEvidence = state.evidence.filter(item => item.caseId === caseItem.id);
  const caseRequests = state.requests.filter(item => item.caseId === caseItem.id);
  return `
    <div class="case-selector card">
      <label><span>Active case room</span><select id="caseSelector">${caseOptions()}</select></label>
      <div>${badge(caseItem.status)} ${badge(caseItem.classification)}</div>
      <button class="secondary-button" id="exportCase">Export synthetic case</button>
    </div>
    <div class="grid grid-3" style="margin-top:18px">
      ${metric('People', casePeople.length, 'Profiles and witnesses', 'rgba(53,197,161,.16)')}
      ${metric('Vehicles', caseVehicles.length, 'Plates and sightings', 'rgba(246,184,74,.16)')}
      ${metric('Evidence', caseEvidence.length, 'Hashed objects', 'rgba(94,167,255,.16)')}
    </div>
    <div class="grid grid-2" style="margin-top:18px">
      <div class="card">
        <div class="card-header"><div><h3>${escapeHtml(caseItem.title)}</h3><p>${escapeHtml(caseItem.ref)} • Lead: ${escapeHtml(caseItem.lead)}</p></div></div>
        <p class="body-copy">${escapeHtml(caseItem.summary)}</p>
        <div class="kv-list" style="margin-top:15px">
          ${keyValue('Objective', caseItem.objective)}
          ${keyValue('Progress', `${caseItem.progress}%`)}
          ${keyValue('Requests', String(caseRequests.length))}
          ${keyValue('Classification', caseItem.classification)}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div><h3>Investigation timeline</h3><p>Each automated correlation remains a lead</p></div></div>
        <div class="timeline">
          ${[
            ['08:42', 'Case opened', 'CAS reference and scope recorded.'],
            ['09:14', 'Metadata request submitted', 'External data remains unavailable pending authority.'],
            ['10:05', 'Camera footage released', 'Custodian release and hash recorded.'],
            ['14:27', 'Vehicle sighting reviewed', 'Human analyst confirmed vehicle characteristics.'],
            ['15:12', 'Identity request paused', 'Legal and POPIA review required.']
          ].map(item => `<div class="timeline-item"><span class="timeline-dot"></span><strong>${item[1]}</strong><span>${item[0]}</span><p>${item[2]}</p></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="section-title"><div><h3>Case intelligence wall</h3><p>Fictional people, vehicles, evidence and requests</p></div></div>
    <div class="intelligence-wall">
      <div class="wall-column"><h4>People</h4>${casePeople.map(item => `<button class="wall-card inspect-person" data-id="${item.id}"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.role)}</span>${badge(item.status)}</button>`).join('') || '<p class="text-muted">No people linked.</p>'}</div>
      <div class="wall-column"><h4>Vehicles</h4>${caseVehicles.map(item => `<button class="wall-card inspect-vehicle" data-id="${item.id}"><strong>${escapeHtml(item.plate)}</strong><span>${escapeHtml(item.make)}</span>${badge(item.status)}</button>`).join('') || '<p class="text-muted">No vehicles linked.</p>'}</div>
      <div class="wall-column"><h4>Evidence</h4>${caseEvidence.map(item => `<button class="wall-card inspect-evidence" data-id="${item.id}"><strong>${escapeHtml(item.id)}</strong><span>${escapeHtml(item.name)}</span>${badge('Verified')}</button>`).join('') || '<p class="text-muted">No evidence linked.</p>'}</div>
      <div class="wall-column"><h4>Requests</h4>${caseRequests.map(item => `<button class="wall-card inspect-request" data-id="${item.id}"><strong>${escapeHtml(item.id)}</strong><span>${escapeHtml(item.department)}</span>${badge(item.status)}</button>`).join('') || '<p class="text-muted">No requests linked.</p>'}</div>
    </div>
  `;
}

function keyValue(label, value) {
  return `<div class="kv"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
}
