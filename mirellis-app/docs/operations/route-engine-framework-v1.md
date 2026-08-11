# Mirellis Route Engine — Framework V1

**Status:** approved product direction; no implementation or publication is authorised by this document alone.  
**Purpose:** make the Mirellis app an end-to-end companion for a specific lived moment, rather than a sequence of generic prompts.

## 1. The product decision

Mirellis is a private, local-first practice companion for human state transitions. It does not diagnose, score, optimise engagement, infer a person’s state, or promise an outcome.

It starts with the person’s own description of a difficult moment. It then offers one appropriate, concrete route: a short practical action first, with carefully selected sound, film, reading, ritual instrument, or reflection only where each genuinely helps. The person can leave at any point without penalty.

The product is not a library of wellness content. It is a **route engine**:

```text
What is difficult now?
→ a person selects the closest true description
→ one small, real-world action
→ optional, relevant support in the right medium
→ an honest check-in
→ a chosen next action, or leave without pressure
```

### V1 master taxonomy (locked)

Only these four transitions are consumer-active in V1. Internal identifiers never appear in the product UI.

| Canonical model | Consumer destination | Current asset position |
| --- | --- | --- |
| Sleep → Wakefulness | Start the morning | Morning Clarity sound; one published Mirellis film |
| Wakefulness → Readiness | Get going | Morning Clarity can support selected routes; film and Finding coverage is incomplete |
| Readiness → Deep Focus | Focus on one thing | Flow sound; film and Finding coverage is incomplete |
| Deep Focus → Recovery | After work | Stillness sound; relevant Findings; no purpose-built after-work film yet |

**Editorial rule:** “Stimulation → Restoration” remains a website/Sound editorial collection, not a fifth app transition. It may link into the app only after a separately approved product change creates a real V1 successor transition.

## 2. Non-negotiable route contract

Every route must be a tested, data-backed object. No generic card, button, or asset may be added merely because it exists on a channel.

| Required field | Rule |
| --- | --- |
| Person’s entry sentence | Uses familiar language; is an explicit selection, never an inferred label. |
| Acknowledgement | Names only what the person selected. No diagnosis or explanation of their personality/body. |
| Small promise | States what they will do and the approximate time; never promises that they will feel better. |
| Primary practice | One feasible, observable action outside the app. It must be completable without buying or watching anything. |
| Support asset | At most one recommended asset in the main path; it has a stated purpose, duration, URL, owner, rights status, and availability check. |
| Alternatives | “Choose another way” and “Leave for now” are always honest exits. Do not offer false branches. |
| Outcome | A person reports what is true. The app neither decides nor translates the response into a hidden score. |
| Save | Saving is optional and visibly states what it will do. A completed or deliberately saved route appears immediately in Personal Observatory. |
| Evidence link | Optional reading links are shown as context, not proof that a practice will work. Public claims must be source-reviewed. |

### The route screen model

1. **Today:** “What brings you here today?” One recommended moment, based only on a saved, explicit choice; otherwise show the four familiar moments under “Explore other moments.”
2. **Moment:** three to four plain-language problem statements plus “Something else / I am not sure.”
3. **Recommendation:** acknowledge the exact selected statement, explain why this practice fits, make a small promise, and show one primary action: **Start this practice**.
4. **Practice:** one to three steps. It must get the person into the real-world action within the first screen, not after a curriculum intro.
5. **Support (only when useful):** one selected listening, viewing, reading, or ritual-instrument option. Links open the actual external destination; Mirellis never pretends the person listened or watched.
6. **Check-in:** “What is true now, if anything?” with **A little more room / Partly enough / This did not fit / Nothing yet**. A private note is optional.
7. **Close:** “You made a first choice. That is enough for today.” Primary: **Back to today.** Secondary options appear only if they have an immediate, visible effect: save the exact route, open the selected support, or choose another approach.

There is no automatic advancement, no streak, no score, no “keep” action that secretly changes tomorrow’s path, and no fabricated observation.

## 3. V1 route registry

The following is the release design target: twelve real routes, three per canonical transition. “Asset gap” means the control must not be displayed until a reviewed asset exists.

| Destination | Person’s selected difficulty | Primary real-world practice | Recommended support now | Content gap / decision |
| --- | --- | --- | --- | --- |
| Start the morning | “I am awake, but not really here yet.” | Open curtains or change light; put both feet on the floor; choose the first ordinary action. | Morning Clarity playlist; existing 7:16 Mirellis waking film as optional explanation. | Link a reviewed waking Finding; do not use cold-exposure material as a default practice. |
| Start the morning | “I keep reaching for my phone.” | Put the phone face down/out of reach for one chosen minute; choose what gets attention first. | Morning Clarity playlist. | A short film or article about intentional morning attention is needed. |
| Start the morning | “The morning already feels rushed.” | Name the next five-minute horizon; make one environmental preparation. | Morning Clarity playlist. | No current film/Finding shown until reviewed. |
| Get going | “The day feels too big to begin.” | Choose one five- or ten-minute horizon and one visible first action. | Morning Clarity only if the person chooses listening. | Produce a 3–5 minute “begin where you are” film; commission/review a relevant Finding. |
| Get going | “Messages and other people are already pulling me in.” | Create one voluntary, time-bounded input boundary; decide what remains available. | Morning Clarity only if selected. | Produce a boundary/start-of-day explanation asset. |
| Get going | “I do not know what should come first.” | Write or select one next action; place it in view. | No media by default; use it only after the action. | Create a concise route-specific article or film. |
| Focus on one thing | “There is too much competing for my attention.” | Choose one point and one realistic focus window. | Flow playlist, deliberately opened by the person. | Produce a focus-window film; review/create a Finding suitable for the app. |
| Focus on one thing | “I keep getting pulled away.” | Name the main pull; set one chosen boundary; define the return point. | Flow playlist. | Produce an interruption/return article or film. |
| Focus on one thing | “I have been interrupted and cannot come back.” | Re-open the work surface, identify the next visible action, choose a small return window. | Flow playlist. | Create a return-from-interruption support asset. |
| After work | “An unfinished point is still replaying.” | Leave one visible return point, close one work surface, then begin one non-work action. | Stillness playlist. Reading: reviewed Work → Recovery Finding only after action. | Produce a 4–6 minute after-work carryover film. |
| After work | “My body still feels switched on.” | Make one physical/environmental change, find support, then choose a lower-demand next action. | Stillness playlist. | Produce a non-medical transition film; review wording with safety/editorial owner. |
| After work | “I keep checking and cannot disengage.” | Create distance from one cue; decide whether a later check is genuinely needed; begin one non-work action. | Stillness playlist. | Create an after-hours cue/boundary article or film. |

The current “I have moved on but feel scattered” protocol should remain available under **Choose another approach**, but it does not replace one of the core twelve until it has an asset and evidence review.

## 4. Asset policy and current inventory

### Approved source references to verify at build time

| Asset | Intended use | Source |
| --- | --- | --- |
| Mirellis YouTube channel | Film source | https://www.youtube.com/channel/UCfuvn1UwUr9pbSnjzbX6qZA |
| “Why Your Brain Isn’t Ready When You Wake Up” (7:16) | Optional explanation for Start the morning | https://www.youtube.com/watch?v=qY8CWzFJFq0 |
| “Why Your Mind Won’t Go Quiet at Night” (4:41) | Website/editorial night resource only until a matching app route is approved | https://www.youtube.com/watch?v=QrcqccL7yMU |
| Morning Clarity | Selected listening support | `https://open.spotify.com/playlist/0kPGfp1m7uIAEkT8h6j66P` |
| Flow | Selected listening support | `https://open.spotify.com/playlist/10xydaUigLOhIwJa4FCAtT` |
| Stillness | Selected listening support | `https://open.spotify.com/playlist/6VG02jtawiXTcOGi0nZzp6` |
| Restoration | Website/editorial collection only | `https://open.spotify.com/playlist/53xH1HRTy7x9IEN7WPByDp` |
| Observatory Findings | Evidence directory | https://mirellis.in/pages/observatory-findings |

Before any release, the content steward must confirm that each external URL is public, stable, appropriate for the named route, and has the required rights. “Opened Spotify” or “watched film” may be recorded only as a local, explicit click; it is never treated as completion or evidence of effect.

### Asset record required before a control may ship

```ts
type RouteAsset = {
  id: string;
  kind: 'practice' | 'spotify' | 'youtube' | 'article' | 'finding' | 'ritual-instrument';
  title: string;
  url: string;
  routeIds: string[];
  purpose: string;       // plain-language, one sentence
  durationLabel?: string;
  owner: string;
  rightsStatus: 'confirmed' | 'pending' | 'not-required';
  evidenceStatus: 'reviewed' | 'editorial-context' | 'not-app-eligible';
  checkedAt: string;
};
```

## 5. Data and trust boundaries

The current local-first Personal Observatory direction remains governing authority.

- Store selections, explicit outcomes, optional notes, and explicit saves locally on the device.
- Do not parse or use private note text to select future routes.
- Do not infer that an external media asset was consumed, nor whether it “worked.”
- “Today” may use only an explicitly saved route as a suggestion. If no route has been saved, it offers a neutral first-time recommendation and Explore other moments.
- Deletion must remain cancellable and delete dependent local route data together.
- Product links remain optional instruments, never required to complete a practice and never framed as treatment.
- Public research language is editorial context. It must be qualified and reviewed before it appears beside an action.

## 6. What makes the experience feel complete

The route should not simply return a person to the first screen after a label is chosen. It should make the next real-world move unmistakable.

For example, a person selecting “An unfinished point is still replaying” receives:

1. **Why this:** “An open point can keep asking for attention after the day has ended. First, give tomorrow a clear place to begin.”
2. **Do now (two minutes):** write the next visible action; close or put away one work surface.
3. **Then choose:** “Begin the evening” is the default next move. “Open Stillness for ten minutes” is an optional support, not another app screen.
4. **If useful:** “Read why Mirellis studies sensory downshift” is editorial context, not a clinical promise.
5. **Check-in:** the person selects what is true and may save this exact route for another day. If it did not fit, **Choose another approach** returns to the three alternate After work routes, not the generic start screen.

## 7. Delivery sequence

### Phase 0 — repair the product foundation

1. Replace the current hard-coded Work → Recovery-only flow with a data-driven `Route` and `RouteAsset` registry.
2. Keep the four-transition assertion; reject any route that points outside the locked taxonomy.
3. Remove all generated internal IDs and curriculum labels from consumer screens.
4. Add an asset validation test: no public route can render an unreviewed, missing, or empty URL.

### Phase 1 — prove the system with one complete vertical slice

Build the three After work routes first because the product already has the strongest assets there: Stillness and reviewed Findings. Add the carryover film only after it is produced and approved. Test the full path from Today through alternate routes, external asset exit, resume, check-in, save, Personal Observatory, and deletion.

### Phase 2 — complete the four destination routes

Add three routes for each remaining destination only as their assets clear the asset record. A route may launch with a practical action plus one reviewed sound asset; it must not show empty video, reading, or product cards.

### Phase 3 — editorial operating system

Create a small editorial production board from the asset gaps above. Every new YouTube film, Spotify playlist, article, Finding, product dossier, Instagram post, Substack essay, Medium article, or Pinterest asset is assigned to a specific route and purpose before it is produced.

### Phase 4 — connection, not data extraction

Add website deep links and Shopify product links only after the app route works alone. Social channels distribute or deepen a route; they are never a required step in the person’s transition.

## 8. Acceptance gates

A route cannot ship until all of the following are true:

- A first-time visitor reaches a real action in two taps after choosing a moment.
- The recommended action is possible without audio, video, a product, an account, or a purchase.
- Every alternate action is materially different; otherwise the option is removed.
- A selected media control opens the actual named external asset and explains why it is offered.
- Completion wording names exactly what was saved, or confirms that nothing was saved.
- “Choose another approach” returns to relevant alternatives; “Leave for now” preserves a resume point without pressure.
- Personal Observatory is empty until a practice is completed or deliberately saved; it contains only explicit local evidence.
- Keyboard, screen-reader, visible focus, 44px targets, reduced motion, mobile layout, external-link disclosure, and deletion cancel/confirm tests pass.
- Links, asset availability, claim qualification, rights status, and product names are reviewed by the content steward.

## 9. Decisions still required before implementation

1. **Spotify confirmation:** confirm that the four direct playlist URLs above are the approved public Mirellis playlists.
2. **Content owner:** name who can approve a route’s claim, rights status, and destination before publication.
3. **First production sprint:** approve the proposed After work carryover film and the first three additional route assets, or provide preferred titles/briefs.
4. **Research participation:** keep it completely separate from everyday route completion unless an explicit, voluntary programme and consent design are approved.

Once these decisions are supplied, the next deliverable is a build-ready route registry and a preview-only implementation of the After work vertical slice. Nothing in this framework authorises a live deployment.
