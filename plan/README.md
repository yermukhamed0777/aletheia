# Aletheia plan — index and conventions

This folder is the long-term execution record. It is deliberately text-only so
it can be reviewed in a diff.

| File | Purpose |
|---|---|
| `strategy.md` | Market thesis, users, positioning, metrics, risks, open questions and the session-history table. |
| `roadmap.md` | The three-horizon plan (short / mid / long), each milestone split into Intelligence and Human work, plus expansion options. |
| `backlog.md` | Ordered executable tasks with stable IDs, `file:line` references and `Done when` criteria. |
| `decisions.md` | **Append-only** decision log: date, decision, why. |
| `progress.md` | **Append-only** session log: exact changes, exact commands and results, open items mapped to backlog IDs. |

## Status snapshot

- Stage: static, browser-only demonstration; public repo, deployed on Vercel (production still serves the 2026-11-25 build); no field validation yet. Code and docs are complete locally up to the human pilot boundary.
- Latest measured numbers: 39 questions / 22 passages / 436 defined strings / 334 used keys; unit 39/39; data 19/19; e2e 13/13; QA 23/23; demo 7 identical artifact hashes; check passes; lint passes 10 files and 2 pinned vendor hashes; eval 50/72 (69.4%); bundle 2638 KB; audit 0 vulnerabilities. Full evidence in `progress.md` and `RELEASE_REPORT.md`.
- Next action: **human only** — run the pilot in `PILOT_HANDOFF.md`; **optional next** — P1-1, raise the eval floor only after a measured retrieval improvement. Closeout classification: **DEMO READY**.

## Binding update convention

After EVERY work session, in the SAME commit as the work:

1. Tick, split or add items in `backlog.md`.
2. Append a `progress.md` entry with exact changes, commands and results.
3. Append to `decisions.md` if direction, scope or cost changed.
4. Update `roadmap.md` and the session-history table in `strategy.md` if the horizon, milestone or work split changed.
5. Update the status snapshot above (stage, latest measured numbers, next action).
6. Re-run tests, benchmark/lint and build; record results.

Commands used here: `node check.mjs` (runs `unit.mjs`), `node lint.mjs`,
`node eval.mjs`, `node unit.mjs`, `node bundle.mjs`, `node e2e.mjs` (or
`.\verify.cmd` on Windows). Research or scoping sessions
still produce a plan entry. Append-only files are never rewritten; old rows and
entries stay verbatim.
