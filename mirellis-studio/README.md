# Mirellis Studio

Private contributor and editor workspace for Evidence Notes and Expert Commentary.

Phase 5 runs on dedicated free development infrastructure and a protected Vercel preview. It is intentionally not connected to the live Mirellis site, `studio.mirellis.in` or Shopify.

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

Copy `.env.example` to `.env.local` for local work. Never commit `.env.local` or place a Supabase secret/service-role key in this app.

## Dedicated Supabase setup

Development project: `mirellis-studio-dev` (`cunxljvxlrnfutdcxxhc`), Supabase Free, Mumbai.

For a new environment:

1. Use Node.js 22 or later.
2. Link the local `supabase` folder to the dedicated project.
3. Review and apply all migrations in `supabase/migrations` to development first.
4. Run Supabase database and security advisors; resolve every security finding before a pilot.
5. In Auth URL Configuration, set the development Site URL and add a bounded `/auth/confirm` preview callback. The client callback supports Supabase implicit, PKCE and token-hash email links.
6. Supabase's default mail service is adequate only for a small internal pilot and is rate-limited. Add custom SMTP only when the project can accept a paid dependency or already owns a suitable service.
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

## Phase 5 pilot result

Completed:

- separate contributor and editor identities provisioned through the trusted control plane;
- full contributor-to-editor database workflow completed under real authenticated roles;
- anonymous, cross-role, private-note, restricted-column and rejected-transition boundaries passed;
- real contributor one-time-link login reached the protected preview workspace;
- accepted content remained unpublished and absent from Shopify; and
- build, lint, static contract and dependency-audit gates passed.

Still required before any `studio.mirellis.in` DNS or public navigation change:

- repeat the editor email-link journey after the default-mail rate window resets;
- complete a human keyboard and screen-reader walkthrough across both authenticated roles;
- decide whether to add custom SMTP for a larger invitation volume; and
- obtain explicit launch approval.

Known Free-plan constraint: Supabase leaked-password protection is a paid-plan feature. The Studio does not ask for a password, disables public sign-up and uses one-time links, so this warning does not block the private pilot.
