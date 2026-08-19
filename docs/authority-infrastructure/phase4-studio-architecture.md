# Mirellis contributor and editor studio — Phase 4 architecture

Status: implementation candidate

Date: 19 August 2026

Target: `studio.mirellis.in` (not publicly linked or deployed in Phase 4)

## Product boundary

The studio is an invited, private editorial workspace for two contribution formats already named publicly: Evidence Notes and Expert Commentary. It is not an open publishing platform, a social network, a medical-record system or a route for automatic publication.

Acceptance is an editorial decision, not publication. Public release still requires a separate human publication step against the governed Observatory record schema.

## Security boundary

- Use a dedicated Supabase project for the studio. Do not share the directory database or its existing Basic-Auth admin surface.
- Supabase Auth establishes identity through invite-only email links. The application never creates an unknown user (`shouldCreateUser: false`).
- A database profile allow-list assigns `contributor`, `editor` or `admin`. Authentication without a profile grants no studio access.
- Authorization lives in Postgres row-level security and is repeated in every Server Action. Navigation visibility is not an access-control mechanism.
- Publishable keys may reach the browser. Secret/service-role keys must never be present in client code.
- The submission bucket is private. A contributor can access files only below their own user prefix; editors can read all submission files.
- Unpublished submissions are confidential and are not sent to third-party AI systems by the application.

## Roles

| Role | Capabilities |
|---|---|
| Contributor | Create a draft; edit own draft or revision; manage own sources and disclosures; submit; withdraw; read own decisions and audit history. |
| Editor | Read submitted work; begin review; record private checklist/notes; request revision, accept, decline or hold; read the full audit trail. |
| Admin | Editor capabilities plus user-role administration performed through the Supabase control plane in Phase 4. |

There is no public registration and no in-app role elevation.

## Workflow

`draft → submitted → in_review → revision_requested → submitted`

An editor may move `submitted` or `in_review` to `accepted`, `declined` or `hold`. A contributor may withdraw a draft, submitted item or revision. Terminal decisions are not silently overwritten; a later change requires a new explicit decision and audit event.

## Submission record

Each submission stores:

- format, territory, title and bounded statement;
- full contribution text, evidence basis and limitations;
- contributor credit and contribution roles;
- one or more sources, including what each source supports and does not support;
- funding, conflicts/commercial interests and material AI assistance;
- explicit permission state for any future confidential AI processing;
- revision number, current status and timestamps;
- editor-only review notes and checklist;
- contributor-visible decisions and next steps; and
- append-only audit events.

## Trust rules

- No auto-save claim unless a successful database write has occurred.
- Every save, submission and decision produces visible and accessible status feedback.
- A contributor can leave and resume a draft without penalty.
- Editors cannot describe internal review as peer review.
- The interface never implies that submission guarantees review, acceptance or publication.
- Delete is not part of the Phase 4 editorial workflow. Withdrawal preserves the record and audit trail; statutory deletion requests use the governed contact process.

## Phase 4 acceptance gate

Phase 4 is implementation-complete only when:

1. unauthenticated visitors cannot access workspace data;
2. an authenticated but unlisted user has no access;
3. contributors cannot read or mutate another contributor's records;
4. contributors cannot promote their own status or read editor-private notes;
5. editors can review and decide only through authenticated, validated actions;
6. every state transition creates an immutable audit event;
7. accepted work remains private and unpublished;
8. keyboard, mobile, focus, error, empty and success states work; and
9. the schema passes Supabase security advisors before an invited pilot.
