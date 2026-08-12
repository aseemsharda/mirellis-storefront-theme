'use client';

import { useEffect, useRef, useState } from 'react';

type Tab = 'today' | 'programme' | 'record' | 'settings';
type SessionView = 'home' | 'close-loop' | 'signal-sort' | 'leave' | 'complete';
type Firmness = 'gentle' | 'firm' | 'accountable';

type AppData = {
  hasStarted: boolean;
  time: string;
  firmness: Firmness;
  day: number;
  signalLevel: number;
  completedDays: number[];
  sessionLog: Array<{ day: number; date: string; closeLoop: string; boundary: string; score: number }>;
};

type SessionDraft = {
  view: Exclude<SessionView, 'home' | 'complete'>;
  workItem: string;
  firstMove: string;
  sortIndex: number;
  sortScore: number;
  selectedBoundary: string;
  seconds: number;
};

const STORAGE_KEY = 'mirellis-after-work-training-v1';
const DRAFT_KEY = 'mirellis-after-work-training-draft-v1';
const defaultData: AppData = {
  hasStarted: false,
  time: '18:30',
  firmness: 'gentle',
  day: 1,
  signalLevel: 1,
  completedDays: [],
  sessionLog: [],
};

const sortPromptSets = [[
  { copy: 'A task that has no deadline until tomorrow morning.', answer: 'work' },
  { copy: 'Choosing what you will do for the next twenty minutes.', answer: 'evening' },
  { copy: 'An email labelled urgent by a person you trust.', answer: 'work' },
  { copy: 'Changing into clothes you do not work in.', answer: 'evening' },
], [
  { copy: 'A colleague asks for a thought tonight, but the decision is tomorrow.', answer: 'work' },
  { copy: 'A personal plan that requires opening the same laptop you worked on.', answer: 'evening' },
  { copy: 'A client cannot continue until you answer one factual question.', answer: 'work' },
  { copy: 'Writing down a work thought so you do not have to keep rehearsing it.', answer: 'evening' },
]] as const;

const boundaryActions = [
  'Put my work device out of reach.',
  'Close the work surface and change rooms.',
  'Send the return point, then leave the desk.',
  'Begin a planned evening activity for one minute.',
];

const firmnessCopy: Record<Firmness, string> = {
  gentle: 'One reminder. You can reschedule without explanation.',
  firm: 'A clear appointment and one follow-up reminder.',
  accountable: 'A scheduled appointment with a deliberate skip choice. Partner sharing comes later.',
};

const practiceNames = ['Close the loop', 'Sort the signal', 'Leave on purpose'];

function dateLabel(date: Date) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
}

function formatTimer(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function AfterWorkApp() {
  const [data, setData] = useState<AppData>(defaultData);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<Tab>('today');
  const [sessionView, setSessionView] = useState<SessionView>('home');
  const [onboarding, setOnboarding] = useState(0);
  const [status, setStatus] = useState('');
  const [workItem, setWorkItem] = useState('');
  const [firstMove, setFirstMove] = useState('');
  const [sortIndex, setSortIndex] = useState(0);
  const [sortScore, setSortScore] = useState(0);
  const [selectedBoundary, setSelectedBoundary] = useState('');
  const [seconds, setSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [adaptationStatus, setAdaptationStatus] = useState('');
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setData({ ...defaultData, ...JSON.parse(saved) as AppData });
      const draft = window.localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const restored = JSON.parse(draft) as SessionDraft;
        setSessionView(restored.view);
        setWorkItem(restored.workItem);
        setFirstMove(restored.firstMove);
        setSortIndex(restored.sortIndex);
        setSortScore(restored.sortScore);
        setSelectedBoundary(restored.selectedBoundary);
        setSeconds(restored.seconds);
        setStatus('Your unfinished workout is ready to resume.');
      }
    } catch {
      setStatus('This browser could not load prior practice data.');
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    if (sessionView === 'home' || sessionView === 'complete') {
      window.localStorage.removeItem(DRAFT_KEY);
      return;
    }
    const draft: SessionDraft = { view: sessionView, workItem, firstMove, sortIndex, sortScore, selectedBoundary, seconds };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [firstMove, hydrated, seconds, selectedBoundary, sessionView, sortIndex, sortScore, workItem]);

  useEffect(() => {
    if (!timerRunning || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning, seconds]);

  useEffect(() => {
    if (seconds === 0 && timerRunning) {
      setTimerRunning(false);
      setStatus('One minute complete. You can record this workout when ready.');
    }
  }, [seconds, timerRunning]);

  const completedCount = data.completedDays.length;
  const sessionNumber = Math.min(data.day, 21);
  const activeSortPrompts = sortPromptSets[Math.min(data.signalLevel - 1, sortPromptSets.length - 1)];
  const sortPrompt = activeSortPrompts[sortIndex];
  const canFinishCloseLoop = workItem.trim().length > 3 && firstMove.trim().length > 6;
  const canCompleteLeave = Boolean(selectedBoundary) && seconds === 0;

  const updateData = (patch: Partial<AppData>, message?: string) => {
    setData((current) => ({ ...current, ...patch }));
    if (message) setStatus(message);
  };

  const startSession = () => {
    setWorkItem('');
    setFirstMove('');
    setSortIndex(0);
    setSortScore(0);
    setSelectedBoundary('');
    setSeconds(60);
    setTimerRunning(false);
    setSessionView('close-loop');
    setStatus(`Session ${sessionNumber} started. First exercise: close the loop.`);
  };

  const chooseSort = (choice: 'work' | 'evening') => {
    const correct = sortPrompt.answer === choice;
    if (correct) setSortScore((value) => value + 1);
    setStatus(correct ? 'Matched. Next signal.' : 'Different from this exercise. Next signal.');
    if (sortIndex === activeSortPrompts.length - 1) {
      setSortIndex(activeSortPrompts.length);
      return;
    }
    setSortIndex((value) => value + 1);
  };

  const completeSession = () => {
    const today = new Date();
    const log = { day: sessionNumber, date: dateLabel(today), closeLoop: firstMove.trim(), boundary: selectedBoundary, score: sortScore };
    const nextSignalLevel = sortScore >= 3 ? Math.min(data.signalLevel + 1, sortPromptSets.length) : data.signalLevel;
    setAdaptationStatus(nextSignalLevel > data.signalLevel
      ? 'Tomorrow’s Signal Sort will use closer, more difficult distinctions because you matched at least three today.'
      : 'Tomorrow’s Signal Sort will stay at this level with new examples.');
    setData((current) => ({
      ...current,
      day: Math.min(current.day + 1, 21),
      signalLevel: nextSignalLevel,
      completedDays: current.completedDays.includes(sessionNumber) ? current.completedDays : [...current.completedDays, sessionNumber],
      sessionLog: [...current.sessionLog.filter((entry) => entry.day !== sessionNumber), log],
    }));
    setSessionView('complete');
    setStatus(`Workout recorded. Session ${sessionNumber} is complete.`);
  };

  const deleteData = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(DRAFT_KEY);
    setData(defaultData);
    setTab('today');
    setSessionView('home');
    setOnboarding(0);
    setDeleteOpen(false);
    setStatus('All local Mirellis practice data was deleted.');
  };

  const trainingState = completedCount === 0
    ? 'Your first practice is ready.'
    : completedCount >= 21
      ? 'This programme is complete. Your practice record is yours to revisit.'
      : `Session ${sessionNumber} is ready at ${data.time}.`;

  if (!hydrated) return <main className="after-work-shell"><p className="quiet-loading">Opening your practice…</p></main>;

  if (!data.hasStarted) return <main className="after-work-shell onboarding-shell">
    <p className="sr-status" role="status" aria-live="polite">{status}</p>
    <header className="after-work-header"><span className="after-work-wordmark">MIRELLIS</span><span>After work</span></header>
    {onboarding === 0 && <section className="onboarding-copy">
      <p className="eyebrow">A daily training programme</p>
      <h1>End work on purpose.</h1>
      <p className="after-work-lead">A short daily workout for practising the moment between work and the rest of your life. It does not assess you or promise how you will feel.</p>
      <section className="after-work-rule"><strong>21 sessions</strong><span>Three short exercises per day</span></section>
      <button className="primary-button" onClick={() => setOnboarding(1)}>Build my routine</button>
      <p className="after-work-footnote">Stored only in this browser until you choose otherwise.</p>
    </section>}
    {onboarding === 1 && <section className="onboarding-copy">
      <p className="eyebrow">Your appointment</p>
      <h1>When does work usually end?</h1>
      <p className="after-work-lead">We will prepare a daily session for this time. Browser reminders are a preview in this build, not a push notification.</p>
      <label className="time-control">Usual end time<input type="time" value={data.time} onChange={(event) => updateData({ time: event.target.value })} /></label>
      <button className="primary-button" onClick={() => setOnboarding(2)}>Continue</button>
      <button className="text-button" onClick={() => setOnboarding(0)}>Back</button>
    </section>}
    {onboarding === 2 && <section className="onboarding-copy">
      <p className="eyebrow">Reminder style</p>
      <h1>How should Mirellis show up?</h1>
      <p className="after-work-lead">You can change this any time. Nothing is shared with anyone.</p>
      <div className="firmness-list" role="group" aria-label="Reminder style">
        {(Object.keys(firmnessCopy) as Firmness[]).map((style) => <button key={style} className={data.firmness === style ? 'firmness-choice is-selected' : 'firmness-choice'} aria-pressed={data.firmness === style} onClick={() => updateData({ firmness: style })}><strong>{style}</strong><span>{firmnessCopy[style]}</span></button>)}
      </div>
      <button className="primary-button" onClick={() => { updateData({ hasStarted: true }, 'Your After Work programme is ready.'); setOnboarding(0); }}>Start my programme</button>
      <button className="text-button" onClick={() => setOnboarding(1)}>Back</button>
    </section>}
  </main>;

  return <main className="after-work-shell">
    <p className="sr-status" role="status" aria-live="polite">{status}</p>
    <header className="after-work-header"><button className="after-work-wordmark" onClick={() => setTab('today')}>MIRELLIS</button><span>{sessionView === 'home' ? 'After work' : sessionView === 'complete' ? 'Workout complete' : `Practice ${sessionNumber}`}</span><button className="after-work-plain-button" onClick={() => setTab('settings')}>Settings</button></header>

    {tab === 'today' && sessionView === 'home' && <section className="after-work-screen today-screen">
      <p className="eyebrow">Today’s training</p>
      <h1>{completedCount === 0 ? 'Make one clear ending.' : completedCount >= 21 ? 'Programme complete.' : 'Keep the appointment.'}</h1>
      <p className="after-work-lead">{trainingState}</p>
      <section className="workout-sheet" aria-labelledby="today-workout-title">
        <div className="workout-sheet-heading"><div><p className="eyebrow">After Work · Session {sessionNumber} of 21</p><h2 id="today-workout-title">{completedCount === 0 ? 'Your first workout' : 'Today’s workout'}</h2></div><span>7 min</span></div>
        {practiceNames.map((name, index) => <div className="practice-row" key={name}><div><strong>{name}</strong><p>{index === 0 ? 'Make tomorrow easier to begin.' : index === 1 ? 'Decide what belongs to work and what can wait.' : 'Take one real step away from work.'}</p></div></div>)}
      </section>
      {completedCount >= 21 ? <button className="primary-button" onClick={() => setTab('record')}>View my practice record</button> : <button className="primary-button" onClick={startSession}>Start today’s workout</button>}
      <button className="text-button" onClick={() => { setTab('programme'); setStatus('Programme opened.'); }}>View the programme</button>
      <p className="after-work-footnote">A completed workout records the exercises you completed. It does not measure your mood, recovery, or productivity.</p>
    </section>}

    {tab === 'today' && sessionView === 'close-loop' && <section className="after-work-screen practice-screen">
      <Progress step={1} />
      <p className="eyebrow">Exercise 1 · Close the loop</p>
      <h1>Give tomorrow a real starting point.</h1>
      <p className="after-work-lead">This is not a to-do list. Choose one unfinished item and write the smallest visible action that begins it.</p>
      <label className="training-field">The unfinished item<textarea value={workItem} onChange={(event) => setWorkItem(event.target.value)} placeholder="For example: the campaign update for Friday" /></label>
      <label className="training-field">Tomorrow’s first visible action<textarea value={firstMove} onChange={(event) => setFirstMove(event.target.value)} placeholder="For example: at 9:15, open the update and write the first three headings" /></label>
      <button className="primary-button" disabled={!canFinishCloseLoop} onClick={() => { setSessionView('signal-sort'); setStatus('Return point saved for this workout. Next: sort the signal.'); }}>Save and continue</button>
      <button className="text-button" onClick={() => { setSessionView('home'); setStatus('Workout paused. Nothing was recorded as complete.'); }}>Pause workout</button>
    </section>}

    {tab === 'today' && sessionView === 'signal-sort' && <section className="after-work-screen practice-screen">
      <Progress step={2} />
      <p className="eyebrow">Exercise 2 · Sort the signal</p>
      <h1>Decide what needs you now.</h1>
      <p className="after-work-lead">Choose where this belongs. The result only reflects this short exercise.</p>
      {sortIndex < activeSortPrompts.length ? <section className="signal-prompt" aria-live="polite"><p>Decision {sortIndex + 1} of {activeSortPrompts.length} · Level {data.signalLevel}</p><h2>{sortPrompt.copy}</h2><div><button className="secondary-button" onClick={() => chooseSort('work')}>Work</button><button className="primary-button" onClick={() => chooseSort('evening')}>Evening</button></div></section> : <section className="signal-prompt"><p>Round complete</p><h2>{sortScore} of {activeSortPrompts.length} decisions matched this exercise.</h2><p className="after-work-lead">Next, choose one actual boundary action for tonight.</p><button className="primary-button" onClick={() => setSessionView('leave')}>Continue</button></section>}
      <button className="text-button" onClick={() => { setSessionView('home'); setStatus('Workout paused. Nothing was recorded as complete.'); }}>Pause workout</button>
    </section>}

    {tab === 'today' && sessionView === 'leave' && <section className="after-work-screen practice-screen">
      <Progress step={3} />
      <p className="eyebrow">Exercise 3 · Leave on purpose</p>
      <h1>Choose your first move out of work.</h1>
      <p className="after-work-lead">Pick one action you can actually take now. Then use the minute to begin it, outside the app.</p>
      <div className="boundary-list" role="group" aria-label="Boundary action">{boundaryActions.map((action) => <button key={action} className={selectedBoundary === action ? 'boundary-choice is-selected' : 'boundary-choice'} aria-pressed={selectedBoundary === action} onClick={() => { setSelectedBoundary(action); setStatus('Boundary action selected.'); }}>{action}</button>)}</div>
      {selectedBoundary && <section className="minute-card"><p className="eyebrow">The one-minute start</p><strong>{seconds === 0 ? 'One minute is complete.' : formatTimer(seconds)}</strong><p>Leave this screen and begin: {selectedBoundary}</p>{seconds > 0 && <button className="secondary-button" onClick={() => { setTimerRunning((value) => !value); setStatus(timerRunning ? 'Timer paused.' : 'Timer started.'); }}>{timerRunning ? 'Pause the minute' : 'Start the minute'}</button>}</section>}
      <button className="primary-button" disabled={!canCompleteLeave} onClick={completeSession}>Record today’s workout</button>
      <button className="text-button" onClick={() => { setSessionView('home'); setStatus('Workout paused. Nothing was recorded as complete.'); }}>Pause workout</button>
    </section>}

    {tab === 'today' && sessionView === 'complete' && <section className="after-work-screen completion-screen">
      <p className="eyebrow">Workout recorded</p>
      <h1>Today’s practice is complete.</h1>
      <p className="after-work-lead">You completed three exercises and chose one real boundary action. That is what this record shows—nothing more.</p>
      <section className="result-sheet"><p><span>Tomorrow’s first move</span>{firstMove}</p><p><span>Signal Sort</span>{sortScore} of {activeSortPrompts.length} matched</p><p><span>Tonight’s boundary</span>{selectedBoundary}</p></section>
      <p className="adaptation-copy" role="status">{adaptationStatus}</p>
      <button className="primary-button" onClick={() => { setSessionView('home'); setStatus(`Session ${sessionNumber} is ready when you are.`); }}>Back to today</button>
      <button className="text-button" onClick={() => { setTab('record'); setSessionView('home'); }}>View my private record</button>
    </section>}

    {tab === 'programme' && <section className="after-work-screen compact-screen">
      <p className="eyebrow">Your programme</p><h1>After work · 21 sessions.</h1><p className="after-work-lead">A repeatable daily training path. The path records practice; it does not label your state.</p>
      <div className="programme-grid" aria-label="Twenty-one session programme">{Array.from({ length: 21 }, (_, index) => { const day = index + 1; const state = data.completedDays.includes(day) ? 'done' : day === sessionNumber ? 'current' : 'upcoming'; return <button key={day} className={`programme-day ${state}`} onClick={() => { if (day === sessionNumber) { setTab('today'); startSession(); } else setStatus(state === 'done' ? `Session ${day} was completed.` : `Session ${day} unlocks after the earlier sessions.`); }} aria-label={`Session ${day}, ${state}`}> {String(day).padStart(2, '0')}<span>{state === 'done' ? 'Done' : state === 'current' ? 'Today' : 'Later'}</span></button>; })}</div>
      <section className="programme-detail"><p className="eyebrow">What repeats</p>{practiceNames.map((name) => <p key={name}><strong>{name}</strong> — practice the same skill with new prompts as you return.</p>)}</section>
    </section>}

    {tab === 'record' && <section className="after-work-screen compact-screen">
      <p className="eyebrow">Private record</p><h1>Your practice, as recorded.</h1><p className="after-work-lead">Mirellis keeps an honest list of sessions and the choices you chose to save.</p>
      {data.sessionLog.length === 0 ? <section className="record-empty"><h2>Nothing recorded yet.</h2><p>Complete one workout to build a private record you can use without Mirellis.</p><button className="primary-button" onClick={() => { setTab('today'); startSession(); }}>Start the first workout</button></section> : <div className="record-list-new">{[...data.sessionLog].reverse().map((entry) => <article key={entry.day}><p className="eyebrow">Session {entry.day} · {entry.date}</p><h2>Workout recorded</h2><p><span>Return point</span>{entry.closeLoop}</p><p><span>Boundary</span>{entry.boundary}</p><p><span>Signal Sort</span>{entry.score} of 4 matched</p></article>)}</div>}
    </section>}

    {tab === 'settings' && <section className="after-work-screen compact-screen">
      <p className="eyebrow">Settings</p><h1>Your routine and data.</h1>
      <section className="settings-list-new"><div><h2>Daily appointment</h2><p>Prepared for {data.time} in this browser.</p><label className="time-control">Change time<input type="time" value={data.time} onChange={(event) => updateData({ time: event.target.value }, 'Appointment time saved.')}/></label></div><div><h2>Reminder style</h2><p>{firmnessCopy[data.firmness]}</p><select value={data.firmness} onChange={(event) => updateData({ firmness: event.target.value as Firmness }, 'Reminder style saved.')} aria-label="Reminder style">{(Object.keys(firmnessCopy) as Firmness[]).map((style) => <option value={style} key={style}>{style}</option>)}</select></div><div><h2>Analytics</h2><p>Analytics are not active in this build.</p></div><div><h2>Local data</h2><p>Your programme, saved actions, and workout record are stored in this browser.</p><button ref={deleteTriggerRef} className="secondary-button" onClick={() => setDeleteOpen(true)}>Delete local data</button></div></section>
      {deleteOpen && <section className="delete-dialog" role="alertdialog" aria-labelledby="delete-title" aria-describedby="delete-description"><h2 id="delete-title">Delete this browser’s practice data?</h2><p id="delete-description">This removes your local programme, saved actions, and workout record. It cannot be undone.</p><div><button autoFocus className="secondary-button" onClick={() => { setDeleteOpen(false); setStatus('Deletion cancelled.'); window.setTimeout(() => deleteTriggerRef.current?.focus(), 0); }}>Cancel</button><button className="primary-button destructive" onClick={deleteData}>Delete everything</button></div></section>}
    </section>}

    <nav className="after-work-nav" aria-label="After Work navigation"><button aria-current={tab === 'today' ? 'page' : undefined} className={tab === 'today' ? 'is-active' : ''} onClick={() => setTab('today')}>Today</button><button aria-current={tab === 'programme' ? 'page' : undefined} className={tab === 'programme' ? 'is-active' : ''} onClick={() => setTab('programme')}>Programme</button><button aria-current={tab === 'record' ? 'page' : undefined} className={tab === 'record' ? 'is-active' : ''} onClick={() => setTab('record')}>Record</button><button aria-current={tab === 'settings' ? 'page' : undefined} className={tab === 'settings' ? 'is-active' : ''} onClick={() => setTab('settings')}>Settings</button></nav>
  </main>;
}

function Progress({ step }: { step: number }) {
  return <div className="session-progress" aria-label={`Exercise ${step} of 3`}><span style={{ width: `${(step / 3) * 100}%` }} /></div>;
}
