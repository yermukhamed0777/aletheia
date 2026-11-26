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
| 2026-11-26 | Complete the interrupted refactor in the working tree instead of reverting it. | The uncommitted edits (whitelisted state, `backendURL`, no fabricated analytics, tour-save guard) showed a clear privacy direction. Reverting would have destroyed user work; the dangling references were completed in that direction. |
| 2026-11-26 | Keep remote evidence self-contained in the turn; do not restore the global `REMOTE_DOCS` map. | A global in-memory registry of remote documents was the source of the crash and can retain third-party text beyond the turn. A per-evidence `source` object renders identically and is discarded with the thread. |
| 2026-11-26 | Remove fabricated seed analytics rather than reintroduce the deleted constants. | README already promised no sample activity. Rewriting charts from real `STATE.history` makes the UI match the documented claim; empty state now shows zeros. |
| 2026-11-26 | Validate backend URLs with `new URL()`: HTTPS only, HTTP for localhost/127.0.0.1/[::1], no credentials or fragments. | The old prefix regex allowed arbitrary HTTP egress and userinfo. Denying plaintext remote endpoints protects question text in transit while keeping local development possible. |
| 2026-11-26 | Add a dev-only Playwright dependency and gate CI on browser e2e. | Syntax and unit checks cannot catch view-level regressions; the earlier remote crash was invisible to CI. The dependency stays outside the shipped bundle (`THIRD_PARTY_NOTICES`). |
| 2026-11-26 | Make pilot counters integer-only and allowlisted, with no text, persistence or network. | The validation plan needs counts but must not become a channel for clinical questions or account data; integer assertions are mechanically verifiable in `unit.mjs`. |
| 2026-11-26 | Pin the two vendored pdf.js SHA-256 hashes in lint. | The zero-dependency build is only as trustworthy as the vendored blobs; a silent upgrade should be a reviewable change. |
| 2026-11-26 | Leave licence, visibility, push and deploy unchanged. | Public commitments were explicitly reserved for the maintainer; a live header check was read-only. |
| 2026-11-26 | Hash LF-normalised vendor bytes in lint instead of raw checkout bytes. | CI run 45753969933 failed because Windows checks out CRLF and Linux checks out LF; canonical LF hashes make the supply-chain gate deterministic across platforms. |
| 2026-11-26 | Push both commits to public `main` after explicit user confirmation. | The user chose "Yes — push and deploy" with the stated consequence: public branch update, CI run and a new Vercel production build. Licence and visibility were not changed. |
| 2026-11-26 | Fix the corrupted `[\s\VIEW]` regexes rather than weaken the README claim. | Synthetic fixtures proved the documented DOCX/XLSX/PDF capability was broken. The correct any-character class is `[\s\S]`; a lint guard now prevents recurrence. |
| 2026-11-26 | Keep the QA and demo harnesses in the repository instead of one-off scripts. | They turn documentation claims into repeatable commands and give a deterministic, non-sensitive capture for a future video. Both are dev-only and CI-gated. |
