function render() {
  const views = {
    command: commandView,
    caseRoom: caseRoomView,
    techDesk: techDeskView,
    peopleVehicles: peopleVehiclesView,
    operations: operationsView,
    requests: requestsView,
    evidence: evidenceView,
    authorisations: authorisationsView,
    audit: auditView,
    architecture: architectureView
  };
  $('#content').innerHTML = views[currentView]();
  bindDynamicEvents();
}

function bindDynamicEvents() {
  $$('[data-go]').forEach(button => button.addEventListener('click', () => setView(button.dataset.go)));

  $('#caseSelector')?.addEventListener('change', event => {
    state.selectedCase = event.target.value;
    addAudit('Changed active intelligence case', state.selectedCase);
    render();
  });

  $('#exportCase')?.addEventListener('click', () => {
    const item = selectedCase();
    downloadFile('khuselalink-synthetic-case.json', JSON.stringify({
      case: item,
      people: state.people.filter(value => value.caseId === item.id),
      vehicles: state.vehicles.filter(value => value.caseId === item.id),
      requests: state.requests.filter(value => value.caseId === item.id),
      evidence: state.evidence.filter(value => value.caseId === item.id)
    }, null, 2), 'application/json');
  });

  $('#simulateEvent')?.addEventListener('click', simulateIncident);
  $('#techSearchForm')?.addEventListener('submit', runTechSearch);
  $('#recalculateGraph')?.addEventListener('click', () => {
    addAudit('Recalculated synthetic relationship graph', state.selectedCase);
    toast('Graph recalculated', 'Only fictional local records were analysed.');
  });

  $$('.operation-action').forEach(button => button.addEventListener('click', () => operationAction(button.dataset.id)));
  $('#newRequest')?.addEventListener('click', createRequest);
  $$('.inspect-request').forEach(button => button.addEventListener('click', () => inspectRequest(button.dataset.id)));
  $$('.inspect-person').forEach(button => button.addEventListener('click', () => inspectEntity('person', button.dataset.id)));
  $$('.inspect-vehicle').forEach(button => button.addEventListener('click', () => inspectEntity('vehicle', button.dataset.id)));
  $$('.inspect-evidence').forEach(button => button.addEventListener('click', () => inspectEntity('evidence', button.dataset.id)));
  $$('.approve').forEach(button => button.addEventListener('click', () => decideApproval(Number(button.dataset.index), 'Approved')));
  $$('.reject').forEach(button => button.addEventListener('click', () => decideApproval(Number(button.dataset.index), 'Rejected')));

  bindEvidenceUpload();
  $('#exportEvidence')?.addEventListener('click', exportEvidence);
  $('#exportAudit')?.addEventListener('click', () => downloadFile('khuselalink-audit-demo.json', JSON.stringify(state.audit, null, 2), 'application/json'));
}

function simulateIncident() {
  const sequence = [
    ['15:18', 'Analyst update', 'Synthetic camera clip was added to the manual-review queue.'],
    ['15:22', 'BOLO correlation', 'A fictional plate matched an active case lead.'],
    ['15:26', 'Control event', 'A technical search was blocked because no authority was selected.'],
    ['15:31', 'Evidence event', 'A sample image hash was verified against the custody register.']
  ];
  const candidate = sequence[state.incidentFeed.length % sequence.length];
  state.incidentFeed.unshift({ time: candidate[0], type: candidate[1], detail: candidate[2], caseId: state.selectedCase });
  addAudit('Simulated incident-feed event', state.selectedCase, 'Demo');
  render();
  toast('Synthetic event generated', candidate[1]);
}
