function runTechSearch(event) {
  event.preventDefault();
  const authority = $('#techAuthority').value;
  const type = $('#techType').value;
  const value = $('#techValue').value.trim();
  const caseId = $('#techCase').value;
  const result = $('#techResult');

  if (!authority) {
    addAudit('Attempted technical search without authority', `${type}:${value}`, 'Denied');
    result.className = 'empty-state denied-state';
    result.innerHTML = '<strong>Search blocked</strong><span>Select an approved request before accessing even the synthetic dataset.</span>';
    toast('Search blocked', 'An approved authority is required.');
    return;
  }

  if (!['tech', 'investigator', 'supervisor', 'admin'].includes(state.role)) {
    addAudit('Attempted technical search outside permitted role', `${type}:${value}`, 'Denied');
    result.className = 'empty-state denied-state';
    result.innerHTML = '<strong>Role blocked</strong><span>Switch to Investigator, Technical Analyst, Supervisor or Administrator.</span>';
    return;
  }

  const output = syntheticSearch(type, value, caseId);
  addAudit('Ran authorised synthetic technical search', `${type}:${value}`, 'Allowed');
  result.className = 'search-result-card';
  result.innerHTML = `<div class="search-result-head"><div><span class="badge info">Synthetic result</span><h4>${escapeHtml(output.title)}</h4></div>${badge(output.confidence)}</div><p>${escapeHtml(output.summary)}</p><div class="kv-list">${output.fields.map(field => keyValue(field[0], field[1])).join('')}</div><div class="notice warning" style="margin-top:14px">This output is an investigative lead. It cannot identify a person, establish guilt or justify arrest without independent evidence and human review.</div>`;
  toast('Synthetic search complete', 'Result added to the audit trail.');
}

function syntheticSearch(type, value, caseId) {
  const normalised = value.toLowerCase();
  if (type === 'plate') {
    const vehicle = state.vehicles.find(item => item.plate.toLowerCase().includes(normalised)) || state.vehicles[0];
    return {
      title: `Vehicle lead: ${vehicle.plate}`,
      confidence: 'Manual review',
      summary: 'A fictional plate record and two sample sightings were found.',
      fields: [['Case', caseId], ['Vehicle', vehicle.make], ['Status', vehicle.status], ['Last event', vehicle.lastEvent], ['Source', 'Synthetic ANPR dataset']]
    };
  }
  if (type === 'person') {
    const person = state.people.find(item => item.name.toLowerCase().includes(normalised)) || state.people[0];
    return {
      title: `Person lead: ${person.name}`,
      confidence: 'Lead only',
      summary: 'A fictional profile was returned from the case-local register.',
      fields: [['Case', caseId], ['Role', person.role], ['Status', person.status], ['Note', person.note], ['Source', 'Synthetic case register']]
    };
  }
  if (type === 'camera') {
    return {
      title: `Camera event: ${value || 'C12'}`,
      confidence: 'Analyst reviewed',
      summary: 'The fictional event shows a vehicle matching recorded characteristics; no driver identity is established.',
      fields: [['Case', caseId], ['Timestamp', '2026-08-02 14:27'], ['Location', 'Bloemfontein CBD (synthetic)'], ['Object', 'Vehicle lead'], ['Source', 'Demo CCTV clip']]
    };
  }
  return {
    title: `Phone metadata lead: ${value || '071 000 1001'}`,
    confidence: 'Historical metadata',
    summary: 'Three fictional historical network events were returned. No message content or live location is available.',
    fields: [['Case', caseId], ['Period', '2026-08-02 13:40–15:08'], ['Events', '3 synthetic tower registrations'], ['Precision', 'Sector-level only'], ['Source', 'Approved demo MNO request']]
  };
}

function operationAction(id) {
  const operation = state.operations.find(item => item.id === id);
  if (!operation) return;
  if (operation.status === 'Completed') {
    addAudit('Viewed operation debrief', id);
    toast('Debrief opened', 'Synthetic lessons and evidence references reviewed.');
    return;
  }
  if (!['supervisor', 'legal', 'admin'].includes(state.role)) {
    addAudit('Attempted operation approval outside role', id, 'Denied');
    toast('Approval blocked', 'Switch to Unit Supervisor, Legal Officer or Administrator.');
    return;
  }
  operation.status = 'Pending approval';
  addAudit('Submitted operation launch approval', id, 'Submitted');
  render();
  toast('Approval requested', `${id} remains a fictional planning record.`);
}

function createRequest() {
  const id = `REQ-${1051 + state.requests.length}`;
  state.requests.unshift({
    id,
    caseId: state.selectedCase,
    department: 'External Department Sandbox',
    dataset: 'Synthetic verification response',
    basis: 'Pending supervisor and legal review',
    status: 'Pending supervisor',
    sensitivity: 'High'
  });
  state.approvals.unshift({ requestId: id, step: 'Investigation supervisor', role: 'supervisor', label: 'Unit Supervisor', status: 'Pending', due: '2026-08-07' });
  addAudit('Submitted external data request', id, 'Submitted');
  render();
  toast('Request created', `${id} cannot release data until approved.`);
}

function inspectRequest(id) {
  const request = state.requests.find(item => item.id === id);
  if (!request) return;
  addAudit('Inspected external data request', id);
  toast(id, `${request.department}: ${request.status}. No live data exposed.`);
}

function inspectEntity(type, id) {
  const source = type === 'person' ? state.people : type === 'vehicle' ? state.vehicles : state.evidence;
  const entity = source.find(item => item.id === id);
  if (!entity) return;
  addAudit(`Inspected ${type} record`, id);
  toast(id, type === 'evidence' ? entity.name : entity.name || entity.plate);
}

function decideApproval(index, decision) {
  const approval = state.approvals[index];
  if (!approval || approval.status !== 'Pending') return;
  const permitted = state.role === 'admin' || state.role === approval.role;
  if (!permitted) {
    addAudit('Attempted approval outside assigned role', approval.requestId, 'Denied');
    toast('Approval blocked', `Switch to ${approval.label}.`);
    return;
  }
  approval.status = decision;
  const request = state.requests.find(item => item.id === approval.requestId);
  if (request) {
    if (decision === 'Rejected') request.status = 'Rejected';
    else if (approval.role === 'supervisor') {
      request.status = 'Pending legal';
      state.approvals.unshift({ requestId: request.id, step: 'Legal & POPIA review', role: 'legal', label: 'Legal Officer', status: 'Pending', due: '2026-08-08' });
    } else if (approval.role === 'legal') {
      request.status = 'Approved';
    } else if (approval.role === 'custodian') {
      request.status = 'Fulfilled';
    }
  }
  addAudit(`${decision} authorisation step`, approval.requestId, decision);
  render();
  toast(`Request ${decision.toLowerCase()}`, approval.requestId);
}
