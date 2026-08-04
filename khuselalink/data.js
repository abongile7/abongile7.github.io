'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const seed = {
  role: 'investigator',
  selectedCase: 'CASE-2026-0042',
  cases: [
    {
      id: 'CASE-2026-0042',
      title: 'Organised vehicle theft network',
      ref: 'FS/BFN/0826/0042',
      status: 'Active',
      classification: 'Restricted',
      lead: 'Abongile Goci (Demo)',
      progress: 72,
      summary: 'Synthetic intelligence case correlating vehicle sightings, fictional camera footage and authorised sample mobile-network metadata.',
      objective: 'Identify relationships and build a court-ready evidence timeline without treating automated matches as proof.'
    },
    {
      id: 'CASE-2026-0038',
      title: 'Missing person location reconstruction',
      ref: 'FS/BFN/0726/0188',
      status: 'Review',
      classification: 'Confidential',
      lead: 'Det. N. Mokoena (Synthetic)',
      progress: 88,
      summary: 'Demonstration timeline using consented sample device events and public-camera footage.',
      objective: 'Reconstruct a last-known movement sequence and document every data source.'
    },
    {
      id: 'CASE-2026-0031',
      title: 'Commercial burglary series',
      ref: 'EC/KOM/0726/0094',
      status: 'Pending authority',
      classification: 'Restricted',
      lead: 'Det. L. Jacobs (Synthetic)',
      progress: 34,
      summary: 'Synthetic ANPR and municipal-camera correlation across Komani.',
      objective: 'Test cross-jurisdiction evidence handling and supervisor approvals.'
    }
  ],
  people: [
    { id: 'P-1001', name: 'Person Alpha', role: 'Person of interest', status: 'Lead only', phone: '071 000 1001', note: 'Fictional profile. No guilt determination.', caseId: 'CASE-2026-0042' },
    { id: 'P-1002', name: 'Witness Beta', role: 'Witness', status: 'Interviewed', phone: '072 000 2002', note: 'Synthetic witness linked to Camera C12.', caseId: 'CASE-2026-0042' },
    { id: 'P-1003', name: 'Owner Gamma', role: 'Vehicle owner', status: 'Verified', phone: '073 000 3003', note: 'Synthetic identity verification completed.', caseId: 'CASE-2026-0042' }
  ],
  vehicles: [
    { id: 'V-4401', plate: 'FS 42 DEMO', make: 'Isuzu D-MAX', status: 'Recovered', owner: 'Owner Gamma', caseId: 'CASE-2026-0042', lastEvent: 'Camera C12 • 14:27' },
    { id: 'V-4402', plate: 'EC 18 TEST', make: 'Toyota Quantum', status: 'BOLO demo', owner: 'Unknown (synthetic)', caseId: 'CASE-2026-0042', lastEvent: 'ANPR A04 • 15:03' },
    { id: 'V-4403', plate: 'GP 77 LAB', make: 'VW Polo', status: 'Cleared', owner: 'Witness Beta', caseId: 'CASE-2026-0038', lastEvent: 'Camera P02 • 09:11' }
  ],
  operations: [
    { id: 'OP-2608-07', name: 'Operation Night Bridge', caseId: 'CASE-2026-0042', status: 'Planning', commander: 'Unit Supervisor (Demo)', risk: 'Medium', briefing: '2026-08-06 06:30', checklist: ['Legal authority confirmed', 'Briefing roster approved', 'Evidence officer assigned'] },
    { id: 'OP-2608-04', name: 'Operation Safe Return', caseId: 'CASE-2026-0038', status: 'Completed', commander: 'Det. N. Mokoena (Synthetic)', risk: 'Low', briefing: '2026-08-01 07:00', checklist: ['Consent recorded', 'Camera owner contact verified', 'Debrief complete'] }
  ],
  requests: [
    { id: 'REQ-1051', caseId: 'CASE-2026-0042', department: 'Mobile Network Operator', dataset: 'Historical tower events', basis: 'Court-authorised metadata request (demo)', status: 'Approved', sensitivity: 'High' },
    { id: 'REQ-1052', caseId: 'CASE-2026-0042', department: 'Municipal CCTV', dataset: 'CBD corridor camera clips', basis: 'Owner consent + case authority', status: 'Fulfilled', sensitivity: 'Medium' },
    { id: 'REQ-1053', caseId: 'CASE-2026-0042', department: 'Home Affairs', dataset: 'Identity verification only', basis: 'Formal interdepartmental request', status: 'Pending legal', sensitivity: 'High' },
    { id: 'REQ-1054', caseId: 'CASE-2026-0031', department: 'Vehicle Registry', dataset: 'Ownership confirmation', basis: 'Case-linked statutory request', status: 'Pending supervisor', sensitivity: 'Medium' }
  ],
  evidence: [
    { id: 'EV-8821', caseId: 'CASE-2026-0042', name: 'CBD-camera-12-demo.mp4', size: 18400000, hash: '49ba0a49d273…e5d2', source: 'Municipal CCTV', time: '2026-08-02 14:27' },
    { id: 'EV-8822', caseId: 'CASE-2026-0042', name: 'tower-events-demo.csv', size: 8942, hash: 'a28cf4bf10a4…09d1', source: 'MNO Demo Gateway', time: '2026-08-02 15:04' },
    { id: 'EV-8823', caseId: 'CASE-2026-0042', name: 'vehicle-sighting-demo.jpg', size: 1489234, hash: '73db5512e29d…a820', source: 'Private Camera Owner', time: '2026-08-03 09:18' }
  ],
  approvals: [
    { requestId: 'REQ-1053', step: 'Legal & POPIA review', role: 'legal', label: 'Legal Officer', status: 'Pending', due: '2026-08-05' },
    { requestId: 'REQ-1054', step: 'Investigation supervisor', role: 'supervisor', label: 'Unit Supervisor', status: 'Pending', due: '2026-08-05' },
    { requestId: 'REQ-1051', step: 'Legal & POPIA review', role: 'legal', label: 'Legal Officer', status: 'Approved', due: '2026-08-02' },
    { requestId: 'REQ-1052', step: 'Data custodian release', role: 'custodian', label: 'Data Custodian', status: 'Approved', due: '2026-08-02' }
  ],
  incidentFeed: [
    { time: '14:27', type: 'Camera event', detail: 'Synthetic vehicle FS 42 DEMO detected at Camera C12.', caseId: 'CASE-2026-0042' },
    { time: '14:31', type: 'Analyst note', detail: 'Manual review confirmed vehicle colour; driver identity remains unknown.', caseId: 'CASE-2026-0042' },
    { time: '15:03', type: 'ANPR event', detail: 'Synthetic plate EC 18 TEST generated a demo BOLO correlation.', caseId: 'CASE-2026-0042' },
    { time: '15:12', type: 'Authority gate', detail: 'Identity verification request paused for legal approval.', caseId: 'CASE-2026-0042' }
  ],
  audit: [
    { time: '2026-08-04 14:32:18', user: 'Legal Officer (Demo)', action: 'Viewed authorisation request', resource: 'REQ-1053', outcome: 'Allowed' },
    { time: '2026-08-04 13:10:42', user: 'Abongile Goci', action: 'Opened intelligence case room', resource: 'CASE-2026-0042', outcome: 'Allowed' },
    { time: '2026-08-04 12:52:09', user: 'Data Custodian (Demo)', action: 'Downloaded evidence package', resource: 'EV-8822', outcome: 'Allowed' },
    { time: '2026-08-04 12:38:51', user: 'Abongile Goci', action: 'Requested identity verification', resource: 'REQ-1053', outcome: 'Submitted' },
    { time: '2026-08-04 11:17:03', user: 'Unknown session', action: 'Attempted restricted export', resource: 'CASE-2026-0042', outcome: 'Denied' }
  ]
};

const viewMeta = {
  command: ['Intelligence Command Centre', 'Case-led operational picture using fictional information'],
  caseRoom: ['Intelligence Case Room', 'People, vehicles, evidence and events connected to one investigation'],
  techDesk: ['Technical Analysis Desk', 'Search synthetic records only after a case and authority are selected'],
  peopleVehicles: ['People & Vehicles', 'Lead management without automated guilt or identity decisions'],
  operations: ['Operations Board', 'Briefings, readiness and approvals for fictional deployments'],
  requests: ['Lawful Data Requests', 'Purpose-bound requests to external custodians'],
  evidence: ['Evidence Vault', 'Local SHA-256 hashing and chain-of-custody demonstration'],
  authorisations: ['Authorisation Centre', 'Separation of duties, legal review and data-custodian release'],
  audit: ['Immutable Audit Log', 'Every access, approval, denial and export is recorded'],
  architecture: ['Integration & Security Plan', 'How production connectors would be governed and isolated']
};

let state = loadState();
let currentView = 'command';
let pendingFile = null;
