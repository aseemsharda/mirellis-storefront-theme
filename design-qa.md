# Mirellis future-ready release design QA

Status: **PASSED**  
Release: 2026-08-12 / production candidate `144949641282` and Vercel deployment `dpl_BEaKhF1t6QAT6RchosLdUqXs7sb1`

## Reference comparison

The release was checked against the approved Mirellis visual references captured in `deliverables/future-readiness-audit-2026-08-12/`:

- `01-homepage.png` — warm editorial hero, Playfair/Inter hierarchy, restrained button scale and generous section rhythm.
- `04-observatory.png` and `05-observatory-claims.png` — Observatory editorial language and institutional visual tone.
- `06-product.png` — Stillness product photography, PDP rhythm and existing commerce controls.
- `07-app-handoff.png` — clear separation between the public site and private app.

No global visual redesign was introduced. New Today, Library, Private Record, evidence-register and product-decision elements reuse the established typography, warm-neutral palette, radii, border language, button dimensions and spacing system.

## Desktop and responsive checks

- Homepage Today selector renders one recommendation at a time and changes the visible result without navigating.
- Observatory renders three accountable records and filters them to morning, work or evening.
- Stillness keeps the approved product narrative and photography while adding a four-part decision summary immediately before purchase.
- New grids collapse to a single column at their defined mobile breakpoints.
- No horizontal overflow was observed in the release candidate.
- The existing mobile header and app header remain intact; no new competing navigation was added.

## Accessibility checks

- New buttons and links have a minimum 44px interactive height.
- Visible `:focus-visible` treatment is present for Today choices, evidence filters, links and app controls.
- Today and evidence-register changes announce through `aria-live="polite"` status regions.
- Selected filters and moment choices expose `aria-pressed`.
- Keyboard focus order follows DOM order and all new interactions use native buttons or links.
- Reduced-motion media queries suppress transitions and scrolling animation.
- The app Private Record deep link opens the genuine first-time empty state and does not announce a destination that is not visible.

## Functional evidence

- Shopify release-candidate browser checks: homepage Today choice and live status; Observatory record count and evening filter; product decision and safety copy; no captured console errors.
- App: TypeScript passed, 20/20 automated tests passed, and the Next.js production build passed.
- Public production HTML confirms the new homepage, Observatory register and product-decision copy.
- Vercel deployment is READY and production runtime errors are clear for the checked period.

## Known non-release issue

The repository-wide Shopify Theme Check still reports legacy warnings in older, unrelated theme files. Edited release schemas and JSON templates validate, and no release-blocking error was found in the changed surfaces.
