# Changelog

Dates are UTC, taken from `git log --format='%h %ad %s' --date=short`.

## Unreleased

- Hardening of the check suite (all source files syntax-checked, exact corpus
  counts, validation scoring), public-repo scaffolding, and `plan/` folder.

## 2026-11-25

- `1a7a17f` Document live demo and CI; ignore Vercel local files.
- `33ed442` Add CI check, templates and handoff notes.
- `7bc1bff` Initial Aletheia build: clinical evidence desk — 7 fictional
  sources, 22 passages, 39 trilingual questions, pure BM25 retriever with
  coverage-based abstention, client-side parsers, optional semantic/OCR layer,
  trilingual UI, static Vercel bundle.
