import { transitions as generatedTransitions } from '@/content/generated';
import type { Transition } from './types';

// Canonical V1 product model. Additional generated curriculum content is not
// consumer-active until it has its own approved V1 product change.
export const V1_TRANSITION_IDS = [
  'sleep-wakefulness',
  'wakefulness-readiness',
  'readiness-focus',
  'focus-recovery',
] as const;

export type V1TransitionId = typeof V1_TRANSITION_IDS[number];

export const v1Transitions: Transition[] = V1_TRANSITION_IDS.map((id) => {
  const transition = generatedTransitions.find((candidate) => candidate.id === id);
  if (!transition) throw new Error(`Missing canonical V1 transition: ${id}`);
  return transition;
});

export function assertV1TransitionModel(): void {
  if (v1Transitions.length !== 4) throw new Error('Mirellis V1 requires exactly four active transitions.');
  if (new Set(v1Transitions.map((transition) => transition.id)).size !== 4) throw new Error('Mirellis V1 transition identifiers must be unique.');
}
