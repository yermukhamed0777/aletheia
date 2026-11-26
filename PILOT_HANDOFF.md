# Pilot handoff — what remains for a human

This document hands the validated artefact to the maintainer. Everything in
this repository has been run locally; nothing in it has been tried with real
participants, real protocols or a real backend. **Nothing here is a usage,
adoption or accuracy claim from the field.** All numbers below that describe
the software come from recorded commands in `plan/progress.md`.

## 1. Goal and boundary

**Goal of the seven-day pilot:** observe whether laboratory/pharmacy staff can
get a source-grounded answer quickly, whether every displayed citation opens a
real passage, and which recurring questions remain unanswered. The pilot is a
research preview of a demonstrator — not a clinical evaluation, not a medical
device, and not a production deployment.

**Agent-doable boundary reached:** the app, verification suite, CI gate,
content-free counters, documentation and this handoff are complete locally.
The **last step that needs real users** is the pilot itself: recruiting and
consenting participants, supplying an approved de-identified corpus, running
the task sessions, and deciding go/no-go. I stopped exactly there. I did not
recruit, ask anyone to test it, push, publish, create accounts or change repo
visibility/licence.

## 2. Cohort and consent wording

**Suggested cohort (human to confirm):** 2–3 laboratory medicine or pharmacy
staff who can complete a 30-minute task-based session on their own hardware.
No patients, no real confidential documents.

**Consent wording to present before the first session** (edit only with
maintainer approval; do not imply clinical validation):

> You are being invited to try a research demonstration of Aletheia. It is not
> a medical device and must not be used for patient care. Participation is
> voluntary; you may stop at any time. Please use only de-identified or
> fictional documents — do not enter real patient information, real patient
> identifiers or confidential documents. Questions, history, gaps and uploaded
> text are stored only in this browser's `localStorage` under `altheia.state`;
> nothing is sent to a server unless you explicitly configure a backend URL.
> No behavioural text is collected by the built-in counters, which record only
> counts of allowlisted events. You can clear all local data at any time in
> Settings → Clear local data. If you agree, the session facilitator may record
> task outcomes (not verbatim questions) for the evaluation report.

Human-only: obtain signed or recorded consent, approve the wording, and decide
whether quotes/screenshots may be retained.

## 3. Schedule (proposed, not executed)

| Day | Activity | Owner |
|---|---|---|
| 0 | Approve protocol, corpus and consent; set up a clean browser profile | Human |
| 1–5 | One 30-minute task session per participant; log outcomes as they happen | Human |
| 6 | Reconcile session traces, resolve every displayed citation against its source | Human |
| 7 | Go/no-go decision using the criteria below; file any failure as a new backlog ID | Human |

Suggested tasks: the metformin dose question, a specimen-handling question,
an intentionally unanswerable paediatric question, then upload a provided
de-identified source and re-ask the gap. Use `WALKTHROUGH.md` for the exact
sequence; do not invent new claims during the session.

## 4. What to collect

- **Counts only** from `EVENT_SNAPSHOT()` (allowlisted names, integer values,
  no user text): `ask_started`, `answer_shown`, `abstain_shown`,
  `citation_opened`, `upload_processed`, `upload_failed`, `gap_logged`,
  `tour_started`, `lang_changed`.
- **Task outcome sheet:** participant code (not name), task id, completed /
  not completed, whether the displayed citation opened the correct passage,
  observed failure, and facilitator notes. Prefer codes and categories over
  verbatim questions; if verbatim text is needed, consent must say so.
- **Environment:** browser and OS version, local build commit SHA, and the
  exact command output from `.\verify.cmd` on that commit.
- **Never collect:** real patient data, account credentials, API keys, or
  backend responses containing confidential documents.

## 5. Filing a failure as a new backlog ID

1. Append a new row to `plan/backlog.md` using the next free ID in the
   appropriate horizon (`P0-n` for defects found in the demo, `M1-n` for
   pilot-process findings). **Never renumber or remove existing IDs.**
2. Include a `file:line` reference (for a UI failure, name the view and the
   reproducible action), severity, and a **Done when** criterion that names a
   command whose output can prove the fix.
3. Append a dated entry to `plan/progress.md` with the exact command and
   result, and update `plan/README.md`'s status snapshot in the same commit.
4. If the finding changes scope, cost or direction, append a row to
   `plan/decisions.md`. Do not rewrite older rows.

## 6. Go / no-go criteria

Targets below are **proposed thresholds, not measured results**. No pilot data
exists yet; do not present them as achieved.

Go (all required):
- At least two pilot sessions completed with consent recorded.
- 100% of citations displayed during the sessions resolve to a real passage
  in the corpus used in that session.
- Zero false answers on the deliberately unanswerable task.
- Zero real patient data or confidential documents in the repository or
  collected artifacts.
- `.\verify.cmd` green on the deployed commit.

No-go (any one): a citation that opens nothing or the wrong passage; any
answer given to an unanswerable question; any real patient data in scope; an
unresolved high-severity defect; or a red CI run.

## 7. Explicitly human-only

- Recruit, schedule and consent participants; decide compensation.
- License/approve a real, de-identified corpus and own the derived passages.
- Approve the protocol, consent wording and whether quotes may be retained.
- Run the sessions, make clinical-safety judgements and decide go/no-go.
- Choose deployment posture (intranet / hosted), commercial licence, entity
  and any design partner.
- **Push, publish, change visibility or licence** — requires your explicit
  confirmation; the exact consequence of "yes" is a public commit to
  `origin/main` and a new Vercel production build. I have not done it.
