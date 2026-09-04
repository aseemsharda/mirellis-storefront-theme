# Support and incident playbook

## Support boundary

Support covers access, local-data deletion, consent controls, routes, and accessibility or product defects. It does not provide emergency, crisis, medical, clinical, or therapy support. People should leave the app and use locally appropriate support when that is what their situation needs.

## Severity model

- **S1:** safety, privacy, consent, or forced-route failure — pause the affected route immediately and assess rollback.
- **S2:** material accessibility, route-control, or data-deletion defect — contain, communicate if needed, and set an owner and review time.
- **S3:** non-blocking defect or feedback — record without interpreting private state; include it in the next stewardship review.

Every entry records build and policy versions, observation, known impact, action/owner, and follow-up evidence. Do not add inferred mood, diagnosis, or private-state claims.

## Controlled-pilot assignments

- Release, incident, pause and rollback authority: Aseem Sharda.
- Product, editorial, privacy and accessibility owner: Aseem Sharda.
- Support channel: `contact@lambdalifestyle.com`.
- Pilot acknowledgement target: within two business days.

These assignments make operations accountable; they do not certify accessibility, curriculum approval, commerce operations or pilot usefulness. Those remain evidence gates in `src/operations/release-record.ts`.

## Rollback sequence

1. Pause the affected public entry link or app deployment when an S1 issue is confirmed.
2. Preserve the incident evidence without collecting private practice text.
3. Restore the last named production deployment or theme release.
4. Verify the affected safety, privacy, accessibility, deletion or route-control path.
5. Record the decision and evidence before reopening the route.
