# Phase 5 — Studio pilot evidence

Recorded: 19 August 2026

## Outcome

The Mirellis Studio now operates on dedicated, zero-cost development infrastructure. It is a protected preview for invited testing, not a public or production service.

## Infrastructure boundary

| Surface | Development state | Public state |
| --- | --- | --- |
| Supabase | `mirellis-studio-dev` / `cunxljvxlrnfutdcxxhc` / Mumbai / Free | No production Studio database |
| Vercel | `mirellis-studio` protected preview / Free | No production deployment or public alias |
| Domain | Vercel-generated preview hostname | `studio.mirellis.in` unchanged |
| Shopify | No Studio integration | Live storefront unchanged |

The previously unused Supabase ECOS project was permanently deleted after explicit owner approval. The Mirellis Directory and inactive Lambda projects were preserved.

## Database and authorization evidence

The development database contains the seven governed Studio tables, the private document bucket and their row-level security policies. Two follow-up migrations resolve advisor findings and remove hosted default API privileges.

The pilot exercised the following sequence under real authenticated database roles:

1. Contributor created a structured Evidence Note with source mapping and disclosures.
2. Contributor submitted the record.
3. Editor moved the record into review.
4. Editor saved a contributor-invisible private review.
5. Editor accepted the record and wrote a contributor-visible decision.
6. Contributor saw the accepted state, visible decision and four-event history.
7. The record remained unpublished and absent from Shopify.

Negative authorization tests passed:

- anonymous table reads denied;
- contributor decision inserts denied;
- contributor access to private review rows denied;
- contributor access to editor-only profile and decision fields denied; and
- contributor overwrite of submitted text denied by the state trigger.

## Authentication evidence

- Public sign-up is disabled in Supabase.
- The application uses `shouldCreateUser: false` and does not expose password entry.
- Known and unknown addresses receive the same on-screen response, preventing email enumeration.
- A real contributor one-time link completed through the protected Vercel preview and reached the workspace.
- The callback supports implicit, PKCE and token-hash Supabase links and removes link credentials from the address bar after processing.
- The current Supabase Site URL is the latest protected preview; a bounded Vercel-preview wildcard covers `/auth/confirm` callbacks.

The default Supabase mail service reached its small free-project rate limit during the pilot. A second editor login through email should be repeated after the window resets; the editor's role and full database workflow were verified independently. Custom SMTP is deferred to preserve the zero-cost constraint.

## Build and advisor evidence

All of the following pass in `mirellis-studio`:

- `npm run validate:phase4`
- `npm run lint`
- `npm run build`
- `npm audit --audit-level=moderate` — zero vulnerabilities

The final Supabase security advisor contains one warning: leaked-password protection is disabled. That feature is unavailable on Supabase Free. The pilot mitigates it by accepting no password in the product, disabling open registration and using one-time links.

The performance advisor contains only unused-index informational notices. These are expected before representative usage exists; removing the foreign-key and review-queue indexes now would be premature.

## Release boundary

Phase 5 does not authorize a production deployment, custom domain, Shopify navigation link or outreach. Before Phase 6, run the fresh editor email-link journey, complete the keyboard and screen-reader walkthrough under both roles and obtain explicit launch approval.
