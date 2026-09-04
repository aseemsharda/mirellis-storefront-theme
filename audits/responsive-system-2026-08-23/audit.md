# Mirellis responsive-system audit

Date: 2026-08-23

## Scope

The audit covered the shared consumer experience across the Shopify storefront and the Next.js Guidance/Directory routes rendered on `mirellis.in`: homepage, Sleep, Focus, Restoration, concern navigator, Understand, About, Shop, desktop dropdowns, mobile navigation, and footer behavior.

The supplied homepage screenshot was used as the primary defect reference. Browser-rendered evidence was captured at 1440 × 900 and 390 × 844.

## Journey health

1. **Homepage recognition and first action — passed after correction**
   - Before: the support sentence began immediately below the CTA row because a high-specificity paragraph reset cancelled the component margin.
   - After: the sentence has a measured 20 px separation, a constrained reading width, and 1.55 line height.
   - Evidence: `before-after-home-spacing.jpg`, `26-home-desktop-corrected.jpg`, `28-home-mobile-live.jpg`.

2. **Sleep, Focus, Restoration, and concern navigation — passed**
   - The four problem-first entry routes retain 20 px mobile gutters and do not overflow horizontally at 390 px.
   - Evidence: `14-sleep-mobile.jpg`, `15-focus-mobile.jpg`, `16-restoration-mobile.jpg`, `17-navigator-mobile.jpg`.

3. **Understand and About institutional routes — passed after correction**
   - Before: these Vercel-rendered pages used a shorter 77 px desktop header, smaller navigation, no desktop utility controls, a different mobile header, and 15 px mobile gutters.
   - After: the shared header now matches the Shopify shell: 112 px desktop / 80 px mobile, 124 × 26 px official lockup, centered primary navigation, 44 px utility controls, and 20 px mobile gutters.
   - Evidence: `before-after-site-shell.jpg`, `31-about-desktop-live.jpg`, `32-about-mobile-live.jpg`.

4. **Navigation behavior — passed**
   - Desktop dropdowns open from semantic buttons, expose `aria-expanded`, close with Escape, and restore focus to their trigger.
   - The mobile menu locks background scrolling, moves focus to the first actionable link, closes with Escape, and restores focus to the menu control.
   - Evidence: `24-mobile-menu-corrected.jpg` and browser interaction checks.

5. **Shop and footer — passed**
   - The Shop retained its responsive product layout and the canonical Shopify header.
   - The Next.js footer now resolves to equal 20 px mobile gutters without horizontal overflow.
   - Evidence: `19-shop-mobile.jpg`, `25-footer-mobile-corrected.jpg`.

## Corrections implemented

- Replaced the broad homepage heading/paragraph reset with a low-specificity `:where(...)` reset so component spacing rules can work.
- Added a readable line height and maximum width to the homepage CTA support sentence.
- Tightened excessive blank space inside mobile pathway cards without changing content hierarchy.
- Rebuilt the shared Guidance/Directory shell around the existing Mirellis brand system rather than page-specific offsets.
- Added the same desktop search, account, and cart utilities used by the Shopify header.
- Replaced the mobile text-only menu control with consistent icon controls and preserved accessible labels.
- Standardized mobile content and footer gutters to 20 px and primary action height to 48 px.

## Verification

- Shopify development theme and live theme: homepage support-text gap measured at 20 px; no horizontal overflow at 1440 × 900 or 390 × 844.
- Next.js: ESLint passed; production build passed with 510 generated pages.
- Authority Phase 2 validation passed.
- Vercel preview and production deployment both rendered the corrected header at 113 px including the border on desktop and 81 px including the border on mobile.
- Mobile content shell measured x = 20 px, width = 350 px in a 390 px viewport.
- Header and action controls meet the 44 × 44 px minimum target requirement.
- No browser console messages were recorded in the final live mobile verification.

## Evidence limits

This is a rendered responsive and interaction audit of the named public routes, not a formal WCAG conformance certification or an exhaustive audit of every legacy Shopify template.

