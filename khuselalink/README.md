# KhuselaLink — Intelligence Operations Demonstration

KhuselaLink is a public, browser-only demonstration by **Abongile Goci**. It is inspired by the workflow seen in fictional police procedurals: an intelligence case room, technical analysis desk, people and vehicle registers, operations board, lawful data requests, evidence handling, approvals and audit logging.

## Live demo

https://abongile7.github.io/khuselalink/

## What works

- Intelligence command dashboard and simulated incident feed
- Case rooms connecting fictional people, vehicles, evidence and requests
- Technical desk with case- and authority-gated synthetic searches
- People, vehicle and BOLO-style demonstration registers
- Operations planning and approval workflow
- Lawful external data-request register
- Role-based legal, supervisor and data-custodian decisions
- Local evidence file SHA-256 hashing
- Evidence and audit exports
- Browser localStorage persistence and demo reset
- Responsive desktop and mobile interface

## Safety and legal boundary

This project contains **no live integrations** and no real criminal, police, identity, telecommunications, camera or vehicle data. It cannot locate a person, intercept communications, identify a face, access a cellphone tower, or connect to SAPS, Home Affairs, a mobile network, CCTV or ANPR systems.

A production implementation would require lawful authority, departmental agreements, POPIA controls, security accreditation, case-level permissions, human review, immutable audit logs and formal data-custodian approval.

## Run locally

Open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.
