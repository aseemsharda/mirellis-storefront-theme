import { v1Transitions } from './v1-transition-model';

export const PRODUCT_EXPERIENCE_VERSION = '2.0.0';

export type ConsumerMoment = {
  label: string;
  description: string;
  orientation: string;
  transitionId: string;
};

export type ProblemKey = 'cannot_start' | 'cannot_settle' | 'focus_blocked' | 'work_carryover' | 'tired_activated' | 'unsure';

export type ProblemChoice = {
  key: ProblemKey;
  label: string;
  acknowledgement: string;
  whyNow: string;
  transitionId: string;
};

export const problemChoices: ProblemChoice[] = [
  { key: 'cannot_start', label: 'I can’t get started', acknowledgement: 'Starting can feel hard before anything has begun.', whyNow: 'A short practice for naming the first barrier and choosing one workable start.', transitionId: 'wakefulness-readiness' },
  { key: 'focus_blocked', label: 'I’m finding it hard to focus', acknowledgement: 'A scattered moment does not need a big solution.', whyNow: 'A short practice for finding one visible place to begin.', transitionId: 'readiness-focus' },
  { key: 'work_carryover', label: 'Work is still following me', acknowledgement: 'Effort can remain with you after work has ended.', whyNow: 'A short practice for noticing what your day is still carrying.', transitionId: 'focus-recovery' },
  { key: 'unsure', label: 'I’m not sure', acknowledgement: 'You do not need to explain anything first.', whyNow: 'A low-demand practice for noticing what is here, without needing to decide what it means.', transitionId: 'sleep-wakefulness' },
];

export function problemChoiceFor(key: ProblemKey): ProblemChoice {
  return problemChoices.find((choice) => choice.key === key) ?? problemChoices[problemChoices.length - 1];
}

// This is an interface map, not a second curriculum. It gives people familiar
// entry points while the frozen transition curriculum remains the authority.
export const consumerMoments: ConsumerMoment[] = [
  { label: 'Start the morning', description: 'Find a gentle first move after waking.', orientation: 'Starting your morning', transitionId: 'sleep-wakefulness' },
  { label: 'Get going', description: 'Find one workable starting action.', orientation: 'Getting going', transitionId: 'wakefulness-readiness' },
  { label: 'Focus on one thing', description: 'Choose one visible place to begin.', orientation: 'Finding focus', transitionId: 'readiness-focus' },
  { label: 'Leave work behind', description: 'Create a little room after effort.', orientation: 'Leaving work behind', transitionId: 'focus-recovery' },
];

export const screenContracts = [
  { id: 'MX-01', primary: 'Start', exit: 'Skip explanation' },
  { id: 'MX-02', primary: 'Choose a moment', exit: 'Skip explanation' },
  { id: 'MX-03', primary: 'Try this now', exit: 'Leave for today' },
  { id: 'MX-04', primary: 'Notice what happened', exit: 'Leave for today' },
  { id: 'MX-05', primary: 'Save this approach', exit: 'Leave for today' },
] as const;

export function consumerMomentFor(transitionId: string): ConsumerMoment | undefined {
  return consumerMoments.find((moment) => moment.transitionId === transitionId);
}

export function consumerLabelFor(transitionId: string): string {
  return consumerMomentFor(transitionId)?.label ?? 'Another moment';
}

export function assertProductExperienceIntegrity(): void {
  const ids = new Set(v1Transitions.map((transition) => transition.id));
  if (consumerMoments.length !== 4 || new Set(consumerMoments.map((moment) => moment.transitionId)).size !== consumerMoments.length) {
    throw new Error('Product experience requires four distinct V1 moments.');
  }
  if (consumerMoments.some((moment) => !ids.has(moment.transitionId))) {
    throw new Error('A familiar moment must map to an active curriculum transition.');
  }
  if (screenContracts.some((screen) => !screen.primary || !screen.exit)) {
    throw new Error('Each consumer screen contract requires a primary action and an exit.');
  }
  if (problemChoices.some((choice) => !ids.has(choice.transitionId))) {
    throw new Error('Each problem choice must map to an active curriculum transition.');
  }
}
