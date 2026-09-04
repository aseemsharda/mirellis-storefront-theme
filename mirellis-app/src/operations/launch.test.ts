import assert from 'node:assert/strict';
import test from 'node:test';
import { assertLaunchOperationsIntegrity, launchGates, launchState, operatingBoundary } from './launch';
import { assertReleaseRecordIntegrity, releaseDecision, releaseEvidence, releaseOwners } from './release-record';

test('launch operations preserve the private, account-free operating boundary', () => {
  assert.doesNotThrow(() => assertLaunchOperationsIntegrity());
  assert.equal(operatingBoundary.accountFree, true);
  assert.equal(operatingBoundary.localFirst, true);
  assert.equal(operatingBoundary.analyticsDefault, 'off');
  assert.equal(operatingBoundary.researchDefault, 'off');
});

test('formal certification remains pending until named reviews and live operations are assigned', () => {
  assert.equal(launchState.status, 'preflight');
  assert.equal(launchGates.find((gate) => gate.id === 'curriculum')?.status, 'pending');
  assert.equal(launchGates.find((gate) => gate.id === 'operations')?.status, 'ready');
  assert.equal(releaseDecision.status, 'preflight');
  assert.equal(releaseEvidence.find((item) => item.id === 'human-accessibility-review')?.status, 'pending');
});

test('the controlled pilot has explicit people-owned operations without pretending validation is complete', () => {
  assert.doesNotThrow(() => assertReleaseRecordIntegrity());
  assert.equal(releaseOwners.releaseAuthority, 'Aseem Sharda');
  assert.match(releaseOwners.supportContact, /@/);
  assert.equal(releaseEvidence.find((item) => item.id === 'people-owned-operations')?.status, 'verified');
});
