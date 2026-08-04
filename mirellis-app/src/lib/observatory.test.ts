import assert from 'node:assert/strict';
import test from 'node:test';
import { createCue, createPersonalRoute, removeRecord, savePrivateNote, assertObservatoryIntegrity } from './observatory';
import { initialData, type ObservatoryRecord } from './types';

const record: ObservatoryRecord = { id: 'record-1', transitionId: 'sleep-wake', experienceId: 'SW-01', curriculumVersion: '1.0.0', occurredAtLocal: '2026-08-04T00:00:00.000Z', routeType: 'primary', policyVersion: 'v2.0' };

test('a personal cue is only created from a visible local record', () => {
  const data = createCue({ ...initialData, observatoryRecords: [record] }, record, 'Open the curtains.');
  assert.equal(data.savedCues.length, 1);
  assert.doesNotThrow(() => assertObservatoryIntegrity(data));
});

test('deleting a source record removes dependent cues and routes', () => {
  const withCue = createCue({ ...initialData, observatoryRecords: [record] }, record, 'Open the curtains.');
  const withRoute = createPersonalRoute(withCue, record.transitionId, [withCue.savedCues[0].id], 'First light');
  const deleted = removeRecord(withRoute, record.id);
  assert.equal(deleted.savedCues.length, 0);
  assert.equal(deleted.personalRoutes.length, 0);
});

test('private notes live outside structured practice records and delete with their source', () => {
  const withRecord = { ...initialData, observatoryRecords: [record] };
  const withNote = savePrivateNote(withRecord, record.id, 'This stays private.');
  assert.equal('reflectionText' in withNote.observatoryRecords[0], false);
  assert.equal(withNote.privateNotes[0].text, 'This stays private.');
  assert.equal(removeRecord(withNote, record.id).privateNotes.length, 0);
});
