import assert from 'node:assert/strict';
import test from 'node:test';
import { candidatePatternCopy, professionalLinks, questionsByMoment, routeRecommendation, validatesRequiredAnswer } from './unified-product';

test('every moment has a complete required question registry', () => {
  for (const questions of Object.values(questionsByMoment)) {
    assert.ok(questions.length >= 4);
    assert.equal(new Set(questions.map((question) => question.id)).size, questions.length);
    for (const question of questions) {
      assert.ok(question.prompt.length > 8);
      if (question.type === 'single') assert.ok((question.options?.length ?? 0) >= 2);
    }
  }
});

test('waking safety overrides convenience', () => {
  const result = routeRecommendation('waking', { waking_difficulty: 'sleepy', safety_task: 'yes', sleep_opportunity: '7to9' });
  assert.equal(result.key, 'waking-safety');
  assert.equal(result.professionalRoute, 'safety');
});

test('focus barriers produce materially different actions', () => {
  const phone = routeRecommendation('focus', { focus_barrier: 'phone', focus_safety: 'no' });
  const unclear = routeRecommendation('focus', { focus_barrier: 'unclear', focus_safety: 'no' });
  const thoughts = routeRecommendation('focus', { focus_barrier: 'thoughts', focus_safety: 'no' });
  assert.equal(phone.key, 'focus-phone');
  assert.equal(unclear.key, 'focus-clarify');
  assert.equal(thoughts.key, 'focus-park');
});

test('after-work routes are explicit and distinct', () => {
  assert.equal(routeRecommendation('after-work', { work_residue: 'unfinished' }).key, 'after-work-return');
  assert.equal(routeRecommendation('after-work', { work_residue: 'checking' }).key, 'after-work-device');
  assert.equal(routeRecommendation('after-work', { work_residue: 'depleted' }).key, 'after-work-recover');
});

test('night safety and timing routes override a generic stopping plan', () => {
  assert.equal(routeRecommendation('night', { breathing_signs: 'yes' }).key, 'night-safety');
  assert.equal(routeRecommendation('night', { breathing_signs: 'no', daytime_safety: 'no', night_distress: 'no', sleepiness: 'not-sleepy' }).key, 'night-timing');
});

test('candidate copy is limited to explicit selected evidence', () => {
  const answers = { night_activity: 'scrolling', sleepiness: 'sleepy', night_function: 'automatic' };
  const recommendation = routeRecommendation('night', answers);
  const copy = candidatePatternCopy(recommendation, answers);
  assert.match(copy, /Scrolling or watching/);
  assert.match(copy, /Sleepy/);
  assert.doesNotMatch(copy, /diagnos/iu);
});

test('required free text rejects empty or trivial input', () => {
  const question = questionsByMoment.focus[0];
  assert.equal(validatesRequiredAnswer(question, '  '), false);
  assert.equal(validatesRequiredAnswer(question, 'A reviewed draft'), true);
});

test('professional routes resolve to live concern filters and official crisis help', () => {
  assert.equal(professionalLinks.sleep, 'https://directory.mirellis.in/practitioners?focus=sleep');
  assert.equal(professionalLinks.attention, 'https://directory.mirellis.in/practitioners?focus=focus');
  assert.equal(professionalLinks.restoration, 'https://directory.mirellis.in/practitioners?focus=restoration');
  assert.equal(professionalLinks.crisis, 'https://112.gov.in/');
  assert.match(professionalLinks.mentalHealth, /mohfw\.gov\.in/);
});
