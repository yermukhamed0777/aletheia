# Aletheia — backlog

Ordered, executable tasks. IDs are stable: never renumber an ID, mark it done
with a dated note instead. `Done when` is the acceptance criterion. Exact
commands and results go in `plan/progress.md`.

## Horizon map

| Horizon | ID range | Meaning |
|---|---|---|
| Short term | P0-1 … P0-12 | Assistant can do next; one session each. |
| Short term (quality) | P1-1 … P1-3 | Small measured improvements after P0. |
| Midterm | M1-1 … M2-3 | Real validation, team and product readiness. |
| Long term | M3-1 … M3-4 | Product shape, posture and commercial model. |

## P0 — next actions

- **P0-1 — Remote-answer rendering regression test.** `src/controller.js:51-62`,
  `src/model.js:129-131`, `src/interface.js:78-79`. **Done 2026-11-26:** the
  global `REMOTE_DOCS` map was removed (with the interrupted refactor) and
  replaced by a `source` object carried inside each evidence item; views use
  `sourceOf()`. `unit.mjs` mocks `fetch`, renders the turn and opens the drawer;
  `e2e.mjs` repeats it in a real browser. Before: 5 failing unit checks and a
  `ReferenceError: REMOTE_DOCS is not defined`; after: all pass with location
  `Sheet "Dosages 2026", rows 2–4`.

- **P0-2 — Execute every source file in the check.** **Done 2026-11-26:**
  `harness.mjs` evaluates all 10 sources in bundle order with DOM stubs;
  `check.mjs` runs `unit.mjs`, which exercises the lazy paths (analytics,
  remote ask, upload, reset). Baseline `UNIT FAILED — 21 passed, 18 failed`
  with a `ReferenceError`; now 39/39.

- **P0-3 — Harden backend URL validation.** **Done 2026-11-26:**
  `backendURL()` in `src/model.js:75-83` uses `new URL()`; HTTPS accepted,
  HTTP only for localhost/127.0.0.1/[::1], credentials, fragments and
  non-HTTP schemes rejected. `saveEndpoint()` uses the same validator on load
  and save; 8 unit assertions recorded.

- **P0-4 — Move hard-coded UI copy into `strings.js`.** **Done 2026-11-26:**
  added `st.ocr`, `unit.ms`, `qs.key`, `qs.esc`, `tour.timeup`, `err.storage`;
  keycaps now render ⌘ on Apple devices via `kbdMod()`. `lint.mjs` fails on
  the old literals. 436 defined strings, 334 literal `t()` keys used.

- **P0-5 — Verify Vercel security headers in production.** **Done 2026-11-26:**
  `curl.exe -sSI https://aletheia-nine-iota.vercel.app/` → `HTTP/1.1 200 OK`,
  `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`,
  `X-Frame-Options: DENY`. Production still serves the pre-fix build
  (Last-Modified 2026-11-25); no deploy was made.

- **P0-6 — Focus and ARIA repair in overlays.** **Done 2026-11-26:** Tab trap
  in `#ov`, `aria-activedescendant` + option ids in quick find, `tabpanel`
  wrapper and arrow-key navigation on gap tabs. Not claimed as a full WCAG
  audit; contrast remains an open risk in `strategy.md`.

- **P0-7 — Fix the cosmetic tour timer and focus restoration.** **Done
  2026-11-26:** `tourSeconds()`/`clockText()` drive the clock; reaching 0
  swaps to `tour.timeup` and a warning class. Citation triggers are now
  recorded in `lastFocus`, so closing the drawer restores focus.

- **P0-8 — Delete or justify dead UI keys.** **Done 2026-11-26:** removed
  `lp.pv.note`, `lp.pv.open`, `dash.demo`, `dash.demo.sub`, `dash.idk` and
  the misleading `an.sample`. 442 → 436 defined strings; the other 18 unused
  keys are reached through dynamic prefixes (`mode.`, `crit.`, `act.*`, etc.).

- **P0-9 — Quota-safe upload state.** **Done 2026-11-26:** a failed `LS.set`
  now marks a processed upload `failed` with `error: 'storage'` and clears its
  chunks before rebuilding the index; `err.storage` explains it in all three
  languages. Two unit assertions cover it.

- **P0-10 — Complete the interrupted state/analytics refactor.** New.
  `src/model.js` was mid-edit: `sleep`, seed helpers, `REMOTE_DOCS` and
  `VIEW.tourSession` had been removed while still referenced, and `stats()` /
  `chartSVG()` / `analyticsView()` used deleted seed constants. **Done
  2026-11-26:** all references reconciled; analytics are built only from real
  `STATE.history`; persisted keys are whitelisted; tour overrides are shielded
  from `save()` and onboarding is persisted before the tour starts.

- **P0-11 — Content-free pilot event harness.** New. **Done 2026-11-26:**
  `src/events.js` exposes `track()` and `EVENT_SNAPSHOT()` over a 9-name
  allowlist; no text payload, no persistence, no network. Unit assertions
  cover allowlisting, integer-only counts and zero network calls.

- **P0-12 — CV-ready documentation.** New. **Done 2026-11-26:** README verify
  and backup/restore sections, `WALKTHROUGH.md`, `PILOT_HANDOFF.md`, updated
  CONTRIBUTING/CHANGELOG/THIRD_PARTY_NOTICES.

## P1 — measured quality

- **P1-1 — Improve validation accuracy above the measured floor.** `eval.mjs:14`,
  `validation/*.json`. Baseline 50/72 (69.4%), ans 26/48, idk 24/24.
  Open: optional next; requires a retrieval-only change that raises the measured
  score before `EVAL_MIN` may change.

- **P1-2 — Add a browser smoke test.** **Done 2026-11-26:** `e2e.mjs` serves
  `dist/index.html` locally, drives landing → ask → citation → drawer → close,
  quick find, a root and a `/sub/` variant, captures
  `artifacts/walkthrough-ask.png`, and asserts zero console errors and zero
  external requests. 13/13 checks passed. Ubuntu CI runs it; Windows runner
  remains open under M2-3.

- **P1-3 — Pin and verify vendored pdf.js.** **Done 2026-11-26:** both SHA-256
  values recorded in `THIRD_PARTY_NOTICES` and checked by `lint.mjs` on every
  run; clean run reports 2 pinned hashes verified.

## M1 — field validation

- **M1-1 — De-identified pilot corpus and protocol.** Human-owned permissions;
  assistant prepares the audit CSV schema and citation trace. Done when: two
  pilot sessions are completed and every logged answer resolves to a passage.

- **M1-2 — Upload-to-gap integration tests.** `src/model.js:314-393`,
  `src/interface.js:238-251`. Done when: TXT/CSV/DOCX/XLSX/PDF upload → answer →
  abstain → reopen/resolve is covered end-to-end in CI.

- **M1-3 — Gap export for document owners.** `src/controller.js:131-132`.
  Done when: a sanitised CSV of open gaps can be exported with no verbatim
  patient data and the format is approved by the pilot team.

## M2 — product and team

- **M2-1 — Optional server retriever.** `README.md:73-76` contract already
  exists; `src/controller.js:51-62` is the client. Done when: a server passes
  the same validation sets as the local engine and remote citations render.

- **M2-2 — Auth, audit log and corpus isolation.** Not implemented; do not
  claim it. Done when: per-role access is enforced server-side and each answer
  has an immutable audit record.

- **M2-3 — Windows CI and runbook.** `npm.ps1` is blocked by Restricted
  execution policy on this machine; `verify.cmd` and `node <script>` work.
  Done when: CI runs on `ubuntu-latest` and `windows-latest` with identical
  check/lint/eval results and a maintainer runbook exists.

## M3 — long term

- **M3-1 — Server-side retrieval and ingestion.** Keep `src/retrieval.js` as
  the portable reference; add Postgres + pgvector and versioned document
  ingestion. Done when: ≥95% of citations resolve in the deployed corpus.

- **M3-2 — Clinical-quality abstention gate.** Independent answerable and
  unanswerable sets, reviewed by a domain expert. Done when: ≥90% correct
  abstention and zero false answers on the reviewed set.

- **M3-3 — On-prem and air-gapped packaging.** Done when: a documented install
  works with no external network access and pinned model artefacts.

- **M3-4 — Commercial model and licence decision.** Rights currently reserved
  (`LICENSE`). Done when: the commercial licence, pricing and entity are
  approved and ≥3 sites are committed.
