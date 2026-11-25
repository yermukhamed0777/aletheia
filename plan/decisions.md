# Aletheia — decision log (append-only)

Never rewrite or reorder existing rows. Add a new dated row for every change of
direction, scope or cost.

| Date | Decision | Why |
|---|---|---|
| 2026-11-25 | Rename the GitHub repo to `aletheia` and make it public. | User explicitly confirmed the new name and visibility after being asked. |
| 2026-11-25 | Keep documentation for this workflow in English. | User chose English; the existing README, CLAUDE.md and code comments are English. The app itself remains EN/RU/KK. |
| 2026-11-25 | Use a proprietary, all-rights-reserved `LICENSE` on the public repo. | User chose rights retained; a clinical/commercial product should not grant reuse by default. `THIRD_PARTY_NOTICES` carves out pdf.js (Apache-2.0). |
| 2026-11-25 | Keep the zero-dependency static bundle; no framework or install step for the app. | It opens instantly on a ward workstation, is trivial to host on an intranet, and keeps the retriever portable. Verified by `node bundle.mjs` and Vercel build. |
| 2026-11-25 | Keep BM25 as the answer path; embeddings/OCR stay optional and best-effort. | Audits confirmed failures are wrapped (`src/augment.js:17-115`) and the BM25 path never depends on them. Preserves the honesty promise. |
| 2026-11-25 | Set `EVAL_MIN` to 0.694, the measured baseline of `node eval.mjs` (50/72). | It is a regression floor from a real command, not a quality target. Raising it requires a new measured result and a decision by the user. |
| 2026-11-25 | Add `X-Content-Type-Options`, `Referrer-Policy` and `X-Frame-Options` in `vercel.json`, but no CSP. | The bundle requires inline scripts and embedded base64 workers; a CSP would break the existing app. Header behaviour still needs a live check (P0-5). |
| 2026-11-25 | Record completed fixes in the same commit as the plan folder, and use one append-only progress log. | Follows the binding update convention in `plan/README.md`; avoids "done" claims without command evidence. |
