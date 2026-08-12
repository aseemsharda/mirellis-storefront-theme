'use client';

import { useMemo, useState } from 'react';

type ExerciseId = 'return-point' | 'cue-break' | 'boundary-sort';
type View = 'today' | 'commit' | 'exercise' | 'field' | 'complete';

type Exercise = {
  id: ExerciseId;
  number: number;
  title: string;
  skill: string;
  duration: string;
  description: string;
  fieldAction: string;
};

const exercises: Exercise[] = [
  {
    id: 'return-point',
    number: 1,
    title: 'Return Point',
    skill: 'Close an open loop',
    duration: '2 minutes',
    description: 'Practise turning a loose task into a starting point you can actually use tomorrow.',
    fieldAction: 'Put one real return point where tomorrow-you will see it.',
  },
  {
    id: 'cue-break',
    number: 2,
    title: 'Cue Break',
    skill: 'Break the checking pull',
    duration: '3 minutes',
    description: 'Practise deciding which work cue stays available and what can wait.',
    fieldAction: 'Make your chosen work cue less available for the next part of the evening.',
  },
  {
    id: 'boundary-sort',
    number: 3,
    title: 'Boundary Sort',
    skill: 'Recognise an ending',
    duration: '3 minutes',
    description: 'Practise making deliberate work-versus-evening decisions under a short clock.',
    fieldAction: 'Close one real work surface and begin one evening action.',
  },
];

const returnChoiceSets = [
  [
    { label: 'Think about the presentation.', correct: false },
    { label: 'Open the deck and draft the three-slide outline.', correct: true },
    { label: 'Finish the presentation tomorrow.', correct: false },
  ],
  [
    { label: 'Come back to the client feedback.', correct: false },
    { label: 'At 9:30, open client feedback and revise the summary paragraph.', correct: true },
    { label: 'Make the client feedback better tomorrow.', correct: false },
  ],
] as const;

const sortCardSets = [[
  { text: 'A work inbox alert at 8:30 pm', answer: 'work' },
  { text: 'Choosing something to eat', answer: 'evening' },
  { text: 'One task to begin tomorrow', answer: 'work' },
  { text: 'Calling someone you care about', answer: 'evening' },
  { text: 'A document that can wait until morning', answer: 'work' },
  { text: 'A short walk after work', answer: 'evening' },
], [
  { text: 'A message marked urgent by a client', answer: 'work' },
  { text: 'Setting the table for dinner', answer: 'evening' },
  { text: 'Finding the first page for tomorrow’s meeting', answer: 'work' },
  { text: 'Changing into clothes you do not work in', answer: 'evening' },
  { text: 'A colleague’s request that has no deadline', answer: 'work' },
  { text: 'Putting your phone in its evening place', answer: 'evening' },
  { text: 'Writing one next action for the morning', answer: 'work' },
  { text: 'Starting a meal, walk, shower, or call', answer: 'evening' },
]] as const;

export function TrainingPrototype() {
  const [view, setView] = useState<View>('today');
  const [exerciseId, setExerciseId] = useState<ExerciseId>('return-point');
  const [minutes, setMinutes] = useState('7 minutes');
  const [firmness, setFirmness] = useState<'gentle' | 'firm'>('firm');
  const [returnAnswer, setReturnAnswer] = useState<number>();
  const [selectedCue, setSelectedCue] = useState<string>();
  const [cueRule, setCueRule] = useState<string>();
  const [sortIndex, setSortIndex] = useState(0);
  const [sortCorrect, setSortCorrect] = useState(0);
  const [levels, setLevels] = useState<Record<ExerciseId, number>>({ 'return-point': 1, 'cue-break': 1, 'boundary-sort': 1 });
  const [status, setStatus] = useState('');

  const exercise = exercises.find((item) => item.id === exerciseId) ?? exercises[0];
  const selectedExerciseNumber = exercises.findIndex((item) => item.id === exerciseId) + 1;
  const activeReturnChoices = returnChoiceSets[Math.min(levels['return-point'] - 1, returnChoiceSets.length - 1)];
  const activeSortCards = sortCardSets[Math.min(levels['boundary-sort'] - 1, sortCardSets.length - 1)];
  const canContinue = exerciseId === 'return-point'
    ? returnAnswer !== undefined
    : exerciseId === 'cue-break'
      ? Boolean(selectedCue && cueRule)
      : sortIndex === activeSortCards.length;
  const drillResult = useMemo(() => {
    if (exerciseId === 'return-point') return returnAnswer === 1 ? 'You chose a visible first action.' : 'Try again: a return point needs a physical first action.';
    if (exerciseId === 'cue-break') return `Your rule: ${cueRule ?? 'not chosen yet'}`;
    return `${sortCorrect} of ${activeSortCards.length} boundary decisions matched the exercise.`;
  }, [activeSortCards.length, cueRule, exerciseId, returnAnswer, sortCorrect]);

  const beginExercise = (nextExercise: ExerciseId) => {
    setExerciseId(nextExercise);
    setReturnAnswer(undefined);
    setSelectedCue(undefined);
    setCueRule(undefined);
    setSortIndex(0);
    setSortCorrect(0);
    setStatus(`${exercises.find((item) => item.id === nextExercise)?.title} selected.`);
    setView('exercise');
  };

  const finishDrill = () => {
    if (!canContinue) return;
    setLevels((current) => ({ ...current, [exerciseId]: current[exerciseId] + 1 }));
    setStatus(`${exercise.title} complete. Your next field action is ready.`);
    setView('field');
  };

  const sort = (answer: 'work' | 'evening') => {
    const isCorrect = activeSortCards[sortIndex].answer === answer;
    if (isCorrect) setSortCorrect((current) => current + 1);
    setSortIndex((current) => current + 1);
    setStatus(isCorrect ? 'Matched. Next decision.' : 'Different from this exercise. Next decision.');
  };

  return <main className="training-shell">
    <p className="sr-status" role="status" aria-live="polite">{status}</p>
    <header className="training-header">
      <button className="wordmark" onClick={() => setView('today')} aria-label="Return to training today">MIRELLIS</button>
      <span>Training prototype</span>
      <button className="training-text-control" onClick={() => setView('today')}>Today</button>
    </header>

    {view === 'today' && <section className="training-screen training-today">
      <p className="eyebrow">After Work Training</p>
      <p className="training-counter">Session 04 <span>of 21</span></p>
      <h1>Train the ending.</h1>
      <p className="training-lead">Not advice for a difficult moment. A short practice that gets more demanding as you complete it.</p>
      <section className="today-workout" aria-labelledby="workout-title">
        <div><p className="eyebrow">Today’s workout</p><h2 id="workout-title">Return Point</h2><p>Make tomorrow’s first work action specific enough to begin.</p></div>
        <span>7 min</span>
      </section>
      <button className="primary-button" onClick={() => setView('commit')}>Begin today’s training</button>
      <button className="text-button" onClick={() => setView('exercise')}>Try another exercise</button>
      <p className="training-note">This prototype stores nothing outside this page. It does not measure your state or promise an outcome.</p>
    </section>}

    {view === 'commit' && <section className="training-screen training-commit">
      <p className="eyebrow">Make the appointment</p>
      <h1>How much time are you protecting?</h1>
      <p className="training-lead">Choose the session you can keep. Your training plan changes when you choose a shorter one.</p>
      <div className="training-choice-row" role="group" aria-label="Training duration">{['3 minutes', '7 minutes', '10 minutes'].map((option) => <button key={option} className={minutes === option ? 'training-choice is-selected' : 'training-choice'} aria-pressed={minutes === option} onClick={() => setMinutes(option)}>{option}</button>)}</div>
      <section className="firmness-row"><div><strong>{firmness === 'firm' ? 'Firm start' : 'Gentle start'}</strong><p>{firmness === 'firm' ? 'A clear timer and no extra choices once you begin.' : 'You can change or pause the session at any point.'}</p></div><button className="toggle" aria-pressed={firmness === 'firm'} onClick={() => setFirmness((current) => current === 'firm' ? 'gentle' : 'firm')}>{firmness === 'firm' ? 'On' : 'Off'}</button></section>
      <button className="primary-button" onClick={() => beginExercise('return-point')}>Start the workout</button>
      <button className="text-button" onClick={() => setView('today')}>Not now</button>
    </section>}

    {view === 'exercise' && <section className="training-screen training-drill">
      <div className="training-progress" aria-label={`Exercise ${selectedExerciseNumber} of ${exercises.length}`}><span style={{ width: `${(selectedExerciseNumber / exercises.length) * 100}%` }} /></div>
      <p className="eyebrow">Exercise {selectedExerciseNumber} · Level {levels[exerciseId]}</p>
      <h1>{exercise.title}</h1>
      <p className="training-lead">{exercise.description}</p>

      {exerciseId === 'return-point' && <section className="drill-panel" aria-labelledby="return-point-question"><p id="return-point-question">Which version would let you restart tomorrow without deciding everything again?</p><div className="drill-options">{activeReturnChoices.map((choice, index) => <button key={choice.label} className={returnAnswer === index ? 'drill-option is-selected' : 'drill-option'} aria-pressed={returnAnswer === index} onClick={() => { setReturnAnswer(index); setStatus(choice.correct ? 'A visible first action selected.' : 'This is not yet a visible first action.'); }}>{choice.label}</button>)}</div>{returnAnswer !== undefined && <p className={returnAnswer === 1 ? 'drill-feedback is-positive' : 'drill-feedback'}>{drillResult}</p>}</section>}

      {exerciseId === 'cue-break' && <section className="drill-panel" aria-labelledby="cue-question"><p id="cue-question">Which cue keeps you checking after work?</p><div className="drill-options compact-options">{['Work email', 'Work chat', 'A task app'].map((cue) => <button key={cue} className={selectedCue === cue ? 'drill-option is-selected' : 'drill-option'} aria-pressed={selectedCue === cue} onClick={() => setSelectedCue(cue)}>{cue}</button>)}</div>{selectedCue && <><p className="drill-question">For tonight, choose the rule you can keep.</p><div className="drill-options">{['Keep one urgent contact available; close the rest.', 'Check at one time I choose; not before.', 'Make this cue unavailable until tomorrow.'].map((rule) => <button key={rule} className={cueRule === rule ? 'drill-option is-selected' : 'drill-option'} aria-pressed={cueRule === rule} onClick={() => { setCueRule(rule); setStatus(`Rule selected for ${selectedCue}.`); }}>{rule}</button>)}</div></>}</section>}

      {exerciseId === 'boundary-sort' && <section className="drill-panel" aria-live="polite">{sortIndex < activeSortCards.length ? <><p className="sort-count">Decision {sortIndex + 1} of {activeSortCards.length}</p><p className="sort-card">{activeSortCards[sortIndex].text}</p><div className="sort-actions"><button className="secondary-button" onClick={() => sort('work')}>Work</button><button className="primary-button" onClick={() => sort('evening')}>Evening</button></div></> : <><p className="sort-count">Round complete</p><p className="sort-card">{drillResult}</p><p className="drill-feedback is-positive">You can now take this distinction into a real end-of-work decision.</p></>}</section>}

      <button className="primary-button" disabled={!canContinue} onClick={finishDrill}>Complete this drill</button>
      <button className="text-button" onClick={() => setView('today')}>Pause training</button>
    </section>}

    {view === 'field' && <section className="training-screen training-field">
      <p className="eyebrow">Field action</p>
      <h1>Take it outside the app.</h1>
      <p className="field-instruction">{exercise.fieldAction}</p>
      <p className="training-lead">Mirellis cannot verify this action. Return when you want to mark today’s session complete.</p>
      <button className="primary-button" onClick={() => { setStatus('Training session marked complete.'); setView('complete'); }}>I am back</button>
      <button className="text-button" onClick={() => { setStatus('Training paused. Nothing was marked complete.'); setView('today'); }}>Pause and return later</button>
    </section>}

    {view === 'complete' && <section className="training-screen training-complete">
      <p className="eyebrow">Session complete</p>
      <p className="training-counter">Session 04 <span>recorded</span></p>
      <h1>One practice is done.</h1>
      <p className="training-lead">You completed {exercise.title} at level {levels[exerciseId] - 1}. That records the exercise—not how you should feel.</p>
      <section className="next-session"><p className="eyebrow">Next training</p><h2>Cue Break</h2><p>Build one clear rule for the work cue that keeps pulling you back.</p></section>
      <button className="primary-button" onClick={() => setView('today')}>Back to training</button>
      <button className="text-button" onClick={() => beginExercise(exerciseId === 'boundary-sort' ? 'return-point' : exercises[selectedExerciseNumber].id)}>Try the next exercise</button>
    </section>}

    {view === 'exercise' && <nav className="exercise-switcher" aria-label="Prototype exercises">{exercises.map((item) => <button key={item.id} className={item.id === exerciseId ? 'exercise-tab is-active' : 'exercise-tab'} aria-current={item.id === exerciseId ? 'page' : undefined} onClick={() => beginExercise(item.id)}><span>{String(item.number).padStart(2, '0')}</span>{item.title}</button>)}</nav>}
  </main>;
}
