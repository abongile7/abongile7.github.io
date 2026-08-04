function techDeskView() {
  const approved = state.requests.filter(item => ['Approved', 'Fulfilled'].includes(item.status));
  return `
    <div class="notice"><strong>Technical desk rule:</strong> select a case and an approved data authority before searching. Results are fictional and stored only in this browser.</div>
    <div class="grid grid-2" style="margin-top:18px">
      <div class="card">
        <div class="card-header"><div><h3>Authorised synthetic search</h3><p>Phone, plate, person or camera reference</p></div></div>
        <form id="techSearchForm" class="tech-search-form">
          <label>Case<select id="techCase">${caseOptions()}</select></label>
          <label>Authority<select id="techAuthority"><option value="">Select an approved request</option>${approved.map(item => `<option value="${item.id}">${item.id} — ${escapeHtml(item.dataset)}</option>`).join('')}</select></label>
          <label>Search type<select id="techType"><option value="phone">Phone metadata</option><option value="plate">Vehicle plate</option><option value="person">Person record</option><option value="camera">Camera event</option></select></label>
          <label>Search value<input id="techValue" value="FS 42 DEMO" required /></label>
          <button class="primary-button" type="submit">Run synthetic search</button>
        </form>
      </div>
      <div class="card">
        <div class="card-header"><div><h3>Search result</h3><p>Manual review required</p></div></div>
        <div id="techResult" class="empty-state"><strong>No search performed</strong><span>Select an authority and run a synthetic query.</span></div>
      </div>
    </div>

    <div class="section-title"><div><h3>Technical capabilities</h3><p>What a controlled production system could coordinate</p></div></div>
    <div class="grid grid-4">
      ${capabilityCard('Phone metadata', 'Historical call-detail and tower-event records received through lawful requests. No live interception.')}
      ${capabilityCard('Camera review', 'Registered clips, timestamps and manual analyst annotations.')}
      ${capabilityCard('ANPR correlation', 'Plate sightings treated as investigative leads, not proof of the driver.')}
      ${capabilityCard('Identity verification', 'Minimum necessary fields returned after interdepartmental approval.')}
    </div>
  `;
}

function capabilityCard(title, description) {
  return `<div class="card capability-card"><span class="capability-icon">⌁</span><h4>${escapeHtml(title)}</h4><p>${escapeHtml(description)}</p></div>`;
}

function peopleVehiclesView() {
  return `
    <div class="grid grid-2">
      <div class="card">
        <div class="card-header"><div><h3>People register</h3><p>Profiles are leads and witnesses, not automated guilt findings</p></div></div>
        <div class="profile-list">${state.people.map(person => `<article class="profile-card"><span class="profile-avatar">${person.name.split(' ').map(part => part[0]).join('').slice(0,2)}</span><div><strong>${escapeHtml(person.name)}</strong><p>${escapeHtml(person.role)} • ${escapeHtml(person.id)}</p><small>${escapeHtml(person.note)}</small></div>${badge(person.status)}</article>`).join('')}</div>
      </div>
      <div class="card">
        <div class="card-header"><div><h3>Vehicle & BOLO register</h3><p>Fictional plate records and sightings</p></div></div>
        <div class="profile-list">${state.vehicles.map(vehicle => `<article class="profile-card"><span class="vehicle-icon">CAR</span><div><strong>${escapeHtml(vehicle.plate)}</strong><p>${escapeHtml(vehicle.make)} • ${escapeHtml(vehicle.owner)}</p><small>${escapeHtml(vehicle.lastEvent)}</small></div>${badge(vehicle.status)}</article>`).join('')}</div>
      </div>
    </div>
    <div class="section-title"><div><h3>Relationship graph</h3><p>Fictional links require analyst verification and source attribution</p></div><button class="secondary-button spacer" id="recalculateGraph">Recalculate demo graph</button></div>
    <div class="card">
      <div class="link-canvas">
        <svg viewBox="0 0 1000 500" preserveAspectRatio="none">
          <g stroke="rgba(148,184,221,.35)" stroke-width="2"><line x1="500" y1="250" x2="230" y2="130"/><line x1="500" y1="250" x2="780" y2="125"/><line x1="500" y1="250" x2="230" y2="385"/><line x1="500" y1="250" x2="790" y2="375"/><line x1="230" y1="130" x2="780" y2="125" stroke-dasharray="6 7"/></g>
        </svg>
        <span class="link-node person" style="left:50%;top:50%">Person Alpha</span>
        <span class="link-node phone" style="left:23%;top:26%">Phone 071…1001</span>
        <span class="link-node vehicle" style="left:78%;top:25%">FS 42 DEMO</span>
        <span class="link-node camera" style="left:23%;top:77%">Camera C12</span>
        <span class="link-node" style="left:79%;top:75%">Evidence EV-8823</span>
      </div>
    </div>
  `;
}

function operationsView() {
  return `
    <div class="notice warning"><strong>Operational safety:</strong> this board demonstrates governance, readiness and documentation. It does not provide tactical instructions, covert-surveillance methods or live officer locations.</div>
    <div class="grid grid-2" style="margin-top:18px">
      ${state.operations.map(operation => `<article class="card operation-card"><div class="card-header"><div><h3>${escapeHtml(operation.name)}</h3><p>${escapeHtml(operation.id)} • ${escapeHtml(operation.caseId)}</p></div>${badge(operation.status)}</div><div class="kv-list">${keyValue('Commander', operation.commander)}${keyValue('Risk', operation.risk)}${keyValue('Briefing', operation.briefing)}</div><h4 class="subheading">Readiness checklist</h4><div class="checklist">${operation.checklist.map((item, index) => `<label><input type="checkbox" ${operation.status === 'Completed' || index < 2 ? 'checked' : ''} disabled><span>${escapeHtml(item)}</span></label>`).join('')}</div><button class="${operation.status === 'Completed' ? 'secondary-button' : 'primary-button'} operation-action" data-id="${operation.id}">${operation.status === 'Completed' ? 'View debrief' : 'Request launch approval'}</button></article>`).join('')}
    </div>
  `;
}
