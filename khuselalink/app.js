state = loadState();

function openModal() {
  $('#modalBackdrop').classList.remove('hidden');
}

function closeModal() {
  $('#modalBackdrop').classList.add('hidden');
}

$$('.nav-item').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
$('#menuButton').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
$('#roleSelect').value = state.role;
$('#roleSelect').addEventListener('change', event => {
  state.role = event.target.value;
  addAudit('Changed demo role', currentRoleName());
  render();
  toast('Role changed', currentRoleName());
});
$('#newCaseButton').addEventListener('click', openModal);
$('#modalClose').addEventListener('click', closeModal);
$('#cancelCase').addEventListener('click', closeModal);
$('#modalBackdrop').addEventListener('click', event => {
  if (event.target.id === 'modalBackdrop') closeModal();
});
$('#newCaseForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.target));
  const id = `CASE-2026-${String(state.cases.length + 43).padStart(4, '0')}`;
  state.cases.unshift({
    id,
    title: form.title,
    ref: form.reference,
    status: 'Pending authority',
    classification: form.classification,
    lead: form.lead,
    progress: 10,
    summary: form.summary,
    objective: 'Develop lawful intelligence leads and preserve a reviewable evidence trail.'
  });
  state.selectedCase = id;
  addAudit('Created synthetic intelligence case', id, 'Submitted');
  closeModal();
  setView('caseRoom');
  toast('Case created', id);
});
$('#resetDemo').addEventListener('click', () => {
  localStorage.removeItem('khuselalink-intelligence-demo');
  state = clone(seed);
  $('#roleSelect').value = state.role;
  setView('command');
  toast('Demo reset', 'Synthetic records restored.');
});

render();
