# Unified V1 + V2 — Phase 0 repository and data audit

Date: 19 August 2026  
Branch: `codex/unified-v1-v2-build`

## Canonical product model

The launch consumer model contains four familiar moments:

1. Getting going after waking.
2. Beginning or holding focus.
3. Leaving work behind.
4. Stopping for sleep.

The locked V1 curriculum still contains four internal transitions: Sleep → Wakefulness, Wakefulness → Readiness, Readiness → Focus, and Focus → Recovery. Night Audit is a V2 cross-cutting capability connected to sleep and restoration. It is not represented as a fifth V1 transition.

## Repository state found

- Next.js App Router application using a server `app/page.tsx` wrapper and client product components.
- The live root currently renders `AfterWorkApp`.
- The complete 21-session After Work programme is also available at `/after-work`.
- `AfterWorkApp` stores progress under `mirellis-after-work-v2` and unfinished drafts under `mirellis-after-work-draft-v2` in `localStorage`.
- The earlier transition prototype stores structured application state in IndexedDB database `mirellis-transition-v1`.
- No account, Supabase dependency, AI dependency, subscription, active analytics, or server-held personal record exists in the current build.
- PWA registration, a manifest and a network-first service worker already exist.

## Launch migration decision

The unified application uses a new, versioned localStorage key: `mirellis-unified-v1-v2`.

Legacy keys and the IndexedDB database are not overwritten or deleted during migration. The 21-session programme remains at `/after-work` and continues reading its existing keys. This creates a rollback-compatible, dual-read release:

- Rolling the root route back restores the existing After Work product without data conversion.
- A person who opens the 21-day programme after using the unified app sees their previous programme progress.
- Unified records may link to the After Work programme, but they do not claim to import or reinterpret legacy answers.
- Only an explicit, confirmed “delete all local Mirellis data” operation may remove both unified and legacy data.

## Consumer route contract

| Route | Launch responsibility |
| --- | --- |
| `/` | Unified four-moment companion, experiments, private record, settings and help. |
| `/after-work` | Preserved optional 21-session After Work maintenance programme. |
| `/training` | Existing internal prototype; not linked from the unified consumer navigation. |

## Data boundary

The unified state stores only explicit answers, the current unfinished session, completed/saved records, experiment observations and user preferences. It must not store diagnoses, inferred traits, scores, free-text interpretations, raw analytics payloads or research participation by default.

## Rollback and release gates

1. All current tests pass before the root route changes.
2. New deterministic engine and migration tests pass.
3. Legacy After Work route loads and prior progress remains readable.
4. Unified root passes first-time, interruption/resume, every real branch, record, export, deletion cancel/confirm, keyboard, mobile and reduced-motion checks.
5. Night safety language requires clinical review before production promotion.
6. Production promotion remains separate from preview deployment.

