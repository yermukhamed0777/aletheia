# Aletheia — progress log (append-only)

Append only. Each entry states exactly what changed, the exact commands and
their results, and what remains open mapped to backlog IDs. Research-only
sessions get an entry too.

## 2026-11-25 — repository and deploy session (earlier in this conversation)

**Changed:** repo `yermukhamed0777/knowledge-base` renamed to
`yermukhamed0777/aletheia` and made public with a new description and topics;
local `origin` added, local branch renamed `master` → `main`; old remote content
replaced by a lease-protected force push; `.github/workflows/check.yml`, issue
and PR templates added; README gained CI badge and live demo URL; Vercel
project `erm1ham3d2204-2491/aletheia` created and linked to the GitHub repo;
production deployment created.

**Commands and results:**
- `gh auth status` → logged in as `yermukhamed0777`, scopes `delete_repo, gist, read:org, repo, workflow`.
- `gh repo rename aletheia --repo yermukhamed0777/knowledge-base --yes` → no output, success.
- `gh repo edit yermukhamed0777/aletheia --description "Aletheia — source-grounded clinical evidence desk for diagnostic networks (EN/RU/KK)" --visibility public --accept-visibility-change-consequences --add-topic …` → no output, success.
- `gh repo view yermukhamed0777/aletheia --json nameWithOwner,visibility,description,url,defaultBranchRef` → `visibility: PUBLIC`, default branch `main`.
- `git fetch origin; git branch -M main; git push --force-with-lease origin main` → `+ 7b9194f...33ed442 main -> main (forced update)`.
- `npx.cmd --yes vercel@latest login` → `✓ Logged in`.
- `npx.cmd --yes vercel@latest link --yes --project aletheia` → `✓ Created erm1ham3d2204-2491/aletheia`, `> Connected` GitHub repo.
- `npx.cmd --yes vercel@latest --prod --yes` → `readyState: READY`, production URL `https://aletheia-nine-iota.vercel.app`.
- `gh run list --repo yermukhamed0777/aletheia --limit 5` → two `success` runs on `main`.

**Open then:** no CI hardening, no public-repo scaffolding, no plan folder.
Mapped now to P0-3, P0-5 and the `plan/` files.

## 2026-11-25 — audit and hardening session (current)

**Read-only audits (three parallel subagents, no files modified):**
- Core/data: BM25 at `src/retrieval.js:33-55`, coverage abstention at `:72-114`,
  identifier guard at `:115-117`; parsers real at `src/model.js:206-346`;
  semantic/OCR wrapped at `src/augment.js:17-115`; remote contract matches
  `README.md:73-76`; **high-severity bug** remote answer crash
  (`src/controller.js:56`, `src/interface.js:78-79`); rehydration bug
  (`src/model.js:80-81`); dead code `augment.js:7-8`, `model.js:137`.
- UI/i18n/docs: 436 strings all valid triples; 329 literal `t()` keys used;
  five toasts English in all languages; `lib.sample.d` described cold-chain but
  adds paediatric file; 30 MiB cap vs 10 MB UI copy and ~5 MB README; remote
  citations dropped `c.location`; no focus traps; light muted contrast 4.25:1.
- Tests/CI/packaging: `check.mjs` never executes six of nine source files;
  no lint, no eval runner; `npm run check` fails under Restricted PowerShell;
  CI lacked `permissions`, `concurrency`, timeout; no LICENSE,
  THIRD_PARTY_NOTICES, CONTRIBUTING, CHANGELOG or SECURITY.md.

**Baseline commands and results:**
- `gh auth status` → logged in as `yermukhamed0777`; scopes `delete_repo, gist, read:org, repo, workflow`.
- `git status --short --branch` → `## main...origin/main` (clean).
- `git log --oneline -5` → `1a7a17f`, `33ed442`, `7bc1bff`.
- `node --version` → `v24.18.1`.
- `npm --version` → **failed**: `npm.ps1 cannot be loaded because running scripts is disabled on this system`.
- `npm run check` → **failed** with the same `PSSecurityError`.
- `npm.cmd --version` → `11.16.0`; `npm.cmd run check` → `CHECK PASSED — bundle built, 39 questions, 22 passages, 329 UI strings verified`; `npm.cmd run build` → `built 2634 KB`.
- Determinism: `Get-FileHash -Algorithm SHA256 dist/index.html` before and after `node bundle.mjs` → both `7BA561AB0AE7CFFD8A82A5CAC3949226464DCA6704C11D9F3CABE108FE6AF70D`.
- `Test-Path plan` → `False`; `Test-Path PLAN.md` → `False`; `validation/` contains `dev.json`, `fresh.json`, `heldout1.json`.
- `gh api repos/yermukhamed0777/aletheia/actions/workflows --jq …` → workflow id `430129443`, path `.github/workflows/check.yml` (badge URL valid).
- `node -e … Retrieval.search …` → `answer` result `status=answer`, coverage `1`, hits with chunk/lines; unrelated question → `abstain`, coverage `0`.

**Files changed:** `check.mjs` (build guard, exact counts, unique QA ids,
non-empty translations, all-TEXT triple validation, double-quoted `t()` keys,
clearer pass line); new `lint.mjs`; new `eval.mjs` with measured gate 0.694;
`.github/workflows/check.yml` (least privilege, concurrency, timeout,
`workflow_dispatch`, staged check→lint→eval→build, artifact upload);
`package.json` (metadata, `license: UNLICENSED`, `engines`, `lint`/`eval`/
`verify` scripts); `vercel.json` (three response headers); `.gitignore`
(key/credential patterns); new `LICENSE`, `THIRD_PARTY_NOTICES`,
`CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`, `verify.cmd`;
`src/strings.js` (30 MiB copy, paediatric sample description, qualified privacy
claims, five translated toasts); `src/model.js` (`REMOTE_DOCS`, remote-aware
`docById`, `loc.label`, `DEFAULT_SETTINGS`); `src/controller.js` (remote chunks
register synthetic docs and preserve `c.location`); `README.md` (upload cap,
analytics nuance, storage quirk); this `plan/` folder.

**Final verification commands and results:**
- `node check.mjs` → `CHECK PASSED — bundle built, 39 questions, 22 passages, 329 literal t() keys used of 436 defined strings verified`.
- `node lint.mjs` → `LINT PASSED — 9 source files parsed, bundle order and tracked-file guards verified`.
- `node eval.mjs` → `dev.json: ans 11/22, idk 8/8, total 19/30`; `fresh.json: ans 8/12, idk 8/8, total 16/20`; `heldout1.json: ans 7/14, idk 8/8, total 15/22`; `EVAL PASSED — 50/72 (69.4%) at threshold 0.6, minimum 0.694`.
- `node bundle.mjs` → `built 2635 KB`.

**Open:** P0-1 (remote render regression test), P0-2 (all-source execution),
P0-3 (HTTPS-only backend URL), P0-4 (hard-coded copy), P0-5 (live header check),
P0-6 (focus/ARIA), P0-7 (timer/focus restoration), P0-8 (dead keys), P0-9
(quota-safe upload), P1-1 (raise measured eval floor), P1-2 (browser smoke test),
P1-3 (pin vendor hashes). No human action is required for P0-1…P0-9 except
confirmations noted in `plan/roadmap.md`.
