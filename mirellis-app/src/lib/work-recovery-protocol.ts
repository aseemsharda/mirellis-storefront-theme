export type RecoveryEntryId = 'unfinished' | 'activated' | 'checking' | 'scattered';

export type GuidedStep = {
  title: string;
  body: string;
  action: string;
  completion: string;
  duration: string;
};

export type RecoveryProtocol = {
  id: RecoveryEntryId;
  label: string;
  acknowledgement: string;
  promise: string;
  steps: readonly GuidedStep[];
  followOn: GuidedStep;
};

// These are consumer-facing protocols, not a hidden diagnostic model. A route
// is selected only from the person's explicit answer and each route changes
// the instructions they receive.
export const workRecoveryProtocols: readonly RecoveryProtocol[] = [
  {
    id: 'unfinished',
    label: 'An unfinished point is still replaying.',
    acknowledgement: 'An open point can keep asking for attention after the day has ended.',
    promise: 'In about eight minutes, you will leave one clear return point and make room for the evening.',
    steps: [
      { title: 'Put the point somewhere it can wait.', body: 'Write one plain line: the next visible action. Keep it short enough that tomorrow-you can recognise it.', action: 'Write the next visible action.', completion: 'I have left a return point', duration: 'Take up to two minutes.' },
      { title: 'Close the work surface.', body: 'Close one work tab, document, or notebook. You are not finishing everything; you are marking that this window is over.', action: 'Close or put away one work surface.', completion: 'The work surface is closed', duration: 'Take a moment.' },
      { title: 'Let the room become different.', body: 'Stand, change rooms, or change the light. Choose one small signal that the next part of the day has begun.', action: 'Make one environmental change.', completion: 'The room feels different', duration: 'Take up to one minute.' },
      { title: 'Choose where your attention goes next.', body: 'Pick one ordinary recovery action: a drink or meal, a short walk, a shower, or a few quiet minutes. Leave the app to do it.', action: 'Choose one next place for your attention.', completion: 'I have chosen my next action', duration: 'Take as long as you need.' },
    ],
    followOn: { title: 'Give the evening one protected minute.', body: 'Sit or stand somewhere supported. Look at one point farther away and let the work surface stay out of reach for one minute.', action: 'Take one protected minute.', completion: 'I have taken the minute', duration: 'One minute.' },
  },
  {
    id: 'activated',
    label: 'My body still feels switched on.',
    acknowledgement: 'Sometimes effort stays in the body after the task itself has ended.',
    promise: 'In about eight minutes, you will change the physical signals around you and choose a gentler pace.',
    steps: [
      { title: 'Find support.', body: 'Let both feet meet the floor or let your back meet a chair. Notice one contact point that is already holding you.', action: 'Find one point of support.', completion: 'I have found support', duration: 'Take a few breaths.' },
      { title: 'Make the signal different.', body: 'Change posture, loosen one layer, drink water, or step into a different room. Choose one safe change, not all of them.', action: 'Make one physical or environmental change.', completion: 'I have changed the signal', duration: 'Take up to two minutes.' },
      { title: 'Lengthen the exhale if it is comfortable.', body: 'Let one exhale be slightly longer than the breath before it. If that does not suit you, simply notice the air around you.', action: 'Take three unforced breaths.', completion: 'I have taken the breaths', duration: 'Take your own pace.' },
      { title: 'Choose a lower-demand next action.', body: 'Choose a quiet drink or meal, a shower, a gentle walk, or a few minutes without another demand. Leave the app to begin it.', action: 'Choose one gentler next action.', completion: 'I have chosen my next action', duration: 'Take as long as you need.' },
    ],
    followOn: { title: 'Let your eyes travel.', body: 'From a safe, still place, let your eyes rest on something farther away for one minute. There is nothing else to achieve.', action: 'Take one quiet minute.', completion: 'I have taken the minute', duration: 'One minute.' },
  },
  {
    id: 'checking',
    label: 'I keep checking and cannot disengage.',
    acknowledgement: 'Checking can keep a work window open long after its useful part has finished.',
    promise: 'In about eight minutes, you will create distance from the cue that keeps pulling you back.',
    steps: [
      { title: 'Name the pull.', body: 'Say privately what is asking for your attention: an inbox, a message, a task, or an uncertainty. Naming it is enough.', action: 'Name what is pulling you back.', completion: 'I have named the pull', duration: 'Take a moment.' },
      { title: 'Create one piece of distance.', body: 'Turn over the phone, close the inbox, or move one work device out of reach. Keep anything urgent available through your normal channel.', action: 'Create one piece of distance.', completion: 'I have created distance', duration: 'Take up to one minute.' },
      { title: 'Choose the next check.', body: 'If you genuinely need to return later, decide the next sensible check. If you do not, let there be no next check tonight.', action: 'Choose whether a later check is needed.', completion: 'I have made the next check clear', duration: 'Take a moment.' },
      { title: 'Begin a non-work action.', body: 'Choose a drink or meal, a short walk, a shower, or time with someone. Leave the app and begin that one thing.', action: 'Choose one non-work action.', completion: 'I have chosen my next action', duration: 'Take as long as you need.' },
    ],
    followOn: { title: 'Keep the cue out of reach a little longer.', body: 'Leave the work cue where you placed it. Give your chosen non-work action three uninterrupted minutes.', action: 'Begin three uninterrupted minutes.', completion: 'I have begun the three minutes', duration: 'Three minutes.' },
  },
  {
    id: 'scattered',
    label: 'I have moved on, but feel scattered.',
    acknowledgement: 'The day can end without attention landing anywhere yet.',
    promise: 'In about eight minutes, you will orient to the present and choose one ordinary place to land.',
    steps: [
      { title: 'Look around the room.', body: 'From a safe place, let your eyes find three ordinary things around you. There is no need to decide what they mean.', action: 'Notice three things around you.', completion: 'I have looked around', duration: 'Take a moment.' },
      { title: 'Notice what is already next.', body: 'Name one thing that is actually waiting for you now: food, water, movement, a person, a shower, or quiet.', action: 'Name what is already next.', completion: 'I have named what is next', duration: 'Take a moment.' },
      { title: 'Make one small landing place.', body: 'Sit somewhere else, put one object down, change the light, or wash your hands. Choose one small way to arrive.', action: 'Make one small landing place.', completion: 'I have made a landing place', duration: 'Take up to two minutes.' },
      { title: 'Go to the next ordinary thing.', body: 'Choose the thing you named and leave the app to begin it. It does not need to be a perfect recovery activity.', action: 'Begin the next ordinary thing.', completion: 'I have begun what is next', duration: 'Take as long as you need.' },
    ],
    followOn: { title: 'Let one ordinary thing have your full attention.', body: 'For three minutes, stay with the next thing you chose. Put no demand on yourself to feel different yet.', action: 'Give it three minutes.', completion: 'I have begun the three minutes', duration: 'Three minutes.' },
  },
] as const;

export function workRecoveryProtocolFor(id?: string): RecoveryProtocol {
  return workRecoveryProtocols.find((protocol) => protocol.id === id) ?? workRecoveryProtocols[0];
}

export function isRecoveryEntryId(value?: string): value is RecoveryEntryId {
  return workRecoveryProtocols.some((protocol) => protocol.id === value);
}
