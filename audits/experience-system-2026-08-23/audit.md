# Mirellis Experience-System Audit

Date: 23 August 2026  
Scope: `mirellis.in`, the public directory and guidance experience, commerce, and `app.mirellis.in`  
Change status: Audit only. No live or source changes were made during this review.

## Executive verdict

The user's diagnosis is correct. Mirellis is structurally coherent and the language is generally calm, but most public surfaces are visually underbuilt. The dominant grammar is a warm blank canvas, a heading, explanatory copy, thin bordered cards, and buttons. Repeating that grammar across discovery, guidance, editorial, institutional, and app workflows makes the system feel like a document or questionnaire rather than a living product.

This is not primarily a colour or animation problem. It is a visual storytelling, composition, interaction-state, and cross-product system problem. Adding decorative gradients or motion to the current templates would not solve it.

Overall visual/experience maturity: approximately 3/10. The product-detail experience is the strongest existing reference at approximately 7/10; the check-in, archives, and app are approximately 2–4/10.

## What was audited

- Shopify: 113 templates, including the homepage, domain pages, institutional/editorial routes, collections, and products.
- Directory/guidance application: 51 `page.tsx` routes, including public guidance, concern, article, search, specialist, retreat, and institutional families. Private administration was excluded.
- Mirellis app: three top-level routes and the major Today, question, recommendation, practice, completion, record, settings, help, and after-work states.
- Shared headers, footers, token files, typography, motion, and image usage across all three systems.
- Representative desktop captures for each public template family.

The audit covers every public template family rather than claiming that all 160+ individual URLs were manually screenshot-tested.

## Existing strengths to preserve

- The warm-neutral palette, quiet pacing, and calm copy are recognizably Mirellis.
- The brand already has useful typography, spacing, colour, and motion tokens.
- The Shopify product page proves the brand can feel editorial, premium, and sensory when original photography is allowed to lead.
- The site already contains a substantial library of original images covering transitions, rituals, environments, products, and institutional storytelling.
- The route architecture is broad enough to support discovery, guidance, professionals, research, commerce, and the app.
- The app's privacy posture and avoidance of pressure mechanics should remain intact.

## Root causes

### 1. The intended design system exists but is not expressed

The Website Experience System specifies original threshold photography, atmospheric depth, meaningful diagrams, generous spacing, and restrained motion. Current canonical pages mostly render text, pale backgrounds, and bordered lists instead.

### 2. The homepage's photographic hero is configured but empty

The homepage section supports a `hero_image`, but the active homepage template passes no image setting. The component therefore falls back to a CSS concentric-circle signal field. This is the concrete reason the homepage opens without a meaningful visual scene.

### 3. Rich assets were disconnected from canonical routes

Existing Shopify data references many original assets, including transition, ritual, overstimulation, environment-science, closing, product, and About imagery. The current one-section problem-first homepage and text-led page templates do not use them.

### 4. Separate products use separate visual dialects

Shopify, the directory, and the app each have their own CSS system. Their brand marks and warm colours overlap, but their container widths, headers, type scales, cards, borders, responsive behaviour, and interaction states are not governed by one shared specification.

### 5. Page types are not visually differentiated

A concern archive, an About page, a practitioner search, an article archive, and an app question should not feel like the same cream document with different text. Each needs a purposeful composition while inheriting the same brand system.

## Journey review

1. **Homepage — weak**

   The hierarchy is understandable, but the first viewport is dominated by empty cream space and a decorative signal diagram. The page does not create an emotional or sensory entry into sleep, focus, or restoration. The hero's existing image slot should use an original threshold scene, with a controlled overlay and clear route cues.

2. **Sleep, Focus, and Restoration gateways — weak**

   These pages currently behave like large introductions. They need distinct state palettes, original photography, a visual map of common lived moments, evidence/status cues, and direct paths into guidance, professionals, articles, practices, and instruments.

3. **Guided check-in — critical**

   A narrow column, progress marks, and stacked white answer boxes make the experience strongly resemble a Google Form. It needs a recognitional interaction: one question at a time, semantic state colour, supportive illustration or atmospheric media, visible consequences, strong selection feedback, and smooth state transitions without becoming clinical theatre.

4. **Concern and editorial archives — weak**

   Long stacks of bordered text rows provide coverage but no reason to explore. Archives need visual taxonomy, filters, representative imagery, card hierarchy, reading-time/evidence metadata where truthful, and curated entry points. Detail pages need editorial rhythm, diagrams or evidence modules when useful, and clear next-step rails.

5. **Directory search and professional detail — weak**

   Search currently reads as an input plus a list. It needs rich, trustworthy result cards, visible credentials and verification state, concern/specialism matching, location/online availability, meaningful filters, save/compare only if real, and a clear route from guidance to a suitable professional. Trust information should be visually legible rather than buried in copy.

6. **Institutional, Method, and About pages — weak**

   The content is credible but presented as large text on empty canvases. These pages should use original process imagery, a restrained research-diagram grammar, finding cards, evidence-status modules, timelines, people/process scenes, and citations without becoming a consultancy deck.

7. **Commerce — strongest current surface**

   The product-detail page uses substantial original photography, confident scale, and editorial typography. It is the best existing visual reference. The redesign should extend this photographic confidence to the rest of Mirellis while keeping support and research pages non-commercial.

8. **Mirellis app — weak**

   The app is functionally a branching form engine presented in a tasteful shell. It needs to become a moment-specific practice environment: visual state changes, a clear sense of progress through an action, more embodied/off-screen instructions, accessible feedback, optional sound only when purposeful, and a coherent return state. It should not add scores, streaks, mascots, pressure, or fake personalisation.

## Proposed design direction: Living Ritual Science

The target is not a generic wellness site and not a research document. It is a calm, sensory, evidence-accountable institution whose visual system changes meaningfully with the person's state.

### Visual foundations

- Keep warm paper and charcoal as the primary canvas and ink.
- Introduce semantic state families rather than random decoration:
  - Sleep: deep indigo and night slate.
  - Focus: forest and restrained teal.
  - Restoration: clay, rust, and muted mineral tones.
  - Waking/readiness: amber and soft daylight gold.
- Use colour to communicate state, route, and feedback—not to fill every surface.
- Use one global spacing, radius, button, card, icon, focus, and type system across Shopify, directory, and app.

### Photography and media

- Use Mirellis-owned original photography only for public lifestyle/story scenes.
- Build a reusable image grammar: threshold light, tactile surface, partial human presence, and deliberate negative space.
- Give each major page one dominant visual moment and supporting editorial media; do not create image clutter.
- Use product photography only where instruments are contextually relevant.
- No autoplay video. Short user-initiated films or audio may be introduced only where they materially support understanding or practice.

### Illustration and data

- Use quiet diagrams for transitions, mechanisms, evidence, and route relationships.
- Avoid decorative charts, fake dashboards, or pseudo-scientific biometrics.
- Findings and evidence status should be reusable, data-driven components.

### Motion

- Restrained fades, reveals, light shifts, and state transitions in roughly 200–600 ms.
- No parallax, scroll-jacking, bouncing, hover zoom, or ambient autoplay.
- Full reduced-motion support.

## Reusable template families to redesign

The correct implementation is not 160 unrelated page redesigns. It is a shared system applied to these canonical families:

1. Global header, navigation, footer, favicon, and page shell.
2. Homepage.
3. Sleep/Focus/Restoration domain gateway.
4. Guided concern navigator/check-in.
5. Concern/article/finding detail.
6. Concern/article/finding archive.
7. Directory search/results.
8. Practitioner/retreat/profile detail.
9. Institutional/About/Method/Observatory.
10. Commerce collection/product.
11. App Today/home.
12. App question/recommendation/practice/completion/record/settings.

## Recommended build sequence

### Phase 0 — visual direction before code

Create three high-fidelity reference experiences in desktop and mobile:

1. Homepage and domain entry.
2. Guided concern-to-professional journey.
3. App Today-to-practice journey.

Approve one coherent direction, then freeze tokens, photography rules, component anatomy, and motion principles.

### Phase 1 — one cross-product foundation

Implement shared design tokens and specifications for layout, typography, buttons, cards, form controls, imagery, focus states, motion, and headers. Rebuild the global shell in all three codebases.

### Phase 2 — acquisition and orientation

Rebuild the homepage and three domain gateways. Connect existing original assets. Make the first 30 seconds explain what Mirellis helps with and make the next action visually obvious.

### Phase 3 — guidance and directory

Rebuild the check-in, concern/archive/detail, directory search, results, and profiles as a seamless route from recognition to appropriate help.

### Phase 4 — app experience

Redesign Today, diagnostic questions, recommendations, practice, completion, record, and settings around moment-specific visual states and explicit actions. Preserve local privacy and no-pressure principles.

### Phase 5 — editorial, Observatory, institutional, and commerce integration

Apply the system to articles, findings, Method/About pages, collections, and product detail. Add contextual cross-links without turning every page into a sales funnel.

### Phase 6 — quality and rollout

Test representative templates at mobile, tablet, laptop, and wide desktop; keyboard-only use; visible focus; contrast; screen readers; reduced motion; image performance; cumulative layout shift; and route continuity. Roll out family by family with preview approval before production.

## Accessibility and responsive risks

- Sparse pages can still have weak contrast, ambiguous hierarchy, and excessive line lengths.
- Answer cards and directory filters need persistent selected/focus states, not colour alone.
- Motion must have a reduced-motion equivalent and never block task completion.
- Imagery needs meaningful alt text or empty alt text when decorative.
- Interactive targets must remain at least 44×44 px.
- Sticky headers, bottom navigation, and safe-area spacing must be reconciled between website and app.
- Fresh mobile screenshots could not be completed in this audit because the current browser-control environment blocked viewport navigation under its security policy. Mobile verification is therefore an explicit implementation gate, not a claimed pass.

## Tools and platform decision

No new plugin is required to begin. Shopify, the existing Next/Vercel applications, and the current asset library are sufficient for implementation. Figma would be useful as the visual approval and component-spec board. Gamma is suitable for presentations, not for designing or governing the production interface.

## Evidence captures

- `01-home-desktop.jpg` — homepage.
- `02-sleep-desktop.jpg` — domain gateway.
- `05-check-desktop.jpg` — guided check-in.
- `06-concerns-desktop.jpg` — concern archive.
- `08-find-desktop.jpg` — directory search.
- `09-articles-desktop.jpg` — editorial archive.
- `10-about-desktop.jpg` — institutional page.
- `11-product-desktop.jpg` — strongest existing product-detail reference.
- `12-app-desktop.jpg` — app Today experience.

## Decision requested

Approve Phase 0 only: three visual direction prototypes, with no production code or live deployment. The chosen direction should then govern the full cross-product build.
