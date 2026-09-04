# Design QA — Mirellis focus home

## Comparison target

- Source visual truth: `/Users/aseem/.codex/generated_images/01a0379d-65c1-7f72-b46d-f13da3b60df2/exec-21f06e50-cef7-4f46-a405-23afee9fc4e8.png`
- Source pixels: 853 × 1844 (mobile reference at high density).
- Implementation: `http://localhost:3000/?focus-home`, captured in the in-app Browser during this task.
- Implementation viewport: 393 × 852 CSS px at device scale factor 1; screenshot is ephemeral to the browser capture API and was reviewed directly in the task transcript.
- State: fresh Focus home, 25-minute ready state, default intention, no unfinished session.
- Density normalization: the source was judged as a high-density mobile reference; comparison is against the 393 × 852 CSS viewport, not browser chrome.

## Full-view comparison

The selected design is reproduced as a scrollable mobile focus home: greeting, editorial headline, intention with edit affordance, central orbit timer, immediate primary CTA, and one supporting boundary action. The intended first interaction is visible without asking the user to complete a questionnaire.

Focused comparison was used for the headline/intention block and orbit/CTA block because those are the fidelity-critical regions.

## Required fidelity surfaces

- Fonts and typography: the existing Playfair Display/serif system maintains the source’s editorial hierarchy. The heading was reduced after the initial capture so “Your attention, kept.” remains one line at the reference width.
- Spacing and layout rhythm: mobile padding, editorial headline spacing, intention row, orbit diameter, and paired pill CTAs now follow the selected vertical composition. Tap targets meet or exceed 44px.
- Colors and visual tokens: warm paper, midnight navy, copper, and muted coral map to the reference while staying within the Mirellis palette.
- Image quality and asset fidelity: the orbit uses `/public/images/focus-orbit-backdrop.png`, a generated, text-free Mirellis artwork. It is clipped to a circular field, removing the rectangular edge found in the first implementation capture.
- Copy and content: the current intention, session duration, boundary, and partner action are all understandable as standalone app controls.
- Icons and accessibility: Phosphor icons provide the edit, arrow, boundary, notification, leaf, and partner marks; buttons have accessible names, the orbit timer has a text equivalent, and the intent field/radio groups are labeled.

## Comparison history

1. Initial mobile comparison: **[P2] Orbit artwork had a visible rectangular paper edge**, unlike the circular reference field. Fixed by clipping `.focus-orbit` with `border-radius: 50%` and retaining the generated orbit art.
2. Recheck: no actionable P0/P1/P2 differences remained in the matched home state. The reference’s outer particle glow is intentionally a minor rendering variation in the generated asset, classified as P3 only.

## Primary interactions tested

- “Begin now” starts a 25-minute focus session immediately.
- Pause switches to “Continue focus,” and Continue restores the active timer state.
- “Make a boundary” opens the editable intention, duration, and single-boundary setup.
- Intention, duration, and boundary persist locally after a reload.
- The selected focus session is resumable or releasable without a penalty state.

## Follow-up polish

- P3: refine the generated orbit’s outer glow if a closer visual match is desired after validating adoption.
- P3: add a native-notification/HealthKit implementation only in the later mobile-native phase; these capabilities are intentionally not simulated in this PWA screen.

final result: passed

---

# Design QA — concern-led route shell

## Comparison target

- Source visual truth: `/Users/aseem/.codex/generated_images/01a0379d-65c1-7f72-b46d-f13da3b60df2/exec-72c81b81-2977-4da3-b479-136f1ca1d9b6.png`
- Source pixels: 853 × 1844 (high-density mobile reference).
- Implementation: browser-rendered `http://localhost:3000/`, captured in the in-app Browser and emitted in this task’s visual comparison.
- Implementation viewport: 1280 × 720 CSS px, device scale factor 2; the centred application frame measured 528 CSS px wide. The source is a mobile reference and was judged against the same single-column app composition; browser chrome and outer desktop canvas were excluded from the comparison.
- State: Today screen, Focus task-initiation protocol selected, no protocol form open.

## Full-view comparison

The source and browser-rendered implementation were reviewed together in one visual comparison. Both show the Mirellis identity, Today’s Route heading, exact concern, Level 1 action, ready CTA, evidence strip, firm overdue trade-off, four-stage protocol progress, and the four requested bottom navigation labels.

Focused comparison was used for the header/current-concern block and the evidence/trade-off/progress block. No raster artwork from the reference was substituted: the actual Mirellis logo assets are used and all interface icons come from the existing Phosphor icon library.

## Required fidelity surfaces

- Fonts and typography: editorial serif display hierarchy and small uppercase labels match the reference’s intent. The implementation uses the existing brand-compatible serif fallback rather than a new visual system.
- Spacing and layout rhythm: the mobile-first, single-column frame retains the reference’s large editorial breathing room, divider rhythm, grouped evidence, and persistent bottom navigation.
- Colors and visual tokens: warm paper, deep green action, muted gold, and restrained warning red map to the source visual language.
- Image quality and asset fidelity: the existing gold Mirellis symbol/wordmark assets are used at native aspect ratio. No placeholder imagery or custom SVG/CSS artwork was introduced.
- Copy and content: visible copy is concern-led and action-led; it does not present a generic focus timer as the product.
- Icons, interaction and accessibility: library icons share a single visual weight; controls have accessible names; the three fields are labelled; disabled readiness is clear; primary navigation, protocol start, recording, concern selection and trade-off flows were exercised in the browser.

## Comparison history

1. **[P1] Missing Today’s Route display heading.** The first implementation reduced the reference’s route heading to a small eyebrow, weakening the composition above the current concern. Fixed by adding the editorial `Today’s Route` display heading and divider before the concern block.
2. Recheck: browser capture showed the corrected hierarchy. No actionable P0/P1/P2 differences remained for the approved hybrid Today state. The source’s bespoke decorative evidence icons are a P3 visual difference; the implementation intentionally uses the approved icon library rather than imitating those source marks.

## Primary interactions tested

- “I’m ready to begin” opens the three-prompt task-initiation protocol.
- Completing the three fields enables the start action and shows the user’s first visible step.
- Recording either result returns the user to Record with a visible entry.
- Route exposes all five equal concern entrances: Waking, Focus, Stress, Restoration, and Sleep; choosing Sleep changes the active concern.
- “Choose the trade-off” presents Close now, Carry it forward, and Trade something deliberately.
- Browser check found content present and no Next.js error overlay.

## Follow-up polish

- P3: replace the mock’s generic evidence values with real user events once Supabase-backed accounts and commitments are wired.
- P3: create a clinical-content approval workflow before shipping individual protocol content beyond this interaction prototype.

final result: passed
