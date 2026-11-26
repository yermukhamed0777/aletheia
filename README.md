# Aletheia — Verified answers from your protocols

[![check](https://github.com/yermukhamed0777/aletheia/actions/workflows/check.yml/badge.svg)](https://github.com/yermukhamed0777/aletheia/actions/workflows/check.yml)

**Live demo:** https://aletheia-nine-iota.vercel.app

**Aletheia** (Ἀλήθεια, ancient Greek for *truth / disclosure*) is an evidence-first desk for diagnostic networks, hospital pharmacies and laboratory teams. Staff ask a question in plain language; the desk returns a short answer, the exact highlighted passage, and the file and location it came from — or an honest **“I could not verify this”**.

Trilingual throughout: **English / Русский / Қазақша** — interface, demo corpus and demo answers.

The built-in corpus is fictional (**Asklepia Diagnostics**): a formulary, a specimen-handling SOP, an antimicrobial policy, an interaction matrix, a cold-chain policy, a critical-results rule and an internal FAQ. Nothing in it describes a real patient, medicine brand or institution.

## Run

```bash
node bundle.mjs          # concatenates src/ into dist/index.html — one self-contained file
start dist/index.html    # or: npx serve dist
```

Deploy: `dist/` is static. On Vercel/Netlify/Cloudflare Pages set build command `node bundle.mjs`, output `dist` (see `vercel.json`). No install step, no dependencies.

## Verify

The app has no runtime dependencies. A **clean install is only needed for the
browser test** (`@playwright/test`); Node 24+ is required.

```bash
node bundle.mjs          # build the self-contained page
node check.mjs           # smoke check; also runs the unit harness
node lint.mjs            # conventions, view copy, pinned vendor hashes
node eval.mjs            # regression score on the indicative validation sets
node unit.mjs            # fast pure-rule + boot tests (no browser)
node data.mjs            # real parsers over synthetic, non-sensitive fixtures
node e2e.mjs             # Chromium smoke: ask -> citation, root + subpath
node qa.mjs              # mobile, keyboard, hostile input, network, persistence
node demo.mjs            # deterministic screenshots from the synthetic corpus
npm ci                   # install the dev-only Playwright dependency
.\verify.cmd             # Windows: all of the above in sequence
```

Measured on 2026-11-26 after `npm ci` and `.\verify.cmd`: unit 39/39, check
passed (39 questions, 22 passages, 334 used keys of 436 defined), lint passed
(10 sources, 2 pinned vendor hashes), eval 50/72 (69.4%) at threshold 0.6,
bundle 2638 KB, e2e 13/13 with zero console errors and no external requests.
`node check.mjs` runs `unit.mjs` too, so a red unit test fails the gate.

CI (`.github/workflows/check.yml`) runs the same commands on every push to
`main` and every pull request, installs Chromium, and uploads the built page
plus the walkthrough screenshot as artifacts. A failing step blocks the run.

## Backup and restore

All user state lives in one browser key, `altheia.state` in `localStorage`:
language/theme, onboarding flag, question history, gaps, feedback, removed
demo sources, settings and uploaded **extracted passages**. Original uploaded
files are not stored, so a backup does not restore the source documents.

- Backup (browser DevTools console): `copy(localStorage.getItem('altheia.state'))` and save the text.
- Restore: paste the JSON back with `localStorage.setItem('altheia.state', <json>)` and reload.
- Settings → *Clear local data* resets to an empty state. Nothing is transmitted.

## Development

- Repository: `https://github.com/yermukhamed0777/aletheia` (public), default branch `main`.
- Before a pull request: run `.\verify.cmd` (or the individual commands above) and paste the exact output. CI runs the same sequence — check (including unit), lint, eval, build and browser e2e — on every push to `main` and on every pull request (`.github/workflows/check.yml`).
- Keep `dist/index.html` generated; never commit hand-edits to it.
- Vercel project: `erm1ham3d2204-2491/aletheia`. It builds `main` from `vercel.json` and creates preview deployments for pull requests. Production URL: https://aletheia-nine-iota.vercel.app.
- Long-term execution plan and session log: [`plan/README.md`](plan/README.md) — strategy, roadmap, backlog, decisions, progress. Every work session updates the plan in the same commit.
- Public-repo files: [`LICENSE`](LICENSE) (all rights reserved), [`THIRD_PARTY_NOTICES`](THIRD_PARTY_NOTICES), [`CONTRIBUTING.md`](CONTRIBUTING.md), [`SECURITY.md`](SECURITY.md), [`CHANGELOG.md`](CHANGELOG.md).

## Honest status: what is real and what is simulated

| Part | Status |
|---|---|
| Upload + parsing of TXT, CSV, DOCX, XLSX (own ZIP reader) and text-based PDF | **Real**, client-side, up to 30 MiB per file. Verified by `node data.mjs` with synthetic fixtures; scans and odd-font PDFs are reported as *Failed*, with the reason. |
| Passage splitting with page / sheet+rows / section / line locations | **Real**. Locations come from the file; nothing is invented. |
| Retrieval: BM25 over passages, cross-language stemming | **Real** (lexical, not embeddings). |
| Evidence validation + abstention | **Real**: idf-weighted share of question terms covered by the best passages must reach the threshold (Configuration, default 60%), otherwise the desk abstains. |
| Free-text answers | **Extractive**: lines copied from retrieved passages. No generated prose. |
| 39 curated demo questions (34 answerable, 5 deliberately unanswerable) | **Pre-verified** against the demo passages; labelled as such in the UI. |
| LLM generation, embeddings, pgvector | **Not connected.** The UI is labelled “Guided retrieval demo”. |
| Analytics | Built only from activity recorded in this browser (persisted in `localStorage`); no fabricated sample history. Verified by `node unit.mjs`. |
| Pilot counters | An allowlisted set of in-memory integer counters (no question text, no network, no persistence), readable via `EVENT_SNAPSHOT()`; asserted content-free by `node unit.mjs`. |
| Accounts, access control, encryption at rest, audit log | Not implemented, not claimed. |

## Architecture

| File | Responsibility |
|---|---|
| `src/corpus.js` | Trilingual demo corpus: 7 sources, 22 passages, 39 Q&A items, topic map. |
| `src/retrieval.js` | Pure, DOM-free engine: tokenizer, BM25, coverage check, identifier guard, extractive line selection, entity extraction. Same interface a server-side retriever could expose. |
| `src/augment.js` | Optional browser-only embeddings (`multilingual-e5-small`) and Tesseract OCR. Best-effort: any failure leaves BM25 working. |
| `src/pdfreader.js` | Embedded pdf.js plus geometric table reconstruction (rebuilds price/dose rows as labelled lines). |
| `src/model.js` | Icons, persisted state, upload parsers, derived data, ask pipeline. |
| `src/interface.js`, `src/pages.js` | Pure HTML-string views: shell, assistant turns, library, insights, gaps, configuration, landing, drawers, quick find, guided tour. |
| `src/controller.js` | Hash router, delegated events, remote backend, boot. |
| `src/events.js` | Allowlisted, content-free in-memory pilot counters. |
| `src/strings.js` | 436 interface strings × 3 languages. |
| `src/theme.css` | Light/dark theme, layout, responsive rules. |
| `harness.mjs`, `unit.mjs` | VM boot harness and fast pure-rule regression tests. |
| `data.mjs` | Synthetic TXT/CSV/DOCX/XLSX/PDF fixtures through the real parsers. |
| `e2e.mjs`, `qa.mjs`, `demo.mjs` | Browser smoke, workflow QA (mobile/keyboard/persistence) and deterministic capture. |

Why no framework: a zero-dependency static bundle opens instantly on a ward workstation, is trivial to host behind an intranet, and keeps the retriever portable (it can move server-side unchanged).

## Connecting a real RAG backend

Configuration → *Real backend* stores only a URL (never an API key). The page then POSTs:

```json
{ "question": "…", "language": "en|ru|kk", "threshold": 0.6 }
```

and expects:

```json
{ "status": "answer|abstain", "answer": "…", "details": ["…"], "strength": "strong|moderate|limited",
  "citations": [ { "doc": "file.pdf", "location": "p. 4", "excerpt": "…" } ], "ms": 120, "scanned": 4210, "coverage": 0.82 }
```

Recommended server: Postgres + pgvector, embeddings per passage with file/page/sheet/row metadata, top-k retrieval, a relevance threshold, an LLM prompt restricted to retrieved passages that must return citation ids, then a validation pass rejecting claims unsupported by the cited passages. Keys stay in server environment variables. Remote answers are rendered with `citations` only; an answer without citations is shown as *cannot verify*.

## Three-minute presentation

A scripted, deterministic version with a capture command is in [`WALKTHROUGH.md`](WALKTHROUGH.md).
The same story is built into the app: sidebar → **Guided demo** runs it: problem → metformin dose question (conflict between an old internal note and the current formulary) → click a citation → sample-handling question spanning two sources → “What is the paediatric dose?” (abstains) → Open questions → Coverage & insights. Then: Sources → *Add sample source* → Open questions → *Ask again* → mark resolved. `Ctrl/Cmd+K` opens quick find.

## Validation

Question sets live in `validation/` (the source PDFs used during earlier tuning were third-party and are not included). Ground truth was read independently from the documents. The sets cover answerable paraphrases and deliberately unanswerable questions; treat the small samples as indicative, not as a benchmark. `node eval.mjs` is a regression floor (currently 0.694), not a quality target. Rules that cannot be driven through a UI — URL validation, state hydration, remote-citation rendering, quota handling, content-free counters — are covered by `node unit.mjs`; parser claims are covered by `node data.mjs`; the rendered app is covered by `node e2e.mjs` and `node qa.mjs`. The reproducible demonstration and release evidence are in [`RELEASE_REPORT.md`](RELEASE_REPORT.md) and `node demo.mjs`.

## Known limitations

- Lexical retrieval misses pure synonyms without semantic mode (e.g. “how much” vs “price”).
- PDF extraction handles simple text streams only; scans need OCR.
- Uploaded data persists in `localStorage` (browser quota ≈5 MB); the enforced per-file upload cap is 30 MiB, so a very large file's extracted text may exceed the quota.
- This is a demonstration, not a medical device. No answer should be used for patient care without checking the cited source.
