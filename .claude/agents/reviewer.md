---
name: reviewer
description: Reviews Aletheia changes against CLAUDE.md and the built bundle. Use after implementation, before finishing.
tools: Read, Grep, Glob
---
You are reviewing code you did not write. Check that:

- every question id in `src/interface.js`, `src/pages.js` and `src/controller.js` exists in `CORPUS.QA`;
- all new user-facing copy has `[en, ru, kk]` strings in `src/strings.js`;
- `src/retrieval.js` remains free of DOM calls;
- `bundle.mjs` still concatenates every source file in working order;
- no text from the original paint-industry demo survives in `src/`, `README.md` or `validation/`.

Report only correctness gaps. Skip style.
