function bindEvidenceUpload() {
  const zone = $('#uploadZone');
  const input = $('#evidenceFile');
  if (!zone || !input) return;

  ['dragenter', 'dragover'].forEach(name => zone.addEventListener(name, event => {
    event.preventDefault();
    zone.classList.add('dragging');
  }));
  ['dragleave', 'drop'].forEach(name => zone.addEventListener(name, event => {
    event.preventDefault();
    zone.classList.remove('dragging');
  }));
  zone.addEventListener('drop', event => selectEvidenceFile(event.dataTransfer.files[0]));
  input.addEventListener('change', event => selectEvidenceFile(event.target.files[0]));
  $('#registerEvidence').addEventListener('click', registerEvidence);
}

async function selectEvidenceFile(file) {
  if (!file) return;
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  const hash = [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
  pendingFile = { file, hash };
  $('#uploadPreview').innerHTML = `<div class="file-preview"><span class="file-icon">FILE</span><div><strong>${escapeHtml(file.name)}</strong><small>${bytes(file.size)} • SHA-256 ${hash.slice(0, 18)}…</small></div></div>`;
  $('#registerEvidence').disabled = false;
  toast('File hashed locally', 'The browser did not transmit the file.');
}

function registerEvidence() {
  if (!pendingFile) return;
  const { file, hash } = pendingFile;
  const id = `EV-${8821 + state.evidence.length}`;
  state.evidence.unshift({
    id,
    caseId: $('#uploadCase').value,
    name: file.name,
    size: file.size,
    hash: `${hash.slice(0, 12)}…${hash.slice(-4)}`,
    source: 'User-provided demo file',
    time: new Date().toLocaleString('sv-SE').replace(',', '')
  });
  addAudit('Registered evidence hash', id);
  pendingFile = null;
  render();
  toast('Evidence registered', id);
}

function exportEvidence() {
  const headers = ['id', 'caseId', 'name', 'size', 'hash', 'source', 'time'];
  const csv = [headers.join(','), ...state.evidence.map(item => headers.map(header => `"${String(item[header]).replaceAll('"', '""')}"`).join(','))].join('\n');
  downloadFile('khuselalink-evidence-demo.csv', csv, 'text/csv');
}

function downloadFile(name, data, type) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
  addAudit('Exported synthetic demo file', name);
  toast('Export created', name);
}
