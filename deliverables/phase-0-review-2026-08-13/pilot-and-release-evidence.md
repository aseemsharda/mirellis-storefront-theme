# Mirellis Phase 0 — pilot and release evidence record

Status: development candidate. Empty evidence is deliberately marked pending; no checkbox may be completed from assumption or automated source inspection alone.

## Automated candidate evidence

| Check | Result | Evidence |
| --- | --- | --- |
| App unit tests | Baseline passed; final rerun pending | 21/21 passed before the private-export tests were added. The final expanded suite could not rerun because the execution approval service reported the account usage limit. TypeScript and production build passed after the new tests and export code were added. |
| TypeScript | Passed | `tsc --noEmit` |
| Next.js production build | Passed | 6 static pages generated; no type/build error |
| Shopify Theme Check | Passed | Command completed without a reported warning or error |
| Phase 0 governance validation | Passed | 37 proposed redirects, 65 claim records and 14 governed website events |
| Local interactive browser run | Blocked by environment policy | The local server built and started, but the in-app browser was not permitted to open `localhost`; this is not counted as a browser pass. |

## Human accessibility record

Supported minimum matrix:

| Surface | Device / browser / assistive technology | Owner | Result | Evidence link or note |
| --- | --- | --- | --- | --- |
| Homepage Today | iPhone Safari | Aseem Sharda | Pending |  |
| Workday Exit | Android Chrome | Aseem Sharda | Pending |  |
| After Work immediate route ×4 | Mobile Safari and Chrome | Aseem Sharda | Pending |  |
| Day 1 programme | Keyboard-only desktop | Aseem Sharda | Pending |  |
| Resume / private record / export | VoiceOver Safari | Aseem Sharda | Pending |  |
| Settings deletion cancel / Escape / confirm | NVDA or VoiceOver | Aseem Sharda | Pending |  |
| Entire app at 200% text | Supported mobile + desktop | Aseem Sharda | Pending |  |
| Reduced motion | Mobile + desktop | Aseem Sharda | Pending |  |

Critical acceptance:

- All interactive targets are at least 44 × 44 CSS pixels.
- Focus is visible and follows a logical order.
- Route, saved, export, reminder and deletion feedback is announced.
- The deletion dialog traps focus, closes with Escape, restores focus on cancel and requires explicit confirmation.
- No content or control is lost at 200% text or 320 CSS-pixel width.

## Commerce operations record

| Boundary | Result | Required evidence |
| --- | --- | --- |
| Product price, variant and availability | Pending | Product admin and storefront match |
| Add to cart | Pending | Correct product/variant enters cart |
| Checkout and payment methods | Pending | Test-mode or reversible test evidence; no unintended charge |
| Shipping promise and address coverage | Pending | India coverage, cost and delivery copy verified |
| Transactional email | Pending | Order confirmation content and sender verified |
| Fulfilment handoff | Pending | Named owner and operational steps |
| Refund/cancellation | Pending | Policy, support response and actual admin workflow verified |
| Analytics attribution | Pending | Consent, pathway event and Shopify purchase visible without private app data |

## Controlled After Work pilot

Recruit 8–12 adults who say leaving work is sometimes difficult. Test the product on their own devices without coaching the route.

For each participant, record only consented feedback outside the private app:

1. Could they explain what Mirellis offered within 30 seconds?
2. Which of the four situations did they choose, and did its action feel materially specific?
3. Did they reach and perform the real-world action without interface confusion?
4. Could they explain what the immediate practice, 21-day programme and calendar reminder each do?
5. Did they understand what remained only in their browser?
6. Did they choose to return or create a reminder? Why or why not?
7. What did they expect Mirellis to do next?
8. Did any language imply diagnosis, guaranteed change, pressure or judgment?

Do not collect private free-text answers, localStorage, exported records or medical information.

## Decision meeting

After the evidence exists, the release authority records one decision:

- **Continue:** all critical gates pass; controlled soft launch may be approved.
- **Revise:** name the failed boundary and smallest reversible correction.
- **Stop:** pause the route when safety, trust, comprehension or usefulness is not adequate.

No production deployment is authorised by this record alone.
