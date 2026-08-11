import assert from 'node:assert/strict';
import test from 'node:test';
import { assertRouteEngineIntegrity, destinations, routes, routesFor } from './route-engine';

test('the route engine contains exactly three complete routes for each canonical V1 destination', () => {
  assert.doesNotThrow(() => assertRouteEngineIntegrity());
  for (const destination of destinations) assert.equal(routesFor(destination.id).length, 3);
});

test('support is real only when a public destination is supplied', () => {
  for (const route of routes) if (route.support) assert.match(route.support.href, /^https:\/\//);
});
