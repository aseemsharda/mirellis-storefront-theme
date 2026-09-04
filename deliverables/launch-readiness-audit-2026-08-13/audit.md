# Mirellis Launch, Revenue & Future-Readiness Audit

**Audit date:** 13 August 2026  
**Scope:** live Shopify website at `mirellis.in`, live app at `app.mirellis.in`, public discovery surface, repository architecture, launch governance, acquisition, retention, measurement and monetisation readiness.  
**Change status:** review only. No live theme, application or deployment was changed during this audit.

## Executive verdict

Mirellis is not perfect, mastered, final, or ready for unrestricted user acquisition. It is ready for a controlled pilot and, after the P0 corrections below, a deliberate soft launch.

The current system is a credible front gate with one working first weapon:

- a distinctive institutional homepage;
- a problem-first Today router;
- a route-specific After Work experience that asks for a real-world action;
- a public evidence-register pattern;
- a strong product decision layer and functioning Shopify commerce;
- a calm, consistent visual identity.

It is not yet a castle because the roads, command room, supply lines and defensive governance are incomplete:

- acquisition is not built as a repeatable engine;
- retention is possible but not proven;
- legacy pages and articles contradict the new bounded-claim system;
- the app is explicitly still `preflight` in its own governance source;
- operational ownership and human accessibility verification remain pending;
- measurement does not yet connect discovery, action, return and revenue;
- only one product journey is deep enough to test.

**Overall system readiness: 5/10.** The visual and narrative foundation is much stronger than the commercial and operating system beneath it.

## Readiness scorecard

| Capability | Readiness | Evidence-based judgment |
| --- | ---: | --- |
| Brand and visual identity | 8/10 | Distinctive, warm, calm and consistent across the audited homepage and product route. |
| Category positioning | 7/10 | “Ritual Science” and Human State Transitions are legible; more canonical explanatory pages are needed. |
| Trust architecture | 6/10 | The new Evidence Register is strong, but the legacy corpus contains incompatible claims. |
| First-visit activation | 7/10 | Today asks a human problem and gives one recommendation. |
| Product depth | 5/10 | After Work is a real vertical slice, but it has not passed its own pilot and release gates. |
| Retention | 4/10 | Calendar reminders, local state and a private record can support return, but repeat use is unproven and cross-device continuity is absent. |
| Acquisition / SEO / AI discovery | 3/10 | Large index surface exists, but it is fragmented, weakly governed and not organised around canonical questions. |
| Commerce | 6/10 | Product explanation, pricing and checkout entry exist; profitable acquisition and pathway attribution are unproven. |
| Measurement and learning | 3/10 | Commerce events exist, but the full value journey is not instrumented or visible in one decision dashboard. |
| Operations and launch governance | 3/10 | The repository itself records pending people-owned operations, accessibility and curriculum approval. |
| Defensibility and leverage | 4/10 | Evidence objects and original media can become a moat, but the current archive is not yet a governed knowledge graph. |

## Audited live journey

All screenshots below were captured from the live product during this audit.

| Step | Screen | Health | What works | What remains |
| ---: | --- | --- | --- | --- |
| 1 | Homepage recognition | Healthy | Distinctive visual identity and a legible institutional proposition. | Needs a stronger measurable path from recognition to repeat value. |
| 2 | Today problem selection | Healthy | Problem-first, low cognitive load, one primary suggestion. | Needs pathway analytics and content coverage beyond the first deep route. |
| 3 | After Work entry | Healthy with validation gap | Four clear lived situations; no internal curriculum language. | Must be tested with target users without coaching. |
| 4 | Recommended real-world action | Healthy with validation gap | A situation-specific action replaces generic advice. | Confirmation still depends on self-report; the return loop has not been proven. |
| 5 | Observatory register | Early | Evidence statuses and limitations create a credible trust pattern. | Only a small register exists; dedicated structured data and editorial operations are missing. |
| 6 | Product entry | Healthy | Product is framed as an instrument, not a miracle cure. | Needs pathway-level attribution and post-purchase learning. |
| 7 | Product decision | Healthy | Formula, evidence boundary, price and purchase action are clear. | Checkout, fulfilment, refund and lifecycle email need recorded end-to-end testing. |
| 8 | Library | Early | Useful entry points to understanding, listening and verification. | Three cards are not yet a discovery, search or return engine. |

## The castle assessment

| Castle element | Mirellis today | Status |
| --- | --- | --- |
| Walls | Brand system, claim boundaries, Evidence Register | Built but breached by legacy content |
| Gate | Today problem router | Working |
| First weapon | After Work guided practice | Built, not field-tested |
| Treasury | Shopify product and checkout infrastructure | Working, not proven as a revenue engine |
| Library | Articles, findings, Spotify and films | Large but fragmented |
| Roads | Search, AI discovery, channel distribution and partnerships | Incomplete |
| Scouts | Analytics, research feedback and cohort insight | Incomplete |
| Supply lines | Email, reminders, return loops and customer lifecycle | Partial |
| Command room | Owners, dashboards, release gates and rollback | Incomplete |
| Moat | Proprietary governed observations linked to useful practices | Early |

Mirellis can take transactions today. It cannot yet generate revenue predictably. A payment rail is not a revenue engine; repeatable qualified acquisition, demonstrated value, return behaviour, conversion and margin are the engine.

## The chessboard assessment

The pieces exist, but they are not yet connected into campaigns. The required canonical loop is:

`Human question → canonical answer → Today recommendation → real-world action → optional film/sound/finding → chosen reminder or saved record → relevant instrument → return visit → governed learning`

Every page, film, playlist, finding and product should have a defined job inside that loop. Content that has no job should be consolidated, redirected, archived or explicitly retained as institutional reference.

## Material findings

### P0 — The new trust system and the old corpus contradict each other

The current public sitemap exposed 96 public pages, 65 articles, 49 metaobject pages, collections and products. At least 27 URLs were obvious duplicate, prototype, typo or legacy variants and representative checks returned `200`, meaning they remain public and indexable.

Of 65 article URLs, 33 used health- or mechanism-adjacent titles involving sleep, stress, cortisol, dopamine, nervous-system language, brain claims or similar territory. A representative legacy article used strong outcome and clinical-study language that does not match the current bounded-claim architecture.

**Required action:** create a URL-level keep / rewrite / merge / redirect / noindex register; review every claim-bearing article; redirect duplicates to one canonical source; do not buy traffic until this is complete.

### P0 — The app is not launch-certified by its own rules

`src/operations/launch.ts` reports `preflight` unless every gate is ready. The current source records these as pending:

- named curriculum approval and red-team evidence for active legacy experiences;
- named support contact, incident owner, pause authority, rollback owner and coverage plan;
- recorded human keyboard, screen-reader, contrast, touch-target, text-scaling and reduced-motion verification.

The After Work production pack also labels the experience a prototype/content specification rather than an approved production release. The live build and governance record therefore disagree about release status.

**Required action:** reconcile the production pack with the live flow, run the approved pilot, record the human gates and publish a release decision. Do not hide the discrepancy by changing a status flag without evidence.

### P0 — Revenue is enabled, but the revenue loop is not proven

Stillness and Morning Clarity can be purchased through Shopify. The audited Stillness journey explains the instrument well and presents price and add-to-cart clearly. There is no audited evidence yet that Mirellis can acquire a qualified visitor at a sustainable cost, help them reach value, earn a return visit and convert them with acceptable contribution margin.

**Required action:** select one first commercial loop, instrument it, run it with a small cohort and calculate conversion, cost, margin and repeat behaviour before scaling spend.

### P1 — Acquisition is an inventory, not a system

Mirellis has a sizeable content surface, YouTube, Spotify and other channels. The Library currently exposes only three broad doors. Search and AI discovery need one governed canonical page per important human question, connected to the relevant action, evidence and product relationship.

The current `/agents.md` is generic Shopify commerce guidance. It helps agents interact with the store but does not explain Mirellis as an institution or give a machine-readable map of its findings, practices and evidence boundaries.

**Required action:** build the knowledge graph and canonical query architecture before expanding the volume of content.

### P1 — Measurement stops between clicks

Shopify/Google commerce instrumentation is present and selected custom events exist for Today actions, resources, the After Work handoff, sound, Evidence Register opens and add-to-cart. The audited code did not show one complete decision view covering:

- problem selected;
- recommendation accepted;
- app route selected;
- external action reached and confirmed;
- reminder intentionally created;
- Day 2 / Day 7 return;
- optional resource opened;
- product journey and purchase attribution;
- newsletter success and return from email;
- pilot feedback linked only through explicit separate consent.

The app should remain local-first and must not send private authored notes. Measurement can cover anonymous product-state events or separate consented research without interpreting the person.

**Required action:** define the event contract, consent boundary, dashboard and decision cadence before launch.

### P1 — Retention mechanisms exist, but the return proposition is not demonstrated

The app can preserve local state and create a calendar reminder. The website has an Observatory newsletter form. The app does not use accounts or push notifications, which protects privacy but limits cross-device continuity.

**Required action:** prove one ethical return loop: a chosen calendar return, segmented email or a private saved practice. No streaks, guilt, artificial urgency or hidden engagement optimisation.

### P1 — Objective quality certification remains open

The live journey was visually inspected, but this audit did not obtain a valid mobile performance score and cannot certify screen-reader or real-device behaviour from source inspection alone. The app's own governance correctly marks human accessibility verification as pending.

**Required action:** run a recorded real-device, keyboard and screen-reader matrix plus performance testing under normal production conditions.

## Target architecture

### Consumer information architecture

Keep the public model small:

- **Today** — begin with the difficulty that is present now.
- **Library** — understand, watch or listen by moment and question.
- **Observatory** — inspect governed findings, evidence status and limits.
- **Shop** — choose instruments by transition, ritual and dossier relationship.
- **Private Record** — see only what the person explicitly saved locally.

Internal curriculum, IDs, evidence operations and lifecycle status remain behind the consumer layer.

### System layers

1. **Acquisition engine:** canonical search pages, films, playlists, newsletter, partnerships and AI-readable discovery.
2. **Problem router:** Today turns a lived statement into one honest next action.
3. **Practice engine:** bounded, situation-specific experiences that cause a useful real-world action.
4. **Knowledge and media graph:** articles, films, sound, findings and dossiers connected by structured relations.
5. **Trust system:** evidence status, claim level, limitations, owner, review date and change history.
6. **Commerce:** relevant instruments introduced after value, plus bundles or paid programs only after validation.
7. **Retention:** user-chosen reminders, segmented email, private saved records and lifecycle care.
8. **Learning system:** consented product events, qualitative pilots and public evidence updates—never private-note interpretation.
9. **Operations:** support, accessibility, privacy, editorial, incident, rollback and release ownership.

### Canonical content object

Every scalable content item should resolve these fields:

`moment`, `human_problem`, `user_question`, `recommended_action`, `practice`, `media`, `finding`, `evidence_status`, `claim_level`, `limitations`, `product_relationship`, `canonical_url`, `owner`, `review_date`, `next_action`.

This is the leverage layer. One governed object can power a problem page, Library card, film description, AI discovery record, newsletter segment, product context and Observatory cross-link without rewriting the claim six times.

## Commercial architecture

Build revenue in this order:

1. **Contextual DTC instruments.** Prove that relevant practices and findings create qualified product interest without turning the practice into an advert.
2. **A paid After Work program or product-plus-program bundle.** Only after the free pilot demonstrates recurring usefulness and willingness to return.
3. **Teams / employer After Work pilot.** A bounded workplace offering with clear privacy separation and no employee scoring.
4. **Hospitality and environment partnerships.** Transition-specific sensory or ritual instruments for hotels, workplaces and retreat settings.
5. **Curriculum, facilitation or licensing.** Later, after the method and evidence operations have demonstrated repeatability.

Do not build a generic college, course or wellness listing marketplace now. It would dilute the category before Mirellis has earned authority in its own transition system.

## Acquisition and distribution architecture

The website should own the canonical source. External channels should distribute fragments that return to the correct job:

- **Search and AI:** question-led canonical pages with explicit evidence and clear next actions.
- **YouTube:** original films answering one transition question and leading to one practice.
- **Spotify:** transition-specific listening environments linked as optional support, never proof of an outcome.
- **Newsletter/Substack:** a useful recurring Finding or practice with a chosen moment segment.
- **Medium and Pinterest:** adapted discovery assets that point to canonical Mirellis pages.
- **Partnerships:** aligned workplaces, hospitality operators and creators with one measurable pathway.

Start with ten high-intent After Work questions, not one hundred generic articles.

## Measurement architecture

**North-star event:** a person reaches and confirms one real-world transition action. Time on site is not the north star.

Measure four linked stages:

| Stage | Core measures |
| --- | --- |
| Acquire | Qualified organic visits, AI referrals, channel-to-question landing rate |
| Activate | Problem selected → recommendation accepted → practice started |
| Value and retain | External action reached, intentional reminder, Day 2 / Day 7 return, qualitative usefulness |
| Monetise | Relevant product view, add-to-cart, checkout, purchase, contribution margin and repeat purchase |

Trust has its own measures: stale records, claim corrections, review-date compliance, evidence-register opens and unresolved governance exceptions.

## Implementation sequence

### Phase 0 — Make the base safe and launchable (1–2 weeks)

1. Create the full URL and claim register; merge, redirect, noindex or rewrite legacy pages and articles.
2. Reconcile the live After Work experience with its production pack and launch-gate source.
3. Name support, incident, pause, rollback, editorial, privacy and accessibility owners.
4. Complete keyboard, screen-reader, real-device, reduced-motion and production-performance evidence.
5. Test newsletter, cart, checkout, payment, fulfilment, shipping, refund and transactional-email paths without relying on assumptions.
6. Define and implement the consented funnel event contract and one decision dashboard.
7. Run the After Work pilot with 8–12 suitable adults as already specified in the repository; collect feedback separately and with consent.

**Proposed decision thresholds for the first review**—working launch targets, not current evidence:

- at least 60% explain the product job without coaching;
- at least 50% complete the intended real-world action without interaction confusion;
- at least 30% intentionally choose a return mechanism or say they would use the route again;
- zero participants misunderstand what is stored, sent or inferred;
- no critical accessibility, privacy, claim or checkout defect remains open.

### Phase 1 — Build the launch machine (3–6 weeks)

1. Publish the first 25 governed canonical problem pages, starting with ten After Work questions.
2. Convert Library into a data-driven, filterable knowledge and media graph.
3. Add appropriate Article/CreativeWork, Video, Product, Organization and breadcrumb structured data only where the real content qualifies.
4. Create a Mirellis-specific machine-readable institution and content map in addition to Shopify's commerce agent guidance.
5. Implement Search Console, Bing Webmaster/IndexNow, sitemap monitoring and AI-referral reporting.
6. Build chosen email/calendar return journeys by transition, with explicit consent and clear exit.
7. Publish the first complete film/finding/practice pathway and measure it end to end.

### Phase 2 — Build the revenue engine (6–12 weeks)

1. Optimise one product pathway against contribution margin, not clicks.
2. Test one program or instrument bundle with existing qualified users.
3. Launch one small employer or hospitality pilot with defined privacy and success boundaries.
4. Add a second transition only after After Work passes the pilot and return gates.
5. Scale paid acquisition only when the pathway shows repeat value and acceptable economics.

## Launch decision

### What Mirellis can do now

- Recruit 8–12 high-fit pilot participants.
- Accept organic product purchases.
- Demonstrate its institutional thesis and first transition practice.
- Begin structured content and claim cleanup.

### What Mirellis should not do yet

- Declare the system finished or world-class.
- Run broad paid acquisition.
- Expand the app to many transitions before the first route is validated.
- Publish more ungoverned health-adjacent content.
- Treat traffic, time-on-site or clicks as evidence of human value.

### Soft-launch gate

Proceed to a public soft launch only when:

1. the P0 legacy claim and URL conflicts are controlled;
2. the app's governance state matches the live release;
3. operational owners and rollback are recorded;
4. accessibility and checkout evidence pass;
5. one complete funnel is visible in a dashboard;
6. the After Work pilot passes an explicit review decision.

### Scale gate

Hunt users at scale only when Mirellis can show, for one clear audience and one transition:

- qualified acquisition;
- understandable activation;
- a completed real-world action;
- voluntary return behaviour;
- conversion with viable margin;
- no unresolved trust or accessibility defect.

## Final answer

The architecture is directionally strong but not complete. The website is not yet a castle; it is a credible fortified gate and foundation. It is not yet a chessboard; it has valuable pieces without a complete operating game. It can build leverage now, provided the next work converts content sprawl into a governed graph and converts individual pages into one measured acquisition–value–return–revenue system.

The next deployment should be Phase 0, not another broad redesign.
