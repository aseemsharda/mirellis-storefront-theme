# Mirellis Studio

Private contributor and editor workspace for Evidence Notes and Expert Commentary.

Phase 4 is intentionally not connected to the live Mirellis site. The app builds locally and fails closed until a dedicated Supabase project is configured.

## What is implemented

- invitation-only passwordless sign-in (`shouldCreateUser: false`);
- profile allow-list with contributor, editor and admin roles;
- structured drafts, source-to-claim mapping and disclosures;
- explicit submit, in-review, revision, hold, accept, decline and withdraw states;
- editor-private checklist and notes stored separately from contributor-visible decisions;
- append-only submission state history;
- private document bucket policies;
- no public publishing action; and
- noindex/nofollow metadata.

## Local verification

```bash
npm install
npm run lint
npm run build
npm run validate:phase4
```

Copy `.env.example` to `.env.local` only when the dedicated development project exists.

## Dedicated Supabase setup

Do not reuse the current directory project. Create a separate development project, then:

1. Use Node.js 22 or later.
2. Link the local `supabase` folder to the dedicated project.
3. Review and apply the migration in `supabase/migrations` to development first.
4. Run Supabase database and security advisors; resolve every security finding before a pilot.
5. In Auth URL Configuration, set the development Site URL and add the exact `/auth/confirm` preview callback URL. Keep the supplied token-hash email templates; the server-side PKCE confirmation route depends on them.
6. Configure custom SMTP before inviting addresses outside the Supabase organization.
7. Disable open registration. The application also sets `shouldCreateUser: false`.
8. Invite a user through the trusted Supabase control plane.
9. After the auth user exists, provision the allow-list profile using its UUID:

```sql
insert into public.studio_profiles (user_id, display_name, role)
values ('AUTH-USER-UUID', 'Contributor name', 'contributor');
```

Use `editor` only for an accountable editor. Role elevation is not available through the app.

## Required environment variables

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

No Supabase secret/service-role key is used by this application.

## Pilot gate

Before a Vercel preview or any `studio.mirellis.in` DNS change:

- run two real invited accounts (one contributor, one editor);
- test cross-user access denial directly against the Data API;
- confirm contributors cannot read `editorial_reviews.private_notes`;
- confirm an authenticated user without `studio_profiles` reaches only Access Pending;
- test every state transition and every rejected transition;
- test expired links, sign-out and session refresh;
- test mobile, keyboard, reduced motion, error and empty states; and
- confirm an accepted item is still absent from the public Shopify site.
