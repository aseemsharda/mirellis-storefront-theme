# ADR-003 — Curriculum source of truth

- Decision: The repository is authoritative for active Mirellis curriculum content, V3 dossier metadata, route-policy evidence rules, test fixtures, and governance records.
- Status: Accepted for implementation; imported experience semantics are not newly approved by this record.
- Consequence: No chat transcript, dashboard pattern, AI output, or unreviewed prompt may modify a learning claim, safety route, data rule, or route policy at runtime.

The application reads only versioned TypeScript configuration shipped with the build. It has no server-side content mutation path.
