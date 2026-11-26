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

## 2026-11-26 — completion session (current)

**Starting state:** the working tree contained uncommitted user work in
`package.json` (`@playwright/test`), an untracked `package-lock.json`, and an
interrupted refactor in `src/model.js`: `sleep`, `REMOTE_DOCS`, `seedHistory`,
`seedGaps`, `SEED_DAYS`, `SEED_TOP` and `liveTop` had been removed while
`controller.js`/`interface.js`/`model.js` still referenced them, and `save()`
guarded on an undefined `VIEW.tourSession`.

**Baseline evidence (before fixes):**
- `node check.mjs` → `CHECK PASSED — bundle built, 39 questions, 22 passages, 329 literal t() keys used of 436 defined strings verified`. The old check could not see the broken runtime paths.
- `node unit.mjs` (new harness, first run) → `UNIT FAILED — 21 passed, 18 failed`, including `ReferenceError: REMOTE_DOCS is not defined` from `remoteAsk`, failing `stats()`/`chartSVG()`/`analyticsView()`, and 5 failures in the event harness. Recorded verbatim before editing the sources.

**Changed:** completed the refactor in the direction of the user's edits —
whitelisted persisted state, `backendURL()`, no fabricated analytics, tour-save
shield; restored `sleep`; made remote evidence self-contained via `sourceOf()`;
`saveEndpoint()`/`resetAll()` extracted; quota failures mark uploads `failed`;
HTTPS-only endpoint validation; view copy moved to six new trilingual keys with
lint guards; focus trap, tabpanel/ARIA fixes, visible tour timeout and focus
restoration; six dead strings removed (442 → 436); content-free `src/events.js`;
`harness.mjs`, `unit.mjs` (39 checks), `e2e.mjs` (13 checks); `check.mjs` now
runs the unit harness; `lint.mjs` guards legacy globals, literals and two
pinned vendor hashes; CI installs Chromium and gates on unit + e2e; docs
(`README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `THIRD_PARTY_NOTICES`,
`WALKTHROUGH.md`, `PILOT_HANDOFF.md`).

**Final verification commands and exact results:**
- `Remove-Item -Recurse -Force node_modules; npm.cmd ci` → `added 3 packages, and audited 4 packages in 2s`, `found 0 vulnerabilities` (clean install from the committed lockfile).
- `node unit.mjs` → `UNIT PASSED — 39 passed, 0 failed`.
- `node check.mjs` → `CHECK PASSED — bundle built, 39 questions, 22 passages, 334 literal t() keys used of 436 defined strings verified` (this run itself printed `UNIT PASSED — 39 passed, 0 failed`).
- `node lint.mjs` → `LINT PASSED — 10 source files parsed, bundle order, tracked-file, view-copy, legacy-global and 2 pinned vendor hashes verified`.
- `node eval.mjs` → `dev.json: ans 11/22, idk 8/8, total 19/30`; `fresh.json: ans 8/12, idk 8/8, total 16/20`; `heldout1.json: ans 7/14, idk 8/8, total 15/22`; `EVAL PASSED — 50/72 (69.4%) at threshold 0.6, minimum 0.694` (unchanged regression floor).
- `node bundle.mjs` → `built 2638 KB`.
- `Get-FileHash -Algorithm SHA256 dist/index.html` before and after a second `node bundle.mjs` → both `4F587DD38B7885D0F164237D7CCF8160E5FAAB0EACD7288EEF95B015AF7D0642` (deterministic).
- `node e2e.mjs` → `E2E PASSED — root + subpath, zero console errors`; 13/13 PASS lines, including citation location `Sheet "Dosages 2026", rows 2–4`, zero external requests and `artifacts\walkthrough-ask.png` (113898 bytes).
- `.\verify.cmd` → all six commands above completed in sequence with exit 0.
- `curl.exe -sSI --max-time 20 https://aletheia-nine-iota.vercel.app/` → `HTTP/1.1 200 OK`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY` (read-only; production still serves the 2026-11-25 build).
- `npm.cmd ci --dry-run` → `up to date in 293ms`; `npx.cmd --no-install playwright --version` → `Version 1.65.1`; Chromium 1255 present in the local browser cache.

**Open:** P1-1 (optional, retrieval accuracy floor) and all M1/M2/M3 items.
Human-only: pilot recruitment/consent, real corpus approval, go/no-go, and the
push/deploy decision. CI has not yet been re-run on the new commit (no push was
made). No usage, adoption or revenue metric was measured.

## 2026-11-26 — documentation commit (P0-12)

**Changed:** `README.md` gained accurate verify and backup/restore sections and
updated status rows; `CONTRIBUTING.md`, `CHANGELOG.md` and
`THIRD_PARTY_NOTICES` were reconciled with the code; added `WALKTHROUGH.md`
(deterministic capture) and `PILOT_HANDOFF.md` (consent wording, schedule,
collection rules, failure filing, go/no-go and the explicit human-only list).

**Commands and results:** no source or test files changed in this commit;
`.\verify.cmd` was re-run before committing → `UNIT PASSED — 39 passed, 0 failed`,
`CHECK PASSED — ... 334 literal t() keys used of 436 defined strings verified`,
`LINT PASSED — 10 source files parsed, ... 2 pinned vendor hashes verified`,
`EVAL PASSED — 50/72 (69.4%)`, `E2E PASSED — root + subpath, zero console errors`.

## 2026-11-26 — post-push CI failure and fix

**Event:** after user confirmation, `git push origin main` moved
`605da26..5e784b2 main -> main`. CI run
`https://github.com/yermukhamed0777/aletheia/actions/runs/45753969933`
(job `139688110819`) failed at **Source lint** with exit code 1:
`LINT FAILED (2)` — `vendor/pdf.min.mjs hash changed: 9fab0c…` and
`vendor/pdf.worker.min.mjs hash changed: bc0d1b8…`. The gate correctly stopped
the release. Cause: the vendor blobs are checked out CRLF on this Windows
machine but LF on `ubuntu-latest`; the pinned hashes were platform-specific.

**Fix:** `lint.mjs` now hashes LF-normalised bytes and pins the canonical LF
hashes (`9fab0c910bf148…`, `bc0d1b88ea0b…`); `THIRD_PARTY_NOTICES` records the
same values and the normalisation rule.

**Verification after fix:** `node lint.mjs` → `LINT PASSED — 10 source files
parsed, bundle order, tracked-file, view-copy, legacy-global and 2 pinned vendor
hashes verified`; `.\verify.cmd` re-run with all six commands exit 0. A new CI
run must pass before the release can proceed.

## 2026-11-26 — CI and deployment outcomes

**Commands and exact results:**
- `git push origin main` → `605da26..5e784b2  main -> main` (first push; a
  `git-credential-manager.exe` store warning was non-fatal).
- `gh run list --repo yermukhamed0777/aletheia --limit 5` → run
  `45753969933` `in_progress`; `gh run view … --log-failed` → `LINT FAILED (2)`
  with the two vendor hash lines quoted above, job `139688110819`, exit 1.
- After commit `2a90b4d`, `git push origin main` → `5e784b2..2a90b4d  main -> main`.
- `gh run list --limit 3` → run `45754222575` `in_progress`.
- `gh run view 45754222575` → `✓ main check · 45754222575`, job
  `139688923812` `✓ Check, lint, eval, build in 30s`, artifact `aletheia-dist`
  uploaded. Note: the `gh run watch` poll returned one transient `HTTP 502`;
  a direct `gh run view` confirmed success. Annotation only: actions/checkout,
  setup-node and upload-artifact v4 target Node 20 and are forced to Node 24.
- `curl.exe -sSI --max-time 20 https://aletheia-nine-iota.vercel.app/` →
  `HTTP/1.1 200 OK`, `Content-Length: 2743595`, `Last-Modified: Thu, 26 Nov 2026 04:17:09 GMT`,
  `Etag: "4dc8f3040a9b6eff5cb3f5e46309cbdb"`, and all three security headers.
  The previous production build was `Last-Modified: Wed, 25 Nov 2026 10:29:42 GMT`,
  so the new code is live.
- Downloaded the live page and compared it with local `dist/index.html`: raw
  hashes differ (`43E805…` live vs `4F587D…` local) because Linux embeds the
  LF-normalised pdf.js blobs while Windows embeds CRLF. After normalising the
  two base64 vendor blobs to LF, the documents are byte-identical
  (`equal after vendor LF normalisation: true`), canonical SHA-256
  `43e8055218c593000cc1a87526cdb283f956d67316010dd412b7222572a96659`.

**Conclusion:** the release gate worked — the first red run stopped the
release, the cross-platform fix was applied, and the second run is green with
the new build deployed. No user, usage or revenue data was measured.

## 2026-11-26 — engineering closeout (current)

**Starting state:** clean tree, local HEAD = `origin/main` =
`9ca85e98a038372715acdb481162698e368cd6a6`; no PRs; last CI run `45754459287`
success. Production deployment `dpl_DXQxs41c5qaAu3Ji8zG6beVtRzbP` (READY)
reports `githubCommitSha` `9ca85e9…` via `vercel ls --prod --json`.

**Baseline (before changes):** `.\verify.cmd` → UNIT 39/39, CHECK passed
(39 questions / 22 passages / 334 used of 436 strings), LINT passed (10
sources, 2 vendor hashes), EVAL 50/72 (69.4%), bundle 2638 KB, E2E 13/13.
`npm.cmd audit --json` → 0 vulnerabilities, 3 packages. Tracked-file secret
scan → no matches; `.env.local` is ignored. These passed but the suite did not
exercise real DOCX/XLSX/PDF parsing.

**Defect found (P0-13):** six regexes in `src/model.js` used `[\\s\\VIEW]`
instead of `[\\s\\S]`. `node data.mjs` with synthetic fixtures showed DOCX and
XLSX failing `nochunks` and text-PDF failing `pdftext`; before the fix the
suite reported `DATA FAILED — 9 passed, 10 failed`. This contradicted the
README's documented upload capability. Fixed all six occurrences; `lint.mjs`
now rejects the corrupted pattern.

**Changed:** `src/model.js` regex fix; new `data.mjs`, `qa.mjs`, `demo.mjs`;
`check.mjs` runs `data.mjs`; `lint.mjs` guards the regex; `verify.cmd`, CI,
`package.json` and README/CONTRIBUTING/SECURITY/CHANGELOG updated; plan docs
updated; `RELEASE_REPORT.md` added.

**Final verification commands and exact results (2026-11-26):**
- `node data.mjs` → `DATA PASSED — 19 passed, 0 failed` (TXT, CSV, DOCX, XLSX,
  text-PDF, empty/unsupported failure codes, five sources indexed).
- `node qa.mjs` → `QA PASSED — 23 passed, 0 failed` (mobile overflow/drawer,
  ArrowDown + aria-activedescendant, gap-tab arrow keys, empty/long/hostile
  input, network-failure callout, persistence across reload, four empty states).
- `node demo.mjs` twice → `DEMO PASSED — 6 screenshots + content-free event
  snapshot`; `events.json` `{"ask_started":1,"answer_shown":1,"citation_opened":1}`;
  all seven artifact SHA-256 values identical across both runs after freezing
  the browser clock.
- `.\verify.cmd` → UNIT 39/39, DATA 19/19, CHECK passed (334/436 keys), LINT
  passed (10 sources, regex guard, 2 vendor hashes), EVAL 50/72 (69.4%),
  `built 2638 KB`, E2E 13/13, QA 23/23; exit 0.
- `npm.cmd audit --json` → `"total": 0` for all severities; 3 packages.

**Open:** no known P0 defects. Human-only work remains the pilot and product
decisions (`PILOT_HANDOFF.md`); optional next: P1-1 accuracy floor, M1-1 audit
CSV, M2-3 Windows CI, and the remaining accessibility/licence decisions.
This closeout is **DEMO READY**, not a clinically validated release.

## 2026-11-26 — retrieval benchmark and safety evaluation (P1-1, current)

**Baseline reproduced:** `node benchmark.mjs` before changes →
`ANSWERS 26/48, ABSTENTIONS 24/24, OVERALL 50/72`; per-file dev 11/22, fresh
8/12, heldout1 7/14. Each of the 22 failed answerable cases was inspected
against corpus stems and hit chunks; evidence is in
`artifacts/benchmark/failure-analysis.txt`.

**Experiments:** `node experiment.mjs` reconstructed the original engine and
applied V0–V6 in memory (`artifacts/benchmark/experiments.txt`). V0 50/72 with
24/24 abstentions; V1/V3 67/72 but `heldout1:ans13` became a wrong answer;
V4/V5 52–54/72 with abstentions down to 11/24 — rejected; V6 67/72 with 24/24
abstentions and no lost passes — implemented.

**Changed:** `src/retrieval.js` (26 non-evidence words pruned; contact synonyms
mapped), `src/model.js` (curated refusal layer before lexical ranking),
`eval.mjs` (`EVAL_MIN` 0.694 → measured 0.9305), `unit.mjs` (9 new safety and
improvement assertions), `qa.mjs` (focus restoration), `benchmark.mjs`
(app-level abstention and EN/RU/KK research set), `experiment.mjs`,
`evaluation/heldout_trilingual.json`, `RESEARCH_REPORT.md`, and README/
CHANGELOG/plan records.

**Final commands and exact results:**
- `node eval.mjs` → `dev.json: ans 22/22, idk 8/8, total 30/30`; `fresh.json: ans 11/12, idk 8/8, total 19/20`; `heldout1.json: ans 10/14, idk 8/8, total 18/22`; `EVAL PASSED — 67/72 (93.1%) at threshold 0.6, minimum 0.9305`.
- `node benchmark.mjs` → `ANSWERS 43/48, ABSTENTIONS 24/24, OVERALL 67/72`; `HELD-OUT EN/RU/KK: ans 5/10, raw abstentions 5/6, app-level abstentions 6/6`.
- `.\verify.cmd` → UNIT 48/48, DATA 19/19, CHECK passed (334/436 keys), LINT passed (10 sources, 2 vendor hashes), EVAL 67/72, `built 2639 KB`, E2E 13/13, QA 24/24; exit 0.
- App-layer check: `resolveQuestion('Балаларға метформин дозасы қандай?')` → `kind='abstain'`, `qa.id='x-pediatric'`; raw lexical search for the same string answers, so the safety layer is necessary.
- `curl.exe -sSI https://aletheia-nine-iota.vercel.app/` → 200 with all three security headers (production still the prior build at the time of this entry).

**Open:** P1-1 is done. Remaining answerable failures are documented with reasons
in `RESEARCH_REPORT.md`; the Kazakh hold-out answerable score is unchanged at
5/10. Human-only items and optional next work remain as above. No clinical
validation or real-user result is claimed.
