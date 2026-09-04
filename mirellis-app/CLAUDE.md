# Mirellis Transition App — Claude guide

Read [`AGENTS.md`](AGENTS.md) first. Its Next.js rules apply to every change.

## Purpose and release boundary

This is the private, local-first Mirellis web app at `https://app.mirellis.in`.
Its current supported product is **After Work**: a person identifies what is keeping work open, receives one small relevant action, and may choose an optional private 21-day practice.

The app is deliberately not a diagnosis, assessment score, behavioural profile, or generic self-improvement programme. It must not imply that it can treat illness, guarantee an outcome, or infer personal state.

The core boundary is important:

- No account is required for core use.
- Personal records live in the browser's IndexedDB only.
- A completed practice is a local record, not permission to advance a user through a hidden path.
- Analytics and research participation are separate controls and off by default.
- The user must always be able to choose another route or leave for today.
- An urgent route exits before any full experience.

Do not add remote persistence, tracking, user accounts, an engagement score, streaks, or personalisation inferred from private text without an explicit product, privacy, and technical decision.

## Quick start

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Before handing off a change, run:

```bash
npm run typecheck
npm test
npm run build
```

If the test runner is blocked from creating its temporary IPC socket by a sandbox, rerun the same test command in an environment that permits local temporary sockets. Do not change test behaviour to work around the sandbox.

## Routes and entry points

| Route | Purpose | Primary implementation |
| --- | --- | --- |
| `/` | Canonical After Work entry | `app/page.tsx` → `AfterWorkApp` |
| `/after-work` | Explicit After Work route | `app/after-work/page.tsx` → `AfterWorkApp` |
| `/training` | Internal training prototype | `app/training/page.tsx` → `TrainingPrototype` |

`app/layout.tsx` owns the public metadata, canonical domain, viewport settings, and PWA registration. `app/globals.css` is the global visual system.

## Code map

- `src/components/AfterWorkApp.tsx` — supported consumer experience and its view state.
- `src/components/TrainingPrototype.tsx` — separate prototype surface; do not present it as the supported After Work experience without an explicit release decision.
- `src/components/TransitionApp.tsx` — broader transition experience implementation.
- `src/lib/types.ts` — shared domain model and initial app data.
- `src/lib/local-store.ts` — IndexedDB storage, migration defaults, save, and delete behaviour.
- `src/lib/route-policy.ts` — route-selection and safety policy. Preserve its explicit evidence, expiry, exit, and alternative-route rules.
- `src/lib/route-engine.ts` and `src/lib/work-recovery-protocol.ts` — route and protocol logic.
- `src/lib/private-record-export.ts` — export is intentionally limited to explicit private programme records.
- `src/lib/*.test.ts`, `src/curriculum/stewardship.test.ts`, and `src/operations/launch.test.ts` — executable product, safety, content, and operational constraints.

When behaviour changes, start with the relevant tests and policy files before editing the UI. Keep the UI's language aligned with the product boundary above.

## Content and curriculum

`src/content/generated.ts` is checked-in generated content for seven transitions (105 experiences). **Do not edit it by hand.** `src/content/validate.ts` enforces that structure at runtime.

The generator is `scripts/generate-content.py`, but it currently references frozen source specifications at machine-specific paths outside this repository. Do not run `npm run content:generate` unless those source documents are available and the paths have been deliberately reviewed or made configurable. Any generated-content update needs a review of the source specs, the resulting diff, and the curriculum tests.

Useful supporting records:

- `docs/curriculum/README.md` — curriculum source notes.
- `docs/decisions/` — established product decisions.
- `docs/governance/` — release and curriculum governance.
- `docs/operations/launch-readiness.md` — what is in the build versus what still needs named human verification.
- `docs/operations/support-and-incident-playbook.md` — operating response guidance.

The app is a product candidate, not formally launch-certified. Do not change copy or documentation to imply that pilot, accessibility, operational, commerce, or review gates have been completed unless the underlying evidence exists.

## Visual and interaction principles

- Keep the experience calm, bounded, and action-first.
- Make one clear next action visible; avoid dense dashboards and gamification.
- Keep routes, states, actions, and exits explicit in the UI.
- Preserve keyboard access, visible focus, responsive layouts, and reduced-motion support.
- Preserve the distinction between a working observation, evidence, and a user’s own private record.

## Deployment

Vercel deploys this as project `mirellis-transition-app`; `vercel.json` declares a Next.js build using `npm run build`. The production domain is `app.mirellis.in`.

Do not deploy directly to production by default. Use a branch and preview deployment first, validate the relevant flow, and obtain explicit approval before a production deployment. Never commit `.env.local`, `.env*`, `.vercel/`, `node_modules/`, or `.next/`.

## Git workflow

The repository is private. Begin by checking the current branch and worktree:

```bash
git status --short --branch
git pull --ff-only origin main
git switch -c claude/<short-task-name>
```

Keep changes focused. Do not overwrite uncommitted work from another agent. Before committing, inspect the diff and run the relevant checks. Open a pull request for review; merge and production deployment require explicit human approval.

## How to work effectively in this repo

1. Read the route, policy, and tests closest to the requested change.
2. State any product or safety assumption that would broaden the request.
3. Implement the smallest coherent change.
4. Validate typecheck, tests, and build in proportion to the change.
5. Summarise user-visible impact, privacy/safety impact, validation, and remaining decisions.

If a task conflicts with the local-first, explicit-consent, or non-diagnostic boundary, stop and ask for product direction rather than quietly changing the model.
