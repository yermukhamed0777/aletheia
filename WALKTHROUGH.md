# Scripted walkthrough and deterministic capture

This page fixes the demo story and its capture command so a video can be made
later without re-running the whole app or improvising the sequence. It is a
script for a human presenter; no part of it has been executed with real users.

## One-command capture

```bash
npm ci
node bundle.mjs
node e2e.mjs
```

`e2e.mjs` serves the built bundle on a local HTTP port, uses a fixed 1440×900
viewport, `en-GB` locale and UTC timezone, disables animations before capture,
and writes `artifacts/walkthrough-ask.png`. It also asserts zero browser
console/page errors, zero external requests, and that the same file boots at a
subpath (`/sub/`). Recorded result on 2026-11-26: 13/13 checks passed.

## Storyboard (guided demo)

| Step | Action | Expected on screen |
|---|---|---|
| 1 | Open `/` | Landing page: promise, "no sign-up", privacy section |
| 2 | Sidebar → **Guided demo** | Three-slide onboarding, then the coach overlay |
| 3 | Coach → Next (metformin) | Answer with numbered citations; note the "pre-verified" label |
| 4 | Click citation 1 | Drawer opens the exact passage, file name and location |
| 5 | Close drawer | Focus returns to the citation button |
| 6 | Next (specimen handling) | Answer spanning two sources; two source chips |
| 7 | Next ("paediatric dose") | Honest abstention; gap logged and linked |
| 8 | Next → Open questions | Gap row with reason, count and **Ask again** |
| 9 | Next → Coverage & insights | Charts built only from this session's real activity |
| 10 | Sources → Add sample source → Open questions → Ask again | New upload raises coverage; gap can be resolved |
| 11 | `Ctrl/Cmd+K` | Quick find over questions, sources and pages |

The scripted path is reproduced automatically by `e2e.mjs` for steps 1, 2, 3,
4, 5 and 11. Steps 6–10 are presenter-only and are not claimed as automated.

## Reading the pilot counters (optional)

In the browser console, `EVENT_SNAPSHOT()` returns an object of allowlisted
integer counters only — for example `{ ask_started: 2, citation_opened: 1 }`.
No question text, document excerpt, endpoint URL or account data is emitted,
stored, or transmitted. `node unit.mjs` asserts the allowlist, integer-only
values and zero network calls.
