# Mirellis Authority Infrastructure — execution register

Started: 19 August 2026

Working branch: `codex/mirellis-authority-infrastructure`

Deployment rule: development theme first; live publication requires an explicit approval after verification.

## Phase 0 — estate and governance baseline

Status: complete locally.

- Existing public architecture, claim register, redirect register and measurement contract were preserved.
- Phase 0 validation passes with 37 proposed redirects, 65 claim records and 14 governed website events.
- The working tree contained substantial pre-existing changes and untracked theme files. They remain protected; authority work is limited to named files and phase-specific validation.
- The live-site audit found three parallel public models: Sleep/Focus/Restoration, three institutional transitions and the four-moment app. Phase 2 must resolve their public relationship without inventing new services.
- Existing redirects remain proposed. No Shopify Admin redirect has been imported.
- Existing raw-observation infrastructure remains separate from the future editorial-contributor system.

## Phase 1 — trust repair

Status: complete on development theme `144948297794`; not live.

Changes:

- Contact page now leads with Mirellis, names the legal operator and removes the residential-address presentation.
- Contact page heading is a semantic `h1`.
- Global Organization schema now uses current Mirellis scope and current theme social settings instead of stale Shopify brand copy.
- Global schema no longer emits the legacy Lambda logo, strips tracking parameters from social profiles and keeps search actions on the canonical domain.
- Article breadcrumb schema now names the article rather than repeating the blog title.
- Duplicate homepage Organization/WebSite schema was removed.
- Homepage app language now reflects the four visible moments instead of calling the entire app “After Work”.
- The footer corrects the legacy “After Work” menu label to “Mirellis app” without mutating Shopify navigation data.
- The logo no longer creates a second homepage `h1`; each page owns its primary heading.
- Homepage headline scale and mid-width header layout were constrained to prevent clipping.

Verification evidence:

- Phase-specific automated validation passes.
- Phase 0 governance validation continues to pass.
- Homepage rendered without horizontal overflow at 390, 768, 1280 and 1440 CSS pixels.
- At 390px the brand, menu, search and cart remain visible and the problem choices reflow into one column.
- At 1280px the complete header remains inside the viewport and the primary choices remain visible in the first screen.
- Homepage and contact page each expose exactly one level-one heading.
- Contact form reflows to a single column at 390px without horizontal overflow.
- Rendered JSON-LD parses successfully; canonical search target, legal operator, current scope and clean social URLs were confirmed.
- The repository-wide Shopify Theme Check still reports inherited errors in legacy sections, including missing image dimensions. Phase 2 must separate active canonical templates from dormant legacy debt before a global clean-check gate is meaningful.

Still required before live deployment:

- Keyboard-only interaction and visible-focus walkthrough.
- Contact-form delivery, success and server-error-state test with a non-production address.
- External Schema.org/Google Rich Results validation of the share preview.
- Explicit approval to publish the Phase 1 theme changes.

Development synchronization note: Shopify reported remote/local differences in several auto-generated JSON templates and retained the development theme's remote settings during reconciliation. The Phase 1 contact template was reapplied and verified afterward. No unrelated synchronized file is included in the Phase 1 commit.

## Phase 2 — canonical public architecture

Status: complete on development theme `144948297794`; not live.

Changes:

- One governed navigation source now drives the desktop header, mobile drawer and footer: Start here, Observatory, Get help, Contribute and About, with Rituals deliberately subordinate.
- The public model now distinguishes three visitor problem doors (Sleep, Focus, Restoration), three Observatory territories (Sleep → Wakefulness, Work → Recovery, Stimulation → Restoration) and four app moments (Waking, Focus, After Work, Night). These are related layers, not competing taxonomies.
- The Observatory is consolidated into one orientation followed by one public evidence register. Duplicate article, subscription, hub and community sections are suppressed on the assigned page template.
- Contribute now lands on an honest invited-pilot gateway. It names the two planned editorial formats, required disclosures and editorial review boundary; nothing is presented as self-publishing or automatically accepted.
- The homepage uncertainty route now uses the canonical Get help URL, and the storefront account control is labelled “Shop account” instead of the ambiguous “Login”.
- Header controls and mobile navigation links have a 44 × 44 pixel minimum target and an explicit keyboard focus state; Rituals remains visually subordinate in desktop and mobile navigation.
- The redirect register now contains 40 unique development-only decisions, including legacy Observatory and community duplicates. Redirects have not been imported into Shopify.
- A route map, decision register and phase-specific automated validator record the architecture as code rather than relying on menu settings alone.

Verification evidence:

- Phase 2, Phase 1 and Phase 0 automated validation pass together.
- The development homepage renders the complete canonical navigation at 1280px without horizontal overflow.
- At 390px the mobile control remains in the viewport, exposes a 44 × 44 pixel target and the drawer contains all governed destinations in the intended order.
- The assigned Observatory page exposes one `h1`, then an `h2` evidence register, and no duplicate subscription, article, hub or community module.
- The Contribute anchor resolves to the contact gateway, preserves one `h1`, exposes a bounded inquiry selector and remains within the mobile viewport.
- All six governed destinations were opened on the development theme and returned usable page content.

Still required before live deployment:

- Shopify redirect import remains withheld until live-publication approval.
- Contribution remains an editorial-contact gateway; authenticated contributor workflows begin in Phase 4.
- Phase 3 must make the public records independently citation-ready and define editorial review policy before outreach begins.

## Later phases

- Phase 3: citation-ready records and public editorial governance.
- Phase 4: authenticated contributor/editor studio.
- Phase 5: security, accessibility and invited-contributor pilot.
- Phase 6: outreach campaign infrastructure.
