# Launch readiness record

This record implements the Launch & Learning Operations v1.0 release gate without treating a local app build as proof of external operational readiness.

## Ready in the build

- Account-free, local-first core use.
- Explicit local evidence only; no inferred state, engagement score, streak, or behavioural profile.
- Separate analytics and research controls, both off by default.
- Alternate, smaller, self-guided, and leave-for-today routes.
- Local data review and deletion controls.
- Named controlled-pilot release, product, editorial, privacy, accessibility, support, incident, pause and rollback ownership in `src/operations/release-record.ts`.

## Still requires named human verification

- Approval and red-team record for each active legacy experience.
- Accessibility acceptance evidence for the supported devices and browsers.
- A published release record and rollback procedure.
- A signed review decision from the approved 8–12-person After Work pilot.
- Recorded checkout, payment, shipping, fulfilment, refund and transactional-email evidence.

Until those records exist, the app reports `preflight`, not formal launch certification.

The live 21-day build supersedes the earlier 8–10-minute-only prototype description as a product candidate; it does not supersede the privacy, claim, accessibility or pilot gates. The current release scope is one immediate After Work practice plus one optional private 21-day programme. No other transition is certified.
