# Mirellis After Work — Product Design QA

**Final result: passed**

## Evidence

- Source visual truth: `/Users/aseem/.codex/generated_images/019fcbc2-228f-7e70-9cc5-51c6703f44c2/exec-1989b8a4-d3e1-445a-b1e5-409ebfa92efb.png`.
- Source role: visual-language and daily-workout hierarchy reference. The user explicitly deferred final visual design, so photography and decorative exercise art are not fidelity requirements for this functional product slice.
- Browser-rendered implementation: `/private/tmp/mirellis-after-work-today-fixed.jpg` at `http://127.0.0.1:3000/after-work`.
- Full-view comparison: `/private/tmp/mirellis-after-work-comparison.png`.
- Viewport: 390 × 844 CSS pixels at device pixel ratio 1.
- Source pixels: 853 × 1844, normalized to 390 × 844 for comparison.
- Implementation pixels: 390 × 844.
- Compared state: configured user, Session 2 Today screen.
- First-time state evidence: `/private/tmp/mirellis-after-work-onboarding.png`.
- Focused region comparison was not separately required: the normalized comparison keeps headline, workout list, primary action and navigation legible. Form, timer, selection, completion and deletion states were inspected directly in the browser.

## Findings

- No actionable P0, P1 or P2 visual issues remain for the provisional functional design.
- [P3] The final art direction is intentionally unresolved. The current screen uses the established Mirellis serif/sans typography, bone paper, espresso ink, brass accent and restrained dividers, but omits the reference photograph and custom exercise artwork until the user chooses a final design direction.

## Required fidelity surfaces

- Fonts and typography: the existing Mirellis Playfair/Inter stack, weight hierarchy, line height and wrapping remain legible at 390 px. The main headline wraps deliberately; small UI labels remain readable.
- Spacing and layout: 24 px mobile margins, consistent divider rhythm and 44 px or larger interactive targets. The Today primary action is visible above the persistent navigation at 390 × 844.
- Colors and tokens: existing paper, ink, muted, line, brass and focus tokens are reused. Selected, destructive and disabled states are distinct.
- Image quality: the current functional slice contains no imagery or decorative illustrations. No placeholder, CSS-art or fake raster assets are present.
- Copy and content: all copy describes an actual function or recorded event. No health, recovery, mood or productivity outcome is inferred.
- Accessibility: semantic buttons/labels, visible 3 px focus outline, aria-live status, aria-current navigation, pressed states, disabled states, reduced-motion support, keyboard focus and cancelable deletion were verified.

## Comparison history

1. [P1] The original mobile Today composition pushed the primary action below the visible viewport. Fixed by tightening only the Today top spacing and removing decorative sequence numbers. Post-fix evidence: `/private/tmp/mirellis-after-work-today-fixed.jpg`.
2. [P1] Navigating to Programme or Settings discarded an unfinished exercise. Fixed with a versioned local draft and exact exercise restoration after navigation or reload. Browser verification restored both text fields and the current exercise.
3. [P2] The one-minute action initially displayed `00:60`. Fixed with real minute/second formatting; browser verification showed `01:00`, `00:30` and the completed state.
4. [P2] Deletion confirmation did not move focus into the alert. Fixed with cancel autofocus, dialog description and focus return to the delete trigger.
5. [P2] The workout did not explain its next-session adaptation. Fixed with a deterministic Signal Sort level derived only from exercise performance and explicit completion feedback.

## Product and interaction verification

- First-time onboarding, time choice and Gentle/Firm/Accountable selection.
- Today, all three exercises, deterministic task feedback, one-minute action, completion and next session.
- Interruption/resume through tab navigation and full reload.
- Programme lock/current/completed states.
- True empty Record state and immediate saved-session record.
- Settings time/style changes, analytics inactive copy, deletion cancel and confirmed deletion.
- Mobile 390 × 844, focus visibility, aria-live announcements and minimum targets.
- Browser console: no warnings or errors.
- TypeScript: passed.
- Production build: passed.
- Existing automated suite: 20/20 passed.

## Follow-up polish

- Final photography, exercise illustration, iconography and motion should be selected in the later visual-design phase; they are not blockers for validating this product loop.
