type PilotTransitionId = 'focus-recovery';

export type RouteSupport = {
  label: string;
  description: string;
  href: string;
  kind: 'listen';
};

export type RouteStep = {
  title: string;
  body: string;
  action: string;
  completion: string;
  duration: string;
  kind: 'cue' | 'closure' | 'quiet';
};

export type Route = {
  id: 'open-loop' | 'checking' | 'activated' | 'unmarked-ending';
  transitionId: PilotTransitionId;
  destination: 'After work';
  label: string;
  acknowledgement: string;
  promise: string;
  steps: readonly RouteStep[];
};

export const afterWorkDestination = {
  id: 'focus-recovery' as const,
  label: 'After work',
  todayLabel: 'Work is still with me',
  question: 'What is still with you after work?',
};

export const stillness: RouteSupport = {
  kind: 'listen',
  label: 'Open Stillness in Spotify',
  description: 'A listening environment for the end of a workday. It opens in Spotify and is optional.',
  href: 'https://open.spotify.com/playlist/6VG02jtawiXTcOGi0nZzp6?si=MCqpIkSQShuZFkSaLR0RFQ',
};

const sharedEnding: RouteStep = {
  kind: 'closure',
  title: 'Let the work surface close.',
  body: 'Close one work tab, document, or notebook. Then change one thing in the room: the light, your chair, the room itself, or where the phone is placed.',
  action: 'Mark the end of this work period.',
  completion: 'The work surface is closed.',
  duration: 'About 1½ minutes',
};

const quietEvening: RouteStep = {
  kind: 'quiet',
  title: 'Begin the evening.',
  body: 'Choose one ordinary next action: make food or a drink, shower, walk, sit somewhere else, or spend a few quiet minutes with someone. Leave the app to begin it.',
  action: 'Return when it is useful. There is nothing more to complete right now.',
  completion: 'Return to check in',
  duration: 'About 5 minutes',
};

export const routes: readonly Route[] = [
  {
    id: 'open-loop', transitionId: afterWorkDestination.id, destination: 'After work',
    label: 'An unfinished point is still replaying.',
    acknowledgement: 'An unfinished point can keep asking for attention after work has ended.',
    promise: 'First, you will give tomorrow one clear place to begin.',
    steps: [
      { kind: 'cue', title: 'Leave a return point.', body: 'Write one plain line: the next visible action. Make it short enough that tomorrow-you will recognise it.', action: 'Give tomorrow one clear place to begin.', completion: 'I left a return point.', duration: 'About 1½ minutes' },
      sharedEnding,
      quietEvening,
    ],
  },
  {
    id: 'checking', transitionId: afterWorkDestination.id, destination: 'After work',
    label: 'I keep checking and cannot disengage.',
    acknowledgement: 'Checking can keep a work window open after its useful part has finished.',
    promise: 'First, you will create a little distance from the cue that keeps pulling you back.',
    steps: [
      { kind: 'cue', title: 'Create one piece of distance.', body: 'Turn over the phone, close the inbox, or move one work device out of reach. Keep genuinely urgent channels available through your normal way of receiving them.', action: 'Make one cue less available.', completion: 'I created some distance.', duration: 'About 1½ minutes' },
      sharedEnding,
      quietEvening,
    ],
  },
  {
    id: 'activated', transitionId: afterWorkDestination.id, destination: 'After work',
    label: 'My body still feels switched on.',
    acknowledgement: 'Sometimes effort stays with the body after the task has ended.',
    promise: 'First, you will make one safe change in the signals around you.',
    steps: [
      { kind: 'cue', title: 'Change one signal.', body: 'Let both feet meet the floor or let your back meet a chair. Then choose one safe change: drink water, loosen one layer, change posture, or step into another room.', action: 'Choose one safe physical or environmental change.', completion: 'I changed one signal.', duration: 'About 1½ minutes' },
      sharedEnding,
      quietEvening,
    ],
  },
  {
    id: 'unmarked-ending', transitionId: afterWorkDestination.id, destination: 'After work',
    label: 'I am not sure; I just have not switched off.',
    acknowledgement: 'You do not have to explain what is happening before you can mark an ending.',
    promise: 'First, you will move your attention to one ordinary thing that is actually next.',
    steps: [
      { kind: 'cue', title: 'Find what is actually next.', body: 'Look around and name one ordinary thing that is waiting for you now: food, water, movement, a person, a shower, or quiet.', action: 'Choose one ordinary next thing.', completion: 'I know what is next.', duration: 'About 1½ minutes' },
      sharedEnding,
      quietEvening,
    ],
  },
] as const;

export function routeFor(id?: string): Route {
  return routes.find((route) => route.id === id) ?? routes[0];
}

export function assertRouteEngineIntegrity(): void {
  if (routes.length !== 4 || new Set(routes.map((route) => route.id)).size !== routes.length) throw new Error('The After Work pilot requires four distinct entry routes.');
  for (const route of routes) {
    if (route.transitionId !== afterWorkDestination.id || route.steps.length !== 3) throw new Error(`${route.id} is not a complete After Work route.`);
    if (route.steps[1].kind !== 'closure' || route.steps[2].kind !== 'quiet') throw new Error(`${route.id} must include the shared ending and quiet environment.`);
  }
  if (!stillness.href.startsWith('https://open.spotify.com/playlist/')) throw new Error('Stillness must use its confirmed public playlist.');
}
