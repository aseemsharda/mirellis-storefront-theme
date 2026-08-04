import assert from 'node:assert/strict';
import test from 'node:test';
import { assertV1TransitionModel, V1_TRANSITION_IDS, v1Transitions } from './v1-transition-model';

test('V1 exposes exactly the four approved transition families', () => {
  assertV1TransitionModel();
  assert.deepEqual(v1Transitions.map((transition) => transition.id), [...V1_TRANSITION_IDS]);
});
