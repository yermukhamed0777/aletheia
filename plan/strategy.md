# Aletheia — strategy

Status snapshot and session history are at the end of this file. The executable
plan is in `plan/roadmap.md`, `plan/backlog.md` and `plan/progress.md`.

## Thesis

Clinical staff at diagnostic networks, hospital pharmacies and laboratory teams
need an answer with its source, not fluent guesswork. Aletheia answers only from
text it can cite; when evidence coverage is below threshold it abstains and
records a knowledge gap. The product promise is *verifiability over fluency*:
every answer carries a passage locator, and the demo is honest about what is
real, curated and simulated.

The current artefact is a free, static, browser-only demonstration. It proves
the promise cheaply; it is not a clinical product or a medical device.

## Users

- **Primary:** laboratory medicine staff and hospital pharmacists checking dose,
  interaction, specimen handling, cold chain and critical-result rules.
- **Secondary:** quality/compliance leads who want an auditable trail of which
  document version supported an answer and where gaps keep recurring.
- **Buyer (future):** lab-network operations or procurement, once real corpora,
  access control and an audit log exist.

The built-in corpus is fictional (**Asklepia Diagnostics**). No real patient,
brand or institution is described.

## Positioning

"Source-grounded clinical evidence desk" — not a chatbot, not a search engine,
not a medical device. Differentiators that must survive every future change:

1. Extractive answers from retrieved passages; no invented prose.
2. Numbered citations that open the exact highlighted passage with file + location.
3. Coverage-based abstention with a visible, adjustable threshold.
4. Zero-install static demo that can be hosted behind an intranet.
5. Trilingual EN/RU/KK interface and corpus, aimed at Central Asian networks.
6. Knowledge-gap tracking, so refusals become a work queue rather than a dead end.

## Measured baseline (commands in `plan/progress.md`)

| Metric | Measured value | Source |
|---|---|---|
| Corpus | 7 sources, 22 passages, 39 questions (34 answerable, 5 abstain) | `node check.mjs` + read-only VM count |
| Strings | 436 defined triples; 334 literal `t()` keys used | `node check.mjs` |
| Source files | 10 `.js` files parsed by lint (added `events.js`) | `node lint.mjs` |
| Built bundle | 2638 KB, deterministic SHA-256 `4F587DD38B7885D0F164237D7CCF8160E5FAAB0EACD7288EEF95B015AF7D0642` across two rebuilds | `Get-FileHash dist/index.html` + `node bundle.mjs` |
| Unit harness | 39/39 checks passed (was 21/39 before the fixes) | `node unit.mjs` |
| Browser e2e | 13/13 checks passed, root + `/sub/`, zero console errors, zero external requests | `node e2e.mjs` |
| Data layer | 19/19 checks: TXT, CSV, DOCX, XLSX, text-PDF and two failure codes | `node data.mjs` |
| Workflow QA | 23/23 checks: mobile, keyboard/a11y, hostile input, network failure, persistence, empty states | `node qa.mjs` |
| Demo capture | 6 screenshots + integer-only event snapshot; identical SHA-256 across two runs | `node demo.mjs` |
| Dependency audit | 0 vulnerabilities across 3 packages | `npm.cmd audit --json` |
| Production | deployment `dpl_DXQx…`, READY, commit `9ca85e9…` | `vercel ls --prod --json` |
| Validation | 50/72 correct (69.4%): dev 19/30, fresh 16/20, heldout1 15/22 | `node eval.mjs` |
| CI | Two previous runs `success`; post-push run 45753969933 failed at lint (CRLF/LF vendor hashes) and was fixed; a new run must pass | `gh run list` + `gh run view --log-failed` |
| Repo | `yermukhamed0777/aletheia`, public | `gh repo view ... --json visibility` |

## Metrics that matter next

- **Trust:** citation-resolution rate (does every visible citation open a real
  passage?), and measured answer accuracy on a frozen held-out set. Current
  held-out proxy: 15/22 (68.2%), indicative only.
- **Abstention quality:** false-answer rate on deliberately unanswerable
  questions. Current: 24/24 abstentions correct across all three sets.
- **Time to evidence:** seconds from question to opened passage. Not yet
  instrumented end-to-end.
- **Gap conversion:** share of recorded open gaps that get resolved with a new
  source. Not yet measured; requires real users.
- **Adoption:** pilot teams, repeat weekly use, questions per active user.
  Zero today — no field validation has happened.

## Risks

1. **Clinical harm**: the demo can be mistaken for a decision aid. Mitigation:
   permanent demo framing and disclaimer, fictional corpus, no real patient data.
2. **Low measured accuracy**: 69.4% on small validation sets. The sets are
   indicative, not a benchmark, and many expected substrings are
   language-specific; treat the number as a regression floor, not a quality bar.
3. **Browser-level tests now exist** (2026-11-26): `unit.mjs` boots all ten
   sources in a VM with DOM stubs and `e2e.mjs` drives a real Chromium page.
   The earlier remote-answer crash is covered by both. Residual risk: full
   accessibility is not audited, and the Windows CI runner is still open (M2-3).
4. **Privacy**: uploaded text, questions and gaps persist unencrypted in
   `localStorage`; a user-configured backend URL may be plain `http://`.
5. **Licence ambiguity resolved for now**: public visibility with all rights
   reserved; no reuse grant. Commercialisation needs a real licence decision.
6. **Accessibility**: overlays lack focus traps; contrast in the light theme is
   below WCAG AA for small muted text.
7. **Deployment**: Vercel project is tied to a personal account slug; headers
   were added but not yet re-verified in production.

## Open questions

- Which real corpus can be licensed for a pilot, and who owns the derived passages?
- Is the eventual product on-prem behind a hospital firewall, hosted SaaS, or both?
- What accuracy bar is acceptable for a non-clinical research preview?
- Should optional embeddings/OCR remain browser-only, or move server-side?
- Who is the first design partner, and what is their evaluation protocol?
- Does the project stay rights-reserved forever, or get a commercial licence later?

## Session history — exactly what was done

| Date | Session | What was done (verified) | Evidence |
|---|---|---|---|
| 2026-11-25 | Repository and deploy session (earlier in this conversation) | Renamed `yermukhamed0777/knowledge-base` → `aletheia`; set public, description and topics; added `origin`, renamed local branch to `main`, lease-protected force push replacing old remote content; added CI, issue/PR templates, handoff notes; created Vercel project `erm1ham3d2204-2491/aletheia`, linked GitHub, deployed production, verified public URL; added CI badge and live URL to README. | `gh repo view yermukhamed0777/aletheia --json nameWithOwner,visibility,description,url,defaultBranchRef` → `PUBLIC`; `git push --force-with-lease origin main` → `+ 7b9194f...33ed442 main -> main (forced update)`; Vercel deploy JSON `readyState: READY`, production URL `https://aletheia-nine-iota.vercel.app`; `gh run list` → two `success` runs. |
| 2026-11-25 | Audit and hardening session (current) | Three read-only audits (core/data, UI/i18n/docs, tests/CI/packaging). Hardened `check.mjs` (build guard, exact counts, unique QA ids, triple validation, double-quoted `t()` keys); added `lint.mjs` and `eval.mjs` with a measured gate of 0.694; added CI permissions/concurrency/timeout/workflow_dispatch and staged check→lint→eval→build + artifact; added `LICENSE`, `THIRD_PARTY_NOTICES`, `CONTRIBUTING.md`, `CHANGELOG.md`, `SECURITY.md`, `verify.cmd`; fixed remote-answer crash, remote citation location loss, settings rehydration bug, 30 MiB cap copy, five untranslated toasts, sample-source description, privacy claims and 436-vs-329 metric wording; created this `plan/` folder. | `node check.mjs`, `node lint.mjs`, `node eval.mjs`, `node bundle.mjs` outputs recorded in `plan/progress.md`; audit findings cited with `file:line` in `plan/backlog.md`. |
| 2026-11-26 | Completion session (current) | Completed the interrupted working-tree refactor; made remote evidence self-contained; added `harness.mjs`, `unit.mjs` (39 checks), `e2e.mjs` (13 checks), content-free `events.js`, HTTPS-only backend URLs, quota-safe uploads, focus/ARIA fixes, pinned vendor hashes and CV-ready docs. | `node unit.mjs` → 39/39 (baseline 21/39); `.\verify.cmd` → all six commands exit 0; `curl.exe -sSI` → three production headers; deterministic bundle hash recorded in `progress.md`. |
