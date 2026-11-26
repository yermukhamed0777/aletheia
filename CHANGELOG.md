# Changelog

Dates are UTC, taken from `git log --format='%h %ad %s' --date=short`.

## Unreleased

- **P0-10** Completed the interrupted state/analytics refactor in the working
  tree: restored `sleep`, removed dangling `REMOTE_DOCS`/seed globals, fixed
  `VIEW.tourSession`, and replaced fabricated seed analytics with real history.
- **P0-1 / P0-2** Remote citations now carry their source inside the turn;
  added `harness.mjs` + `unit.mjs` (39 checks) and made `check.mjs` fail on
  lazy runtime errors that syntax lint cannot see.
- **P0-3 / P0-9** HTTPS-only backend URL validation (localhost HTTP allowed);
  storage-quota failures now mark an upload `failed` with a reason code.
- **P0-4** Remaining hard-coded view copy moved to `strings.js`; lint guards
  the old literals and renders the keycap for Apple devices.
- **P0-5 / P1-2** Verified the three production security headers; added a
  Playwright smoke test (ask → citation → drawer, root + subpath, zero console
  errors) and a deterministic screenshot; CI gates on all of it.
- **P0-6 / P0-7** Focus trap and tabpanel semantics for overlays, ARIA active
  descendant in quick find, visible tour timeout, focus restored after a
  citation drawer closes.
- **P0-8** Removed six dead/misleading strings (442 → 436 defined).
- **P1-3** Vendored pdf.js SHA-256 hashes pinned in lint and notices.
- **P0-11 / P0-12** Added content-free pilot counters and CV-ready docs
  (`WALKTHROUGH.md`, `PILOT_HANDOFF.md`, README verify/backup sections).

## 2026-11-25

- `1a7a17f` Document live demo and CI; ignore Vercel local files.
- `33ed442` Add CI check, templates and handoff notes.
- `7bc1bff` Initial Aletheia build: clinical evidence desk — 7 fictional
  sources, 22 passages, 39 trilingual questions, pure BM25 retriever with
  coverage-based abstention, client-side parsers, optional semantic/OCR layer,
  trilingual UI, static Vercel bundle.
