# Security policy

## Reporting

Use GitHub's private vulnerability reporting for this repository:
https://github.com/yermukhamed0777/aletheia/security/advisories/new

Do not open a public issue for an unresolved vulnerability. Include the
affected file and line, a reproduction, and the impact you observed.

## Scope

Aletheia is a client-side demonstration. It parses user-selected documents in
the browser and stores session state in `localStorage` under `altheia.state`.
It has no accounts, server-side storage, or encryption at rest. Do not upload
real patient data or real confidential documents to a deployed demo.

The optional *Real backend* setting stores only a URL and POSTs the question
to it. Configure it only with an endpoint you control; see `README.md` for the
request/response contract. Process and open security work are tracked in
[`plan/README.md`](plan/README.md).
