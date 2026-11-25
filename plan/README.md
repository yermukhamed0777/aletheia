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

- Stage: static, browser-only demonstration; public repo, deployed on Vercel; no field validation yet.
- Latest measured numbers: 39 questions / 22 passages / 436 defined strings; check passes; lint passes 9 files; eval 50/72 (69.4%); bundle 2635 KB. Full evidence in `progress.md`.
- Next action: **P0-1** — add the remote-answer rendering regression test (see `roadmap.md` §1 and `backlog.md`).

## Binding update convention

After EVERY work session, in the SAME commit as the work:

1. Tick, split or add items in `backlog.md`.
2. Append a `progress.md` entry with exact changes, commands and results.
3. Append to `decisions.md` if direction, scope or cost changed.
4. Update `roadmap.md` and the session-history table in `strategy.md` if the horizon, milestone or work split changed.
5. Update the status snapshot above (stage, latest measured numbers, next action).
6. Re-run tests, benchmark/lint and build; record results.

Commands used here: `node check.mjs`, `node lint.mjs`, `node eval.mjs`,
`node bundle.mjs` (or `.\verify.cmd` on Windows). Research or scoping sessions
still produce a plan entry. Append-only files are never rewritten; old rows and
entries stay verbatim.
