import type { AppData, EvidenceAtom, Experience, RouteType, Transition } from './types';

export const POLICY_VERSION = 'v2.0';
export type Constraint = 'open' | 'urgent' | 'unsure';

export type Suggestion = {
  experience: Experience;
  routeType: RouteType;
  explanation: string;
  evidenceIds: string[];
  evidenceExpiresAt?: string;
};

export type RouteDecision = {
  policyVersion: string;
  primary?: Suggestion;
  alternatives: Suggestion[];
  safetyRoute?: 'exit';
  alwaysAvailable: ['choose_another_route', 'leave_for_today'];
};

const DAY = 24 * 60 * 60 * 1000;

export function evidenceIsActive(evidence: EvidenceAtom, now = new Date()): boolean {
  return new Date(evidence.expiresAt).getTime() > now.getTime();
}

function progressKey(transitionId: string, experienceId: string) {
  return `${transitionId}:${experienceId}`;
}

function suggestion(experience: Experience, routeType: RouteType, explanation: string, evidence: EvidenceAtom[] = []): Suggestion {
  return {
    experience,
    routeType,
    explanation,
    evidenceIds: evidence.map((item) => item.id),
    evidenceExpiresAt: evidence[0]?.expiresAt,
  };
}

export function evaluateRoute(transition: Transition, data: AppData, constraint: Constraint, now = new Date()): RouteDecision {
  const activeEvidence = data.evidence.filter((item) => item.transitionId === transition.id && evidenceIsActive(item, now));
  const excluded = new Set(activeEvidence.filter((item) => item.kind === 'not-for-me').map((item) => item.experienceId));
  const available = transition.experiences.filter((item) => !excluded.has(item.id));

  if (constraint === 'urgent') {
    return { policyVersion: POLICY_VERSION, alternatives: [], safetyRoute: 'exit', alwaysAvailable: ['choose_another_route', 'leave_for_today'] };
  }

  // A completion is a local record, not permission to advance a person through
  // a hidden path. The chosen problem determines this offer.
  const next = available[0];
  if (!next) return { policyVersion: POLICY_VERSION, alternatives: [], alwaysAvailable: ['choose_another_route', 'leave_for_today'] };

  const primary = suggestion(next, 'guided', 'This is a small practice for the difficulty you chose today.');

  const recentlyFit = available
    .map((experience) => ({ experience, evidence: activeEvidence.filter((item) => item.experienceId === experience.id && (item.kind === 'fit' || item.kind === 'partly-fit')) }))
    .filter((item) => item.experience.id !== primary.experience.id && item.evidence.length > 0)
    .sort((a, b) => new Date(b.evidence[0].createdAt).getTime() - new Date(a.evidence[0].createdAt).getTime())
    .map((item) => suggestion(item.experience, 'guided', 'You said this cue fit before.', item.evidence));

  const nextOptions = available
    .filter((item) => item.id !== primary.experience.id && !recentlyFit.some((candidate) => candidate.experience.id === item.id))
    .map((item) => suggestion(item, 'guided', 'Choose another route.'));

  return {
    policyVersion: POLICY_VERSION,
    primary,
    alternatives: [...recentlyFit, ...nextOptions].slice(0, 2),
    alwaysAvailable: ['choose_another_route', 'leave_for_today'],
  };
}

export function evidenceExpiry(from = new Date()): string {
  return new Date(from.getTime() + 30 * DAY).toISOString();
}
