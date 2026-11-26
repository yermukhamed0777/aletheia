# Security policy

## Reporting

Use GitHub's private vulnerability reporting for this repository:
https://github.com/yermukhamed0777/aletheia/security/advisories/new

Do not open a public issue for an unresolved vulnerability. Include the
affected file and line, a reproduction, and the impact you observed.

## Scope

Aletheia is a client-side demonstration. It parses user-selected documents in
the browser and stores session state in `localStorage` under `altheia.state`.
It has no accounts, server-side storage, or encryption at rest. Do not upload
real patient data or real confidential documents to a deployed demo.

The optional *Real backend* setting stores only a URL and POSTs the question
to it. Configure it only with an endpoint you control; see `README.md` for the
request/response contract. `backendURL()` accepts HTTPS only (plain HTTP is
allowed for localhost/127.0.0.1/[::1]) and rejects embedded credentials and
fragments. Verified by `node unit.mjs`.

## Verified controls and residual risk

- Dependency audit: `npm audit --json` reports 0 vulnerabilities (3 packages,
  dev-only Playwright). No runtime dependencies are shipped.
- Credential handling: no secret is tracked; `.env*` is ignored. Local Vercel
  CLI state in `.env.local` and `.vercel/` is never committed. Rotate any local
  CLI token you no longer need; nothing in the repository requires it.
- Data isolation: uploaded text, questions and gaps stay in this browser under
  `altheia.state`. `node qa.mjs` confirms hostile input is escaped, a failed
  network request produces an error state (not a crash), and state survives
  reload. `node e2e.mjs` asserts zero external requests during the walkthrough.
- Event counters are integers only; no question text or document content is
  emitted, persisted or transmitted (`src/events.js`, `node unit.mjs`).
- Residual risk: no account/auth boundary, no encryption at rest, no CSP
  (inline scripts and embedded workers), and the LLM/embedding path is not
  connected. Do not use real patient data. Process and open security work are
  tracked in [`plan/README.md`](plan/README.md).
