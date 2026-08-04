import assert from 'node:assert/strict';
import test from 'node:test';
import { assertCurriculumIntegrity, transitionDossiers } from './stewardship';

test('V3 curriculum dossiers cover every active transition and experience', () => {
  assert.doesNotThrow(() => assertCurriculumIntegrity());
  assert.equal(transitionDossiers.length, 4);
  assert.equal(transitionDossiers.flatMap((dossier) => dossier.experienceInventory).length, 60);
});

test('every V3 curriculum experience is locally bounded and review-gated', () => {
  for (const experience of transitionDossiers.flatMap((dossier) => dossier.experienceInventory)) {
    assert.equal(experience.evidenceExpiryDays, 30);
    assert.equal(experience.redTeamStatus, 'not-yet-reviewed');
    assert.equal(experience.safetyRoute, 'minimum-or-exit');
  }
});
