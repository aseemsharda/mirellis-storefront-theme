import assert from 'node:assert/strict';
import test from 'node:test';
import { afterWorkDestination, assertRouteEngineIntegrity, routes, stillness } from './route-engine';

test('the active release candidate is one complete After Work service with four distinct entry routes', () => {
  assert.doesNotThrow(() => assertRouteEngineIntegrity());
  assert.equal(routes.length, 4);
  assert.equal(new Set(routes.map((route) => route.transitionId)).size, 1);
  assert.equal(routes[0].transitionId, afterWorkDestination.id);
  assert.equal(new Set(routes.map((route) => route.steps[0].title)).size, 4);
});

test('every route has a route-specific cue, a shared ending, and the quiet transition environment', () => {
  for (const route of routes) {
    assert.equal(route.steps.length, 3);
    assert.equal(route.steps[0].kind, 'cue');
    assert.equal(route.steps[1].kind, 'closure');
    assert.equal(route.steps[2].kind, 'quiet');
  }
});

test('Stillness uses the confirmed public playlist', () => {
  assert.equal(stillness.href, 'https://open.spotify.com/playlist/6VG02jtawiXTcOGi0nZzp6?si=MCqpIkSQShuZFkSaLR0RFQ');
});
