import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPrivateRecordExport } from './private-record-export';

test('private record export contains only the supplied explicit programme record', () => {
  const record = { day: 1, title: 'Make a clear ending', chosenAction: 'Close the laptop' };
  const exported = buildPrivateRecordExport({ day: 2, completedDays: [1], records: [record] }, new Date('2026-08-13T12:00:00.000Z'));

  assert.equal(exported.product, 'Mirellis After Work');
  assert.equal(exported.exportedAt, '2026-08-13T12:00:00.000Z');
  assert.deepEqual(exported.programme, { currentDay: 2, completedDays: [1], records: [record] });
  assert.doesNotMatch(JSON.stringify(exported), /score|diagnosis|personality|inferred/i);
});

test('private record export caps the visible programme day without modifying source data', () => {
  const source = { day: 40, completedDays: [1, 2], records: [] };
  const exported = buildPrivateRecordExport(source, new Date('2026-08-13T12:00:00.000Z'));

  assert.equal(exported.programme.currentDay, 21);
  assert.equal(source.day, 40);
});
