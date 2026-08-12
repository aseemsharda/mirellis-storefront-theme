# Mirellis After Work V2 — Design QA

- Source visual truth: `/Users/aseem/.codex/generated_images/019fcbc2-228f-7e70-9cc5-51c6703f44c2/exec-1989b8a4-d3e1-445a-b1e5-409ebfa92efb.png`
- Implementation screenshots: `/private/tmp/mirellis-v2-local-01-onboarding.jpg`, `/private/tmp/mirellis-v2-local-02-do-now.jpg`, `/private/tmp/mirellis-v2-local-03-day3.jpg`
- Combined comparison: `/private/tmp/mirellis-v2-design-comparison.png`
- Browser viewport: 390 × 844 CSS px; device scale factor 1
- Source pixels: 853 × 1844; normalized to a top 390 × 844 crop
- Implementation pixels: 390 × 931 full-page onboarding capture; normalized to a top 390 × 844 crop for comparison
- State: first-time onboarding; additional evidence covers Day 1 action and Day 3 progression

## Full-view comparison evidence

The source is an art-direction reference rather than a literal mock of the new onboarding state. The implementation preserves its warm-neutral paper, black-brown ink, muted gold, editorial serif display type, sans-serif utility type, square controls, fine rules and generous vertical rhythm. The new screen intentionally omits the photographic cover because this state must first explain the programme and its real reminder behavior.

## Focused evidence

No separate crop was required: the 390 px full-page captures make the header, headline, step hierarchy, controls, selection state, focus ring and persistent navigation legible. The Day 1 action screenshot verifies long-form controls and selected states; the Day 3 screenshot verifies the same system on later programme content.

## Findings and iteration history

- Earlier P0: the flow used hidden scoring, levels, “matched” decisions and an unexplained timer. Fixed by replacing them with the person’s actual unfinished item, a plain urgency check, two explicit outside-the-app actions and confirmation-only records.
- Earlier P1: reminder choices implied behavior a web app did not provide. Fixed by stating the limitation and generating a real 21-day calendar file.
- Earlier P1: Day 2 repeated Day 1. Fixed by making Day 2 retrieve yesterday’s exact plan and branch its real actions from the cue the person selects.
- Earlier P2: new content inherited excessive top padding from the old `.training-field` selector. Fixed with V2-specific padding reset and checked at 390 px.
- Post-fix comparison: no actionable P0/P1/P2 visual mismatch remains for the functional onboarding and practice states. The missing photographic cover is an intentional state/content difference, not a fidelity defect.

## Required fidelity surfaces

- Fonts and typography: Playfair Display/Georgia display hierarchy and Inter sans-serif UI hierarchy are consistent with the source; no clipping or truncation at 390 px.
- Spacing and layout: consistent 1.15–1.5 rem mobile gutters, fine-rule grouping, square fields and 44 px minimum controls; no horizontal overflow observed.
- Colors and tokens: warm paper, ink, muted text and gold progress/eyebrow tokens match the source direction with readable selected states.
- Image quality: no visible image asset is required by these functional states; no placeholder or approximate image is used.
- Copy and content: plain-language programme structure, reminder mechanism, real actions and tomorrow handoff are explicit.

## Interaction and accessibility evidence

- Tested first-time setup, no-reminder start, the real urgent-item branch, explicit closing action, Day 1 completion, Day 2 retrieval and cue branch, Day 3 differentiated content, pause/reload/resume, record visibility, calendar download feedback and delete-cancel.
- Native buttons, inputs and textareas provide keyboard activation and logical DOM order; visible focus ring observed on selection controls.
- Accessible status updates are exposed through `role="status"` and `aria-live="polite"`.
- Local browser logs contained no errors; only Next.js development information and HMR connection logs.

final result: passed
