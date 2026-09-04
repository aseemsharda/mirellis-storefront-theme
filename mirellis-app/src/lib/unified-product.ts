export type MomentKey = 'waking' | 'focus' | 'after-work' | 'night';

export type QuestionOption = {
  value: string;
  label: string;
  support?: string;
};

export type ProductQuestion = {
  id: string;
  prompt: string;
  reason?: string;
  type: 'single' | 'text' | 'time';
  options?: readonly QuestionOption[];
  placeholder?: string;
  required?: boolean;
};

export type PracticeStep = {
  title: string;
  body: string;
  action: string;
  confirmation: string;
};

export type Recommendation = {
  key: string;
  moment: MomentKey;
  name: string;
  acknowledgement: string;
  fit: string;
  promise: string;
  duration: string;
  steps: readonly PracticeStep[];
  alternatives?: readonly string[];
  professionalRoute?: 'sleep' | 'attention' | 'safety' | 'crisis';
};

export type Answers = Record<string, string>;

export const momentDefinitions: Record<MomentKey, {
  label: string;
  shortLabel: string;
  question: string;
  support: string;
}> = {
  waking: {
    label: 'Getting going after waking',
    shortLabel: 'Waking',
    question: 'You’re awake. What is making it hard to begin?',
    support: 'Choose what is true right now. Mirellis will not judge how well you slept.',
  },
  focus: {
    label: 'Beginning or holding focus',
    shortLabel: 'Focus',
    question: 'What must exist when this session ends?',
    support: 'Choose a real result. Mirellis will help prepare the conditions, then get out of the way.',
  },
  'after-work': {
    label: 'Leaving work behind',
    shortLabel: 'After work',
    question: 'Work has ended. What is still with you?',
    support: 'Choose the closest description. Each answer leads to a different first action.',
  },
  night: {
    label: 'Stopping for sleep',
    shortLabel: 'Night',
    question: 'You meant to stop. What happened next?',
    support: 'Reconstruct one recent night. Mirellis will suggest a possibility for you to confirm—not a diagnosis.',
  },
};

const commonTimeOptions: readonly QuestionOption[] = [
  { value: '5', label: '5 minutes' },
  { value: '10', label: '10 minutes' },
  { value: '20', label: '20 minutes' },
  { value: '35', label: '35 minutes' },
  { value: '50', label: '50 minutes' },
];

export const questionsByMoment: Record<MomentKey, readonly ProductQuestion[]> = {
  waking: [
    {
      id: 'waking_difficulty',
      prompt: 'What is hardest right now?',
      type: 'single', required: true,
      options: [
        { value: 'sleepy', label: 'I still feel sleepy or foggy' },
        { value: 'heavy', label: 'My body feels physically heavy' },
        { value: 'rushed', label: 'I am anxious or rushed' },
        { value: 'unclear', label: 'I do not know where to begin' },
        { value: 'unwell', label: 'I feel unwell or unsafe' },
      ],
    },
    {
      id: 'sleep_opportunity',
      prompt: 'Roughly how much opportunity did you have to sleep?',
      reason: 'A short night changes what is safe and realistic this morning.',
      type: 'single', required: true,
      options: [
        { value: 'under5', label: 'Under 5 hours' },
        { value: '5to6', label: '5–6 hours' },
        { value: '6to7', label: '6–7 hours' },
        { value: '7to9', label: '7–9 hours' },
        { value: 'over9', label: 'More than 9 hours' },
        { value: 'unknown', label: 'Not sure' },
      ],
    },
    {
      id: 'awake_for', prompt: 'How long have you been awake?', type: 'single', required: true,
      options: [
        { value: 'under10', label: 'Under 10 minutes' },
        { value: '10to30', label: '10–30 minutes' },
        { value: '30to90', label: '30–90 minutes' },
        { value: 'over90', label: 'More than 90 minutes' },
      ],
    },
    {
      id: 'safety_task',
      prompt: 'Do you need to drive, operate machinery or make a safety-critical decision within the next hour?',
      reason: 'A brief routine cannot make severe sleepiness safe.',
      type: 'single', required: true,
      options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
    },
    {
      id: 'morning_access', prompt: 'What can you access right now?', type: 'single', required: true,
      options: [
        { value: 'outdoor', label: 'Comfortable outdoor daylight' },
        { value: 'window', label: 'Indoor light or a bright window' },
        { value: 'movement', label: 'A quiet minute to move' },
        { value: 'none', label: 'None of these' },
      ],
    },
  ],
  focus: [
    { id: 'focus_result', prompt: 'What must exist when this session ends?', type: 'text', required: true, placeholder: 'Example: A reviewed first draft of the product page' },
    {
      id: 'focus_barrier', prompt: 'What is stopping you right now?', type: 'single', required: true,
      options: [
        { value: 'cannot-begin', label: 'I cannot begin' },
        { value: 'unclear', label: 'The task is unclear' },
        { value: 'phone', label: 'My phone or sites keep pulling me away' },
        { value: 'thoughts', label: 'Other thoughts keep arriving' },
        { value: 'people', label: 'People or messages interrupt me' },
        { value: 'tired', label: 'I am too tired' },
        { value: 'unsure', label: 'I am not sure' },
      ],
    },
    { id: 'focus_time', prompt: 'How much uninterrupted time do you actually have?', type: 'single', required: true, options: commonTimeOptions },
    {
      id: 'phone_location', prompt: 'Where is your phone?', type: 'single', required: true,
      options: [
        { value: 'another-room', label: 'In another room' },
        { value: 'stored', label: 'In a bag or drawer' },
        { value: 'desk', label: 'On the desk' },
        { value: 'needed', label: 'I need it for this task' },
      ],
    },
    { id: 'first_action', prompt: 'What is the first visible action?', type: 'text', required: true, placeholder: 'Example: Open the draft and rewrite the first heading' },
    {
      id: 'focus_safety', prompt: 'Is your tiredness strong enough that continuing would be unsafe or clearly unproductive?', type: 'single', required: true,
      options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Not sure' }],
    },
  ],
  'after-work': [
    {
      id: 'work_residue', prompt: 'What is still with you?', type: 'single', required: true,
      options: [
        { value: 'unfinished', label: 'An unfinished task is replaying' },
        { value: 'checking', label: 'I keep checking work' },
        { value: 'activated', label: 'My mind or body still feels switched on' },
        { value: 'affected', label: 'Something at work affected me emotionally' },
        { value: 'depleted', label: 'I feel depleted or numb' },
        { value: 'unsure', label: 'I cannot tell' },
      ],
    },
    {
      id: 'work_location', prompt: 'Where are you now?', type: 'single', required: true,
      options: [
        { value: 'workspace', label: 'At the workspace' },
        { value: 'commuting', label: 'Commuting' },
        { value: 'home', label: 'At home' },
        { value: 'elsewhere', label: 'Somewhere else' },
      ],
    },
    {
      id: 'work_time', prompt: 'How much time can you give this transition?', type: 'single', required: true,
      options: [{ value: '3', label: '3 minutes' }, { value: '8', label: '8 minutes' }, { value: '15', label: '15 minutes' }],
    },
    {
      id: 'evening_need', prompt: 'What does the next part of the evening need most?', type: 'single', required: true,
      options: [
        { value: 'quiet', label: 'Quiet' },
        { value: 'movement', label: 'Movement' },
        { value: 'connection', label: 'Connection' },
        { value: 'practical', label: 'A practical task' },
        { value: 'unknown', label: 'Nothing planned yet' },
      ],
    },
  ],
  night: [
    { id: 'intended_stop', prompt: 'What time did you intend to begin getting ready for sleep?', type: 'time', required: true },
    { id: 'actual_stop', prompt: 'What time did you actually stop the activity that kept you up?', type: 'time', required: true },
    {
      id: 'night_activity', prompt: 'What were you mainly doing in the gap?', type: 'single', required: true,
      options: [
        { value: 'scrolling', label: 'Scrolling or watching' },
        { value: 'working', label: 'Working' },
        { value: 'social', label: 'Talking or messaging' },
        { value: 'gaming', label: 'Gaming' },
        { value: 'reading', label: 'Reading or making something' },
        { value: 'care', label: 'Household or caregiving' },
        { value: 'awake', label: 'Lying awake' },
        { value: 'other', label: 'Something else' },
      ],
    },
    {
      id: 'sleepiness', prompt: 'At the time you intended to stop, what did your body feel like?', type: 'single', required: true,
      options: [
        { value: 'sleepy', label: 'Sleepy' },
        { value: 'tired-active', label: 'Tired, but mentally active' },
        { value: 'not-sleepy', label: 'Not sleepy' },
        { value: 'activated', label: 'Physically uncomfortable or activated' },
        { value: 'bed-awake', label: 'Already in bed, but awake' },
        { value: 'unknown', label: 'Not sure' },
      ],
    },
    {
      id: 'night_function', prompt: 'What did staying up give you in that moment?', type: 'single', required: true,
      options: [
        { value: 'mine', label: 'Time that felt like mine' },
        { value: 'relief', label: 'Relief or distraction' },
        { value: 'connection', label: 'Connection' },
        { value: 'work', label: 'A chance to finish work' },
        { value: 'automatic', label: 'I continued without deciding' },
        { value: 'unclear', label: 'Nothing obvious' },
        { value: 'unknown', label: 'Not sure' },
      ],
    },
    {
      id: 'night_frequency', prompt: 'How often has this been happening recently?', type: 'single', required: true,
      options: [
        { value: 'rare', label: 'Less than weekly' },
        { value: 'weekly', label: '1–2 nights a week' },
        { value: 'often', label: '3 or more nights a week' },
        { value: 'almost', label: 'Almost every night' },
        { value: 'unknown', label: 'Not sure' },
      ],
    },
    {
      id: 'night_duration', prompt: 'How long has this been a concern?', type: 'single', required: true,
      options: [
        { value: 'under2w', label: 'Under two weeks' },
        { value: '2to12w', label: '2–12 weeks' },
        { value: 'over3m', label: '3 months or longer' },
        { value: 'unknown', label: 'Not sure' },
      ],
    },
    {
      id: 'breathing_signs', prompt: 'Have you noticed loud snoring, gasping, choking or pauses in your breathing during sleep?', type: 'single', required: true,
      options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unknown', label: 'Not sure' }, { value: 'skip', label: 'Prefer not to say' }],
    },
    {
      id: 'daytime_safety', prompt: 'Has sleepiness contributed to a near miss, accident or difficulty staying awake while driving?', type: 'single', required: true,
      options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'skip', label: 'Prefer not to say' }],
    },
    {
      id: 'night_distress', prompt: 'Are sleep difficulties causing severe distress or making daily life difficult most days?', type: 'single', required: true,
      options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'skip', label: 'Prefer not to say' }],
    },
  ],
};

const step = (title: string, body: string, action: string, confirmation: string): PracticeStep => ({ title, body, action, confirmation });

const wakingRecommendations: Record<string, Recommendation> = {
  safety: {
    key: 'waking-safety', moment: 'waking', name: 'Protect limited capacity',
    acknowledgement: 'You said you feel sleepy and have a safety-critical task soon.',
    fit: 'A brief routine cannot make severe sleepiness safe.',
    promise: 'Mirellis will help you pause the task and choose a safer next step.', duration: 'About 2 minutes', professionalRoute: 'safety',
    steps: [step('Do not rely on a quick reset', 'Postpone the task if you can. If you cannot, involve another person or use the safest available alternative.', 'Choose the safe alternative before continuing.', 'I have chosen a safer next step')],
  },
  capacity: {
    key: 'waking-capacity', moment: 'waking', name: 'Protect limited capacity',
    acknowledgement: 'You had a short sleep opportunity and feel sleepy or heavy.',
    fit: 'This morning calls for a lower-risk first task, not a performance promise.',
    promise: 'You will choose one safe, low-demand beginning and postpone one avoidable demand.', duration: 'About 3 minutes',
    steps: [
      step('Choose a lower-risk first task', 'Pick something ordinary that does not depend on fast judgment.', 'Name the first low-demand task you can safely begin.', 'I chose the first task'),
      step('Move one avoidable demand', 'Postpone or ask for help with one task that does not need to happen now.', 'Make one concrete change to the next hour.', 'I changed the next hour'),
    ],
  },
  orient: {
    key: 'waking-orient', moment: 'waking', name: 'Orient before accelerating',
    acknowledgement: 'You said the morning feels rushed, unclear or difficult to enter.',
    fit: 'A visible first commitment can reduce the decisions competing for attention.',
    promise: 'You will name what must happen first and what can wait.', duration: 'About 3 minutes',
    steps: [
      step('Name what truly has to happen first', 'Choose one result—not the whole day.', 'Say or write the one thing that must exist first.', 'I named the first result'),
      step('Name what can wait', 'Remove one avoidable decision from the next hour.', 'Choose one thing you will not begin yet.', 'I made room for the first result'),
    ],
  },
  light: {
    key: 'waking-light', moment: 'waking', name: 'Open light and movement',
    acknowledgement: 'You have only recently woken and can access comfortable light or movement.',
    fit: 'Light and gentle movement may support alertness, but they do not replace enough sleep.',
    promise: 'You will change the immediate environment and begin one visible task.', duration: 'About 4 minutes',
    steps: [
      step('Move toward comfortable light', 'Use the brightest comfortable light available. Outdoors is optional and only if practical and safe.', 'Change the light around you now.', 'The light is different'),
      step('Move gently for two minutes', 'Walk, mobilise or do one ordinary household action.', 'Choose movement that is safe for your body and location.', 'I moved for two minutes'),
      step('Begin one visible task', 'Choose one action that can be started immediately.', 'Begin the first visible action, then leave the app.', 'I began the first action'),
    ],
  },
};

const focusRecommendations: Record<string, Recommendation> = {
  stop: {
    key: 'focus-stop', moment: 'focus', name: 'Stop or reschedule safely',
    acknowledgement: 'You said tiredness may make continuing unsafe or clearly unproductive.',
    fit: 'Pushing through is not the right focus intervention when capacity is the main limit.',
    promise: 'You will choose rest, help or a safer time instead of forcing this session.', duration: 'About 2 minutes', professionalRoute: 'safety',
    steps: [step('Protect capacity', 'Pause the session. If the task is safety-critical, do not rely on motivation or a focus exercise.', 'Reschedule, reduce the task, or ask another person for help.', 'I chose a safer next step')],
  },
  launch: {
    key: 'focus-launch', moment: 'focus', name: 'Make the first action visible',
    acknowledgement: 'You know the result, but beginning is the difficult point.',
    fit: 'A concrete first action reduces the work needed to decide how to begin.',
    promise: 'You will prepare the exact first action and begin a protected work window.', duration: 'Your chosen work window',
    steps: [
      step('Prepare only the first action', 'Open only what the first visible action requires.', 'Close unrelated tabs and place the first action in front of you.', 'The first action is ready'),
      step('Make one commitment', 'Work only toward the result you named for the time you actually have.', 'Say: For this session, I am working only toward my chosen result.', 'I made the commitment'),
      step('Begin the work window', 'Leave Mirellis open only if you need the timer. Otherwise put the screen away.', 'Begin the first visible action now.', 'I began the session'),
    ],
  },
  clarify: {
    key: 'focus-clarify', moment: 'focus', name: 'Define what done means',
    acknowledgement: 'You said the task itself is unclear.',
    fit: 'A work session cannot be protected until its observable result is defined.',
    promise: 'You will narrow the result, define one done condition and begin its first action.', duration: 'About 5 minutes before work begins',
    steps: [
      step('Narrow the result', 'Choose one result that can exist at the end of this session.', 'Remove anything that belongs to a later session.', 'The result is narrow enough'),
      step('Define one done condition', 'Choose what will make this session visibly complete.', 'Write one plain sentence beginning: This session is complete when…', 'I defined done'),
      step('Begin the first action', 'Open only the tool needed for the first visible action.', 'Begin now; other work can wait.', 'I began the first action'),
    ],
  },
  phone: {
    key: 'focus-phone', moment: 'focus', name: 'Put the pull beyond reach',
    acknowledgement: 'You said the phone or sites are pulling attention away.',
    fit: 'Changing the environment is more reliable than repeatedly resisting a nearby cue.',
    promise: 'You will move the main distraction and begin one protected work window.', duration: 'Your chosen work window',
    steps: [
      step('Move the device', 'If the phone is not required, place it in another room, bag or drawer. If it is required, close nonessential apps and notifications.', 'Make the device arrangement real now.', 'The phone arrangement is ready'),
      step('Keep only the tools the result needs', 'Close or hide unrelated sites, tabs and messages.', 'Leave the chosen work surface visible.', 'Only the needed tools remain'),
      step('Begin the first action', 'Work only toward the result you named for the time you actually have.', 'Begin the first visible action now.', 'I began the session'),
    ],
  },
  park: {
    key: 'focus-park', moment: 'focus', name: 'Park what follows you',
    acknowledgement: 'Other thoughts are arriving while you try to work.',
    fit: 'A temporary parking place lets you capture a thought without switching tasks.',
    promise: 'You will create one parking line and return to the chosen result.', duration: 'About 2 minutes before work begins',
    steps: [
      step('Create a parking line', 'Use one note titled “After this session.” It is not another task list.', 'Record only the thought that is pulling you away.', 'The thought has a place'),
      step('Return to the result', 'Reopen the first visible action and leave the parking line out of sight.', 'Begin the chosen work window.', 'I returned to the result'),
    ],
  },
  boundary: {
    key: 'focus-boundary', moment: 'focus', name: 'Protect this work window',
    acknowledgement: 'People or messages are interrupting the work you chose.',
    fit: 'A visible availability boundary changes what others can reasonably expect.',
    promise: 'You will set one clear return time and begin the chosen result.', duration: 'About 3 minutes before work begins',
    steps: [
      step('Set a return time', 'Tell the relevant person or channel when you will be available again.', 'Use one factual sentence with the end time.', 'The return time is visible'),
      step('Close the interrupting channel', 'Keep a genuinely urgent route only if one is required.', 'Silence or close the ordinary channel for this session.', 'The channel is closed'),
      step('Begin the result', 'Use the first visible action you named.', 'Begin now.', 'I began the session'),
    ],
  },
};

const afterWorkRecommendations: Record<string, Recommendation> = {
  unfinished: {
    key: 'after-work-return', moment: 'after-work', name: 'Leave tomorrow a starting point',
    acknowledgement: 'An unfinished point is still asking for attention.',
    fit: 'A visible return point can close the current loop without pretending the work is finished.',
    promise: 'You will leave one clear first action for tomorrow and close the work surface.', duration: '3–8 minutes',
    steps: [
      step('Write tomorrow’s first visible action', 'Name where work will resume—not the whole task.', 'Write one small action that tomorrow-you can recognise.', 'I left a return point'),
      step('Close the work surface', 'Close the document, tab, notebook or device where the task lives.', 'Make the work surface visibly unavailable.', 'The work surface is closed'),
      step('Begin the evening', 'Choose quiet, movement, connection or one practical action.', 'Leave the app and begin the next part of the evening.', 'I began what comes next'),
    ],
  },
  checking: {
    key: 'after-work-device', moment: 'after-work', name: 'End the checking loop',
    acknowledgement: 'Checking keeps the work window open even when no useful action follows.',
    fit: 'A last-check decision and physical distance change the cue itself.',
    promise: 'You will decide whether one final check is needed, then move the device out of reach.', duration: 'About 3 minutes',
    steps: [
      step('Choose the last check', 'If a genuine check is needed, do it once. Otherwise let the last check be the one already completed.', 'Decide now whether another check is necessary.', 'The last check is decided'),
      step('Move the device', 'Close work apps and move the work device out of sight or reach.', 'Keep only a genuinely urgent channel if your role requires one.', 'The checking cue is away'),
      step('Begin one non-work action', 'Choose what the next part of the evening needs.', 'Leave the app and begin it.', 'I began what comes next'),
    ],
  },
  activated: {
    key: 'after-work-downshift', moment: 'after-work', name: 'Change the physical signal',
    acknowledgement: 'Work has ended, but effort still feels present in your mind or body.',
    fit: 'A safe change in movement, posture or environment can make the boundary more visible.',
    promise: 'You will change one physical signal and choose a lower-demand next action.', duration: '3–8 minutes',
    steps: [
      step('Change one signal', 'Stand, change rooms, loosen your posture or wash your hands. Choose one safe change.', 'Make the environment or body position different.', 'The signal is different'),
      step('Choose a lower-demand next action', 'Pick quiet, gentle movement, food, a shower or another ordinary recovery action.', 'Leave the app and begin it.', 'I began the next action'),
    ],
  },
  affected: {
    key: 'after-work-support', moment: 'after-work', name: 'Name what support is needed',
    acknowledgement: 'Something at work is still emotionally present.',
    fit: 'The useful next step may be space, a conversation or a practical action—not interpretation from Mirellis.',
    promise: 'You will choose one kind of support and make it concrete.', duration: 'About 3 minutes',
    steps: [
      step('Choose the support', 'Choose space, a conversation, one practical action or professional support.', 'Name only what would help now; you do not need to explain the event to Mirellis.', 'I chose the support I need'),
      step('Make it real', 'Send the message, move somewhere private, take the practical step or open the support directory.', 'Begin the support outside the app.', 'I began the support action'),
    ],
  },
  depleted: {
    key: 'after-work-recover', moment: 'after-work', name: 'Choose the lowest-demand recovery action',
    acknowledgement: 'You said you feel depleted or numb.',
    fit: 'Adding a complex ritual would create another demand.',
    promise: 'You will choose one practical recovery action and remove one unnecessary decision.', duration: 'About 2 minutes',
    steps: [
      step('Choose the lowest-demand action', 'Food, water, rest, a shower or gentle movement may fit. Choose what is accessible—not what sounds ideal.', 'Begin one ordinary recovery action.', 'I began the recovery action'),
      step('Remove one decision', 'Let one optional task wait until later or tomorrow.', 'Make that decision explicit.', 'I removed one demand'),
    ],
  },
  unsure: {
    key: 'after-work-land', moment: 'after-work', name: 'Choose one place to land',
    acknowledgement: 'You do not have to name the residue before leaving work.',
    fit: 'A neutral boundary can still make the next part of the day concrete.',
    promise: 'You will close one work cue and begin one ordinary evening action.', duration: 'About 3 minutes',
    steps: [
      step('Close one work cue', 'Close one tab, document, notebook or device.', 'Choose the easiest visible boundary.', 'One work cue is closed'),
      step('Begin one ordinary action', 'Choose quiet, movement, connection or a practical task.', 'Leave the app and begin it.', 'I began what comes next'),
    ],
  },
};

const nightRecommendations: Record<string, Recommendation> = {
  safety: {
    key: 'night-safety', moment: 'night', name: 'Seek appropriate support',
    acknowledgement: 'One of your answers points beyond a self-guided stopping experiment.',
    fit: 'Breathing concerns, dangerous daytime sleepiness or severe persistent difficulty deserve qualified assessment.',
    promise: 'Mirellis will show the relevant next step without diagnosing the cause.', duration: 'Immediate', professionalRoute: 'sleep',
    steps: [step('Choose the next source of help', 'Use a qualified sleep clinician or appropriate medical service. If staying awake is unsafe now, stop driving or operating machinery.', 'Open the help route or contact a clinician you already trust.', 'I know the next help step')],
  },
  automatic: {
    key: 'night-if-then', moment: 'night', name: 'Make the stopping decision in advance',
    acknowledgement: 'You were sleepy, but the activity continued without a new decision.',
    fit: 'An explicit if–then cue moves the stopping choice earlier than the automatic continuation.',
    promise: 'You will choose one visible cue and one stopping action to test tonight.', duration: 'About 3 minutes tonight; optional 7-night experiment',
    steps: [
      step('Choose the cue', 'Use the intended stopping time or another event you can reliably notice.', 'Complete: If it is [cue]…', 'I chose the cue'),
      step('Choose the stopping action', 'Make it observable: close the app, put the phone in its place, or begin getting ready.', 'Complete: …then I will [action].', 'I chose the action'),
      step('Mark the real stop', 'When the activity actually ends, return once and tap the live timestamp control. Do not stay on-screen in bed.', 'Use the marker only at the moment you stop.', 'I will mark the real stop')
    ],
  },
  'protected-time': {
    key: 'night-protected-time', moment: 'night', name: 'Protect personal time earlier',
    acknowledgement: 'Staying up was giving you time that felt like your own.',
    fit: 'Removing the only protected part of the day can make the stopping plan unrealistic.',
    promise: 'You will place a small protected period before the intended stop, then use one stopping cue.', duration: 'Plan in 4 minutes; test for 7 nights',
    steps: [
      step('Protect a small period earlier', 'Choose a realistic period before the intended stopping time that belongs to you.', 'Name when it begins and what it is for.', 'My protected time has a place'),
      step('Choose the end cue', 'Use one visible event that closes the protected period.', 'Move the device or activity out of the sleep space when the cue occurs.', 'I chose the stopping cue'),
    ],
  },
  relief: {
    key: 'night-relief', moment: 'night', name: 'Create an earlier off-ramp',
    acknowledgement: 'The activity was providing relief or distance from the day.',
    fit: 'A stopping plan needs another way to decompress; removing the activity alone may not fit.',
    promise: 'You will test one lower-friction decompression action before the intended stop.', duration: 'About 5 minutes; test for 7 nights',
    steps: [
      step('Choose the off-ramp', 'Use a familiar sound, shower, brief note, gentle movement or another ordinary action that does not extend screen use.', 'Choose one action you can access tonight.', 'I chose the off-ramp'),
      step('Place it before the stop', 'Begin it before the activity usually becomes difficult to leave.', 'Choose the exact cue that starts it.', 'The off-ramp has a cue'),
    ],
  },
  social: {
    key: 'night-social', moment: 'night', name: 'Make the social ending visible',
    acknowledgement: 'Connection was the activity that continued past the intended stop.',
    fit: 'A clear message and agreed stopping signal can end the interaction without pretending connection is the problem.',
    promise: 'You will choose one honest final message and a visible device boundary.', duration: 'About 3 minutes; test for 7 nights',
    steps: [
      step('Choose the final message', 'State that you are stopping and when you will return.', 'Prepare one sentence you can actually send.', 'My final message is ready'),
      step('Make the device boundary visible', 'Choose where the device goes after the message.', 'Move it to that place when the message is sent.', 'I chose the device boundary'),
    ],
  },
  work: {
    key: 'night-work', moment: 'night', name: 'Close work before the night begins',
    acknowledgement: 'Work continued into the time you meant to stop.',
    fit: 'The unfinished work needs a return point before a night stopping cue can be credible.',
    promise: 'You will leave tomorrow a first action, then close the work surface.', duration: 'About 5 minutes',
    steps: afterWorkRecommendations.unfinished.steps,
  },
  timing: {
    key: 'night-timing', moment: 'night', name: 'Observe when sleepiness actually arrives',
    acknowledgement: 'You said you were not sleepy at the intended stopping time.',
    fit: 'This may not be bedtime procrastination. A forced earlier stop is not the right assumption.',
    promise: 'For seven nights, you will record when sleepiness first becomes clear without treating it as a score.', duration: 'One tap each night for 7 nights',
    steps: [step('Observe without forcing', 'Keep your intended time visible, but do not label yourself late or undisciplined.', 'Mark when sleepiness first becomes clear and whether the time was live or recalled.', 'I understand what to observe')],
  },
  insomnia: {
    key: 'night-insomnia', moment: 'night', name: 'Use an evidence-based insomnia route',
    acknowledgement: 'You were already trying to sleep or felt sleepy, but remained awake with persistent difficulty.',
    fit: 'A stopping experiment may not address this pattern.',
    promise: 'Mirellis will explain evidence-based insomnia support and help you find a qualified practitioner.', duration: 'Immediate information', professionalRoute: 'sleep',
    steps: [step('Choose qualified support', 'Evidence-based insomnia care may be a better next step than another sleep-hygiene list.', 'Open the professional-help route or save the information for later.', 'I know the next option')],
  },
};

export const nightPossibilityOptions = [
  { value: 'automatic', label: 'The activity kept continuing without a new decision' },
  { value: 'protected-time', label: 'The late time felt like the only time that was mine' },
  { value: 'relief', label: 'The activity gave me relief or distance from the day' },
  { value: 'social', label: 'I did not want to end a conversation or connection' },
  { value: 'work', label: 'Work was still open' },
  { value: 'timing', label: 'I simply was not sleepy yet' },
  { value: 'insomnia', label: 'I was trying to sleep, but remained awake' },
] as const;

export function recommendationForNightPossibility(value: string): Recommendation {
  return nightRecommendations[value] ?? nightRecommendations.automatic;
}

export function routeRecommendation(moment: MomentKey, answers: Answers): Recommendation {
  if (moment === 'waking') {
    if (answers.safety_task === 'yes' && ['sleepy', 'heavy'].includes(answers.waking_difficulty)) return wakingRecommendations.safety;
    if (answers.sleep_opportunity === 'under5' && ['sleepy', 'heavy'].includes(answers.waking_difficulty)) return wakingRecommendations.capacity;
    if (['rushed', 'unclear'].includes(answers.waking_difficulty) || answers.morning_access === 'none') return wakingRecommendations.orient;
    return wakingRecommendations.light;
  }

  if (moment === 'focus') {
    if (answers.focus_safety === 'yes') return focusRecommendations.stop;
    switch (answers.focus_barrier) {
      case 'unclear': return focusRecommendations.clarify;
      case 'phone': return focusRecommendations.phone;
      case 'thoughts': return focusRecommendations.park;
      case 'people': return focusRecommendations.boundary;
      case 'tired': return focusRecommendations.stop;
      default: return focusRecommendations.launch;
    }
  }

  if (moment === 'after-work') return afterWorkRecommendations[answers.work_residue] ?? afterWorkRecommendations.unsure;

  if (answers.breathing_signs === 'yes' || answers.daytime_safety === 'yes' || answers.night_distress === 'yes') return nightRecommendations.safety;
  if (answers.sleepiness === 'not-sleepy') return nightRecommendations.timing;
  if (answers.night_activity === 'awake' || answers.sleepiness === 'bed-awake') return nightRecommendations.insomnia;
  if (answers.night_activity === 'working' || answers.night_function === 'work') return nightRecommendations.work;
  if (answers.night_function === 'mine') return nightRecommendations['protected-time'];
  if (answers.night_function === 'relief') return nightRecommendations.relief;
  if (answers.night_function === 'connection' || answers.night_activity === 'social') return nightRecommendations.social;
  return nightRecommendations.automatic;
}

export function candidatePatternCopy(recommendation: Recommendation, answers: Answers): string {
  const evidence = [
    answers.night_activity ? `you selected “${optionLabel('night', 'night_activity', answers.night_activity)}”` : '',
    answers.sleepiness ? `your body felt “${optionLabel('night', 'sleepiness', answers.sleepiness)}”` : '',
    answers.night_function ? `staying up gave you “${optionLabel('night', 'night_function', answers.night_function)}”` : '',
  ].filter(Boolean).join(', and ');
  return `${recommendation.acknowledgement}${evidence ? ` This possibility uses only what you selected: ${evidence}.` : ''}`;
}

export function optionLabel(moment: MomentKey, questionId: string, value: string): string {
  const question = questionsByMoment[moment].find((item) => item.id === questionId);
  return question?.options?.find((option) => option.value === value)?.label ?? value;
}

export function validatesRequiredAnswer(question: ProductQuestion, value: string): boolean {
  if (!question.required) return true;
  if (question.type === 'text') return value.trim().length >= 3;
  return value.trim().length > 0;
}

export const professionalLinks = {
  sleep: 'https://directory.mirellis.in/practitioners?focus=sleep',
  attention: 'https://directory.mirellis.in/practitioners?focus=focus',
  restoration: 'https://directory.mirellis.in/practitioners?focus=restoration',
  safety: 'https://directory.mirellis.in',
  crisis: 'https://112.gov.in/',
  mentalHealth: 'https://dghs.mohfw.gov.in/national-mental-health-programme.php',
} as const;
