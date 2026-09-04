# Mirellis post-launch coherence audit

Date: 2026-08-22

## Scope

The audit followed the public journey from the homepage into concern-led education, the Journal, specialist discovery, the Mirellis app, About, and the product collection.

## Step health

1. **Homepage — healthy.** The problem-first entry, institutional framing, and routes to education and qualified help are coherent.
2. **Concern hub — healthy.** Visitors can start with a lived concern rather than a product or internal curriculum label.
3. **Understand and specialist discovery — healthy.** Educational and professional-help routes are visible and distinct.
4. **Journal — corrected.** The page title and orientation copy are visible again instead of being hidden by template CSS.
5. **Mirellis app Help — corrected.** Sleep, focus, and restoration routes now resolve to real directory filters. Urgent-help links use official Indian services.
6. **Shop — corrected.** The collection is framed as optional ritual instruments, includes a clear non-treatment boundary, and no longer exposes unnecessary filtering controls for two products.
7. **Public-claim governance — requires human review.** The register contains 65 articles: 39 metadata-clear, 25 high-priority, and 1 critical-priority record. Automated metadata triage is not a clinical review of article bodies.

## Verification

- App: TypeScript check passed; production build passed; 36 automated tests passed.
- Governance: 40 proposed redirects, 65 claim records, and 14 governed events validated.
- Production: the live Shopify theme and the production Vercel deployment were checked through their rendered DOM and key routes.
- Accessibility: visible structure and route labels were inspected, but this audit does not claim full WCAG compliance.

## Evidence limits

Baseline screenshots were captured and inspected for each audited surface. After deployment, browser screenshot capture timed out, so the final production state was verified structurally in the live DOM rather than accepted as new visual screenshot evidence.

## Rollback

The previous Shopify theme, `Mirellis Authority Release 2026-08-22` (`145250713666`), remains unpublished and available for rollback.
