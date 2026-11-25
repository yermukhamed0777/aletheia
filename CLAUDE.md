# Aletheia — working notes

## Commands
- Build: `node bundle.mjs`
- Verify: `node check.mjs` — pass/fail smoke test; reports command output as evidence.
- Quick run: `node bundle.mjs && npx serve dist` (or open `dist/index.html`).

## Conventions
- `src/*.js` are plain global scripts concatenated in the fixed order in `bundle.mjs`; do not add `import`/`export` inside them.
- `src/corpus.js` stores every user-visible string as an `[en, ru, kk]` triple. Any question id referenced in `interface.js`, `pages.js` or `controller.js` must exist in `CORPUS.QA`.
- `src/retrieval.js` is pure and DOM-free; keep new ranking logic there, not in views.
- All interface copy lives in `src/strings.js`; add a key there instead of hard-coding English in views.

## Workflow
- Remote: `yermukhamed0777/aletheia` (public), default branch `main`.
- CI runs `node check.mjs` on pushes to `main` and on pull requests.

## Gotchas
- `dist/index.html` is generated. Never hand-edit it.
- Demo sources are enabled by default; uploads and history persist in `localStorage` under `altheia.state`.
- Optional semantic search / OCR are best-effort and must never break the BM25 path.
