# Mirellis Phase 0 — implementation review

Date: 13 August 2026  
Environment: local development branch only  
Production status: not deployed; no live theme, Shopify Admin redirect or Vercel production change was made.

## Workstream 1 — public trust and URL governance

### What changed

- Added a canonical/noindex governance snippet to the Shopify layout.
- Added 37 proposed redirect rows covering obvious duplicates, prototype routes, typo pages, obsolete static Personal Observatory pages and PageFly copies.
- Added a reversible `noindex,follow` safeguard for those sources before redirects are approved in Shopify Admin.
- Added the same temporary safeguard for the 33 known high-risk legacy article handles.
- Added a reusable public-claim scanner and generated a 65-row review register.

### Before / after

- **Before:** duplicate and prototype URLs remained parallel indexable `200` pages.
- **After in development:** one canonical target is declared and known sources are protected with `noindex,follow`; live redirects remain proposed until reviewed.
- **Before:** legacy claim risk existed only as an audit observation.
- **After:** every current article URL has a review row; 1 title is critical and 25 are high-risk in metadata triage, while all 65 still require human body-copy review.

### State logic

No content is silently deleted or redirected by theme code. Shopify Admin redirects remain a separate reviewed action. The safeguard is reversible and does not claim a metadata-only scan approved article copy.

### Evidence

- Phase 0 validation: passed.
- Shopify Theme Check: passed.
- Full public page-body crawl: pending; the network approval service timed out twice, so the generated register is explicitly labelled metadata-only.

## Workstream 2 — consent-safe pathway measurement

### What changed

- Expanded the existing Shopify-consented analytics loader into a governed event contract.
- Added 14 public website event definitions across Today, After Work, the Evidence Register, product decision, add-to-cart and newsletter submission.
- Added public enum context such as `work`, `unfinished` or record number—never form text or private app data.
- Added consent-aware visibility events for the Evidence Register and product decision area.
- Documented the decision dashboard and explicit exclusions.

### Before / after

- **Before:** only a few click names and `page_path` were emitted.
- **After in development:** a visitor's chosen public pathway can be read without a cross-domain ID, private answers, app records, email values or hidden state inference.
- **Before:** newsletter and key decision views were absent from the custom pathway.
- **After:** submission intent and 50%-visible governed sections are represented after Shopify consent.

### State logic

The app continues to say “Analytics are not active in this build.” No app event, localStorage value, free text, reminder time or outcome is transmitted. Website analytics starts only when Shopify's customer privacy API permits analytics processing.

### Evidence

- Event contract validation: passed, 14/14 events represented.
- Email/private-data exclusion check: passed.
- Browser consent interaction: pending because local browser access was denied by environment policy.

## Workstream 3 — app release and privacy alignment

### What changed

- Added one authoritative August 2026 release-candidate record for the immediate After Work route plus optional 21-day programme.
- Reconciled the earlier 8–10-minute prototype pack without discarding its privacy, pilot, distinct-route or optional-media boundaries.
- Assigned release, product, editorial, privacy, support, accessibility, incident, pause and rollback ownership for the controlled pilot.
- Kept launch status `preflight` until human accessibility, qualitative pilot, commerce operations and curriculum evidence pass.
- Added a real private-record JSON download that sends nothing to Mirellis.
- Strengthened the delete confirmation into an `aria-modal` alert dialog with focus trapping, Escape cancellation and focus restoration.
- Expanded visible focus treatment to links, buttons, inputs, textareas and selects.

### Before / after copy

- **Before:** “Analytics are not active in this build.”  
  **After:** preserved exactly.
- **Before:** the private record could be read and deleted locally but not exported.  
  **After:** “Download my private record” with “Downloads a JSON file to this device. Nothing is sent to Mirellis.”
- **Before:** operational roles were explicitly unassigned.  
  **After:** the controlled pilot has named ownership and `contact@lambdalifestyle.com` support, without pretending validation is complete.

### State logic

Certification is derived from evidence. It cannot be changed to `certified` while a required release-evidence row remains pending. Export contains only the supplied completed-day records and selected actions. Cancelled deletion changes no data; confirmed deletion clears both programme and unfinished-draft keys.

### Evidence

- Existing unit suite: 21/21 passed after release-gate changes.
- Two deterministic private-export tests were added; final expanded rerun was blocked by the platform usage limit.
- TypeScript after all changes: passed.
- Next.js 16.3 production build after all changes: passed; six static routes generated.
- React quality review: no server/client boundary, async-waterfall or bundle issue introduced; localStorage remains versioned and minimal.

## Workstream 4 — launch evidence system

### What changed

- Added a human accessibility matrix covering mobile, keyboard, screen reader, text scaling, reduced motion, all four immediate routes, Day 1, resume, export and deletion.
- Added a commerce operations matrix for product, cart, checkout, payment, shipping, email, fulfilment, refund and attribution.
- Added the 8–12-person pilot protocol and decision record.

### Current gate status

| Gate | Status |
| --- | --- |
| Canonical URL and claim governance implementation | Development-ready |
| Consent-safe website event contract | Development-ready |
| App type and production build | Passed |
| Shopify Theme Check | Passed |
| Human accessibility record | Pending |
| Interactive local browser verification | Blocked by environment policy; not counted as pass |
| Expanded 23-test app suite | Final rerun pending due platform usage limit |
| 8–12-person qualitative pilot | Pending |
| Commerce operations evidence | Pending |
| Production deployment approval | Not requested yet |

## Deployment recommendation

Do not deploy this package directly to production yet.

First review and approve:

1. the 37 redirect targets;
2. the temporary noindex article list;
3. the named controlled-pilot operational assignments;
4. the consent-safe event taxonomy;
5. the human accessibility and commerce test execution plan.

After approval, deploy to a Shopify development theme and Vercel preview, run the blocked interactive matrix there, close the remaining evidence rows, and return one final production go/no-go record.

## Commit status

The work is organised into small file-level workstreams, but the environment would not permit writing the Git index after the platform reported its usage limit. No commit or push is claimed. The working-tree changes remain intact for review.
