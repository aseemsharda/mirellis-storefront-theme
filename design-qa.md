# Mirellis brand consistency — design QA

Date: 2026-08-22

## Scope

Standardize the supplied official Mirellis symbol and wordmark across the Shopify storefront, Mirellis Guidance/Directory, `app.mirellis.in`, and the private Contributor Studio. Replace generated or platform-default favicon/PWA artwork with the official Mirellis symbol.

## Sources of truth

- Official symbol: `5151_U_Mirellis_DV_PM_02.png`
- Official combined lockup: `5151_U_Mirellis_DV_PM_01.png`
- Official wordmark: `5151_U_Mirellis_DV_PM_03.png`
- Before reference — Guidance: user screenshot at 1998 × 1265
- Before reference — app: user screenshot at 1998 × 1265
- Consolidated before/after comparison: `audits/brand-consistency-2026-08-22/before-after.png`

The implementation uses mechanically trimmed and resized derivatives of the supplied files. The mark and lettering were not redrawn or reinterpreted.

## Comparison method

- Desktop implementation captures: 1440 × 900 browser viewport; displayed at 1280 × 720 by the browser capture service.
- Reference screenshots and implementation captures were normalized to 1280 px width and cropped from the top edge so header position, logo size, visual weight, and surrounding spacing could be compared directly.
- Focus surfaces: global header, footer brand, favicon declarations, Apple touch icon, and installable-app manifest icons.

## Review history

1. Replaced typed `Mirellis`/`MIRELLIS` header branding with the official symbol plus official wordmark.
2. Standardized responsive sizing and spacing rather than changing the supplied artwork.
3. Added the same lockup to the Guidance footer and Studio entry/error states.
4. Replaced Shopify, Next metadata, Apple touch, `.ico`, and PWA manifest icons with official-symbol derivatives.
5. Verified the lockup is visible on Shopify, Guidance, the private app, and Studio deployment previews.
6. Verified favicon links resolve to the new Mirellis assets in rendered page metadata; Shopify uses versioned theme assets and the apps use versioned brand paths plus generated `.ico` fallbacks.
7. Confirmed no horizontal overflow in the default browser viewport and retained explicit small-screen sizing rules for all lockups.
8. Promoted the verified builds to production and repeated the rendered-DOM check on `mirellis.in`, `mirellis.in/check`, `app.mirellis.in`, and the Studio production deployment.
9. Bumped the private app's service-worker cache and replaced its retired `/icon.svg` dependency so returning PWA users receive the official brand assets.

## Test evidence

- Guidance: ESLint and Next.js production build passed (510 generated pages).
- Private app: TypeScript, 36/36 product tests, and Next.js production build passed.
- Studio: ESLint, Phase 4 governance validation, and Next.js production build passed.
- Shopify: Authority Phase 2 validation passed. Theme Check still reports pre-existing theme-wide legacy image-dimension errors outside the logo/header files; no new brand-change error was introduced.
- Visual previews: `audits/brand-consistency-2026-08-22/directory-preview-desktop.png`, `app-preview-desktop.png`, `studio-preview-desktop.png`, and `shopify-home-preview-desktop.png`.
- Production asset checks: official logo image nodes were found on all four live surfaces; every requested PNG favicon and the PWA manifest returned HTTP 200 with the correct content type.
- Vercel runtime check: no runtime error clusters for Guidance, the private app, or Studio in the post-deployment window.

## Final assessment

The supplied official symbol and wordmark now form one consistent lockup across the required consumer and operational surfaces. Browser, Apple touch, and installable-app icons use the official symbol, eliminating Vercel/default branding from the implemented metadata and icon files.

## Image 2 sizing correction

- Exact visual reference: user-provided `Screenshot 2026-08-22 at 10.56.54 PM.png` (Image 2).
- Root cause: Shopify, Guidance, app and Studio used the same bitmap assets but four different CSS width systems.
- Canonical header lockup: 26 px symbol, 90 px wordmark, 8 px gap, intrinsic aspect ratios retained with `object-fit: contain`.
- Rendered preview measurements: Shopify home 26/90, Shopify products 26/90, Guidance 26/90, app 26/90 and Studio 26/90.
- Post-deployment live measurements: Shopify home 26/90, Shopify products 26/90, `mirellis.in/check` 26/90, `app.mirellis.in` 26/90 and Studio 26/90.
- The first `M` is visible on every corrected capture.
- Same-input visual comparison: `audits/logo-uniformity-2026-08-22/reference-comparison.png`.
- Full preview captures: `shopify-home.png`, `shopify-products.png`, `directory.png`, `app-reference.png`, and `studio.png` in the same audit directory.
- ESLint and production builds passed for Guidance, app and Studio; Shopify authority validation passed.

## Wordmark edge-integrity correction

- Exact visual reference: user-provided `Screenshot 2026-08-22 at 11.17.21 PM.png` (Image 2).
- Root cause: the supplied wordmark artwork reaches the first and last source pixels. Shopify's direct bitmap rendering therefore visually trimmed the outer strokes of the first `M` and final `S` at the 90 px display size.
- Correction: added a 1 px optical safety area at each horizontal edge through the Shopify image rendering box while preserving the same 90 px visible artwork width, 26 px symbol, 8 px visual gap, and 124 px total lockup width.
- Verified on the Shopify development theme at the homepage and `/collections/all`; both use the same global header component and retained the canonical 124 × 26 px lockup footprint.
- Shopify Authority Phase 2 validation passed.
- Same-input visual comparison: `audits/logo-edge-integrity-2026-08-22/reference-vs-shopify.jpg` (Image 2 reference on the left, corrected Shopify rendering on the right).
- Full corrected preview capture: `audits/logo-edge-integrity-2026-08-22/shopify-preview-home.png`.
- The first `M` and final `S` are fully visible in the corrected rendering.

## Responsive-system correction

- Source visual truth: `/var/folders/00/9g0t059x1910npgv0dzvlr200000gn/T/TemporaryItems/NSIRD_screencaptureui_4UE9Hj/Screenshot 2026-08-23 at 12.08.06 AM.png` (2880 × 1800 at 2× density; page region normalized to 1440 × 812).
- Implementations: `audits/responsive-system-2026-08-23/26-home-desktop-corrected.jpg` (1440 × 900), `31-about-desktop-live.jpg` (1440 × 900), `28-home-mobile-live.jpg` (390 × 844), and `32-about-mobile-live.jpg` (390 × 844), all captured at device scale factor 1.
- State: public, first-load homepage and About/Understand routes; closed and open navigation states were tested separately.
- Full-view same-input comparisons: `before-after-home-spacing.jpg` and `before-after-site-shell.jpg` (before on the left, corrected implementation on the right).
- Focused comparison: the homepage CTA/support-copy region remained readable in the full normalized board; measured geometry confirmed the visible correction from 0 px to 20 px. A separate crop was not needed.

### Required fidelity surfaces

- Fonts and typography: existing Mirellis sans/serif role separation was preserved. Navigation size, weight, and line height are now consistent across the Shopify and Vercel-rendered shells.
- Spacing and layout rhythm: fixed the cancelled CTA-note margin, standardized 112/80 px header heights and 20 px mobile gutters, and reduced an excessive mobile pathway-card gap.
- Colors and tokens: retained the warm-neutral palette and mapped the shared navigation to the existing terracotta navigation color.
- Image quality: the supplied official 124 × 26 px Mirellis lockup remains the shared brand asset; no substitute or redrawn asset was introduced.
- Copy and content: no narrative copy was rewritten. Labels continue to describe their destinations, and responsive changes did not truncate or obscure text.
- Icons and interactions: utility and menu icons use one consistent library and stroke treatment; desktop dropdown and mobile-menu keyboard states were verified.

### Comparison history

1. P1 — Homepage support text collided visually with the CTA row. Fixed the specificity conflict and verified a 20 px rendered gap on development and live Shopify.
2. P1 — About/Understand used a visibly different site shell. Rebuilt the shared navigation dimensions and utilities, then verified the corrected live routes at desktop and mobile sizes.
3. P2 — Mobile Vercel-rendered content/footer gutters differed from Shopify and pathway cards carried excessive vertical emptiness. Standardized the gutters and reduced the card gap; no overflow remained at 390 px.
4. Post-fix pass — no actionable P0/P1/P2 mismatch remained in the named routes or tested navigation states.

final result: passed
