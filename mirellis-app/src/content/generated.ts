import type { Transition } from '@/lib/types';
import { validateTransitions } from './validate';

// Generated from the frozen Transition 001–007 specifications. Do not edit by hand.
export const transitions: Transition[] = [
  {
    "id": "sleep-wakefulness",
    "title": "Sleep → Wakefulness",
    "question": "Can I make a workable start after waking?",
    "states": [
      "Orient",
      "Choose",
      "Influence",
      "Activate",
      "Self-direct"
    ],
    "experiences": [
      {
        "id": "SW-01",
        "sourceId": "SW-01",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Orient",
        "title": "Name the Fog",
        "beliefUnderTest": "“Something is wrong with me.”",
        "capability": "Recognize sleep inertia as a temporary waking state, not a personal failure.",
        "prompt": "Don’t change anything yet. Just notice.",
        "choicePrompt": "Which feels closest right now?",
        "options": [
          {
            "id": "option-1",
            "label": "My body feels heavy."
          },
          {
            "id": "option-2",
            "label": "My thoughts feel slow."
          },
          {
            "id": "option-3",
            "label": "I want to stay exactly where I am."
          },
          {
            "id": "option-4",
            "label": "Today feels different."
          }
        ],
        "action": "Remain where you are for 10 quiet seconds and notice one physical or mental signal.",
        "observation": "This experience has a name: sleep inertia. It passes.",
        "reflection": "Does naming it change how you relate to it?",
        "completion": "Tap “I can name what is happening.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "e973140fc7ae"
      },
      {
        "id": "SW-02",
        "sourceId": "SW-02",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Orient",
        "title": "Watch It Change",
        "beliefUnderTest": "“This feeling will stay like this.”",
        "capability": "Observe that the waking state shifts over a short interval.",
        "prompt": "Before we move, make a prediction.",
        "choicePrompt": "In the next 30 seconds, will this feeling stay exactly the same?",
        "options": [
          {
            "id": "option-1",
            "label": "Yes."
          },
          {
            "id": "option-2",
            "label": "Maybe not."
          },
          {
            "id": "option-3",
            "label": "I’m not sure."
          }
        ],
        "action": "Sit upright or place both feet on the floor; wait 30 seconds without opening another app.",
        "observation": "Compare this moment with the one before it.",
        "reflection": "What moved first: body, thoughts, or nothing yet?",
        "completion": "Choose “I noticed a shift” or “Not yet.” Both complete the experience.",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "f3ebe176a36a"
      },
      {
        "id": "SW-03",
        "sourceId": "SW-03",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Orient",
        "title": "Separate the State",
        "beliefUnderTest": "“I am lazy / I am not a morning person.”",
        "capability": "Use state language instead of identity language for one morning.",
        "prompt": "Finish this sentence without judging yourself.",
        "choicePrompt": "Right now, I am experiencing…",
        "options": [
          {
            "id": "option-1",
            "label": "a slow start."
          },
          {
            "id": "option-2",
            "label": "a foggy mind."
          },
          {
            "id": "option-3",
            "label": "a heavy body."
          },
          {
            "id": "option-4",
            "label": "a racing mind."
          }
        ],
        "action": "Say the selected phrase silently once. No physical task is required.",
        "observation": "A state is something you are in. It is not who you are.",
        "reflection": "Which words felt more accurate: “I am…” or “I’m experiencing…”?",
        "completion": "Tap “This is a state, not my identity.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "0e5d69e8eb8e"
      },
      {
        "id": "SW-04",
        "sourceId": "SW-04",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Choose",
        "title": "The First Choice",
        "beliefUnderTest": "“I have no choice until I feel motivated.”",
        "capability": "Make one conscious decision before automatic habits begin.",
        "prompt": "Who makes the first decision of your day?",
        "choicePrompt": "For the next 20 seconds, choose one:",
        "options": [
          {
            "id": "option-1",
            "label": "Stay exactly as I am."
          },
          {
            "id": "option-2",
            "label": "Begin with one small move."
          }
        ],
        "action": "If “Begin” is selected, place both feet on the floor. If “Stay” is selected, pause for 20 seconds, then choose again without guilt.",
        "observation": "A decision can arrive before motivation.",
        "reflection": "What made the smaller choice possible?",
        "completion": "Tap “I made the first choice.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "3f1dc81ccf36"
      },
      {
        "id": "SW-05",
        "sourceId": "SW-05",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Choose",
        "title": "Before the Phone",
        "beliefUnderTest": "“Checking my phone is how I start.”",
        "capability": "Create a short intentional gap before attention is captured.",
        "prompt": "Before the world arrives, keep one minute for yourself.",
        "choicePrompt": "Could your phone wait for 60 seconds?",
        "options": [
          {
            "id": "option-1",
            "label": "Yes."
          },
          {
            "id": "option-2",
            "label": "Maybe."
          },
          {
            "id": "option-3",
            "label": "That feels hard."
          }
        ],
        "action": "Place the phone face down or out of reach for 60 seconds.",
        "observation": "Notice what reaches for your attention when the phone does not.",
        "reflection": "What showed up first: urge, calm, planning, or nothing?",
        "completion": "Tap “I chose the order.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "cb1171a83e0b"
      },
      {
        "id": "SW-06",
        "sourceId": "SW-06",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Choose",
        "title": "One Alarm, One Beginning",
        "beliefUnderTest": "“Another snooze will help me start better.”",
        "capability": "Notice the difference between delaying discomfort and beginning the transition.",
        "prompt": "Tomorrow, test one clean beginning.",
        "choicePrompt": "What would one alarm make easier?",
        "options": [
          {
            "id": "option-1",
            "label": "Less negotiation."
          },
          {
            "id": "option-2",
            "label": "Less anxiety."
          },
          {
            "id": "option-3",
            "label": "I’m unsure."
          }
        ],
        "action": "Set one wake alarm for the intended time. The app offers an optional reminder to place the device beyond immediate reach; it does not control the system alarm.",
        "observation": "Tomorrow, compare a single beginning with repeated re-starts.",
        "reflection": "After the next morning: did one alarm change the first minute?",
        "completion": "This experience completes after the next-session reflection.",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "24a86f9d500f"
      },
      {
        "id": "SW-07",
        "sourceId": "SW-07",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Influence",
        "title": "Feet on the Floor",
        "beliefUnderTest": "“Nothing changes until I feel awake.”",
        "capability": "Experience that a safe, small action can influence the state.",
        "prompt": "Before we begin, make a prediction.",
        "choicePrompt": "If you stand for 20 seconds, what do you expect?",
        "options": [
          {
            "id": "option-1",
            "label": "Nothing will change."
          },
          {
            "id": "option-2",
            "label": "Maybe a little."
          },
          {
            "id": "option-3",
            "label": "I’ll feel more awake."
          }
        ],
        "action": "Stand safely for 20 seconds. The app uses a simple visible timer and no automatic detection.",
        "observation": "Was your prediction accurate?",
        "reflection": "What changed first, if anything?",
        "completion": "Select “Nothing,” “A little,” or “More than expected.” All are valid.",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "0e31402cd6e0"
      },
      {
        "id": "SW-08",
        "sourceId": "SW-08",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Influence",
        "title": "Leave the Bed",
        "beliefUnderTest": "“Staying here is the only way to recover.”",
        "capability": "Test whether a change of location changes the first minute.",
        "prompt": "Let’s test a change of place.",
        "choicePrompt": "If you move away from the bed for one minute, what might shift?",
        "options": [
          {
            "id": "option-1",
            "label": "Nothing."
          },
          {
            "id": "option-2",
            "label": "My body."
          },
          {
            "id": "option-3",
            "label": "My attention."
          },
          {
            "id": "option-4",
            "label": "I’m unsure."
          }
        ],
        "action": "Move to a safe nearby place: doorway, chair, window, or another room. Stay there for one minute.",
        "observation": "Compare the room you left with where you are now.",
        "reflection": "Did location change your body, attention, or both?",
        "completion": "Tap “I tested a new place.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "8addca367cd8"
      },
      {
        "id": "SW-09",
        "sourceId": "SW-09",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Influence",
        "title": "Make a Small Difference",
        "beliefUnderTest": "“My morning is already decided.”",
        "capability": "Choose one safe input and observe its effect.",
        "prompt": "Choose one small signal for your body.",
        "choicePrompt": "Which signal would you like to test?",
        "options": [
          {
            "id": "option-1",
            "label": "Light."
          },
          {
            "id": "option-2",
            "label": "Water."
          },
          {
            "id": "option-3",
            "label": "A few steps."
          },
          {
            "id": "option-4",
            "label": "Fresh air."
          }
        ],
        "action": "Complete the chosen safe action for up to two minutes.",
        "observation": "You did not need to fix the morning. You changed one condition.",
        "reflection": "Did your chosen signal make any difference?",
        "completion": "Choose “yes,” “a little,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "33bc032811ba"
      },
      {
        "id": "SW-10",
        "sourceId": "SW-10",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Activate",
        "title": "Find the First Light",
        "beliefUnderTest": "“Light is background, not part of waking.”",
        "capability": "Use available light intentionally as an environmental cue.",
        "prompt": "Where is the brightest safe place you can reach right now?",
        "choicePrompt": "What might change if you spend two minutes there?",
        "options": [
          {
            "id": "option-1",
            "label": "My eyes."
          },
          {
            "id": "option-2",
            "label": "My body."
          },
          {
            "id": "option-3",
            "label": "My mood."
          },
          {
            "id": "option-4",
            "label": "I’m unsure."
          }
        ],
        "action": "Open curtains or go to a bright, safe window/outdoor location for two minutes. The user may keep sunglasses or avoid direct sun where needed.",
        "observation": "Notice the room and your attention after the light changes.",
        "reflection": "What did light change, if anything?",
        "completion": "Tap “I found my first light.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "32e0d17de9d0"
      },
      {
        "id": "SW-11",
        "sourceId": "SW-11",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Activate",
        "title": "Wake Through Movement",
        "beliefUnderTest": "“I need a workout to feel different.”",
        "capability": "Discover that small movement can be enough to begin activation.",
        "prompt": "Try the smallest movement that feels safe today.",
        "choicePrompt": "Could 60 seconds matter?",
        "options": [
          {
            "id": "option-1",
            "label": "Probably not."
          },
          {
            "id": "option-2",
            "label": "Maybe."
          },
          {
            "id": "option-3",
            "label": "I think so."
          }
        ],
        "action": "Choose one: walk slowly, stretch arms, roll shoulders, or march in place for 60 seconds.",
        "observation": "Notice temperature, breath, posture, or attention.",
        "reflection": "Which signal arrived first?",
        "completion": "Tap “I moved on purpose.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "887debd1b948"
      },
      {
        "id": "SW-12",
        "sourceId": "SW-12",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Activate",
        "title": "Build Your Activation Set",
        "beliefUnderTest": "“There is one perfect routine.”",
        "capability": "Identify a small, personal combination of cues that feels usable.",
        "prompt": "Choose two signals that helped even a little.",
        "choicePrompt": "Which pair feels most realistic tomorrow?",
        "options": [
          {
            "id": "option-1",
            "label": "Light + movement."
          },
          {
            "id": "option-2",
            "label": "Water + movement."
          },
          {
            "id": "option-3",
            "label": "Light + a quiet minute."
          },
          {
            "id": "option-4",
            "label": "My own pair."
          }
        ],
        "action": "Complete the selected pair in any safe order; app presents a short sequence with editable order.",
        "observation": "Your activation set can be simple and personal.",
        "reflection": "Would this be realistic on an ordinary morning?",
        "completion": "Choose “yes,” “with changes,” or “not yet.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "ebdf1d8e6773"
      },
      {
        "id": "SW-13",
        "sourceId": "SW-13",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "A Hard-Morning Route",
        "beliefUnderTest": "“Bad sleep means the day is lost.”",
        "capability": "Select a minimum viable transition after a difficult night.",
        "prompt": "Today may not be a full-practice morning. What is the smallest helpful beginning?",
        "choicePrompt": "Which one is possible right now?",
        "options": [
          {
            "id": "option-1",
            "label": "Change position."
          },
          {
            "id": "option-2",
            "label": "Find some light."
          },
          {
            "id": "option-3",
            "label": "Drink water."
          },
          {
            "id": "option-4",
            "label": "Take three slow steps."
          },
          {
            "id": "option-5",
            "label": "Rest and return later."
          }
        ],
        "action": "Complete the selected minimum action, or choose rest/return later.",
        "observation": "A difficult morning still allows one influence.",
        "reflection": "What was possible without forcing it?",
        "completion": "All routes complete.",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "155bb51201bb"
      },
      {
        "id": "SW-14",
        "sourceId": "SW-14",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Choose Your Own Route",
        "beliefUnderTest": "“The app must tell me what to do.”",
        "capability": "Select a self-directed sequence from learned cues.",
        "prompt": "You know more about this morning than we do. What do you need first?",
        "choicePrompt": "Choose your first signal.",
        "options": [
          {
            "id": "option-1",
            "label": "A change of place."
          },
          {
            "id": "option-2",
            "label": "Light."
          },
          {
            "id": "option-3",
            "label": "Movement."
          },
          {
            "id": "option-4",
            "label": "Quiet."
          },
          {
            "id": "option-5",
            "label": "My own choice."
          }
        ],
        "action": "Build a two-step route from previously completed actions. The app guides only pacing, not the choice.",
        "observation": "You designed the beginning.",
        "reflection": "Did your route fit today?",
        "completion": "Choose “yes,” “partly,” or “try a different route tomorrow.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "f07fb68f3002"
      },
      {
        "id": "SW-15",
        "sourceId": "SW-15",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Morning Without Mirellis",
        "beliefUnderTest": "“I need the app to begin well.”",
        "capability": "Practice a self-guided morning and return only to reflect.",
        "prompt": "Tomorrow, begin without opening Mirellis.",
        "choicePrompt": "What will you do first?",
        "options": [
          {
            "id": "option-1",
            "label": "Select from my activation set."
          },
          {
            "id": "option-2",
            "label": "Write my own first action."
          },
          {
            "id": "option-3",
            "label": "I’m not ready yet."
          }
        ],
        "action": "On the next morning, the user completes the selected action without opening the experience runner. When they later open the app, it asks only for a reflection.",
        "observation": "You can guide a morning without a script.",
        "reflection": "What did you do, and what did you learn?",
        "completion": "Select “I guided myself,” “I needed support,” or “I’ll try again.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "885b0b0d85f2"
      }
    ]
  },
  {
    "id": "wakefulness-readiness",
    "title": "Wakefulness → Readiness",
    "question": "Can I choose how the day begins?",
    "states": [
      "Arrive",
      "Protect",
      "Orient",
      "Begin",
      "Self-direct"
    ],
    "experiences": [
      {
        "id": "WR-01",
        "sourceId": "WR-01",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Arrive",
        "title": "Start Where You Are",
        "beliefUnderTest": "“I need to feel completely ready before I can begin.”",
        "capability": "Name the current starting state without judging it.",
        "prompt": "Before the day asks anything of you, notice where you are.",
        "choicePrompt": "Which feels closest right now?",
        "options": [
          {
            "id": "option-1",
            "label": "Quiet and slow."
          },
          {
            "id": "option-2",
            "label": "Awake but scattered."
          },
          {
            "id": "option-3",
            "label": "Already pulled in many directions."
          },
          {
            "id": "option-4",
            "label": "Ready to begin."
          }
        ],
        "action": "Take one slow breath and remain with the chosen description for 10 seconds.",
        "observation": "A starting state is information. It is not a verdict on the day.",
        "reflection": "Did the description make the moment clearer?",
        "completion": "Tap “I know where I am starting.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "9d1f250a1560"
      },
      {
        "id": "WR-02",
        "sourceId": "WR-02",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Arrive",
        "title": "One Horizon",
        "beliefUnderTest": "“I need to solve the whole day before I can start.”",
        "capability": "Reduce the day to the next workable window.",
        "prompt": "The whole day can wait. What is the next small window?",
        "choicePrompt": "Choose the horizon that feels possible.",
        "options": [
          {
            "id": "option-1",
            "label": "The next 5 minutes."
          },
          {
            "id": "option-2",
            "label": "The next 10 minutes."
          },
          {
            "id": "option-3",
            "label": "Until breakfast."
          },
          {
            "id": "option-4",
            "label": "I need a gentler start."
          }
        ],
        "action": "Hold only the selected horizon in mind. No task list is shown.",
        "observation": "You do not need a plan for everything to have a beginning.",
        "reflection": "Did the smaller horizon make the day feel more reachable?",
        "completion": "Choose “Yes,” “a little,” or “not yet.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "35e2ff8a4f37"
      },
      {
        "id": "WR-03",
        "sourceId": "WR-03",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Arrive",
        "title": "Notice the Pull",
        "beliefUnderTest": "“I have to respond to everything that reaches me.”",
        "capability": "Recognize an external pull before automatically following it.",
        "prompt": "Before you open anything else, notice what is pulling at you.",
        "choicePrompt": "Which pull is loudest?",
        "options": [
          {
            "id": "option-1",
            "label": "Messages."
          },
          {
            "id": "option-2",
            "label": "News or social feeds."
          },
          {
            "id": "option-3",
            "label": "A task I must remember."
          },
          {
            "id": "option-4",
            "label": "Nothing in particular."
          }
        ],
        "action": "Name the pull, then wait 15 seconds before choosing whether to follow it.",
        "observation": "A pull can be noticed before it becomes the direction of the morning.",
        "reflection": "Did naming the pull create even a little space?",
        "completion": "Tap “I noticed the pull.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "8579392ba244"
      },
      {
        "id": "WR-04",
        "sourceId": "WR-04",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Protect",
        "title": "The First Boundary",
        "beliefUnderTest": "“The first thing that arrives should decide my first attention.”",
        "capability": "Choose a brief boundary before new input.",
        "prompt": "Give the beginning of the day a small boundary.",
        "choicePrompt": "How long can you keep new input outside the first moment?",
        "options": [
          {
            "id": "option-1",
            "label": "30 seconds."
          },
          {
            "id": "option-2",
            "label": "60 seconds."
          },
          {
            "id": "option-3",
            "label": "Keep essentials available."
          },
          {
            "id": "option-4",
            "label": "Not today."
          }
        ],
        "action": "For the chosen interval, place the phone face down, close the current feed, or simply do not open another app.",
        "observation": "A boundary is not avoidance. It is choosing the order of attention.",
        "reflection": "What did you notice inside the boundary?",
        "completion": "Choose “Space,” “urge,” “nothing,” or “not sure.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "addbe7751d2f"
      },
      {
        "id": "WR-05",
        "sourceId": "WR-05",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Protect",
        "title": "Let One Thing Wait",
        "beliefUnderTest": "“If I do not handle it now, I will lose control of it.”",
        "capability": "Deliberately defer one non-urgent item.",
        "prompt": "Choose one non-urgent thing that can wait until your first window is complete.",
        "choicePrompt": "What can wait without causing harm?",
        "options": [
          {
            "id": "option-1",
            "label": "A message."
          },
          {
            "id": "option-2",
            "label": "A feed."
          },
          {
            "id": "option-3",
            "label": "A minor decision."
          },
          {
            "id": "option-4",
            "label": "Nothing can wait today."
          }
        ],
        "action": "If an item is selected, add a one-line local reminder: “Return after my first window.”",
        "observation": "You did not ignore it. You gave it a place.",
        "reflection": "Did giving it a place make it easier to leave for now?",
        "completion": "Choose “Yes,” “partly,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "9f48df67bb40"
      },
      {
        "id": "WR-06",
        "sourceId": "WR-06",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Protect",
        "title": "Keep One Space Clear",
        "beliefUnderTest": "“Readiness requires a perfect, distraction-free environment.”",
        "capability": "Create one small clear space to begin.",
        "prompt": "What is one small space you can keep clear for the next few minutes?",
        "choicePrompt": "Choose the easiest space to clear.",
        "options": [
          {
            "id": "option-1",
            "label": "A physical surface."
          },
          {
            "id": "option-2",
            "label": "My phone screen."
          },
          {
            "id": "option-3",
            "label": "One browser tab."
          },
          {
            "id": "option-4",
            "label": "My attention only."
          }
        ],
        "action": "Clear or simplify the chosen space for up to two minutes.",
        "observation": "You do not need to organize everything to create one place to begin.",
        "reflection": "Did the clearer space change the next step?",
        "completion": "Choose “Yes,” “a little,” or “not sure.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "5a0da437683c"
      },
      {
        "id": "WR-07",
        "sourceId": "WR-07",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Orient",
        "title": "One Meaningful Direction",
        "beliefUnderTest": "“I must choose the most urgent thing, even if it is not the right beginning.”",
        "capability": "Name one direction for the first window.",
        "prompt": "For the next small window, what would make the beginning feel honest?",
        "choicePrompt": "Choose a direction.",
        "options": [
          {
            "id": "option-1",
            "label": "Care for myself."
          },
          {
            "id": "option-2",
            "label": "Care for someone else."
          },
          {
            "id": "option-3",
            "label": "Prepare for work or study."
          },
          {
            "id": "option-4",
            "label": "Finish one necessary thing."
          }
        ],
        "action": "Select one direction. The app does not score or rank it.",
        "observation": "A direction is enough. The full plan can come later.",
        "reflection": "Did choosing a direction reduce the number of possibilities?",
        "completion": "Tap “I have a direction.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "8be237973964"
      },
      {
        "id": "WR-08",
        "sourceId": "WR-08",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Orient",
        "title": "Make the First Step Visible",
        "beliefUnderTest": "“I should wait until I know exactly how the whole thing will go.”",
        "capability": "Identify the visible first step, not the entire sequence.",
        "prompt": "What is the first visible step in your chosen direction?",
        "choicePrompt": "Choose the form of the first step.",
        "options": [
          {
            "id": "option-1",
            "label": "Open or place one thing."
          },
          {
            "id": "option-2",
            "label": "Write one line."
          },
          {
            "id": "option-3",
            "label": "Move to one place."
          },
          {
            "id": "option-4",
            "label": "Ask someone one question."
          }
        ],
        "action": "Describe the step in no more than 60 characters, or choose a supplied example.",
        "observation": "A beginning becomes easier when it can be seen.",
        "reflection": "Could another person tell when you had begun?",
        "completion": "Choose “Yes,” “almost,” or “I need to make it smaller.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "1b9c4ef8799c"
      },
      {
        "id": "WR-09",
        "sourceId": "WR-09",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Orient",
        "title": "Prepare One Tool",
        "beliefUnderTest": "“I need more motivation before I can start.”",
        "capability": "Reduce friction by preparing one needed tool or place.",
        "prompt": "What one thing would make the first step easier to begin?",
        "choicePrompt": "Choose one small preparation.",
        "options": [
          {
            "id": "option-1",
            "label": "Put it in reach."
          },
          {
            "id": "option-2",
            "label": "Open it."
          },
          {
            "id": "option-3",
            "label": "Find a place."
          },
          {
            "id": "option-4",
            "label": "Make it quieter."
          }
        ],
        "action": "Complete the chosen preparation for up to two minutes.",
        "observation": "You did not need motivation to make the beginning easier.",
        "reflection": "Did the first step feel closer after preparation?",
        "completion": "Choose “Closer,” “a little,” or “not yet.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "7f4b25beb3aa"
      },
      {
        "id": "WR-10",
        "sourceId": "WR-10",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Begin",
        "title": "Two Minutes Is a Beginning",
        "beliefUnderTest": "“Starting only counts if I can do a lot.”",
        "capability": "Begin a chosen first step for two minutes or less.",
        "prompt": "Let the first step exist for two minutes.",
        "choicePrompt": "What do you expect after two minutes?",
        "options": [
          {
            "id": "option-1",
            "label": "Nothing will change."
          },
          {
            "id": "option-2",
            "label": "I may continue."
          },
          {
            "id": "option-3",
            "label": "I will know more clearly what to do."
          }
        ],
        "action": "Do the saved first step for two minutes. Pause, stop, or reduce the step at any time.",
        "observation": "Compare the beginning with the moment before you started.",
        "reflection": "Was your prediction accurate?",
        "completion": "Choose “Yes,” “not exactly,” or “I was surprised.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "cf4c88aff7db"
      },
      {
        "id": "WR-11",
        "sourceId": "WR-11",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Begin",
        "title": "Return to the Point",
        "beliefUnderTest": "“If I get distracted, the beginning is ruined.”",
        "capability": "Practice returning after one interruption without restarting the whole morning.",
        "prompt": "If you are pulled away, what would a return look like?",
        "choicePrompt": "Choose a return cue.",
        "options": [
          {
            "id": "option-1",
            "label": "Look at my first step."
          },
          {
            "id": "option-2",
            "label": "Take one breath."
          },
          {
            "id": "option-3",
            "label": "Go back to my place."
          },
          {
            "id": "option-4",
            "label": "Make the step smaller."
          }
        ],
        "action": "If an interruption occurs today, use the selected cue once. Otherwise, rehearse the cue now.",
        "observation": "A return is still part of beginning.",
        "reflection": "Did the cue make returning more possible?",
        "completion": "Choose “Yes,” “partly,” or “I will test it later.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "ddaeac0996d6"
      },
      {
        "id": "WR-12",
        "sourceId": "WR-12",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Begin",
        "title": "Keep It Workable",
        "beliefUnderTest": "“If the original plan does not work, I have failed.”",
        "capability": "Adapt the first step when the morning changes.",
        "prompt": "What would make today’s first step more workable?",
        "choicePrompt": "Choose one adjustment.",
        "options": [
          {
            "id": "option-1",
            "label": "Make it smaller."
          },
          {
            "id": "option-2",
            "label": "Change the place."
          },
          {
            "id": "option-3",
            "label": "Change the time."
          },
          {
            "id": "option-4",
            "label": "Choose a different direction."
          }
        ],
        "action": "Apply the chosen adjustment now or save it for the next window.",
        "observation": "Adaptation is not abandoning the beginning.",
        "reflection": "Did the adjusted step fit today better?",
        "completion": "Choose “Yes,” “partly,” or “try another adjustment.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "f50a01105b20"
      },
      {
        "id": "WR-13",
        "sourceId": "WR-13",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "A Difficult Day Still Has a Beginning",
        "beliefUnderTest": "“If today is difficult, there is no point in trying.”",
        "capability": "Choose a minimum viable beginning for a hard morning.",
        "prompt": "Today may need a smaller beginning. What is possible?",
        "choicePrompt": "Choose the minimum route.",
        "options": [
          {
            "id": "option-1",
            "label": "Drink or eat if appropriate."
          },
          {
            "id": "option-2",
            "label": "Sit somewhere different."
          },
          {
            "id": "option-3",
            "label": "Send one necessary message."
          },
          {
            "id": "option-4",
            "label": "Return later."
          }
        ],
        "action": "Complete the selected action only if safe and appropriate; the user may end the session immediately.",
        "observation": "A smaller beginning still counts as a beginning.",
        "reflection": "Did the minimum route respect today?",
        "completion": "Choose “Yes,” “partly,” or “I need care elsewhere.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "f48f718a0e1f"
      },
      {
        "id": "WR-14",
        "sourceId": "WR-14",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Build My Beginning",
        "beliefUnderTest": "“The app must choose the right beginning for me.”",
        "capability": "Create a self-directed two-step readiness route from previously experienced cues.",
        "prompt": "You know more about this morning than we do. What do you need first?",
        "choicePrompt": "Choose two cues for today.",
        "options": [
          {
            "id": "option-1",
            "label": "A boundary."
          },
          {
            "id": "option-2",
            "label": "A clear space."
          },
          {
            "id": "option-3",
            "label": "One direction."
          },
          {
            "id": "option-4",
            "label": "A smaller first step."
          },
          {
            "id": "option-5",
            "label": "My own choice."
          }
        ],
        "action": "Arrange two selected cues in order. The app only provides pacing and a “begin” button.",
        "observation": "You designed the beginning.",
        "reflection": "Did your route fit today?",
        "completion": "Choose “Yes,” “partly,” or “try a different route tomorrow.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "5f7f8d2c6c5c"
      },
      {
        "id": "WR-15",
        "sourceId": "WR-15",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Begin Without Mirellis",
        "beliefUnderTest": "“I need the app in order to begin intentionally.”",
        "capability": "Practice a self-guided beginning and return only to reflect.",
        "prompt": "Tomorrow, begin without opening Mirellis.",
        "choicePrompt": "What will you do first?",
        "options": [
          {
            "id": "option-1",
            "label": "Use my saved route."
          },
          {
            "id": "option-2",
            "label": "Choose one cue in the moment."
          },
          {
            "id": "option-3",
            "label": "I am not ready yet."
          }
        ],
        "action": "On the next day, complete the chosen first cue before opening the app. When the user later returns, show only the reflection screen.",
        "observation": "You can begin with your own judgment.",
        "reflection": "What did you do, and did it fit the day?",
        "completion": "Choose “I guided myself,” “I needed support,” or “I will try again.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "6323d1f49660"
      }
    ]
  },
  {
    "id": "readiness-focus",
    "title": "Readiness → Deep Focus",
    "question": "Can I create and return to one chosen attention window?",
    "states": [
      "Select",
      "Prepare",
      "Enter",
      "Sustain",
      "Self-direct"
    ],
    "experiences": [
      {
        "id": "DF-01",
        "sourceId": "DF-01",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Select",
        "title": "Find the Point",
        "beliefUnderTest": "“I have too many things to focus on to begin.”",
        "capability": "Name one point of attention for the next focus window.",
        "prompt": "What deserves your attention for the next small window?",
        "choicePrompt": "Choose one point.",
        "options": [
          {
            "id": "option-1",
            "label": "One piece of work."
          },
          {
            "id": "option-2",
            "label": "One conversation."
          },
          {
            "id": "option-3",
            "label": "One thing I need to learn."
          },
          {
            "id": "option-4",
            "label": "One necessary task."
          }
        ],
        "action": "Name the point in 60 characters or choose a supplied example.",
        "observation": "One point is not the whole day. It is only where you begin.",
        "reflection": "Does one point feel clearer than everything at once?",
        "completion": "Tap “I have a point.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "40f364ac7611"
      },
      {
        "id": "DF-02",
        "sourceId": "DF-02",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Select",
        "title": "Choose a Window",
        "beliefUnderTest": "“Focus only counts if I can do it for a long time.”",
        "capability": "Set a realistic, self-chosen attention window.",
        "prompt": "How long is realistic for this beginning?",
        "choicePrompt": "Choose a window that fits today.",
        "options": [
          {
            "id": "option-1",
            "label": "5 minutes."
          },
          {
            "id": "option-2",
            "label": "10 minutes."
          },
          {
            "id": "option-3",
            "label": "20 minutes."
          },
          {
            "id": "option-4",
            "label": "I need a smaller start."
          }
        ],
        "action": "Choose the window. The app does not schedule the rest of the day.",
        "observation": "A smaller window can still be a real focus period.",
        "reflection": "Does the chosen window feel possible rather than impressive?",
        "completion": "Choose “Yes,” “with changes,” or “smaller.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "fb511336adff"
      },
      {
        "id": "DF-03",
        "sourceId": "DF-03",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Select",
        "title": "Name the Pull",
        "beliefUnderTest": "“Every thought or notification needs my attention now.”",
        "capability": "Recognize the primary pull competing with the chosen point.",
        "prompt": "What is most likely to pull you away?",
        "choicePrompt": "Name the first pull you expect.",
        "options": [
          {
            "id": "option-1",
            "label": "Messages."
          },
          {
            "id": "option-2",
            "label": "Open tasks."
          },
          {
            "id": "option-3",
            "label": "A thought I might forget."
          },
          {
            "id": "option-4",
            "label": "Something else."
          }
        ],
        "action": "Name the pull and choose “Handle now” or “Return after my window.”",
        "observation": "A pull can be named before it becomes the direction of attention.",
        "reflection": "Did naming the pull change how urgent it felt?",
        "completion": "Tap “I noticed the pull.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "be36a711a738"
      },
      {
        "id": "DF-04",
        "sourceId": "DF-04",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Prepare",
        "title": "Make a Boundary",
        "beliefUnderTest": "“I must be available to everything while I focus.”",
        "capability": "Choose one voluntary boundary for a focus window.",
        "prompt": "What one boundary would protect this window?",
        "choicePrompt": "Choose the smallest boundary that fits.",
        "options": [
          {
            "id": "option-1",
            "label": "Close one unrelated tab."
          },
          {
            "id": "option-2",
            "label": "Put one device aside."
          },
          {
            "id": "option-3",
            "label": "Keep essentials only."
          },
          {
            "id": "option-4",
            "label": "No boundary today."
          }
        ],
        "action": "Apply the selected boundary for the chosen window.",
        "observation": "A boundary is not withdrawal. It is choosing what enters this window.",
        "reflection": "Did the boundary make the point easier to return to?",
        "completion": "Choose “Yes,” “a little,” or “not sure.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "9f645aab75fb"
      },
      {
        "id": "DF-05",
        "sourceId": "DF-05",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Prepare",
        "title": "Put the First Thing in Reach",
        "beliefUnderTest": "“I will start when I feel more motivated.”",
        "capability": "Reduce one friction between the user and the focus point.",
        "prompt": "What one thing would make beginning easier?",
        "choicePrompt": "Choose one preparation.",
        "options": [
          {
            "id": "option-1",
            "label": "Open it."
          },
          {
            "id": "option-2",
            "label": "Put it in reach."
          },
          {
            "id": "option-3",
            "label": "Go to one place."
          },
          {
            "id": "option-4",
            "label": "Make the space quieter."
          }
        ],
        "action": "Complete the selected preparation for up to two minutes.",
        "observation": "You did not need motivation to make the beginning closer.",
        "reflection": "Did the point become easier to begin?",
        "completion": "Choose “Closer,” “a little,” or “not yet.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "fd2d41654096"
      },
      {
        "id": "DF-06",
        "sourceId": "DF-06",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Prepare",
        "title": "Give the Rest a Place",
        "beliefUnderTest": "“If I do not hold every other concern in mind, I will lose it.”",
        "capability": "Set aside one open loop without pretending it is solved.",
        "prompt": "What can be placed outside this window without being ignored?",
        "choicePrompt": "Choose one kind of open loop.",
        "options": [
          {
            "id": "option-1",
            "label": "A message."
          },
          {
            "id": "option-2",
            "label": "A thought to remember."
          },
          {
            "id": "option-3",
            "label": "A later task."
          },
          {
            "id": "option-4",
            "label": "Nothing can wait."
          }
        ],
        "action": "Optionally write one local note, maximum 80 characters: “Return after this window.”",
        "observation": "Giving something a place is different from carrying it everywhere.",
        "reflection": "Did the note make space for the chosen point?",
        "completion": "Choose “Yes,” “partly,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "9459cd048860"
      },
      {
        "id": "DF-07",
        "sourceId": "DF-07",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Enter",
        "title": "The Smallest Start",
        "beliefUnderTest": "“I need to feel ready before I begin.”",
        "capability": "Begin the focus point with the smallest visible unit.",
        "prompt": "What is the smallest visible start?",
        "choicePrompt": "Choose the form of the first unit.",
        "options": [
          {
            "id": "option-1",
            "label": "Read one paragraph."
          },
          {
            "id": "option-2",
            "label": "Write one line."
          },
          {
            "id": "option-3",
            "label": "Open one file."
          },
          {
            "id": "option-4",
            "label": "Make one first move."
          }
        ],
        "action": "Do the chosen unit. No timer is required.",
        "observation": "Beginning can arrive before the feeling of readiness.",
        "reflection": "Did the first unit change your relationship to the point?",
        "completion": "Choose “Yes,” “a little,” or “not yet.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "aa910e9a14ba"
      },
      {
        "id": "DF-08",
        "sourceId": "DF-08",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Enter",
        "title": "Stay for the Window",
        "beliefUnderTest": "“If I want to leave, the focus window is over.”",
        "capability": "Experience a chosen period of returning to one point.",
        "prompt": "Let this window belong to one point.",
        "choicePrompt": "What do you expect during the window?",
        "options": [
          {
            "id": "option-1",
            "label": "I will stay with it."
          },
          {
            "id": "option-2",
            "label": "I will be pulled away."
          },
          {
            "id": "option-3",
            "label": "I am not sure."
          }
        ],
        "action": "Start the selected 5-, 10-, or 20-minute timer. Pause, finish early, or use the minimum route at any time.",
        "observation": "Notice how many times you can return—not how perfectly you stay.",
        "reflection": "What happened most: stayed, returned, paused, or changed the plan?",
        "completion": "Choose one response. Every response completes the exposure.",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "21f669746529"
      },
      {
        "id": "DF-09",
        "sourceId": "DF-09",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Enter",
        "title": "Return Without Restarting",
        "beliefUnderTest": "“One interruption means I have failed at focus.”",
        "capability": "Use a single return cue after a distraction or interruption.",
        "prompt": "If you are pulled away, how will you return?",
        "choicePrompt": "Choose one return cue.",
        "options": [
          {
            "id": "option-1",
            "label": "Look at the first unit."
          },
          {
            "id": "option-2",
            "label": "Read the next line."
          },
          {
            "id": "option-3",
            "label": "Take one breath."
          },
          {
            "id": "option-4",
            "label": "Make the point smaller."
          }
        ],
        "action": "If interrupted, use the cue once. If not interrupted, rehearse it now.",
        "observation": "A return is still part of the focus window.",
        "reflection": "Did the cue make return more possible?",
        "completion": "Choose “Yes,” “partly,” or “I will test it later.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "33db5e9cd467"
      },
      {
        "id": "DF-10",
        "sourceId": "DF-10",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Sustain",
        "title": "Make Distraction a Choice",
        "beliefUnderTest": "“If I feel an urge to switch, I must switch immediately.”",
        "capability": "Create a short pause between an urge and an action.",
        "prompt": "When you feel the urge to switch, test a 10-second pause.",
        "choicePrompt": "What will the pause change?",
        "options": [
          {
            "id": "option-1",
            "label": "Nothing."
          },
          {
            "id": "option-2",
            "label": "I may return."
          },
          {
            "id": "option-3",
            "label": "I may still switch, but more consciously."
          }
        ],
        "action": "At the next urge, wait 10 seconds, then choose “Return” or “Switch.”",
        "observation": "Both choices are allowed. The experiment is noticing the gap.",
        "reflection": "Did the pause change the choice?",
        "completion": "Choose “Yes,” “a little,” or “not sure.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "d835e71bb1c1"
      },
      {
        "id": "DF-11",
        "sourceId": "DF-11",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Sustain",
        "title": "Adjust the Container",
        "beliefUnderTest": "“If this window is hard, I should push through exactly as planned.”",
        "capability": "Adjust the duration, environment, or point without abandoning the session.",
        "prompt": "What would make this window more workable?",
        "choicePrompt": "Choose one adjustment.",
        "options": [
          {
            "id": "option-1",
            "label": "Make it shorter."
          },
          {
            "id": "option-2",
            "label": "Change the place."
          },
          {
            "id": "option-3",
            "label": "Reduce the point."
          },
          {
            "id": "option-4",
            "label": "Take a deliberate break."
          }
        ],
        "action": "Apply the selected adjustment now or set it for the next window.",
        "observation": "Adjustment is part of focus, not proof that focus is missing.",
        "reflection": "Did the adjusted container fit better?",
        "completion": "Choose “Yes,” “partly,” or “try another adjustment.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "e7e81046f9d4"
      },
      {
        "id": "DF-12",
        "sourceId": "DF-12",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Sustain",
        "title": "Close on Purpose",
        "beliefUnderTest": "“Focus ends only when I run out of energy or get interrupted.”",
        "capability": "End a focus window intentionally and preserve a next step.",
        "prompt": "Before you leave the point, give it a clean close.",
        "choicePrompt": "What would make return easier later?",
        "options": [
          {
            "id": "option-1",
            "label": "Name the next visible step."
          },
          {
            "id": "option-2",
            "label": "Leave one line for later."
          },
          {
            "id": "option-3",
            "label": "Put the first thing in view."
          },
          {
            "id": "option-4",
            "label": "End without a note."
          }
        ],
        "action": "Complete the chosen close in 30 seconds or less.",
        "observation": "A clean close can make the next beginning gentler.",
        "reflection": "Did the close make future return clearer?",
        "completion": "Choose “Yes,” “a little,” or “not needed today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "8e519a4e17bb"
      },
      {
        "id": "DF-13",
        "sourceId": "DF-13",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "A Difficult Focus Day",
        "beliefUnderTest": "“If I cannot focus deeply today, there is no useful beginning.”",
        "capability": "Choose a minimum viable engagement route for a difficult day.",
        "prompt": "Today may need a smaller focus route. What is possible?",
        "choicePrompt": "Choose the minimum engagement.",
        "options": [
          {
            "id": "option-1",
            "label": "Name one point."
          },
          {
            "id": "option-2",
            "label": "Do one smallest unit."
          },
          {
            "id": "option-3",
            "label": "Create one clear space."
          },
          {
            "id": "option-4",
            "label": "Return later."
          }
        ],
        "action": "Complete the selected action only if safe and appropriate; the user may end the session immediately.",
        "observation": "A minimum route can respect the day without abandoning yourself.",
        "reflection": "Did the route fit today?",
        "completion": "Choose “Yes,” “partly,” or “I need care elsewhere.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "a0551c9c9531"
      },
      {
        "id": "DF-14",
        "sourceId": "DF-14",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Build My Focus Route",
        "beliefUnderTest": "“The app must tell me how to focus.”",
        "capability": "Create a self-directed focus route from previously experienced cues.",
        "prompt": "You know more about this window than we do. What do you need first?",
        "choicePrompt": "Choose two cues for today.",
        "options": [
          {
            "id": "option-1",
            "label": "One point."
          },
          {
            "id": "option-2",
            "label": "A boundary."
          },
          {
            "id": "option-3",
            "label": "A clear first unit."
          },
          {
            "id": "option-4",
            "label": "A shorter window."
          },
          {
            "id": "option-5",
            "label": "My own choice."
          }
        ],
        "action": "Arrange two selected cues in order. The app only provides pacing and Begin.",
        "observation": "You designed the container for your own attention.",
        "reflection": "Did your route fit today?",
        "completion": "Choose “Yes,” “partly,” or “try a different route tomorrow.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "c0330a10475b"
      },
      {
        "id": "DF-15",
        "sourceId": "DF-15",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Focus Without Mirellis",
        "beliefUnderTest": "“I need the app to enter a focus window.”",
        "capability": "Practice a self-guided focus window and return only to reflect.",
        "prompt": "For your next window, begin without opening Mirellis.",
        "choicePrompt": "What will you do first?",
        "options": [
          {
            "id": "option-1",
            "label": "Use my saved route."
          },
          {
            "id": "option-2",
            "label": "Choose cues in the moment."
          },
          {
            "id": "option-3",
            "label": "I am not ready yet."
          }
        ],
        "action": "On the next focus window, complete the chosen first cue before opening the app. When the user returns, show only reflection.",
        "observation": "You can shape a focus window with your own judgment.",
        "reflection": "What did you do, and did it fit?",
        "completion": "Choose “I guided myself,” “I needed support,” or “I will try again.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "c53b64b26a60"
      }
    ]
  },
  {
    "id": "focus-recovery",
    "title": "Deep Focus → Recovery",
    "question": "Can I leave effort and choose what comes next?",
    "states": [
      "Notice",
      "Release",
      "Reset",
      "Restore",
      "Self-direct"
    ],
    "experiences": [
      {
        "id": "FR-01",
        "sourceId": "FR-01",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Notice",
        "title": "Name the Residue",
        "beliefUnderTest": "“When the work window ends, I should already be finished with it.”",
        "capability": "Recognize what, if anything, is still travelling with the user after a focus window.",
        "prompt": "The window has ended. What is still with you?",
        "choicePrompt": "The window has ended. What is still with you?",
        "options": [
          {
            "id": "option-1",
            "label": "The point is still in my head."
          },
          {
            "id": "option-2",
            "label": "My body still feels switched on."
          },
          {
            "id": "option-3",
            "label": "I am already elsewhere."
          },
          {
            "id": "option-4",
            "label": "I am not sure."
          }
        ],
        "action": "Pause for 10 seconds without changing anything.",
        "observation": "An ending can leave a trace. Naming the trace does not make it a problem.",
        "reflection": "Did naming it make the next choice clearer?",
        "completion": "Tap “I noticed what came with me.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "4da949597812"
      },
      {
        "id": "FR-02",
        "sourceId": "FR-02",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Notice",
        "title": "Separate the Work from the Day",
        "beliefUnderTest": "“An unfinished point must occupy the rest of my attention.”",
        "capability": "Distinguish a chosen focus point from the whole of the day or self.",
        "prompt": "Finish this sentence: “That point is part of my day. It is not…”",
        "choicePrompt": "Finish this sentence: “That point is part of my day. It is not…”",
        "options": [
          {
            "id": "option-1",
            "label": "the whole of my day."
          },
          {
            "id": "option-2",
            "label": "all of me."
          },
          {
            "id": "option-3",
            "label": "something I must solve now."
          },
          {
            "id": "option-4",
            "label": "none of these."
          }
        ],
        "action": "Select an ending or choose “skip wording.”",
        "observation": "A point can remain open without owning every next moment.",
        "reflection": "Did the distinction create even a little space?",
        "completion": "Tap “The point can wait with me, not on me.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "5e60a70c436f"
      },
      {
        "id": "FR-03",
        "sourceId": "FR-03",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Notice",
        "title": "Notice the Ending",
        "beliefUnderTest": "“I do not need to mark an ending; I can just move on.”",
        "capability": "Experience a deliberate, low-friction end to one period of effort.",
        "prompt": "Before the next thing, mark that this window has ended.",
        "choicePrompt": "Before the next thing, mark that this window has ended.",
        "options": [
          {
            "id": "option-1",
            "label": "Close one tab."
          },
          {
            "id": "option-2",
            "label": "Put one thing down."
          },
          {
            "id": "option-3",
            "label": "Stand or change posture."
          },
          {
            "id": "option-4",
            "label": "Say “this window is over.”"
          }
        ],
        "action": "Complete the selected marker once.",
        "observation": "An ending can be small and still be real.",
        "reflection": "Did the marker make the shift more noticeable?",
        "completion": "Choose “Yes,” “a little,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "ef00fe89d4a9"
      },
      {
        "id": "FR-04",
        "sourceId": "FR-04",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Release",
        "title": "Leave a Return Point",
        "beliefUnderTest": "“If I stop now, I will lose where to begin later.”",
        "capability": "Create one small, private cue for a later return.",
        "prompt": "What would make coming back gentler later?",
        "choicePrompt": "What would make coming back gentler later?",
        "options": [
          {
            "id": "option-1",
            "label": "Name the next visible step."
          },
          {
            "id": "option-2",
            "label": "Leave one line in view."
          },
          {
            "id": "option-3",
            "label": "Put one item where I will see it."
          },
          {
            "id": "option-4",
            "label": "I do not need a cue."
          }
        ],
        "action": "Create the chosen cue in 30 seconds or less.",
        "observation": "A return point can hold the work without keeping it active in your mind.",
        "reflection": "Did the cue make stopping feel more possible?",
        "completion": "Choose “Yes,” “partly,” or “not needed.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "82a557708b0f"
      },
      {
        "id": "FR-05",
        "sourceId": "FR-05",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Release",
        "title": "Give the Next Thing a Time",
        "beliefUnderTest": "“I must keep rehearsing the next demand so I do not forget it.”",
        "capability": "Choose whether a next demand needs attention now, later, or not at all.",
        "prompt": "What does the next thing need from you?",
        "choicePrompt": "What does the next thing need from you?",
        "options": [
          {
            "id": "option-1",
            "label": "It needs me now."
          },
          {
            "id": "option-2",
            "label": "It can wait until a later window."
          },
          {
            "id": "option-3",
            "label": "It can be written down."
          },
          {
            "id": "option-4",
            "label": "I am not sure."
          }
        ],
        "action": "Follow the selected route. If “later,” optionally set a local plain-text note; the app does not create calendar events.",
        "observation": "Deferring is not ignoring. Responding now is not failing recovery.",
        "reflection": "Did the route fit what was actually needed?",
        "completion": "Choose “It fit,” “I changed course,” or “not sure.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "eb3ab7134fdb"
      },
      {
        "id": "FR-06",
        "sourceId": "FR-06",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Release",
        "title": "Clear One Carryover",
        "beliefUnderTest": "“I need to clear everything before I can move on.”",
        "capability": "Release one small carryover without demanding a perfectly empty mind or space.",
        "prompt": "What one thing can be put down for now?",
        "choicePrompt": "What one thing can be put down for now?",
        "options": [
          {
            "id": "option-1",
            "label": "One open tab."
          },
          {
            "id": "option-2",
            "label": "One object."
          },
          {
            "id": "option-3",
            "label": "One thought in a private note."
          },
          {
            "id": "option-4",
            "label": "Nothing can be put down now."
          }
        ],
        "action": "Place, close, or note the selected carryover. Stop after one.",
        "observation": "You do not need to clear everything to make one bit of room.",
        "reflection": "Did one change feel enough for this moment?",
        "completion": "Choose “Enough,” “a little,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "fa737b9c53d0"
      },
      {
        "id": "FR-07",
        "sourceId": "FR-07",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Reset",
        "title": "Change the Signal",
        "beliefUnderTest": "“I must think my way out of a focused state.”",
        "capability": "Test one safe environmental or physical change after effort.",
        "prompt": "What small change could tell this moment it is different?",
        "choicePrompt": "What small change could tell this moment it is different?",
        "options": [
          {
            "id": "option-1",
            "label": "Change rooms or seats."
          },
          {
            "id": "option-2",
            "label": "Change the light."
          },
          {
            "id": "option-3",
            "label": "Drink water."
          },
          {
            "id": "option-4",
            "label": "Change posture."
          }
        ],
        "action": "Make the selected change safely for up to two minutes.",
        "observation": "Compare this moment with the moment before the signal changed.",
        "reflection": "What changed, if anything: body, attention, surroundings, or nothing yet?",
        "completion": "Choose one response. Every response completes the exposure.",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "99527487f13e"
      },
      {
        "id": "FR-08",
        "sourceId": "FR-08",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Reset",
        "title": "Let the Eyes Travel",
        "beliefUnderTest": "“My attention must remain on the same close point after the window ends.”",
        "capability": "Practice gently widening visual attention without claiming a physiological effect.",
        "prompt": "For a few seconds, let your eyes find something farther away.",
        "choicePrompt": "For a few seconds, let your eyes find something farther away.",
        "options": [
          {
            "id": "option-1",
            "label": "The room."
          },
          {
            "id": "option-2",
            "label": "My body."
          },
          {
            "id": "option-3",
            "label": "Another thought."
          },
          {
            "id": "option-4",
            "label": "I am not sure."
          }
        ],
        "action": "Look at a comfortable distant or different point for 20 seconds. Do not stare, strain, or use while moving through an unsafe space.",
        "observation": "The point you were in is no longer the only thing in view.",
        "reflection": "Did widening the view change anything about the ending?",
        "completion": "Choose “Yes,” “a little,” or “not for me.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "a46bca8f02a8"
      },
      {
        "id": "FR-09",
        "sourceId": "FR-09",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Reset",
        "title": "Choose a Pace",
        "beliefUnderTest": "“The only alternative to intense focus is doing nothing.”",
        "capability": "Choose the next pace without treating rest, movement, care, or continued work as morally ranked.",
        "prompt": "What pace fits the next few minutes?",
        "choicePrompt": "What pace fits the next few minutes?",
        "options": [
          {
            "id": "option-1",
            "label": "Continue gently."
          },
          {
            "id": "option-2",
            "label": "Move slowly."
          },
          {
            "id": "option-3",
            "label": "Rest briefly."
          },
          {
            "id": "option-4",
            "label": "Attend to something else."
          }
        ],
        "action": "Take the selected route for up to two minutes, or end the app and do it.",
        "observation": "You can choose a pace instead of being carried straight into the next demand.",
        "reflection": "Did the pace fit this moment?",
        "completion": "Choose “Yes,” “partly,” or “I changed it.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "6043b3aa8094"
      },
      {
        "id": "FR-10",
        "sourceId": "FR-10",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Restore",
        "title": "Find What Gives Back",
        "beliefUnderTest": "“Recovery must look the same every time.”",
        "capability": "Notice one ordinary activity that feels fitting after concentrated effort.",
        "prompt": "What would feel like a gentle next place to put your attention?",
        "choicePrompt": "What would feel like a gentle next place to put your attention?",
        "options": [
          {
            "id": "option-1",
            "label": "A quiet drink or meal."
          },
          {
            "id": "option-2",
            "label": "A short walk or stretch."
          },
          {
            "id": "option-3",
            "label": "A small practical task."
          },
          {
            "id": "option-4",
            "label": "A few quiet minutes."
          }
        ],
        "action": "Do the chosen activity briefly, or choose “I need something else.”",
        "observation": "A helpful next activity may be ordinary, not impressive.",
        "reflection": "Did this fit the transition from effort?",
        "completion": "Choose “Yes,” “partly,” “not today,” or “something else.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "4ecac27ade45"
      },
      {
        "id": "FR-11",
        "sourceId": "FR-11",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Restore",
        "title": "Make a Smaller Rest",
        "beliefUnderTest": "“If I cannot take a long break, recovery is impossible.”",
        "capability": "Test a minimum viable pause that fits a constrained day.",
        "prompt": "What is the smallest pause that could fit right now?",
        "choicePrompt": "What is the smallest pause that could fit right now?",
        "options": [
          {
            "id": "option-1",
            "label": "One breath."
          },
          {
            "id": "option-2",
            "label": "30 seconds."
          },
          {
            "id": "option-3",
            "label": "One change of posture."
          },
          {
            "id": "option-4",
            "label": "Return later."
          }
        ],
        "action": "Complete the chosen pause, if appropriate.",
        "observation": "A smaller pause is not a lesser person’s version of recovery.",
        "reflection": "Did the smaller pause fit today?",
        "completion": "Choose “It fit,” “a little,” or “not available today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "8338b3cc21a6"
      },
      {
        "id": "FR-12",
        "sourceId": "FR-12",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Restore",
        "title": "Return to the World",
        "beliefUnderTest": "“I must stay in the work state until all work is done.”",
        "capability": "Re-enter an ordinary non-focus context deliberately.",
        "prompt": "What are you returning to now?",
        "choicePrompt": "What are you returning to now?",
        "options": [
          {
            "id": "option-1",
            "label": "A person."
          },
          {
            "id": "option-2",
            "label": "A place."
          },
          {
            "id": "option-3",
            "label": "A routine."
          },
          {
            "id": "option-4",
            "label": "Another necessary task."
          }
        ],
        "action": "Before moving on, name one way you want to arrive there: present, quiet, practical, or simply as I am.",
        "observation": "You can arrive somewhere without bringing the whole focus window with you.",
        "reflection": "Did naming the arrival change the handoff?",
        "completion": "Choose “Yes,” “a little,” or “not sure.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "0298acc11d34"
      },
      {
        "id": "FR-13",
        "sourceId": "FR-13",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "A Demanding Day",
        "beliefUnderTest": "“If I cannot recover properly today, I have failed the transition.”",
        "capability": "Choose a compassionate minimum route during urgency, illness, care duty, grief, or a demanding schedule.",
        "prompt": "Today may not have room for a full transition. What is possible?",
        "choicePrompt": "Today may not have room for a full transition. What is possible?",
        "options": [
          {
            "id": "option-1",
            "label": "Mark the ending."
          },
          {
            "id": "option-2",
            "label": "Leave one return cue."
          },
          {
            "id": "option-3",
            "label": "Take one breath."
          },
          {
            "id": "option-4",
            "label": "I need to attend elsewhere."
          }
        ],
        "action": "Complete the selected route only if safe and appropriate; “attend elsewhere” immediately ends the session.",
        "observation": "The route can fit the day without pretending the day is easy.",
        "reflection": "Did this route respect what today required?",
        "completion": "Choose “Yes,” “partly,” or “I need care elsewhere.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "c062f1db4ced"
      },
      {
        "id": "FR-14",
        "sourceId": "FR-14",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Build My Recovery Route",
        "beliefUnderTest": "“The app must tell me how to come down from effort.”",
        "capability": "Create an editable personal route using previously tested cues.",
        "prompt": "You know more about this ending than we do. What do you need first?",
        "choicePrompt": "You know more about this ending than we do. What do you need first?",
        "options": [
          {
            "id": "option-1",
            "label": "Mark the end."
          },
          {
            "id": "option-2",
            "label": "Leave a return point."
          },
          {
            "id": "option-3",
            "label": "Change one signal."
          },
          {
            "id": "option-4",
            "label": "Choose the next pace."
          },
          {
            "id": "option-5",
            "label": "My own choice."
          }
        ],
        "action": "Arrange two cues in order. The app provides only pacing and a Begin button.",
        "observation": "You designed the route between effort and what comes next.",
        "reflection": "Did your route fit today?",
        "completion": "Choose “Yes,” “partly,” or “try a different route next time.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "fa21c0c39adb"
      },
      {
        "id": "FR-15",
        "sourceId": "FR-15",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Recover Without Mirellis",
        "beliefUnderTest": "“I need the app to leave a focused state well.”",
        "capability": "Practice a self-guided transition and return only to reflect.",
        "prompt": "After your next focus window, use your route before opening Mirellis.",
        "choicePrompt": "After your next focus window, use your route before opening Mirellis.",
        "options": [
          {
            "id": "option-1",
            "label": "Use my saved route."
          },
          {
            "id": "option-2",
            "label": "Choose in the moment."
          },
          {
            "id": "option-3",
            "label": "I am not ready yet."
          }
        ],
        "action": "After the next focus window, complete the first chosen cue before reopening the app. On return, show reflection only.",
        "observation": "You can shape an ending using your own judgement.",
        "reflection": "What did you do, and did it fit?",
        "completion": "Choose “I guided myself,” “I needed support,” or “I will try again.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "2744f2b5e736"
      }
    ]
  },
  {
    "id": "recovery-presence",
    "title": "Recovery → Presence",
    "question": "Can I arrive in the next real moment?",
    "states": [
      "Arrive",
      "Orient",
      "Participate",
      "Return",
      "Self-direct"
    ],
    "experiences": [
      {
        "id": "RP-01",
        "sourceId": "RP-01",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Arrive",
        "title": "Notice Where You Are",
        "beliefUnderTest": "“I need to feel completely recovered before I can be here.”",
        "capability": "Name the current place in the day without grading the state.",
        "prompt": "Before the next thing, notice where you are.",
        "choicePrompt": "Before the next thing, notice where you are.",
        "options": [
          {
            "id": "option-1",
            "label": "Here, but slow."
          },
          {
            "id": "option-2",
            "label": "Here, but still carrying something."
          },
          {
            "id": "option-3",
            "label": "Already pulled toward the next thing."
          },
          {
            "id": "option-4",
            "label": "Not sure where I am."
          }
        ],
        "action": "Pause for 10 seconds. Notice one thing in the immediate surroundings or one part of the body that is comfortable to notice.",
        "observation": "You can arrive before you feel finished.",
        "reflection": "Did naming the moment make it easier to be in it?",
        "completion": "Tap “I know where I am.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "7ed9dc3e153b"
      },
      {
        "id": "RP-02",
        "sourceId": "RP-02",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Arrive",
        "title": "Let the Last Moment End",
        "beliefUnderTest": "“The last moment has to disappear before a new one can begin.”",
        "capability": "Allow a residue from recovery or effort to be present without making it the whole moment.",
        "prompt": "Is anything from the last moment still with you?",
        "choicePrompt": "Is anything from the last moment still with you?",
        "options": [
          {
            "id": "option-1",
            "label": "A thought."
          },
          {
            "id": "option-2",
            "label": "A feeling."
          },
          {
            "id": "option-3",
            "label": "A body sensation."
          },
          {
            "id": "option-4",
            "label": "Nothing in particular."
          }
        ],
        "action": "Select one answer or choose “skip wording.” No disclosure or free text is required.",
        "observation": "Something can be with you without being all there is.",
        "reflection": "Did this make room for the next moment?",
        "completion": "Choose “A little,” “not yet,” or “nothing was there.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "f9166f009647"
      },
      {
        "id": "RP-03",
        "sourceId": "RP-03",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Arrive",
        "title": "One Thing That Is Here",
        "beliefUnderTest": "“Presence is an abstract feeling I either have or do not have.”",
        "capability": "Find one concrete part of the present environment.",
        "prompt": "Find one thing that is here with you now.",
        "choicePrompt": "Find one thing that is here with you now.",
        "options": [
          {
            "id": "option-1",
            "label": "A sound."
          },
          {
            "id": "option-2",
            "label": "A surface."
          },
          {
            "id": "option-3",
            "label": "Light or shadow."
          },
          {
            "id": "option-4",
            "label": "A person or place."
          }
        ],
        "action": "Spend 15 seconds with the selected cue. Do not strain, stare, or seek a particular feeling.",
        "observation": "The present is made of ordinary details.",
        "reflection": "Did one detail make the moment more specific?",
        "completion": "Choose “Yes,” “a little,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "6e4ba66a4c1a"
      },
      {
        "id": "RP-04",
        "sourceId": "RP-04",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Orient",
        "title": "Widen the Frame",
        "beliefUnderTest": "“Whatever is loudest in my mind is the whole moment.”",
        "capability": "Notice that attention can include more than the loudest thought or demand.",
        "prompt": "Without moving anything away, what else is here?",
        "choicePrompt": "Without moving anything away, what else is here?",
        "options": [
          {
            "id": "option-1",
            "label": "Something farther away."
          },
          {
            "id": "option-2",
            "label": "A different sound."
          },
          {
            "id": "option-3",
            "label": "My feet or hands."
          },
          {
            "id": "option-4",
            "label": "The space around me."
          }
        ],
        "action": "Notice the selected point for 20 seconds in any safe position.",
        "observation": "The loudest thing may still be here. It is not the whole frame.",
        "reflection": "Did the frame feel wider, the same, or unclear?",
        "completion": "Choose one response; none is graded.",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "1327ad978b9b"
      },
      {
        "id": "RP-05",
        "sourceId": "RP-05",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Orient",
        "title": "Name the Next Context",
        "beliefUnderTest": "“I should be equally present everywhere and for everyone.”",
        "capability": "Identify the actual next context without forcing an ideal version of presence.",
        "prompt": "What are you returning to now?",
        "choicePrompt": "What are you returning to now?",
        "options": [
          {
            "id": "option-1",
            "label": "A person."
          },
          {
            "id": "option-2",
            "label": "A place."
          },
          {
            "id": "option-3",
            "label": "A practical task."
          },
          {
            "id": "option-4",
            "label": "Some quiet time."
          }
        ],
        "action": "Select the context. The app never ranks any context as more meaningful.",
        "observation": "Presence is not one mood. It is a way of arriving somewhere real.",
        "reflection": "Did naming the context make the next step clearer?",
        "completion": "Tap “I know what I am returning to.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "d3daa05994a7"
      },
      {
        "id": "RP-06",
        "sourceId": "RP-06",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Orient",
        "title": "Choose How to Arrive",
        "beliefUnderTest": "“I must arrive as my best self or not at all.”",
        "capability": "Choose a realistic quality of arrival for the next context.",
        "prompt": "How would you like to arrive there?",
        "choicePrompt": "How would you like to arrive there?",
        "options": [
          {
            "id": "option-1",
            "label": "Quietly."
          },
          {
            "id": "option-2",
            "label": "Practically."
          },
          {
            "id": "option-3",
            "label": "Openly."
          },
          {
            "id": "option-4",
            "label": "Just as I am."
          }
        ],
        "action": "Hold the chosen word during the first step into the next context.",
        "observation": "A small intention can shape an arrival without controlling the whole moment.",
        "reflection": "Did the word fit?",
        "completion": "Choose “Yes,” “partly,” or “I would choose another word.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "e069a38ab8af"
      },
      {
        "id": "RP-07",
        "sourceId": "RP-07",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Participate",
        "title": "One Real Action",
        "beliefUnderTest": "“I need to feel present before I can take part.”",
        "capability": "Take one small, context-fitting action before waiting for a particular internal state.",
        "prompt": "What is one real action that belongs here?",
        "choicePrompt": "What is one real action that belongs here?",
        "options": [
          {
            "id": "option-1",
            "label": "Look at the person or place."
          },
          {
            "id": "option-2",
            "label": "Touch the next object."
          },
          {
            "id": "option-3",
            "label": "Ask or answer one simple question."
          },
          {
            "id": "option-4",
            "label": "Begin one necessary motion."
          }
        ],
        "action": "Complete the selected action once, only if safe and appropriate.",
        "observation": "You can take part before you feel perfectly ready.",
        "reflection": "Did the action bring you closer to the context?",
        "completion": "Choose “Yes,” “a little,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "d45c7dc22001"
      },
      {
        "id": "RP-08",
        "sourceId": "RP-08",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Participate",
        "title": "Give One Thing Your Attention",
        "beliefUnderTest": "“If I cannot give everything my attention, I am not present.”",
        "capability": "Practice giving one person, object, or action a brief full turn of attention.",
        "prompt": "For the next 30 seconds, what gets one full turn?",
        "choicePrompt": "For the next 30 seconds, what gets one full turn?",
        "options": [
          {
            "id": "option-1",
            "label": "This person."
          },
          {
            "id": "option-2",
            "label": "This task."
          },
          {
            "id": "option-3",
            "label": "This place."
          },
          {
            "id": "option-4",
            "label": "This small act of care."
          }
        ],
        "action": "Stay with the selected object of attention for 30 seconds. Pause, stop, or end early whenever needed.",
        "observation": "One turn of attention is enough to practise choosing where it goes.",
        "reflection": "Was the turn possible, partial, or not today?",
        "completion": "Choose one response. All routes complete.",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "c57426fdad3d"
      },
      {
        "id": "RP-09",
        "sourceId": "RP-09",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Participate",
        "title": "Make Room for the Ordinary",
        "beliefUnderTest": "“Presence only counts in a special, quiet, or beautiful moment.”",
        "capability": "Recognize an ordinary act as a valid place to arrive.",
        "prompt": "What ordinary thing is already asking for you?",
        "choicePrompt": "What ordinary thing is already asking for you?",
        "options": [
          {
            "id": "option-1",
            "label": "A small practical task."
          },
          {
            "id": "option-2",
            "label": "Food or drink."
          },
          {
            "id": "option-3",
            "label": "A transition between places."
          },
          {
            "id": "option-4",
            "label": "A person nearby."
          }
        ],
        "action": "Do the chosen ordinary act for one minute, or leave the app and do it.",
        "observation": "The ordinary moment was already enough to enter.",
        "reflection": "Did it feel different when you gave it a place?",
        "completion": "Choose “Yes,” “a little,” or “not sure.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "9357f656a6ea"
      },
      {
        "id": "RP-10",
        "sourceId": "RP-10",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Return",
        "title": "Notice the Leaving",
        "beliefUnderTest": "“If my attention wanders, I have lost presence.”",
        "capability": "Notice a shift of attention without turning it into failure.",
        "prompt": "Has your attention gone somewhere else?",
        "choicePrompt": "Has your attention gone somewhere else?",
        "options": [
          {
            "id": "option-1",
            "label": "A thought pulled me."
          },
          {
            "id": "option-2",
            "label": "A demand pulled me."
          },
          {
            "id": "option-3",
            "label": "My phone pulled me."
          },
          {
            "id": "option-4",
            "label": "I am still here."
          }
        ],
        "action": "Name the route without trying to fix it for 10 seconds.",
        "observation": "Noticing the leaving is already part of returning.",
        "reflection": "Did naming it change anything about the next choice?",
        "completion": "Choose “Clearer,” “a little,” or “not yet.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "5a81ea66c26e"
      },
      {
        "id": "RP-11",
        "sourceId": "RP-11",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Return",
        "title": "Return by One Cue",
        "beliefUnderTest": "“Coming back requires a long reset.”",
        "capability": "Test one simple cue for returning attention to the current context.",
        "prompt": "What could bring you back one step?",
        "choicePrompt": "What could bring you back one step?",
        "options": [
          {
            "id": "option-1",
            "label": "Feel my feet or hands."
          },
          {
            "id": "option-2",
            "label": "Look at the next object."
          },
          {
            "id": "option-3",
            "label": "Say the context quietly."
          },
          {
            "id": "option-4",
            "label": "Take one slower breath."
          }
        ],
        "action": "Use the selected cue once, then continue with the actual next action.",
        "observation": "A return cue does not erase the pull. It gives attention another place to go.",
        "reflection": "Did the cue fit this context?",
        "completion": "Choose “Yes,” “partly,” or “not for me.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "cd2d9d969326"
      },
      {
        "id": "RP-12",
        "sourceId": "RP-12",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Return",
        "title": "Begin Again Without Restarting",
        "beliefUnderTest": "“A broken moment must be restarted perfectly.”",
        "capability": "Resume a real context after interruption without replaying the full transition.",
        "prompt": "You do not need to restart the whole moment.",
        "choicePrompt": "You do not need to restart the whole moment.",
        "options": [
          {
            "id": "option-1",
            "label": "Look again."
          },
          {
            "id": "option-2",
            "label": "Take the next practical step."
          },
          {
            "id": "option-3",
            "label": "Say one honest sentence."
          },
          {
            "id": "option-4",
            "label": "Return later."
          }
        ],
        "action": "Complete the selected route once, or choose “return later.”",
        "observation": "Beginning again can be small.",
        "reflection": "Did the smaller return fit?",
        "completion": "Choose “It fit,” “partly,” or “not available today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "7b12628343e4"
      },
      {
        "id": "RP-13",
        "sourceId": "RP-13",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "A Crowded Moment",
        "beliefUnderTest": "“If the moment is noisy or difficult, presence is impossible.”",
        "capability": "Choose a minimum viable way to arrive during urgency, care duty, travel, grief, illness, or high demand.",
        "prompt": "This moment may not have room for a full transition. What is possible?",
        "choicePrompt": "This moment may not have room for a full transition. What is possible?",
        "options": [
          {
            "id": "option-1",
            "label": "Name where I am."
          },
          {
            "id": "option-2",
            "label": "Notice one thing."
          },
          {
            "id": "option-3",
            "label": "Choose one next action."
          },
          {
            "id": "option-4",
            "label": "Attend elsewhere."
          }
        ],
        "action": "Complete the chosen route only if safe and useful. “Attend elsewhere” ends the session immediately.",
        "observation": "The route can fit the day without pretending the day is simple.",
        "reflection": "Did this respect what the moment required?",
        "completion": "Choose “Yes,” “partly,” or “I need care elsewhere.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "9ebd64374ebc"
      },
      {
        "id": "RP-14",
        "sourceId": "RP-14",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Build My Arrival Route",
        "beliefUnderTest": "“The app must tell me how to become present.”",
        "capability": "Build an editable two-step arrival route from previously tested cues.",
        "prompt": "You know this moment better than we do. What helps you arrive first?",
        "choicePrompt": "You know this moment better than we do. What helps you arrive first?",
        "options": [
          {
            "id": "option-1",
            "label": "Name the context."
          },
          {
            "id": "option-2",
            "label": "Notice one detail."
          },
          {
            "id": "option-3",
            "label": "Choose how to arrive."
          },
          {
            "id": "option-4",
            "label": "Take one real action."
          },
          {
            "id": "option-5",
            "label": "My own choice."
          }
        ],
        "action": "Arrange two cues in order. The app provides only a Begin button and quiet pacing.",
        "observation": "You designed a way to return to the life in front of you.",
        "reflection": "Did your route fit today?",
        "completion": "Choose “Yes,” “partly,” or “try a different route next time.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "37aa0e56cb14"
      },
      {
        "id": "RP-15",
        "sourceId": "RP-15",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Arrive Without Mirellis",
        "beliefUnderTest": "“I need the app to return to the present.”",
        "capability": "Practise a self-guided arrival, then return only to reflect.",
        "prompt": "Next time you enter an ordinary moment, use your route before opening Mirellis.",
        "choicePrompt": "Next time you enter an ordinary moment, use your route before opening Mirellis.",
        "options": [
          {
            "id": "option-1",
            "label": "Use my saved route."
          },
          {
            "id": "option-2",
            "label": "Choose in the moment."
          },
          {
            "id": "option-3",
            "label": "I am not ready yet."
          }
        ],
        "action": "Complete the first chosen cue before reopening the app. On return, show only the reflection.",
        "observation": "You can arrive without a script.",
        "reflection": "What did you do, and did it fit?",
        "completion": "Choose “I guided myself,” “I needed support,” or “I will try again.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "648357f70020"
      }
    ]
  },
  {
    "id": "presence-wind-down",
    "title": "Presence → Wind-down",
    "question": "Can I end this part of the day and make room for what follows?",
    "states": [
      "Notice",
      "Contain",
      "Shift",
      "Return",
      "Self-direct"
    ],
    "experiences": [
      {
        "id": "PW-01",
        "sourceId": "PW-01",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Notice",
        "title": "Notice the Day Changing",
        "beliefUnderTest": "“I have to finish everything before I am allowed to slow down.”",
        "capability": "Recognize that a part of the day may be changing even when work or thought remains.",
        "prompt": "What is changing in your day right now?",
        "choicePrompt": "What is changing in your day right now?",
        "options": [
          {
            "id": "option-1",
            "label": "My work is ending."
          },
          {
            "id": "option-2",
            "label": "My energy is changing."
          },
          {
            "id": "option-3",
            "label": "My surroundings are changing."
          },
          {
            "id": "option-4",
            "label": "I am not sure."
          }
        ],
        "action": "Pause for 10 seconds and notice one sign that the current part of the day is changing.",
        "observation": "An ending can begin before everything is resolved.",
        "reflection": "Did noticing the change make an ending feel possible?",
        "completion": "Choose “Yes,” “a little,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "f4a4ff49a33b"
      },
      {
        "id": "PW-02",
        "sourceId": "PW-02",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Notice",
        "title": "Name What Is Still Open",
        "beliefUnderTest": "“If something is unfinished, I cannot leave it.”",
        "capability": "Name an open loop without being required to solve it.",
        "prompt": "Is anything still asking to be carried?",
        "choicePrompt": "Is anything still asking to be carried?",
        "options": [
          {
            "id": "option-1",
            "label": "A task."
          },
          {
            "id": "option-2",
            "label": "A thought."
          },
          {
            "id": "option-3",
            "label": "A conversation."
          },
          {
            "id": "option-4",
            "label": "Nothing I can name."
          }
        ],
        "action": "Select one response or choose “I will leave this unnamed.” No note, explanation, or disclosure is required.",
        "observation": "Something can remain open without owning the entire evening.",
        "reflection": "Did naming it change how heavy it felt?",
        "completion": "Choose “Lighter,” “the same,” or “not sure.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "f15bddc48423"
      },
      {
        "id": "PW-03",
        "sourceId": "PW-03",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Notice",
        "title": "Find the Last Thing",
        "beliefUnderTest": "“I can only stop when I know exactly what to do next.”",
        "capability": "Identify one last necessary action or consciously choose no action.",
        "prompt": "Is there one last thing that truly needs your attention?",
        "choicePrompt": "Is there one last thing that truly needs your attention?",
        "options": [
          {
            "id": "option-1",
            "label": "Yes, and it is small."
          },
          {
            "id": "option-2",
            "label": "Yes, but it can wait."
          },
          {
            "id": "option-3",
            "label": "No."
          },
          {
            "id": "option-4",
            "label": "I cannot tell."
          }
        ],
        "action": "If it is small and safe, do it once. Otherwise choose “It can wait” or “No action now.”",
        "observation": "A boundary can include one necessary action or none.",
        "reflection": "Did the choice make the next part of the day clearer?",
        "completion": "Choose “Yes,” “a little,” or “not yet.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "b7da22e2d56f"
      },
      {
        "id": "PW-04",
        "sourceId": "PW-04",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Contain",
        "title": "Put It Down for Now",
        "beliefUnderTest": "“If I stop holding it in mind, I will lose it.”",
        "capability": "Choose a temporary place for one unfinished concern without claiming it is solved.",
        "prompt": "Where can this sit for now?",
        "choicePrompt": "Where can this sit for now?",
        "options": [
          {
            "id": "option-1",
            "label": "In a short local note."
          },
          {
            "id": "option-2",
            "label": "In a visible place."
          },
          {
            "id": "option-3",
            "label": "In tomorrow’s first step."
          },
          {
            "id": "option-4",
            "label": "I will carry it quietly."
          }
        ],
        "action": "Use the selected option once. A note is optional, private, local-only, and limited to 140 characters.",
        "observation": "Putting something down for now is different from losing it.",
        "reflection": "Did this give the concern a place?",
        "completion": "Choose “Yes,” “partly,” or “not for me.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "dcd1eef9bb3b"
      },
      {
        "id": "PW-05",
        "sourceId": "PW-05",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Contain",
        "title": "Close One Boundary",
        "beliefUnderTest": "“A boundary only counts if it is large and permanent.”",
        "capability": "Make one small, reversible boundary between the current activity and what follows.",
        "prompt": "What is one small boundary you can close?",
        "choicePrompt": "What is one small boundary you can close?",
        "options": [
          {
            "id": "option-1",
            "label": "Put one thing away."
          },
          {
            "id": "option-2",
            "label": "Change my position."
          },
          {
            "id": "option-3",
            "label": "End one tab or screen."
          },
          {
            "id": "option-4",
            "label": "Say “enough for now.”"
          }
        ],
        "action": "Complete the selected boundary once, or choose “I cannot change anything now.”",
        "observation": "A small boundary can mark an ending without fixing the whole day.",
        "reflection": "Did the boundary fit the moment?",
        "completion": "Choose “Yes,” “partly,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "958ab3dcab74"
      },
      {
        "id": "PW-06",
        "sourceId": "PW-06",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Contain",
        "title": "Leave a Marker",
        "beliefUnderTest": "“If I do not keep thinking, tomorrow will begin badly.”",
        "capability": "Leave a modest marker for a future return without turning Mirellis into a task manager.",
        "prompt": "What would make returning easier later?",
        "choicePrompt": "What would make returning easier later?",
        "options": [
          {
            "id": "option-1",
            "label": "Leave the next object visible."
          },
          {
            "id": "option-2",
            "label": "Write one private line."
          },
          {
            "id": "option-3",
            "label": "Name the first step."
          },
          {
            "id": "option-4",
            "label": "No marker today."
          }
        ],
        "action": "Create the marker once if useful. The app does not schedule, rank, or notify.",
        "observation": "A future return can be supported without remaining mentally open all night.",
        "reflection": "Did the marker make leaving easier?",
        "completion": "Choose “Yes,” “a little,” or “not sure.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "2576986c7889"
      },
      {
        "id": "PW-07",
        "sourceId": "PW-07",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Shift",
        "title": "Change One Signal",
        "beliefUnderTest": "“My body and surroundings will change on their own; I cannot participate.”",
        "capability": "Test one small environmental or sensory signal that marks a different part of the day.",
        "prompt": "What could signal that something is changing?",
        "choicePrompt": "What could signal that something is changing?",
        "options": [
          {
            "id": "option-1",
            "label": "A different light."
          },
          {
            "id": "option-2",
            "label": "A different place."
          },
          {
            "id": "option-3",
            "label": "A different sound level."
          },
          {
            "id": "option-4",
            "label": "A different pace."
          }
        ],
        "action": "Make one safe, accessible change for 20 seconds, or choose an internal cue such as noticing the room as it is.",
        "observation": "A small signal can help mark a change without forcing a feeling.",
        "reflection": "Did the signal fit?",
        "completion": "Choose “Yes,” “partly,” or “not for me.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "03649d5cf071"
      },
      {
        "id": "PW-08",
        "sourceId": "PW-08",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Shift",
        "title": "Let the Pace Change",
        "beliefUnderTest": "“If I slow down, I will lose control or fall behind.”",
        "capability": "Test one ordinary action at a deliberately different pace.",
        "prompt": "What could take one slower turn?",
        "choicePrompt": "What could take one slower turn?",
        "options": [
          {
            "id": "option-1",
            "label": "One step."
          },
          {
            "id": "option-2",
            "label": "One drink or bite."
          },
          {
            "id": "option-3",
            "label": "One tidying action."
          },
          {
            "id": "option-4",
            "label": "One breath."
          }
        ],
        "action": "Do the selected action once at a pace that feels possible. Stop, shorten, or skip at any time.",
        "observation": "Changing pace is an option, not a rule.",
        "reflection": "Did the slower turn change anything, or not?",
        "completion": "Choose “Something,” “not much,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "83653a9add65"
      },
      {
        "id": "PW-09",
        "sourceId": "PW-09",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Shift",
        "title": "Choose the Next Kind of Time",
        "beliefUnderTest": "“If I am not working, I am wasting time.”",
        "capability": "Name the next kind of time without ranking it as productive or unproductive.",
        "prompt": "What kind of time comes next?",
        "choicePrompt": "What kind of time comes next?",
        "options": [
          {
            "id": "option-1",
            "label": "Care or connection."
          },
          {
            "id": "option-2",
            "label": "Practical life."
          },
          {
            "id": "option-3",
            "label": "Quiet or rest."
          },
          {
            "id": "option-4",
            "label": "I do not know yet."
          }
        ],
        "action": "Choose one first action that fits the kind of time, or choose “leave this open.”",
        "observation": "The next part of the day does not need to earn its place.",
        "reflection": "Did naming the kind of time make it easier to enter?",
        "completion": "Choose “Yes,” “a little,” or “not sure.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "d23a27d55601"
      },
      {
        "id": "PW-10",
        "sourceId": "PW-10",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Return",
        "title": "Notice the Pull Back",
        "beliefUnderTest": "“If I return to work or worry, I have ruined the wind-down.”",
        "capability": "Notice a pull back toward the previous mode without grading it as failure.",
        "prompt": "Has something pulled you back?",
        "choicePrompt": "Has something pulled you back?",
        "options": [
          {
            "id": "option-1",
            "label": "A thought."
          },
          {
            "id": "option-2",
            "label": "A demand."
          },
          {
            "id": "option-3",
            "label": "A device."
          },
          {
            "id": "option-4",
            "label": "I am still in the new part of the day."
          }
        ],
        "action": "Name the pull for 10 seconds. Do not fix, suppress, or explain it.",
        "observation": "Noticing the pull is part of choosing what happens next.",
        "reflection": "Did naming it make the next choice clearer?",
        "completion": "Choose “Clearer,” “a little,” or “not yet.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "0c0cdfdef73c"
      },
      {
        "id": "PW-11",
        "sourceId": "PW-11",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Return",
        "title": "Return by One Boundary",
        "beliefUnderTest": "“Once I reopen the old mode, I need to start the whole wind-down again.”",
        "capability": "Use one small boundary to return to the chosen next kind of time.",
        "prompt": "What could bring you back one step?",
        "choicePrompt": "What could bring you back one step?",
        "options": [
          {
            "id": "option-1",
            "label": "Put one thing aside."
          },
          {
            "id": "option-2",
            "label": "Look where I am."
          },
          {
            "id": "option-3",
            "label": "Say “later.”"
          },
          {
            "id": "option-4",
            "label": "Take the next ordinary action."
          }
        ],
        "action": "Use the cue once, then continue with the real next action.",
        "observation": "A small boundary gives the next part of the day somewhere to begin.",
        "reflection": "Did the boundary fit this moment?",
        "completion": "Choose “Yes,” “partly,” or “not for me.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "679a53ddc6d8"
      },
      {
        "id": "PW-12",
        "sourceId": "PW-12",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Return",
        "title": "Begin Again Without Starting Over",
        "beliefUnderTest": "“An interrupted evening has to be repaired perfectly.”",
        "capability": "Resume the next part of the day after interruption without replaying the transition.",
        "prompt": "You do not need to begin the whole evening again.",
        "choicePrompt": "You do not need to begin the whole evening again.",
        "options": [
          {
            "id": "option-1",
            "label": "Notice the room."
          },
          {
            "id": "option-2",
            "label": "Take the next practical step."
          },
          {
            "id": "option-3",
            "label": "Choose one boundary."
          },
          {
            "id": "option-4",
            "label": "Return later."
          }
        ],
        "action": "Complete the selected route once, or choose “return later.”",
        "observation": "A smaller return is still a return.",
        "reflection": "Did the smaller route fit?",
        "completion": "Choose “It fit,” “partly,” or “not available today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "dbf79216ec9c"
      },
      {
        "id": "PW-13",
        "sourceId": "PW-13",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "A Crowded Ending",
        "beliefUnderTest": "“If the end of the day is noisy, I cannot wind down at all.”",
        "capability": "Choose a minimum viable ending during care duty, travel, illness, grief, conflict, high demand, or urgency.",
        "prompt": "This ending may not have room for a full transition. What is possible?",
        "choicePrompt": "This ending may not have room for a full transition. What is possible?",
        "options": [
          {
            "id": "option-1",
            "label": "Name what is ending."
          },
          {
            "id": "option-2",
            "label": "Choose one boundary."
          },
          {
            "id": "option-3",
            "label": "Choose one next action."
          },
          {
            "id": "option-4",
            "label": "Attend elsewhere."
          }
        ],
        "action": "Complete the route only if safe and useful. “Attend elsewhere” ends the session immediately.",
        "observation": "The route can fit a difficult day without pretending the day is simple.",
        "reflection": "Did this respect what the moment required?",
        "completion": "Choose “Yes,” “partly,” or “I need care elsewhere.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "3ffa887c5761"
      },
      {
        "id": "PW-14",
        "sourceId": "PW-14",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Build My Wind-down Route",
        "beliefUnderTest": "“The app must tell me how to end the day.”",
        "capability": "Build an editable two-step wind-down route from tested cues.",
        "prompt": "You know this ending better than we do. What helps first?",
        "choicePrompt": "You know this ending better than we do. What helps first?",
        "options": [
          {
            "id": "option-1",
            "label": "Name what is ending."
          },
          {
            "id": "option-2",
            "label": "Put one thing down."
          },
          {
            "id": "option-3",
            "label": "Change one signal."
          },
          {
            "id": "option-4",
            "label": "Choose the next kind of time."
          },
          {
            "id": "option-5",
            "label": "My own choice."
          }
        ],
        "action": "Arrange two cues in order. The app provides only Begin and quiet pacing.",
        "observation": "You designed a way to make room for what comes next.",
        "reflection": "Did your route fit today?",
        "completion": "Choose “Yes,” “partly,” or “try a different route next time.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "fd5240e270ae"
      },
      {
        "id": "PW-15",
        "sourceId": "PW-15",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Wind Down Without Mirellis",
        "beliefUnderTest": "“I need the app to end one part of the day.”",
        "capability": "Practice a self-guided wind-down, then return only to reflect.",
        "prompt": "Next time the day changes, use your route before opening Mirellis.",
        "choicePrompt": "Next time the day changes, use your route before opening Mirellis.",
        "options": [
          {
            "id": "option-1",
            "label": "Use my saved route."
          },
          {
            "id": "option-2",
            "label": "Choose in the moment."
          },
          {
            "id": "option-3",
            "label": "I am not ready yet."
          }
        ],
        "action": "Complete the first chosen cue before reopening the app. On return, show only the reflection.",
        "observation": "You can make room for an ending without a script.",
        "reflection": "What did you do, and did it fit?",
        "completion": "Choose “I guided myself,” “I needed support,” or “I will try again.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "42066c06e1a4"
      }
    ]
  },
  {
    "id": "wind-down-release",
    "title": "Wind-down → Release",
    "question": "Can I loosen my hold without requiring resolution?",
    "states": [
      "Permission",
      "Set down",
      "Release",
      "Return",
      "Self-direct"
    ],
    "experiences": [
      {
        "id": "T007-WR-01",
        "sourceId": "WR-01",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Permission",
        "title": "Notice What You Are Still Holding",
        "beliefUnderTest": "“If I am still holding this, I have to keep holding it.”",
        "capability": "Recognize one demand, effort, thought, or role that is still present without having to explain or remove it.",
        "prompt": "What is still asking to be held?",
        "choicePrompt": "What is still asking to be held?",
        "options": [
          {
            "id": "option-1",
            "label": "A task."
          },
          {
            "id": "option-2",
            "label": "A thought."
          },
          {
            "id": "option-3",
            "label": "A person or role."
          },
          {
            "id": "option-4",
            "label": "I cannot name it."
          }
        ],
        "action": "Pause for 10 seconds. Name it privately or choose “I cannot name it.”",
        "observation": "Something can be present without becoming your whole next moment.",
        "reflection": "Did naming it change anything, or not?",
        "completion": "Choose “A little,” “not really,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "618b8fe083b1"
      },
      {
        "id": "T007-WR-02",
        "sourceId": "WR-02",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Permission",
        "title": "Let Today Be Enough for Today",
        "beliefUnderTest": "“I have to finish or resolve this before I can stop.”",
        "capability": "Distinguish an unresolved matter from a requirement to continue with it now.",
        "prompt": "Does this need you now, or does it need a place?",
        "choicePrompt": "Does this need you now, or does it need a place?",
        "options": [
          {
            "id": "option-1",
            "label": "It needs me now."
          },
          {
            "id": "option-2",
            "label": "It needs a place."
          },
          {
            "id": "option-3",
            "label": "It can wait."
          },
          {
            "id": "option-4",
            "label": "I do not know."
          }
        ],
        "action": "Choose one response. No plan, promise, message, or explanation is required.",
        "observation": "Unfinished does not always mean immediate.",
        "reflection": "Did the distinction make the next moment clearer?",
        "completion": "Choose “Yes,” “a little,” or “not sure.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "d6f78b8411bd"
      },
      {
        "id": "T007-WR-03",
        "sourceId": "WR-03",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Permission",
        "title": "Choose a Small Ending",
        "beliefUnderTest": "“Stopping only counts if the whole day is complete.”",
        "capability": "Choose one small ending that does not pretend to finish everything.",
        "prompt": "What can end for now?",
        "choicePrompt": "What can end for now?",
        "options": [
          {
            "id": "option-1",
            "label": "One tab or screen."
          },
          {
            "id": "option-2",
            "label": "One thought loop."
          },
          {
            "id": "option-3",
            "label": "One role for this hour."
          },
          {
            "id": "option-4",
            "label": "Nothing can end yet."
          }
        ],
        "action": "Close, set aside, or name the selected item “for now.” Or choose no ending.",
        "observation": "An ending can be partial and still be real.",
        "reflection": "Did that ending fit the moment?",
        "completion": "Choose “It fit,” “partly,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "81845c402eb2"
      },
      {
        "id": "T007-WR-04",
        "sourceId": "WR-04",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Set down",
        "title": "Put One Thing Down",
        "beliefUnderTest": "“If I stop carrying it in my mind, I will lose it.”",
        "capability": "Choose a temporary container for one open concern without treating it as solved.",
        "prompt": "Where can this sit for now?",
        "choicePrompt": "Where can this sit for now?",
        "options": [
          {
            "id": "option-1",
            "label": "A short private note."
          },
          {
            "id": "option-2",
            "label": "A visible object."
          },
          {
            "id": "option-3",
            "label": "A first-step phrase."
          },
          {
            "id": "option-4",
            "label": "I will hold it quietly."
          }
        ],
        "action": "Use the selected option once. Notes are local-only, optional, and limited to 140 characters.",
        "observation": "Putting something down for now is different from losing it.",
        "reflection": "Did it have somewhere to sit?",
        "completion": "Choose “Yes,” “partly,” or “not for me.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "f5081c2bd1a7"
      },
      {
        "id": "T007-WR-05",
        "sourceId": "WR-05",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Set down",
        "title": "Loosen One Grip",
        "beliefUnderTest": "“I have to keep the same grip until I feel different.”",
        "capability": "Test one safe, accessible change in how the user is holding an object, posture, screen, or attention.",
        "prompt": "Where could you loosen the hold by one degree?",
        "choicePrompt": "Where could you loosen the hold by one degree?",
        "options": [
          {
            "id": "option-1",
            "label": "My hands."
          },
          {
            "id": "option-2",
            "label": "My posture."
          },
          {
            "id": "option-3",
            "label": "One screen."
          },
          {
            "id": "option-4",
            "label": "My attention."
          }
        ],
        "action": "Make one small safe change for 15 seconds, or choose “notice without changing.”",
        "observation": "A smaller grip can be an option without requiring a new feeling.",
        "reflection": "Did the change fit, or not?",
        "completion": "Choose “It fit,” “not much,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "89a48aedd242"
      },
      {
        "id": "T007-WR-06",
        "sourceId": "WR-06",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Set down",
        "title": "Let a Role Rest",
        "beliefUnderTest": "“I have to keep being available in the same way.”",
        "capability": "Name one role that may become less active for a while, without withdrawing from care or responsibility.",
        "prompt": "Which role could become quieter for now?",
        "choicePrompt": "Which role could become quieter for now?",
        "options": [
          {
            "id": "option-1",
            "label": "Worker."
          },
          {
            "id": "option-2",
            "label": "Problem-solver."
          },
          {
            "id": "option-3",
            "label": "Planner."
          },
          {
            "id": "option-4",
            "label": "None of these can rest now."
          }
        ],
        "action": "Say privately: “This role can be quieter for now,” or choose “It cannot rest now.”",
        "observation": "A role can remain important without taking every second.",
        "reflection": "Did that wording respect what is real?",
        "completion": "Choose “Yes,” “partly,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "83448151b100"
      },
      {
        "id": "T007-WR-07",
        "sourceId": "WR-07",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Release",
        "title": "Let One Thought Go Unanswered",
        "beliefUnderTest": "“Every thought that returns needs an answer right now.”",
        "capability": "Notice one returning thought and choose not to solve, debate, suppress, or follow it for a brief interval.",
        "prompt": "Is there one thought asking for an answer?",
        "choicePrompt": "Is there one thought asking for an answer?",
        "options": [
          {
            "id": "option-1",
            "label": "Yes."
          },
          {
            "id": "option-2",
            "label": "Maybe."
          },
          {
            "id": "option-3",
            "label": "Not right now."
          }
        ],
        "action": "For 15 seconds, notice the thought and say “not now” once—or choose “I need to answer it now.”",
        "observation": "A thought can be noticed without being solved in this moment.",
        "reflection": "What was it like not to answer immediately?",
        "completion": "Choose “Possible,” “hard,” or “not available today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "3e7196a83b16"
      },
      {
        "id": "T007-WR-08",
        "sourceId": "WR-08",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Release",
        "title": "Make One Release Gesture",
        "beliefUnderTest": "“Release has to be dramatic to be real.”",
        "capability": "Choose a small physical or attention-based cue that marks a voluntary release.",
        "prompt": "What small gesture could say “for now”?",
        "choicePrompt": "What small gesture could say “for now”?",
        "options": [
          {
            "id": "option-1",
            "label": "Open my hands."
          },
          {
            "id": "option-2",
            "label": "Set one thing aside."
          },
          {
            "id": "option-3",
            "label": "Change position."
          },
          {
            "id": "option-4",
            "label": "Look away from one screen."
          }
        ],
        "action": "Use the cue once, safely, or choose “I will only notice.”",
        "observation": "A release can be small, private, and unfinished.",
        "reflection": "Did the cue mean anything to you?",
        "completion": "Choose “Yes,” “a little,” or “not for me.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "4acdeac493f9"
      },
      {
        "id": "T007-WR-09",
        "sourceId": "WR-09",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Release",
        "title": "Leave Space for No Next Step",
        "beliefUnderTest": "“Every moment has to become the next task.”",
        "capability": "Experience a brief interval without selecting the next productive action.",
        "prompt": "Could the next 20 seconds belong to no task?",
        "choicePrompt": "Could the next 20 seconds belong to no task?",
        "options": [
          {
            "id": "option-1",
            "label": "That feels possible."
          },
          {
            "id": "option-2",
            "label": "That feels difficult."
          },
          {
            "id": "option-3",
            "label": "I cannot do that now."
          }
        ],
        "action": "Let 20 seconds pass without choosing the next task. Pause, stop, or exit at any time.",
        "observation": "An unassigned moment does not have to be wasted.",
        "reflection": "What did the unassigned moment make room for, if anything?",
        "completion": "Choose “Something,” “nothing,” or “not today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "6fb7abb7eea8"
      },
      {
        "id": "T007-WR-10",
        "sourceId": "WR-10",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Return",
        "title": "Notice the Reopening",
        "beliefUnderTest": "“If the demand returns, I have failed to release it.”",
        "capability": "Recognize a returning demand without treating its return as failure.",
        "prompt": "Has something reopened?",
        "choicePrompt": "Has something reopened?",
        "options": [
          {
            "id": "option-1",
            "label": "A task."
          },
          {
            "id": "option-2",
            "label": "A thought."
          },
          {
            "id": "option-3",
            "label": "A message or device."
          },
          {
            "id": "option-4",
            "label": "Nothing yet."
          }
        ],
        "action": "Name the reopening for 10 seconds. Do not fix, suppress, or explain it.",
        "observation": "Something can return without cancelling the ending you made.",
        "reflection": "Did naming the return make your next choice clearer?",
        "completion": "Choose “Clearer,” “a little,” or “not yet.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "e116d85b7366"
      },
      {
        "id": "T007-WR-11",
        "sourceId": "WR-11",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Return",
        "title": "Release Without Resolving",
        "beliefUnderTest": "“I can only release something after I have solved it.”",
        "capability": "Use a chosen phrase or boundary to return to release while the matter remains unresolved.",
        "prompt": "What could let this remain unfinished for now?",
        "choicePrompt": "What could let this remain unfinished for now?",
        "options": [
          {
            "id": "option-1",
            "label": "“Later.”"
          },
          {
            "id": "option-2",
            "label": "“I have a place for this.”"
          },
          {
            "id": "option-3",
            "label": "Put one thing aside."
          },
          {
            "id": "option-4",
            "label": "Look where I am."
          }
        ],
        "action": "Use the cue once, then take the real next action—or attend to the matter if needed.",
        "observation": "A boundary can coexist with an unresolved reality.",
        "reflection": "Did the cue fit this moment?",
        "completion": "Choose “Yes,” “partly,” or “not for me.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "a3e71331e42b"
      },
      {
        "id": "T007-WR-12",
        "sourceId": "WR-12",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Return",
        "title": "Begin Again Without Repairing It All",
        "beliefUnderTest": "“If I get pulled back, I have to restart perfectly.”",
        "capability": "Resume a release route after interruption using the smallest viable cue.",
        "prompt": "You do not need to start over.",
        "choicePrompt": "You do not need to start over.",
        "options": [
          {
            "id": "option-1",
            "label": "Name the demand."
          },
          {
            "id": "option-2",
            "label": "Use one cue."
          },
          {
            "id": "option-3",
            "label": "Leave space for a breath."
          },
          {
            "id": "option-4",
            "label": "Return later."
          }
        ],
        "action": "Use the chosen route once, or choose “return later.”",
        "observation": "A smaller return is still a return.",
        "reflection": "Did the smaller route fit?",
        "completion": "Choose “It fit,” “partly,” or “not available today.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "248b4989c051"
      },
      {
        "id": "T007-WR-13",
        "sourceId": "WR-13",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "A Hard Release",
        "beliefUnderTest": "“If the moment is difficult, release is not possible.”",
        "capability": "Choose a minimum viable release route during urgency, care duty, illness, grief, conflict, high demand, or exhaustion.",
        "prompt": "This may not have room for a full ending. What is possible?",
        "choicePrompt": "This may not have room for a full ending. What is possible?",
        "options": [
          {
            "id": "option-1",
            "label": "Name what I am holding."
          },
          {
            "id": "option-2",
            "label": "Put one thing down."
          },
          {
            "id": "option-3",
            "label": "Choose one next action."
          },
          {
            "id": "option-4",
            "label": "Attend elsewhere."
          }
        ],
        "action": "Complete the route only if safe and useful. “Attend elsewhere” ends the session immediately.",
        "observation": "A smaller release can respect a difficult moment.",
        "reflection": "Did this respect what was needed?",
        "completion": "Choose “Yes,” “partly,” or “I need care elsewhere.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "26af431d176e"
      },
      {
        "id": "T007-WR-14",
        "sourceId": "WR-14",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Build My Release Route",
        "beliefUnderTest": "“The app must tell me how to let go.”",
        "capability": "Build an editable two-step release route from tested cues.",
        "prompt": "You know this moment better than we do. What helps first?",
        "choicePrompt": "You know this moment better than we do. What helps first?",
        "options": [
          {
            "id": "option-1",
            "label": "Name what I am holding."
          },
          {
            "id": "option-2",
            "label": "Give it a place."
          },
          {
            "id": "option-3",
            "label": "Use one gesture."
          },
          {
            "id": "option-4",
            "label": "Leave space."
          },
          {
            "id": "option-5",
            "label": "My own choice."
          }
        ],
        "action": "Arrange two cues in order. The app provides only Begin and quiet pacing.",
        "observation": "You designed a way to release without pretending everything is resolved.",
        "reflection": "Did your route fit today?",
        "completion": "Choose “Yes,” “partly,” or “try a different route next time.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "abd7a2cc004f"
      },
      {
        "id": "T007-WR-15",
        "sourceId": "WR-15",
        "version": "1.0",
        "semanticVersion": "1.0.0",
        "state": "Self-direct",
        "title": "Release Without Mirellis",
        "beliefUnderTest": "“I need the app to let go.”",
        "capability": "Practice a self-guided release route, returning only to reflect.",
        "prompt": "Next time something is ending, use your route before opening Mirellis.",
        "choicePrompt": "Next time something is ending, use your route before opening Mirellis.",
        "options": [
          {
            "id": "option-1",
            "label": "Use my saved route."
          },
          {
            "id": "option-2",
            "label": "Choose in the moment."
          },
          {
            "id": "option-3",
            "label": "I am not ready yet."
          }
        ],
        "action": "Complete the first chosen cue before reopening the app. On return, show only the reflection.",
        "observation": "You can choose release without a script.",
        "reflection": "What did you do, and did it fit?",
        "completion": "Choose “I guided myself,” “I needed support,” or “I will try again.”",
        "fallback": "Leave it for today. Your place will be kept.",
        "contentHash": "8235f0bbae5e"
      }
    ]
  }
];

validateTransitions(transitions);
