import assert from 'node:assert/strict';
import test from 'node:test';
import { createSession, deleteAllMirellisLocalData, experimentForRecord, initialUnifiedState, loadUnifiedState, normaliseUnifiedState, recordFromSession, recordIsVisible, saveUnifiedState } from './unified-store';

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
    values,
  };
}

test('normalises missing or corrupt state without inventing records', () => {
  assert.deepEqual(normaliseUnifiedState(null), initialUnifiedState);
  assert.deepEqual(normaliseUnifiedState({ schemaVersion: 99 }), initialUnifiedState);
});

test('saves and loads a resumable active session', () => {
  const storage = memoryStorage();
  const activeSession = createSession('focus', new Date('2026-08-19T10:00:00Z'));
  saveUnifiedState(storage, { ...initialUnifiedState, activeSession });
  assert.equal(loadUnifiedState(storage).activeSession?.moment, 'focus');
});

test('record visibility requires completion evidence or an explicit save', () => {
  const session = { ...createSession('waking'), recommendationKey: 'waking-light', answers: { waking_difficulty: 'sleepy' } };
  const no = recordFromSession(session, 'Open light and movement', 'no', '');
  assert.equal(recordIsVisible(no), false);
  assert.equal(recordIsVisible({ ...no, saved: true }), true);
  assert.equal(recordIsVisible({ ...no, outcome: 'partly' }), true);
});

test('experiments have bounded, moment-specific lengths', () => {
  const session = { ...createSession('night'), recommendationKey: 'night-if-then' };
  const night = recordFromSession(session, 'Make the stopping decision in advance', 'yes', '');
  assert.equal(experimentForRecord(night)?.plannedSessions, 7);
  const focus = { ...night, moment: 'focus' as const };
  assert.equal(experimentForRecord(focus)?.plannedSessions, 3);
  const afterWork = { ...night, moment: 'after-work' as const };
  assert.equal(experimentForRecord(afterWork), undefined);
});

test('delete removes unified and preserved legacy keys only after explicit invocation', () => {
  const storage = memoryStorage();
  storage.setItem('mirellis-unified-v1-v2', '{}');
  storage.setItem('mirellis-after-work-v2', '{}');
  storage.setItem('mirellis-after-work-draft-v2', '{}');
  storage.setItem('unrelated', 'keep');
  deleteAllMirellisLocalData(storage);
  assert.equal(storage.values.has('mirellis-unified-v1-v2'), false);
  assert.equal(storage.values.has('mirellis-after-work-v2'), false);
  assert.equal(storage.values.has('mirellis-after-work-draft-v2'), false);
  assert.equal(storage.values.get('unrelated'), 'keep');
});
