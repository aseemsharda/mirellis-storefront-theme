import assert from 'node:assert/strict';
import test from 'node:test';
import { workRecoveryProtocolFor, workRecoveryProtocols } from './work-recovery-protocol';

test('every explicit work-recovery entry has a complete, distinct protocol', () => {
  assert.equal(workRecoveryProtocols.length, 4);
  for (const protocol of workRecoveryProtocols) {
    assert.equal(protocol.steps.length, 4);
    assert.ok(protocol.promise.length > 40);
    assert.ok(protocol.followOn.action.length > 0);
  }
  assert.notEqual(workRecoveryProtocolFor('unfinished').steps[0].title, workRecoveryProtocolFor('activated').steps[0].title);
});
