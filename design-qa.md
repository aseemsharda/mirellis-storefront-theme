# Mirellis desktop navigation alignment — design QA

## Evidence

- Source visual truth: `/var/folders/00/9g0t059x1910npgv0dzvlr200000gn/T/TemporaryItems/NSIRD_screencaptureui_9LGslN/Screenshot 2026-08-22 at 10.05.48 PM.png`
- Browser-rendered implementation: `audits/navigation-alignment-2026-08-22/implementation-preview-1280.png`
- Normalized comparison: `audits/navigation-alignment-2026-08-22/before-after-header.png`
- Source pixels: 2880 × 1800 at 144 ppi. The source header crop was normalized from 2880 px to the 1280 px comparison width.
- Implementation pixels and CSS viewport: 1280 × 900 at device scale 1.
- State: desktop header closed for alignment comparison; Get help dropdown open for interaction verification; mobile drawer open at 390 × 844.

## Comparison history

### Initial findings

- [P1] The five-item primary navigation was visually attached to the logo rather than centred in the header. In the normalized source, the menu cluster sat approximately 192 px left of the viewport centre.
- [P2] Dropdown summaries had a 44 px alignment box while direct links used their text line box, making the menu row feel uneven even when the text baselines were close.

### Fixes made

- Rebuilt the desktop header as equal flexible side tracks with an intrinsic centre navigation track.
- Centred the primary navigation independently from the logo and utility controls.
- Applied the same 44 px alignment box and vertical centring to dropdown and direct navigation items.
- Removed the one-pixel chevron baseline offset in the Mirellis navigation.

### Post-fix evidence

- At 1280 px, wrapper centre is 640 px and navigation centre is 639.996 px: a 0.004 px delta.
- Logo, navigation and utility-control vertical centres are all 65.76 px within rounding tolerance.
- Left and right safety gaps are 296.47 px and 290.48 px; no collision or horizontal overflow exists.
- The dropdown remains fully within the viewport and opens below its trigger.
- At 390 px, the menu trigger remains 44 × 44 px, the drawer opens, and horizontal overflow is 0.

## Required fidelity surfaces

- Fonts and typography: unchanged from the approved Mirellis theme; only alignment boxes and line-height behaviour changed.
- Spacing and layout rhythm: corrected. Primary navigation now occupies the true centre track with balanced surrounding space.
- Colors and visual tokens: unchanged.
- Image quality and assets: original Mirellis logo and theme icons remain unchanged; no replacement or approximation was introduced.
- Copy and content: unchanged; all existing destinations and dropdown descriptions are preserved.

## Interaction checks

- Desktop Get help disclosure opens successfully.
- Mobile drawer opens successfully.
- Desktop dropdown and mobile drawer show no horizontal overflow.
- Responsive desktop and mobile visibility rules remain intact.

## Remaining findings

No actionable P0, P1 or P2 findings remain for the requested header-alignment correction.

final result: passed
