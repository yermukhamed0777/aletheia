# Aletheia — roadmap

The plan is ordered by horizon. Every milestone has an **Intelligence** list
(what the assistant can do) and a **Human** list (what only the user can do).
Status and measured numbers live in `plan/strategy.md`; executable IDs live in
`plan/backlog.md`; exact verification output lives in `plan/progress.md`.

## 1. Short term — easy, concrete next steps

These are the steps the assistant takes next. Each is small enough for one
session and must end with a recorded command and result.

**Status 2026-11-26:** P0-1…P0-9 are done and evidenced in `progress.md`. P0-10
(complete the interrupted refactor), P0-11 (content-free counters) and P0-12
(CV docs) were added and done in the same session. P1-2 and P1-3 are done.
Only P1-1 remains open here, and it requires a measured improvement before the
eval floor may move. The human confirmations listed in the original items
(real backend field names, HTTPS-only policy, RU/KK keycap wording, approved
embedding) remain human-owned; defensible defaults were implemented and
recorded in `decisions.md` where the choice was reversible.

1. **P0-1 — Prove the remote-answer path cannot crash the UI.**
   - Intelligence: add an automated regression that mocks `fetch`, runs the
     remote branch of `remoteAsk()` (`src/controller.js:51-60`) through the
     views, and asserts a citation opens with a non-empty location. The bug was
     `docById()` returning `undefined` at `src/interface.js:78-79`; the fix
     registers synthetic docs in `REMOTE_DOCS` (`src/model.js:2,105`).
   - Human: confirm the real backend's citation field names (`doc`, `location`,
     `excerpt`) match `README.md:73-76`, or supply a real sample response.
   - Done when: the test fails if `REMOTE_DOCS` registration is removed, and
     passes with it; exact command and output appended to `plan/progress.md`.

2. **P0-2 — Make the smoke check notice broken source files.**
   - Intelligence: extend `check.mjs:19-24` so every `src/*.js` is parsed in the
     VM (syntax + top-level evaluation where safe), not just three files. Keep
     the pure-layer assertions.
   - Human: none, unless a file requires a browser global that cannot be
     stubbed; then decide whether to add a real browser runner.
   - Done when: injecting a syntax error into a copy of any source file makes
     `node check.mjs` exit non-zero, and the normal run still passes.

3. **P0-3 — Close the arbitrary-egress gap on the backend URL.**
   - Intelligence: replace the prefix regex at `src/controller.js:149` with
     `new URL()`, require `https:` (allow `http:` only for `localhost`), reject
     credentials in the URL, and add a small assertion script.
   - Human: decide whether a hosted demo must always use HTTPS-only endpoints.
   - Done when: `https://…` is accepted, `http://example.com` is rejected, and
     a URL with embedded credentials is rejected; results recorded.

4. **P0-4 — Move remaining hard-coded view copy into `src/strings.js`.**
   - Intelligence: replace `Ctrl K` (`src/interface.js:290`), `Esc`
     (`src/pages.js:80`), `ms` (`src/interface.js:86,224,228`) and `· OCR`
     (`src/interface.js:163`) with trilingual keys, and add a lint rule for the
     literal patterns.
   - Human: approve the RU/KK wording for the new keycaps.
   - Done when: `node lint.mjs` flags the old literals and the app renders
     Cmd on Apple devices; all new keys are `[en,ru,kk]` triples.

5. **P0-5 — Verify the new Vercel headers on the live production URL.**
   - Intelligence: run a read-only header check against
     `https://aletheia-nine-iota.vercel.app` after the next production deploy
     and confirm `X-Content-Type-Options`, `Referrer-Policy` and
     `X-Frame-Options` from `vercel.json:6-14`.
   - Human: confirm that `X-Frame-Options: DENY` does not break an approved
     embedding of the demo.
   - Done when: header output is recorded in `plan/progress.md` and the page
     still loads.

6. **P0-6 — Raise the eval floor only with a measured change.**
   - Intelligence: after one retrieval-focused change, re-run `node eval.mjs`,
     report per-file ans/idk numbers, and update `EVAL_MIN` in `eval.mjs:14`
     only if the new measured baseline is higher.
   - Human: set the quality bar that matters for a research preview (the
     current 69.4% is a regression floor, not an acceptable clinical bar).
   - Done when: `EVAL_MIN` equals a measured value and `node eval.mjs` passes.

## 2. Midterm — validation and product milestones

### M1 — Field validation with a real lab network

- Intelligence: prepare a read-only evaluation harness that accepts a real
  document set, records citations and abstentions, and produces a per-question
  audit CSV; add browser-level tests for upload → citation → gap resolution;
  add a sanitised export of knowledge gaps. **2026-11-26:** the content-free
  counter harness, Playwright walkthrough and `PILOT_HANDOFF.md` are ready;
  the audit CSV schema and gap export remain unbuilt.
- Human: obtain permission to use a real (de-identified) protocol set; recruit
  2–3 staff for a 30-minute task-based session; record consent and a short demo
  video; approve the evaluation protocol. **This is the boundary.**
- Exit criteria: at least two pilot sessions completed; every answer in the
  session trace resolves to a real passage; measured false-answer rate on the
  pilot question set is recorded with the set itself; no real patient data in
  the repository.

### M2 — Product and team readiness

- Intelligence: move the retriever behind an optional server endpoint using
  the existing contract (`README.md:73-76`); add a real auth boundary, audit
  log and per-tenant corpus isolation; add CI on Windows as well as Ubuntu;
  publish a versioned CHANGELOG entry for each pilot release.
- Human: decide deployment posture (intranet, SaaS or both); assign an owner
  for security reports; approve a support/runbook and a pricing hypothesis;
  brief a partner meeting.
- Exit criteria: one deployment owned by a named maintainer; a reproducible
  install/runbook; an audited permission model; at least one external partner
  willing to run a second pilot.

## 3. Long term — the product awaiting

Shape: a source-grounded evidence desk for a diagnostic network, with a central
index over versioned SOPs/formularies, per-role access, an immutable answer +
citation audit trail, and a knowledge-gap queue that feeds document owners.

Deployment posture: primary on-prem or private-cloud behind the hospital
firewall; optional controlled SaaS for multi-site networks. The browser bundle
stays as the zero-install demo and fallback client.

Business model: annual per-site licence for the network plus a services line for
corpus onboarding and validation. Not a per-seat consumer chat tool; the value
is the auditable evidence trail, not prose generation.

Quantitative exit criteria (targets, not claims — none are met today):
- ≥95% of displayed citations resolve to an existing passage in the deployed corpus.
- ≥90% correct abstention on an independently reviewed unanswerable set.
- Median question-to-citation time ≤10 s on pilot hardware.
- ≥3 paying or formally committed sites, each with ≥10 weekly active staff.
- Zero real patient data in source control, verified by a tracked scan.

- Intelligence: implement server-side Postgres + pgvector retrieval, ingestion
  connectors, role-based access, audit log, eval dashboards and an on-prem
  packaging script; keep `src/retrieval.js` portable as the reference engine.
- Human: close licence/IP agreements for real corpora; negotiate pilot and
  paid contracts; approve clinical-safety positioning; build the partner
  network; choose the commercial licence and entity.

## Expansion options

Alternatives by job, each with a watch-out. The selection rule at the end wins
over novelty in every case.

| Job | Alternative | Watch-out |
|---|---|---|
| Static hosting | Cloudflare Pages, Netlify, GitHub Pages, S3 + CloudFront | GitHub Pages cannot set the custom headers added in `vercel.json`; verify header parity before moving. |
| Server DB / vector | Postgres + pgvector, Qdrant, Weaviate, SQLite + FTS5 | A hosted vector DB adds egress and a data-processing agreement; pgvector keeps SQL and audit queries together. |
| Auth | OIDC via hospital IdP, Auth0, Clerk, simple reverse-proxy basic auth | Basic auth is not an audit trail; do not confuse network access control with per-user attribution. |
| Storage / CDN | S3/R2 for source PDFs, signed URLs | Signed URLs expire; cached excerpts must not outlive document versions. |
| Edge functions | Vercel Functions, Cloudflare Workers | Edge runtimes vary in Node API support; the retriever uses only pure JS but pdf parsing does not run there. |
| Observability | Sentry, OpenTelemetry, Vercel logs | Never send question text or document excerpts to an analytics vendor by default. |
| Product analytics | PostHog (self-hosted), Plausible, custom event log | Event payloads must be counted, not contain verbatim clinical questions. |
| AI / eval | local multilingual embeddings, hosted embeddings, an LLM judge | A judge that reads real documents needs a data-processing agreement; keep deterministic evals as the gate. |
| Payments | Stripe, invoicing only | Per-site invoicing fits procurement better than self-serve cards. |
| Email | Resend, SMTP relay, no email | Clinical networks may block external email; design for in-app notifications first. |
| Docs | Markdown in repo, Docusaurus, Notion | Public docs must not leak pilot corpora or partner names. |
| Feature flags | simple config file, LaunchDarkly, Unleash | A flag cannot change the abstention threshold without an audit event. |
| On-prem packaging | Docker Compose, single binary + static folder, air-gapped USB bundle | Air-gapped installs need pinned model/embedding artefacts; npm-free build is an advantage. |
| CI / supply chain | GitHub Actions only, add SLSA provenance, signed artifacts | The zero-dependency build is only as trustworthy as the vendored pdf.js blobs; pin and record their hash. |

**Selection rule:** choose the cheapest boring option that preserves the core
promise — extractive answers with verifiable citations, honest abstention and
no patient data leaving the user's control. Prefer the option that can be
removed or self-hosted later over the one with the most features today.
