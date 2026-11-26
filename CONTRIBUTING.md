# Contributing to Aletheia

The repository is public for visibility, not an open-source project: see
`LICENSE` (all rights reserved). Contributions are accepted only by explicit
invitation from the maintainer. You may still open issues and report bugs.

## Local setup

No install step is required for the app itself. Node 24 or newer is used in
CI. From the repository root:

```bash
npm ci                   # dev-only dependency for the browser test
node bundle.mjs          # build dist/index.html from src/
node check.mjs           # smoke check; also runs unit.mjs
node lint.mjs            # syntax/convention lint + pinned vendor hashes
node eval.mjs            # score validation sets against the retriever
node unit.mjs            # fast pure-rule and boot regressions
node data.mjs            # synthetic parser fixtures (no sensitive data)
node e2e.mjs             # Chromium smoke, root + subpath
node qa.mjs              # mobile, keyboard, hostile input, network, persistence
node demo.mjs            # deterministic screenshots + content-free event snapshot
```

Use `.\verify.cmd` on Windows to run all eight commands in sequence.

On Windows with PowerShell `ExecutionPolicy = Restricted`, `npm`/`npx`
resolve to `.ps1` shims that are blocked. Use `node <script>` directly, or the
`.cmd` shims (`npm.cmd run check`), or `.\verify.cmd` to run all four commands.
Do not change the machine execution policy for this project.

## Conventions

- `src/*.js` are plain global scripts concatenated in the fixed order in
  `bundle.mjs`; do not add `import`/`export` inside them.
- `src/corpus.js` stores user-visible strings as `[en, ru, kk]` triples. A
  question id used in `interface.js`, `pages.js` or `controller.js` must exist
  in `CORPUS.QA`.
- All interface copy lives in `src/strings.js`; add a key there instead of
  hard-coding English in a view.
- `src/retrieval.js` is pure and DOM-free; ranking logic belongs there.
- `dist/index.html` is generated. Never hand-edit it.
- Optional semantic search / OCR are best-effort and must never break BM25.
- Never commit secrets, `.env*`, tokens, or real patient data. The demo corpus
  is fictional by design.

## Before opening a pull request

1. Run `.\verify.cmd` (or all six commands above) and paste the exact output.
2. Open the built bundle in a browser and check the affected view.
3. Update `validation/` if retrieval behaviour changed, and report the eval
   numbers before/after.
4. Follow the update convention in [`plan/README.md`](plan/README.md): in the same commit, tick
   or add backlog items, append a `plan/progress.md` entry with commands and
   results, append `plan/decisions.md` if scope/cost changed, and update the
   roadmap and session-history table if the horizon changed.

See `SECURITY.md` for vulnerability reports.
