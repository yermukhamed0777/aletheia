# Aletheia — backlog

Ordered, executable tasks. IDs are stable: never renumber an ID, mark it done
with a dated note instead. `Done when` is the acceptance criterion. Exact
commands and results go in `plan/progress.md`.

## Horizon map

| Horizon | ID range | Meaning |
|---|---|---|
| Short term | P0-1 … P0-9 | Assistant can do next; one session each. |
| Short term (quality) | P1-1 … P1-3 | Small measured improvements after P0. |
| Midterm | M1-1 … M2-3 | Real validation, team and product readiness. |
| Long term | M3-1 … M3-4 | Product shape, posture and commercial model. |

## P0 — next actions

- **P0-1 — Remote-answer rendering regression test.** `src/controller.js:51-62`,
  `src/model.js:2,105-106`, `src/interface.js:78-79`. The crash was fixed by
  registering synthetic docs in `REMOTE_DOCS`; no automated test covers it.
  Done when: a mock-`fetch` test drives the remote path, asserts a citation chip
  and drawer render with a non-empty location, and fails if registration is removed.

- **P0-2 — Execute every source file in the check.** `check.mjs:19-24` loads only
  `corpus.js`, `retrieval.js`, `strings.js`; `lint.mjs:10-16` syntax-checks all
  nine but does not boot them. Done when: `node check.mjs` fails on a top-level
  error injected into any of the six unexecuted files, while the clean run passes.

- **P0-3 — Harden backend URL validation.** `src/controller.js:149` accepts any
  `http(s)://` prefix; `src/model.js:79` persists it. Done when: `new URL()`
  parsing is used, `http:` is rejected except `localhost`, embedded credentials
  are rejected, and a recorded command shows accepted/rejected cases.

- **P0-4 — Move hard-coded UI copy into `strings.js`.** `src/interface.js:86,163,224,228,290`,
  `src/pages.js:80`. Violates `CLAUDE.md:12`. Done when: no view contains those
  literals, all new keys are trilingual, and lint guards the patterns.

- **P0-5 — Verify Vercel security headers in production.** `vercel.json:6-14`
  added headers; no live check yet. Done when: a read-only header request to the
  production URL shows all three headers and the page still loads.

- **P0-6 — Focus and ARIA repair in overlays.** `src/pages.js:39,52,63,80,87`
  (`aria-modal` without focus trap), `src/pages.js:81` (no
  `aria-activedescendant`), `src/interface.js:244` (tabs without `tabpanel` or
  arrow keys). Done when: a keyboard-only pass can enter, operate and leave each
  overlay without reaching background controls.

- **P0-7 — Fix the cosmetic tour timer and focus restoration.** `src/pages.js:108`
  counts down to 0:00 with no consumer; `src/controller.js:102` deliberately
  skips focus restoration for `src`. Done when: reaching 0:00 produces a visible
  state change and closing the citation drawer returns focus to its trigger.

- **P0-8 — Delete or justify dead UI keys.** `src/strings.js:363,368,708,713,718,1578`
  are defined but never rendered; `an.sample` claims sample activity that
  `src/model.js:71-73` does not create. Done when: each key is either used or
  removed, and `node check.mjs` still passes with 436 → N defined strings recorded.

- **P0-9 — Quota-safe upload state.** `src/model.js:186,388-393` enforces a
  30 MiB cap but a `localStorage` quota failure only toasts while state can say
  `processed`. Done when: a failed `LS.set` marks the upload `failed` with a
  reason code and the library shows it.

## P1 — measured quality

- **P1-1 — Improve validation accuracy above the measured floor.** `eval.mjs:14`,
  `validation/*.json`. Baseline 50/72 (69.4%), ans 26/48, idk 24/24.
  Done when: a retrieval-only change raises measured accuracy, per-file numbers
  are recorded, and `EVAL_MIN` is updated to the new measured value only.

- **P1-2 — Add a browser smoke test.** No Playwright/jsdom dependency today;
  `check.mjs:56-60` tests only pure retrieval. Done when: CI opens the built
  page, asks a metformin question, opens a citation and records zero console
  errors, on both Ubuntu and Windows runners.

- **P1-3 — Pin and verify vendored pdf.js.** `vendor/pdf.min.mjs:23-24`,
  `bundle.mjs:4`, `THIRD_PARTY_NOTICES`. Done when: the SHA-256 of both vendor
  files is recorded in `THIRD_PARTY_NOTICES` and lint fails on a mismatch.

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
