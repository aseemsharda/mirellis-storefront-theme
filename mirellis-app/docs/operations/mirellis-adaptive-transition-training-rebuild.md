# Mirellis Adaptive Transition Training — Rebuild Architecture

**Status:** product-rebuild proposal; no implementation or release authorisation.  
**Date:** 12 August 2026  
**Decision requested:** replace the current advice-led web experience with a training-and-accountability product.  
**Why this exists:** ten observed reviewers were not motivated to return because the current experience mostly tells them actions they already know.

## 1. The product reset

### Invalidated premise

The present product assumes that recognising a difficult moment and receiving a calm instruction will be enough to produce action. It is not. Knowing that closing a laptop, moving a phone, or taking a walk could help is not the missing capability for most people.

Mirellis must stop shipping advice screens as the core value.

### New product job

> Help a person repeatedly practise the skills of crossing an ordinary boundary, with a clear daily commitment, an activity that changes with their performance, and a reason to return tomorrow.

This is **training**, not treatment. Mirellis can record a practice attempt and an explicit choice; it must never claim to measure recovery, diagnose a state, assess cognition, or prove an outside-the-app result.

### Product category

Mirellis is best positioned as a **transition-training and ritual-accountability app**:

```text
Choose a training goal
→ receive today's short workout
→ complete interactive drills plus a real-world action
→ receive deterministic task feedback
→ build a self-chosen training plan and accountability rhythm
```

It is not a content library, wellness diary, passive meditation player, clinical cognitive-assessment tool, or an app that merely asks a person how they feel.

## 2. What to adapt from the benchmark set

Mirellis should adapt operating mechanics, not copy interfaces, branded language, content, source code, or claims.

| Benchmark | Mechanic worth adapting | Mirellis adaptation | Do not copy |
| --- | --- | --- | --- |
| Duolingo | One small daily lesson, immediate task feedback, visible course progression, reminders. | A daily transition workout with a clear start, exercise result, and next unlocked practice. | Mascot, language-course structure, XP economy, aggressive loss aversion. |
| Elevate / Peak | Personalised workout length; skill-specific exercises; difficulty changes from demonstrated task performance. | The user explicitly selects training focus and time; the system adapts only exercise complexity and timing from in-app performance. | Any claim that performance means a person is more productive, happier, healthier, or recovered. |
| BrainHQ | Short repeatable drills, adaptive challenge, a plan that has a reason for its next exercise. | Purpose-built transition drills, with an explained “why this is next” based only on chosen goal and completed drills. | Medical/neuroplasticity claims unless separately substantiated and approved. |
| Strava | Concrete goal, visible activity history, opt-in challenge/accountability. | Private goals and opt-in accountability circles; activity record means “training completed,” never “state improved.” | Public comparison of private moments, default sharing, or leaderboard pressure. |
| Fitbit | A focused next action based on actual data. | Only use data Mirellis truly has: chosen goal, scheduled time, exercise choices, and confirmed completion. | Readiness/recovery scores or sensor-derived interpretations until qualified data, evidence, consent, and claims exist. |

### Critical claim boundary

Brain-training companies have faced scrutiny for promising real-world outcomes their evidence did not support. Mirellis must never say that a drill will improve work performance, sleep, anxiety, attention, cognition, physiology, or health unless it has appropriate, reviewed evidence for that precise claim. A user getting better at a Mirellis activity is evidence only of performance in that activity.

## 3. Audience and use moment

### Primary audience for the first build

Adults who want a firmer, repeatable way to end work and protect the beginning of their evening, but do not want therapy, a content feed, or generic wellbeing advice.

### First active programme

**After Work Training — 21 sessions**

The programme trains four observable skills rather than presenting four static moods:

1. **Close the loop:** turn an unfinished item into a clear next starting point.
2. **Break the pull:** reduce a chosen work cue and tolerate the first return urge.
3. **Change the setting:** create an external end-of-work signal.
4. **Begin elsewhere:** choose and begin a non-work action without waiting to feel ready.

The app should only add another programme after this one is tested for repeat use and understood value.

## 4. The daily product loop

### The home screen

The first screen has one clear job:

```text
Today’s After Work Training
7 minutes · Session 4 of 21
Goal: Make one clear ending before the evening starts.

[ Begin training ]
[ Change today’s session ]
```

The user should never have to interpret a curriculum card grid before reaching an action.

### A daily session

Each session contains one primary skill drill and one outside-the-app action. It must take 5–10 minutes. It should have a beginning, a challenge level, a response, immediate task feedback, and an unambiguous close.

| Moment | Product behaviour | What is measured |
| --- | --- | --- |
| Commitment | The person chooses a duration and accountability preference before beginning. | Explicit choice only. |
| Interactive drill | A short, skill-specific exercise with deterministic feedback. | Task response, elapsed time, retry/finish. |
| Field action | The app sends the person to perform one chosen real-world action. | Only the person’s explicit return/confirmation; never fabricated verification. |
| Review | One clear result: completed, paused, skipped, or rescheduled. | Session state, not mental state. |
| Next session | Explain the next drill from the selected programme and actual previous task state. | Completion history only. |

### No false completion

Tapping “I did it” cannot establish that a person left work, listened to music, changed a room, or felt better. It only records that they chose to mark the step complete. The UI and data model must say exactly this.

## 5. First exercise catalogue

The first production prototype should contain **six** exercises, not a decorative library of fifty. Every exercise must have a repeatable mechanic, variations, a difficulty ladder, explicit failure/skip state, accessibility equivalent, and human content review.

| Exercise | Skill | Core interaction | Adaptation variable | Real-world bridge |
| --- | --- | --- | --- | --- |
| Return Point | Closing an open loop | Build a next-action card from user-selected templates. | Fewer/more prompts; shorter/longer delay before review. | Place it in tomorrow’s chosen place. |
| Cue Break | Interrupting checking | Choose a work cue and build an explicit “available / not now / urgent” rule. | Number and similarity of cues. | Activate the selected distance action. |
| Boundary Sort | Separating work from evening | Timed sorting of realistic work/non-work boundary decisions. | Time, ambiguity, distractors. | Close one real work surface. |
| Signal Switch | Recognising an ending signal | Match a selected environmental change to a chosen context. | Options and delayed recall. | Change light, room, clothing, or device place. |
| Next Place | Beginning elsewhere | Select one concrete next action from a user-authored menu. | Reduced prompts; planned interruptions. | Start the action outside the app. |
| Return Under Pull | Recovering after an interruption | A short timed drill: recognise an interruption and choose the agreed boundary. | Interval, distractor frequency, rule complexity. | Return to the selected evening activity. |

These exercises are **not** cognitive assessment. They are designed practice activities. Mirellis must describe their result as, for example, “You completed today’s Boundary Sort at level 2,” never “your attention improved.”

## 6. Personalisation model: explicit, adaptive, bounded

The product must stop assuming a single state while avoiding a hidden personality or diagnostic model.

### Inputs the person controls

- Active programme and programme goal.
- Usual transition time and desired session length.
- Desired firmness: Gentle, Firm, or Accountable.
- Chosen work cues and permitted urgent channel.
- Which exercises they find relevant or want to pause.
- Whether they want sound and which approved collection they prefer.

### What the system may adapt

- Exercise order within the active programme.
- Challenge level of a specific in-app task.
- Whether to repeat a drill after an explicit “not useful” response.
- Reminder timing inside the user’s selected window.

### What the system may not infer or adapt from

- Free-text notes.
- Mood, diagnosis, personality, health condition, or presumed productivity.
- Hidden engagement optimisation.
- Any external behaviour not explicitly and truthfully captured.

## 7. Motivation and accountability engine

Advice becomes action only if opening the app creates a meaningful commitment. Mirellis needs three opt-in modes; a person can change modes at any time.

| Mode | Mechanism | Boundary |
| --- | --- | --- |
| Gentle | One chosen reminder; pause or reschedule without consequence. | Default. No shame and no fabricated loss. |
| Firm | A scheduled appointment, escalating reminders within the chosen window, and an explicit “skip today” choice. | The app cannot trap, punish, or repeatedly harass a user. |
| Accountable | A private accountability circle or selected partner receives only a user-authorised event such as “A session was started” or “I chose to reschedule.” | No private notes, route details, state claims, or sharing by default. |

### Progress that is motivating but truthful

- A 21-session programme path, where a session unlocks after the previous session is completed or deliberately rescheduled.
- Private practice calendar and consistency count.
- Exercise-level progression based on task completion and task performance.
- Optional weekly challenge: for example, “Keep three chosen end-of-work appointments this week.”
- Optional partner challenge only with clearly shown sharing scope.

No universal wellness score, recovery score, readiness score, public ranking, or inferred “progress” appears. Completion and drill performance are sufficient feedback loops for the first product.

## 8. Product surfaces

1. **Onboarding:** choose programme, schedule, firmness, privacy mode, and first goal. No health assessment.
2. **Today:** one scheduled workout, one explicit alternative, and honest skipped/rescheduled state.
3. **Session:** commitment → drill → field action → return → result.
4. **Programme:** the 21-session path; explains unlocked and upcoming drills without pretending a person’s state has advanced.
5. **Practice library:** only unlocked drills; optional free practice.
6. **Progress:** private calendar, completed sessions, current exercise levels, selected goal, and reschedules.
7. **Accountability:** opt-in reminder and partner/circle controls with visible data-sharing scope.
8. **Settings and privacy:** export, deletion, notification controls, accessibility preferences, and a clear non-clinical boundary.

Music, films, articles, Findings, and products do not get a top-level home position. They are contextual support supplied only when a particular exercise calls for them.

## 9. Platform architecture

### Release decision

A browser page cannot reliably provide scheduled reminders, device-level focus controls, robust offline use, or meaningful accountability. The final product should be **native mobile first**. The current Vercel app becomes a prototype and web companion, not the long-term primary product.

### Delivery sequence

| Stage | Product | Purpose | Release rule |
| --- | --- | --- | --- |
| 0 | Interactive exercise prototypes | Test whether people find the daily workout compelling enough to return. | Do not ship publicly. |
| 1 | Mobile alpha with local-only training | Validate the 21-session loop, reminders, and exercise comprehension. | 20–30 consented testers. |
| 2 | Account/sync plus opt-in accountability | Validate private sharing and retention mechanics. | Separate privacy, abuse, support, and consent review. |
| 3 | Device integrations | Explore user-authorised Focus/notification integrations where platform policy allows. | Platform-specific privacy and reliability review. |

### Data architecture principles

- Local-first session history for the prototype.
- The user sees every stored data category and can export/delete it.
- Account creation is optional until cross-device sync or accountability is selected.
- Private text remains outside adaptation logic.
- Notifications are permissioned, editable, and never presented as emergency support.
- Partner sharing uses a separately scoped data model; it is not a side effect of using the app.

## 10. Claims, privacy, and safety release gates

Before implementation, replace the current legacy curriculum governance for this new product with a dedicated training-exercise review process.

Every exercise requires:

- a plain-language training objective;
- exact consumer copy and task logic;
- evidence/claims status;
- accessibility equivalent;
- skip, pause, and failure states;
- data collection map;
- editorial, privacy, accessibility, and safety approver;
- acceptance tests and rollback version.

The product must not ship language such as “rewire,” “regulate,” “recover,” “improve cognition,” “fix,” “cure,” “clinically proven,” or “personalised to your brain” unless the claim has been reviewed and substantiated for that exact use.

## 11. Research and validation plan

### Before writing production code

Test three distinct working exercises with 15–20 people who say ending work is difficult. The test is not “do you like it?” It is:

1. Would you choose to begin tomorrow’s session without a researcher asking?
2. Does the exercise feel meaningfully different from advice?
3. Does its feedback feel truthful and motivating?
4. Would you select Gentle, Firm, or Accountable mode? Why?
5. Does the programme path make sense without suggesting a diagnosis or promised outcome?
6. Which moment makes the app worth opening?
7. What would make a scheduled session too intrusive?

### Decision metrics

- At least 60% of testers voluntarily return for a second session within seven days.
- At least 50% can accurately explain what Mirellis trains and what it does not claim to do.
- At least one of the three exercise prototypes earns a voluntary third use from half of testers.
- No participant reports that reminder/accountability controls were unclear, coercive, or exposed private information.

Failure to meet these gates means revise the exercise mechanic; do not add more content or deploy a prettier interface.

## 12. First 90-day build plan

### Days 1–14: prove the mechanism

- Produce three high-fidelity interactive exercise prototypes: Return Point, Cue Break, Boundary Sort.
- Write the exact onboarding and accountability consent flows.
- Run 15–20 moderated tests and collect only consented, non-sensitive feedback.
- Select one winning mechanic; archive the rest.

### Days 15–45: build the vertical slice

- Build native alpha shell: onboarding, Today, one programme, three exercises, session state, local history, notification preferences, deletion.
- Create 21 session scripts only after the three exercise patterns have passed test review.
- Test screen reader, keyboard/external keyboard, reduced motion, small-screen, offline, pause/resume, and notification permission states.

### Days 46–90: test a real programme

- Expand to the six-exercise catalogue and 21-session After Work programme.
- Add private practice calendar and firm reminder mode.
- Run a consented 20–30 person alpha for four weeks.
- Evaluate voluntary return, exercise clarity, and accountability fit before adding accounts, partner sharing, content, products, or another transition.

## 13. Explicit decisions for the product owner

This architecture recommends the following defaults:

1. **Retire the existing advice-led After Work flow** from the future release path; keep it only as an archived prototype until the new alpha replaces it.
2. **Permit truthful gamification:** programme paths, private completion history, optional streaks/challenges, and exercise levels.
3. **Do not introduce mental-health, cognition, recovery, or productivity scores.**
4. **Build native mobile as the future product**, with the current web app used only for prototype/testing.
5. **Start with an account-free local alpha;** add account/sync and partner accountability only after a separate privacy/consent review.
6. **No new content or live deployment** until the first three exercise prototypes pass the research gates.

## Appendix: sources informing the architecture

- Duolingo — personalised short lessons, gamified habit mechanics, and reminders: https://www.duolingo.com/learn
- Elevate — daily personalised workouts, adaptive difficulty, and workout settings: https://support.elevateapp.com/hc/en-us/articles/4402922583067-What-is-Elevate and https://support.elevateapp.com/hc/en-us/articles/4402924805275-How-do-I-use-the-app
- BrainHQ — short adaptive exercises and personal training plan: https://www.brainhq.com/why-brainhq/brainhq-faq/
- Strava — goals, private/public activity participation, challenges and accountability: https://www.strava.com/join-now and https://support.strava.com/en-us/articles/15401916-strava-challenges
- FTC — substantiation risk of broad cognitive and real-world-benefit claims: https://www.ftc.gov/news-events/news/press-releases/2016/01/lumosity-pay-2-million-settle-ftc-deceptive-advertising-charges-its-brain-training-program
