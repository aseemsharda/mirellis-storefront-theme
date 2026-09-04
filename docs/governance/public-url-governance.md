# Public URL governance — Phase 0

Status: development candidate; no redirect in this register may be imported into the live shop before review.

## Canonical territories

- Morning beginning: `/pages/sleep-to-wakefulness`
- Work ending: `/pages/work-to-recovery`
- Evening quieting: `/pages/stimulation-to-restoration`
- Observatory: `/pages/the-observatory`
- Private record: `https://app.mirellis.in/?view=record`
- About: `/pages/about`
- Method: `/pages/the-method`

## Rules

1. Every public subject has one canonical URL.
2. Obvious aliases, prototypes, typo routes and duplicate PageFly copies are redirected rather than left as parallel `200` pages.
3. A redirect must preserve the visitor's likely intent; uncertain pages remain in manual review rather than being guessed.
4. Claim-bearing articles marked critical or high by the generated scan require human source review. The scanner is triage, not approval.
5. A page is launch-safe only when its owner, claim level, evidence source, review date and next review date are recorded.
6. Shopify Admin redirects and content publishing are shop-level changes, not theme-level changes. The import file is therefore applied only after the development review.

## Development safeguards

The development theme includes `snippets/mirellis-public-governance.liquid`. Before the redirect import is approved, it gives known duplicate pages a canonical target and `noindex,follow`. It also places the highest-risk legacy article group behind a temporary `noindex,follow` safeguard.

This is deliberately reversible. Once a page is rewritten and approved, remove its handle from the safeguard and record the approval in the claim register.

## Required import order

1. Approve `url-redirects-phase-0.csv` row by row.
2. Create or verify every target URL.
3. Import redirects in Shopify Admin.
4. Deploy the theme safeguard.
5. Re-crawl the XML sitemaps and test every source and target.
6. Remove temporary noindex entries only after the corresponding human claim review.
