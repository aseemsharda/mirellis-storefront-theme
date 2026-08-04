import assert from 'node:assert/strict';
import test from 'node:test';
import { transitions } from '@/content/generated';
import { evaluateRoute, evidenceExpiry } from './route-policy';
import { initialData } from './types';

const transition = transitions[0];

test('urgent routes exit before any full experience', () => {
  const decision = evaluateRoute(transition, initialData, 'urgent');
  assert.equal(decision.safetyRoute, 'exit');
  assert.equal(decision.primary, undefined);
  assert.deepEqual(decision.alwaysAvailable, ['choose_another_route', 'leave_for_today']);
});

test('negative explicit fit suppresses the same experience for 30 days', () => {
  const first = transition.experiences[0];
  const data = {
    ...initialData,
    evidence: [{ id: 'negative', transitionId: transition.id, experienceId: first.id, kind: 'not-for-me' as const, createdAt: '2026-08-04T00:00:00.000Z', expiresAt: evidenceExpiry(new Date('2026-08-04T00:00:00.000Z')) }],
  };
  const decision = evaluateRoute(transition, data, 'open', new Date('2026-08-05T00:00:00.000Z'));
  assert.notEqual(decision.primary?.experience.id, first.id);
});

test('expired evidence cannot influence a suggestion', () => {
  const first = transition.experiences[0];
  const data = {
    ...initialData,
    evidence: [{ id: 'expired', transitionId: transition.id, experienceId: first.id, kind: 'not-for-me' as const, createdAt: '2026-06-01T00:00:00.000Z', expiresAt: '2026-07-01T00:00:00.000Z' }],
  };
  const decision = evaluateRoute(transition, data, 'open', new Date('2026-08-04T00:00:00.000Z'));
  assert.equal(decision.primary?.experience.id, first.id);
});

test('a completed practice does not silently advance the next suggestion', () => {
  const first = transition.experiences[0];
  const data = { ...initialData, completed: { [`${transition.id}:${first.id}`]: 'guided' } };
  assert.equal(evaluateRoute(transition, data, 'open').primary?.experience.id, first.id);
});

test('private note text cannot influence a route', () => {
  const withPrivateText = {
    ...initialData,
    privateNotes: [{ id: 'note-private', linkedRecordId: 'record-private', createdAtLocal: '2026-08-04T00:00:00.000Z', text: 'This must remain a private note.', source: 'local' as const }],
  };
  assert.equal(evaluateRoute(transition, withPrivateText, 'open').primary?.experience.id, evaluateRoute(transition, initialData, 'open').primary?.experience.id);
});
