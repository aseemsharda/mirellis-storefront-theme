# Mirellis consent-safe measurement contract v1

Status: development candidate. Website measurement runs only after the visitor explicitly accepts analytics in the Shopify privacy banner (`currentVisitorConsent().analytics === "yes"`). Relying on `analyticsProcessingAllowed()` was not enough: it is true for any region the store does not configure to require consent, which on 17 October 2026 included India (DPDP audit, finding 3). App analytics remain inactive in this build.

## Product boundary

Mirellis measures whether the public system helps a visitor reach a useful next door. It does not measure or transmit private answers, free text, local practice records, reminder times, diagnoses, inferred states or Spotify listening.

## Website event contract

| Event | Fired when | Allowed context |
| --- | --- | --- |
| `today_problem_selected` | A visitor explicitly selects Morning, After work or Evening on Today | `morning`, `work`, `evening` |
| `today_action` | A visitor opens the one recommended action | selected public moment only |
| `today_resource` | A visitor opens the optional resource | selected public moment only |
| `after_work_problem_selected` | A visitor explicitly selects one After Work situation | route enum only |
| `after_work_action` | A visitor opens the private app from the Workday Exit page | route enum only |
| `after_work_programme_open` | A visitor opens the 21-day programme from its explanation | `work` |
| `after_work_sound` | A visitor opens the public Spotify playlist | route enum when available |
| `after_work_resource` | A visitor opens the guide, Finding or product | public resource enum only |
| `evidence_register_view` | At least half of the evidence register enters the viewport | `observatory` |
| `evidence_record_open` | A visitor opens a public evidence record | public record number only |
| `evidence_practice_open` | A visitor opens the related practice | public record number only |
| `product_decision_view` | At least half of the final product decision enters the viewport | product handle only |
| `product_add_to_cart` | The product form is submitted from the decision block | product handle only |
| `newsletter_submit` | A newsletter form is submitted | fixed form location only; never the email value |

Shopify's own commerce pixel remains the source for `view_item`, `add_to_cart`, checkout and purchase events. Mirellis custom events explain the governed pathway into commerce; they must not duplicate revenue reporting.

## Explicit exclusions

- No event from `app.mirellis.in` in this release.
- No localStorage contents, free text, calendar time, clipboard text or practice outcome.
- No cross-domain user ID.
- No fingerprinting, heat maps, session replay or behavioural profile.
- No event is evidence that a person changed state, listened, read, understood or benefited.

## Decision dashboard

Review weekly during the controlled pilot:

1. qualified landing page sessions;
2. Today problem selection and action-open rate;
3. After Work situation selection and app-open rate;
4. optional guide, sound and product-door opens;
5. product decision views, add-to-cart, checkout and purchase;
6. newsletter submission success;
7. separate, consented qualitative pilot evidence.

The dashboard must show counts and pathway conversion without declaring a person successful, recovered or improved.
