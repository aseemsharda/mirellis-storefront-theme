import type { V1TransitionId } from './v1-transition-model';

export type RouteSupport = {
  label: string;
  description: string;
  href: string;
  kind: 'listen' | 'watch' | 'read';
};

export type RouteStep = {
  title: string;
  body: string;
  action: string;
  completion: string;
  duration: string;
};

export type Route = {
  id: string;
  transitionId: V1TransitionId;
  destination: string;
  label: string;
  acknowledgement: string;
  promise: string;
  steps: readonly RouteStep[];
  support?: RouteSupport;
};

export type Destination = {
  id: V1TransitionId;
  label: string;
  todayLabel: string;
  description: string;
  question: string;
};

export const destinations: readonly Destination[] = [
  { id: 'sleep-wakefulness', label: 'Start the morning', todayLabel: 'I need a gentler start', description: 'Find one workable first move after waking.', question: 'What feels closest this morning?' },
  { id: 'wakefulness-readiness', label: 'Get going', todayLabel: 'I cannot get started', description: 'Make the day feel reachable enough to begin.', question: 'What is making the beginning difficult?' },
  { id: 'readiness-focus', label: 'Focus on one thing', todayLabel: 'I am finding it hard to focus', description: 'Choose one protected attention window.', question: 'What is getting in the way of focus?' },
  { id: 'focus-recovery', label: 'After work', todayLabel: 'Work is still with me', description: 'Leave effort and choose what comes next.', question: 'What is still with you after work?' },
] as const;

const morningClarity: RouteSupport = {
  kind: 'listen',
  label: 'Open Morning Clarity',
  description: 'A listening environment for the first part of the day. It opens in Spotify.',
  href: 'https://open.spotify.com/playlist/0kPGfp1m7uIAEkT8h6j66P',
};

const flow: RouteSupport = {
  kind: 'listen',
  label: 'Open Flow',
  description: 'A listening environment for a chosen focus window. It opens in Spotify.',
  href: 'https://open.spotify.com/playlist/10xydaUigLOhIwJa4FCAtT',
};

const stillness: RouteSupport = {
  kind: 'listen',
  label: 'Open Stillness',
  description: 'A listening environment for the end of a workday. It opens in Spotify.',
  href: 'https://open.spotify.com/playlist/6VG02jtawiXTcOGi0nZzp6',
};

export const routes: readonly Route[] = [
  {
    id: 'morning-arrive', transitionId: 'sleep-wakefulness', destination: 'Start the morning', label: 'I am awake, but not really here yet.',
    acknowledgement: 'You do not have to become fully ready before the day can begin.',
    promise: 'In a few minutes, you will make one simple signal that the morning has started.', support: morningClarity,
    steps: [
      { title: 'Let the room arrive first.', body: 'Open a curtain, change the light, or look toward the brightest available part of the room.', action: 'Choose one change in light.', completion: 'The room feels more present', duration: 'Take a moment.' },
      { title: 'Find the first ordinary thing.', body: 'Let both feet meet the floor or sit somewhere supported. Choose the first ordinary action: water, washing, food, or getting dressed.', action: 'Choose one first action.', completion: 'I have chosen the first thing', duration: 'Take your own pace.' },
    ],
  },
  {
    id: 'morning-phone', transitionId: 'sleep-wakefulness', destination: 'Start the morning', label: 'I keep reaching for my phone.',
    acknowledgement: 'Your attention can have a first moment before the rest of the world arrives.',
    promise: 'You will choose one minute and one first action before opening anything else.', support: morningClarity,
    steps: [
      { title: 'Choose one small gap.', body: 'Place the phone face down or out of reach for one chosen minute. Keep urgent channels available if you need them.', action: 'Create one minute of distance.', completion: 'The phone can wait for now', duration: 'One minute.' },
      { title: 'Choose what comes first.', body: 'Pick one ordinary action for the minute: water, a window, washing, or simply standing somewhere else.', action: 'Choose your first action.', completion: 'I chose the order', duration: 'Take a moment.' },
    ],
  },
  {
    id: 'morning-rushed', transitionId: 'sleep-wakefulness', destination: 'Start the morning', label: 'The morning already feels rushed.',
    acknowledgement: 'You do not need to solve the whole morning at once.',
    promise: 'You will reduce the next part of the day to one reachable window.', support: morningClarity,
    steps: [
      { title: 'Make the horizon smaller.', body: 'Think only about the next five minutes. Everything after that can remain unnamed for now.', action: 'Choose the next five-minute horizon.', completion: 'The next few minutes are enough', duration: 'Take a moment.' },
      { title: 'Prepare one thing.', body: 'Set out, fill, open, or put away one ordinary thing that will make that small window easier.', action: 'Make one preparation.', completion: 'One thing is ready', duration: 'Take up to two minutes.' },
    ],
  },
  {
    id: 'ready-too-big', transitionId: 'wakefulness-readiness', destination: 'Get going', label: 'The day feels too big to begin.',
    acknowledgement: 'A whole day can feel impossible before it has a first edge.',
    promise: 'You will choose one small horizon and one visible first action.', support: morningClarity,
    steps: [
      { title: 'Choose a smaller horizon.', body: 'Choose the next five minutes or the next ten. Do not plan the rest of the day yet.', action: 'Choose a horizon that feels possible.', completion: 'I have a smaller horizon', duration: 'Take a moment.' },
      { title: 'Name the first visible action.', body: 'Write or say one action you could do within that horizon. Keep it concrete enough to see or begin.', action: 'Name one visible first action.', completion: 'I know where to begin', duration: 'Take up to two minutes.' },
    ],
  },
  {
    id: 'ready-pulled', transitionId: 'wakefulness-readiness', destination: 'Get going', label: 'Messages and other people are already pulling me in.',
    acknowledgement: 'You can decide the order of attention without ignoring what is genuinely urgent.',
    promise: 'You will create one brief boundary and decide what remains available.', support: morningClarity,
    steps: [
      { title: 'Name what is urgent.', body: 'Keep only the channel you truly need available. Everything else can wait for one short window.', action: 'Choose what stays available.', completion: 'The essentials are clear', duration: 'Take a moment.' },
      { title: 'Protect one beginning.', body: 'Close one feed, mute one non-urgent alert, or set the phone aside for five minutes.', action: 'Create one small boundary.', completion: 'I have protected a beginning', duration: 'Five minutes, if useful.' },
    ],
  },
  {
    id: 'ready-unsure', transitionId: 'wakefulness-readiness', destination: 'Get going', label: 'I do not know what should come first.',
    acknowledgement: 'Not knowing the whole order does not prevent a beginning.',
    promise: 'You will make one next action visible enough to begin.',
    steps: [
      { title: 'Look for what is already in front of you.', body: 'Choose one thing that is already open, waiting, or necessary. It does not need to be the most important thing in your life.', action: 'Choose one available thing.', completion: 'I have one thing in view', duration: 'Take a moment.' },
      { title: 'Make the first move smaller.', body: 'Write the first physical or digital action: open, reply, read, collect, or place.', action: 'Name the first move.', completion: 'The first move is clear', duration: 'Take a moment.' },
    ],
  },
  {
    id: 'focus-competing', transitionId: 'readiness-focus', destination: 'Focus on one thing', label: 'There is too much competing for my attention.',
    acknowledgement: 'One point can be chosen without pretending everything else has disappeared.',
    promise: 'You will select one point and a focus window that fits today.', support: flow,
    steps: [
      { title: 'Choose one point.', body: 'Name one piece of work, conversation, task, or thing to learn. It is only where you begin.', action: 'Choose one point for attention.', completion: 'I have one point', duration: 'Take a moment.' },
      { title: 'Choose a realistic window.', body: 'Pick five, ten, or twenty minutes. Choose what is possible, not what would look impressive.', action: 'Choose one focus window.', completion: 'My window is set', duration: 'Take a moment.' },
    ],
  },
  {
    id: 'focus-pulled', transitionId: 'readiness-focus', destination: 'Focus on one thing', label: 'I keep getting pulled away.',
    acknowledgement: 'A pull can be noticed before it decides the next part of your attention.',
    promise: 'You will name the main pull and create one boundary around it.', support: flow,
    steps: [
      { title: 'Name the pull.', body: 'Is it a message, an open task, a notification, or a thought you might forget? Naming one is enough.', action: 'Name the first pull you expect.', completion: 'I have named the pull', duration: 'Take a moment.' },
      { title: 'Choose one boundary.', body: 'Close one unrelated tab, put one device aside, or leave only the essential channel available.', action: 'Make one boundary.', completion: 'The boundary is in place', duration: 'Take up to one minute.' },
    ],
  },
  {
    id: 'focus-return', transitionId: 'readiness-focus', destination: 'Focus on one thing', label: 'I have been interrupted and cannot come back.',
    acknowledgement: 'Returning does not require recreating the exact state you had before.',
    promise: 'You will find the next visible action and give it one short return window.', support: flow,
    steps: [
      { title: 'Re-open the point.', body: 'Bring the relevant page, paper, or task back into view. Do not review everything that happened while you were away.', action: 'Put the point back in view.', completion: 'The point is visible again', duration: 'Take a moment.' },
      { title: 'Find the next visible action.', body: 'Choose the smallest thing you can do next, then give it five minutes of attention.', action: 'Choose a five-minute return.', completion: 'I have a way back in', duration: 'Five minutes.' },
    ],
  },
  {
    id: 'recovery-unfinished', transitionId: 'focus-recovery', destination: 'After work', label: 'An unfinished point is still replaying.',
    acknowledgement: 'An open point can keep asking for attention after the workday has ended.',
    promise: 'In a few minutes, you will leave a return point and make room for the evening.', support: stillness,
    steps: [
      { title: 'Put the point somewhere it can wait.', body: 'Write one plain line: the next visible action. Keep it short enough that tomorrow-you will recognise it.', action: 'Write the next visible action.', completion: 'I have left a return point', duration: 'Take up to two minutes.' },
      { title: 'Close the work surface.', body: 'Close one work tab, document, or notebook. You are not finishing everything; you are marking that this window is over.', action: 'Close or put away one work surface.', completion: 'The work surface is closed', duration: 'Take a moment.' },
    ],
  },
  {
    id: 'recovery-activated', transitionId: 'focus-recovery', destination: 'After work', label: 'My body still feels switched on.',
    acknowledgement: 'Sometimes effort stays in the body after the task itself has ended.',
    promise: 'You will change one signal around you and choose a lower-demand next action.', support: stillness,
    steps: [
      { title: 'Find one point of support.', body: 'Let both feet meet the floor or let your back meet a chair. Notice one contact point already holding you.', action: 'Find one point of support.', completion: 'I have found support', duration: 'Take a few breaths.' },
      { title: 'Make one signal different.', body: 'Change posture, loosen one layer, drink water, or step into a different room. Choose one safe change, not all of them.', action: 'Make one physical or environmental change.', completion: 'I have changed the signal', duration: 'Take up to two minutes.' },
    ],
  },
  {
    id: 'recovery-checking', transitionId: 'focus-recovery', destination: 'After work', label: 'I keep checking and cannot disengage.',
    acknowledgement: 'Checking can keep a work window open long after its useful part has finished.',
    promise: 'You will create one piece of distance from the cue that keeps pulling you back.', support: stillness,
    steps: [
      { title: 'Name the pull.', body: 'Say privately what is asking for your attention: an inbox, a message, a task, or an uncertainty. Naming it is enough.', action: 'Name what is pulling you back.', completion: 'I have named the pull', duration: 'Take a moment.' },
      { title: 'Create one piece of distance.', body: 'Turn over the phone, close the inbox, or move one work device out of reach. Keep anything urgent available through your normal channel.', action: 'Create one piece of distance.', completion: 'I have created distance', duration: 'Take up to one minute.' },
    ],
  },
] as const;

export function destinationFor(id?: string): Destination {
  return destinations.find((destination) => destination.id === id) ?? destinations[0];
}

export function routeFor(id?: string): Route {
  return routes.find((route) => route.id === id) ?? routes[0];
}

export function routesFor(transitionId: V1TransitionId): readonly Route[] {
  return routes.filter((route) => route.transitionId === transitionId);
}

export function assertRouteEngineIntegrity(): void {
  if (destinations.length !== 4 || new Set(destinations.map((destination) => destination.id)).size !== 4) throw new Error('Route engine requires four canonical destinations.');
  if (routes.length !== 12 || new Set(routes.map((route) => route.id)).size !== routes.length) throw new Error('Route engine requires twelve unique V1 routes.');
  for (const destination of destinations) if (routesFor(destination.id).length !== 3) throw new Error(`${destination.id} requires three routes.`);
  for (const route of routes) {
    if (!route.label || !route.acknowledgement || !route.promise || route.steps.length < 2) throw new Error(`${route.id} is incomplete.`);
    if (route.support && (!route.support.href.startsWith('https://') || !route.support.label || !route.support.description)) throw new Error(`${route.id} has invalid support.`);
  }
}
