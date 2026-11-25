# Aletheia — Verified answers from your protocols

**Aletheia** (Ἀλήθεια, ancient Greek for *truth / disclosure*) is an evidence-first desk for diagnostic networks, hospital pharmacies and laboratory teams. Staff ask a question in plain language; the desk returns a short answer, the exact highlighted passage, and the file and location it came from — or an honest **“I could not verify this”**.

Trilingual throughout: **English / Русский / Қазақша** — interface, demo corpus and demo answers.

The built-in corpus is fictional (**Asklepia Diagnostics**): a formulary, a specimen-handling SOP, an antimicrobial policy, an interaction matrix, a cold-chain policy, a critical-results rule and an internal FAQ. Nothing in it describes a real patient, medicine brand or institution.

## Run

```bash
node bundle.mjs          # concatenates src/ into dist/index.html — one self-contained file
start dist/index.html    # or: npx serve dist
```

Deploy: `dist/` is static. On Vercel/Netlify/Cloudflare Pages set build command `node bundle.mjs`, output `dist` (see `vercel.json`). No install step, no dependencies.

```bash
npm run check            # pass/fail smoke test over the built bundle
```

## Honest status: what is real and what is simulated

| Part | Status |
|---|---|
| Upload + parsing of TXT, CSV, DOCX, XLSX (own ZIP reader) and text-based PDF | **Real**, client-side. Scans and odd-font PDFs are reported as *Failed*, with the reason. |
| Passage splitting with page / sheet+rows / section / line locations | **Real**. Locations come from the file; nothing is invented. |
| Retrieval: BM25 over passages, cross-language stemming | **Real** (lexical, not embeddings). |
| Evidence validation + abstention | **Real**: idf-weighted share of question terms covered by the best passages must reach the threshold (Configuration, default 60%), otherwise the desk abstains. |
| Free-text answers | **Extractive**: lines copied from retrieved passages. No generated prose. |
| 39 curated demo questions (34 answerable, 5 deliberately unanswerable) | **Pre-verified** against the demo passages; labelled as such in the UI. |
| LLM generation, embeddings, pgvector | **Not connected.** The UI is labelled “Guided retrieval demo”. |
| Analytics | Built only from live session activity; no fabricated sample history. |
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
| `src/strings.js` | 436 interface strings × 3 languages. |
| `src/theme.css` | Light/dark theme, layout, responsive rules. |

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

Sidebar → **Guided demo** runs the story: problem → metformin dose question (conflict between an old internal note and the current formulary) → click a citation → sample-handling question spanning two sources → “What is the paediatric dose?” (abstains) → Open questions → Coverage & insights. Then: Sources → *Add sample source* → Open questions → *Ask again* → mark resolved. `Ctrl/Cmd+K` opens quick find.

## Validation

Question sets live in `validation/` (the source PDFs used during earlier tuning were third-party and are not included). Ground truth was read independently from the documents. The sets cover answerable paraphrases and deliberately unanswerable questions; treat the small samples as indicative, not as a benchmark.

## Known limitations

- Lexical retrieval misses pure synonyms without semantic mode (e.g. “how much” vs “price”).
- PDF extraction handles simple text streams only; scans need OCR.
- Uploaded data persists in `localStorage` (≈5 MB limit).
- This is a demonstration, not a medical device. No answer should be used for patient care without checking the cited source.
