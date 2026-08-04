import assert from 'node:assert/strict';
import test from 'node:test';
import { assertProductExperienceIntegrity, consumerMoments, problemChoices, screenContracts } from './product-experience';
import { v1Transitions } from './v1-transition-model';

test('four familiar moments resolve to distinct active V1 transitions', () => {
  assertProductExperienceIntegrity();
  assert.equal(consumerMoments.length, 4);
  assert.equal(new Set(consumerMoments.map((moment) => moment.transitionId)).size, 4);
  assert.ok(consumerMoments.every((moment) => v1Transitions.some((transition) => transition.id === moment.transitionId)));
});

test('consumer screen contracts always offer one action and one exit', () => {
  assert.ok(screenContracts.every((screen) => screen.primary.length > 0 && screen.exit.length > 0));
});

test('every familiar problem maps deterministically to active V1 content', () => {
  assert.equal(problemChoices.length, 4);
  assert.ok(problemChoices.every((choice) => v1Transitions.some((transition) => transition.id === choice.transitionId)));
});
