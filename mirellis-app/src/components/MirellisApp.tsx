'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BellSimple, Leaf, PencilSimple, ShieldCheck, UsersThree } from '@phosphor-icons/react';
import { MirellisBrand } from '@/components/MirellisBrand';
import {
  candidatePatternCopy,
  momentDefinitions,
  nightPossibilityOptions,
  optionLabel,
  professionalLinks,
  questionsByMoment,
  recommendationForNightPossibility,
  routeRecommendation,
  validatesRequiredAnswer,
  type Answers,
  type MomentKey,
  type ProductQuestion,
  type Recommendation,
} from '@/lib/unified-product';
import {
  createSession,
  deleteAllMirellisLocalData,
  experimentForRecord,
  initialUnifiedState,
  loadUnifiedState,
  recordFromSession,
  recordIsVisible,
  saveUnifiedState,
  type PatternState,
  type UnifiedExperiment,
  type UnifiedRecord,
  type UnifiedSession,
  type UnifiedState,
} from '@/lib/unified-store';

type Screen = 'today' | 'focus-setup' | 'question' | 'pattern' | 'pattern-options' | 'recommendation' | 'practice' | 'focus-session' | 'reflection' | 'complete' | 'experiment' | 'practices' | 'record' | 'settings' | 'help';
type Outcome = UnifiedRecord['outcome'];

const momentOrder: readonly MomentKey[] = ['waking', 'focus', 'after-work', 'night'];

const outcomeOptions: readonly { value: Outcome; label: string; support: string }[] = [
  { value: 'yes', label: 'Yes', support: 'The action was enough for this moment.' },
  { value: 'partly', label: 'Partly', support: 'Some part helped, and that is enough to record.' },
  { value: 'no', label: 'Not for me today', support: 'This practice did not fit this moment.' },
  { value: 'not-sure', label: 'I’m not sure', support: 'Nothing needs to be concluded.' },
];

const quickFocusRecommendation: Recommendation = {
  key: 'focus-start',
  moment: 'focus',
  name: 'Protected focus session',
  acknowledgement: 'You made a protected window for one important thing.',
  fit: 'A small, visible starting point is easier to protect than an abstract plan.',
  promise: 'Stay with one meaningful block. Notice what moved when it ends.',
  duration: '25 minutes by default',
  steps: [],
};

function screenForSession(session: UnifiedSession): Screen {
  if (session.phase === 'pattern') return 'pattern';
  if (session.phase === 'recommendation') return 'recommendation';
  if (session.phase === 'practice') return 'practice';
  if (session.phase === 'focus-session') return 'focus-session';
  if (session.phase === 'reflection') return 'reflection';
  return 'question';
}

function downloadRecord(state: UnifiedState) {
  const payload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: state.schemaVersion,
    records: state.records.filter(recordIsVisible),
  };
  const url = URL.createObjectURL(new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: 'application/json;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `mirellis-private-record-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function MirellisApp() {
  const [state, setState] = useState<UnifiedState>(initialUnifiedState);
  const [hydrated, setHydrated] = useState(false);
  const [screen, setScreen] = useState<Screen>('today');
  const [answer, setAnswer] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [lastRecordId, setLastRecordId] = useState<string>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [clock, setClock] = useState(() => Date.now());
  const [experimentValue, setExperimentValue] = useState('');
  const [experimentDetail, setExperimentDetail] = useState('');
  const [focusIntention, setFocusIntention] = useState('Deep work on the proposal');
  const [focusDuration, setFocusDuration] = useState(25);
  const [focusBoundary, setFocusBoundary] = useState('Pause social feeds until this session ends');
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);
  const deleteDialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loaded = loadUnifiedState(window.localStorage);
    setState(loaded);
    setFocusIntention(loaded.preferences.focusIntention);
    setFocusDuration(loaded.preferences.focusDuration);
    setFocusBoundary(loaded.preferences.focusBoundary);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveUnifiedState(window.localStorage, state);
  }, [hydrated, state]);

  useEffect(() => {
    if (!deleteOpen) return;
    const dialog = deleteDialogRef.current;
    const close = () => {
      setDeleteOpen(false);
      setStatus('Deletion cancelled. Nothing was removed.');
      window.setTimeout(() => deleteTriggerRef.current?.focus(), 0);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])'));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [deleteOpen]);

  useEffect(() => {
    if (screen !== 'focus-session' || !state.activeSession?.timerEndAt) return;
    const timer = window.setInterval(() => setClock(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [screen, state.activeSession?.timerEndAt]);

  const session = state.activeSession;
  const recommendation = useMemo(() => {
    if (!session?.recommendationKey) return undefined;
    if (session.recommendationKey === quickFocusRecommendation.key) return quickFocusRecommendation;
    const routed = routeRecommendation(session.moment, session.answers);
    if (routed.key === session.recommendationKey) return routed;
    if (session.moment === 'night') {
      const key = session.recommendationKey.replace('night-', '');
      return recommendationForNightPossibility(key);
    }
    return routed;
  }, [session]);
  const visibleRecords = useMemo(() => state.records.filter(recordIsVisible).slice().reverse(), [state.records]);
  const lastRecord = lastRecordId ? state.records.find((record) => record.id === lastRecordId) : undefined;
  const activeExperiment = state.experiments.find((experiment) => experiment.status === 'active');
  const experimentInView = activeExperiment ?? state.experiments.at(-1);

  const commit = (next: UnifiedState) => setState(next);

  const updateFocusPlan = (updates: Partial<Pick<UnifiedState['preferences'], 'focusIntention' | 'focusDuration' | 'focusBoundary'>>) => {
    setState((current) => ({ ...current, preferences: { ...current.preferences, ...updates } }));
  };

  const changeFocusIntention = (value: string) => {
    setFocusIntention(value);
    updateFocusPlan({ focusIntention: value });
  };

  const changeFocusDuration = (value: 15 | 25 | 45) => {
    setFocusDuration(value);
    updateFocusPlan({ focusDuration: value });
  };

  const changeFocusBoundary = (value: string) => {
    setFocusBoundary(value);
    updateFocusPlan({ focusBoundary: value });
  };

  const updateSession = (next: UnifiedSession, nextScreen?: Screen) => {
    commit({ ...state, activeSession: { ...next, updatedAt: new Date().toISOString() } });
    if (nextScreen) setScreen(nextScreen);
  };

  const beginMoment = (moment: MomentKey) => {
    const next = createSession(moment);
    commit({ ...state, activeSession: next });
    setAnswer('');
    setNote('');
    setLastRecordId(undefined);
    setScreen('question');
    setStatus(`${momentDefinitions[moment].shortLabel} questions opened.`);
  };

  const beginFocusedNow = () => {
    const next = createSession('focus');
    const seconds = focusDuration * 60;
    const focusSession: UnifiedSession = {
      ...next,
      phase: 'focus-session',
      recommendationKey: quickFocusRecommendation.key,
      answers: {
        focus_result: focusIntention.trim() || 'One important piece of work',
        focus_time: String(focusDuration),
        focus_barrier: focusBoundary,
        first_action: 'Begin the next visible step',
      },
      timerDurationSeconds: seconds,
      timerRemainingSeconds: seconds,
      timerEndAt: new Date(Date.now() + seconds * 1000).toISOString(),
    };
    commit({ ...state, activeSession: focusSession });
    setClock(Date.now());
    setScreen('focus-session');
    setStatus(`${focusDuration}-minute focus session started. ${focusBoundary}.`);
  };

  const shareFocusInvite = async () => {
    const invite = 'I’m beginning a protected focus session. Want to keep each other off social feeds for the next 25 minutes?';
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Join me for a focus session', text: invite });
        setStatus('Focus-partner invitation opened.');
        return;
      }
      await navigator.clipboard?.writeText(invite);
      setStatus('Focus-partner invitation copied.');
    } catch {
      setStatus('The invitation was not sent. You can try again when you are ready.');
    }
  };

  const leaveForNow = () => {
    if (session) commit({ ...state, activeSession: { ...session, state: 'paused', updatedAt: new Date().toISOString() } });
    setScreen('today');
    setStatus('Your place is kept in this browser. Leaving carries no penalty.');
  };

  const resume = () => {
    if (!session) return;
    const next = { ...session, state: 'active' as const };
    commit({ ...state, activeSession: next });
    setAnswer(next.answers[questionsByMoment[next.moment][next.questionIndex]?.id] ?? '');
    setScreen(screenForSession(next));
    setStatus(`Continuing ${momentDefinitions[next.moment].shortLabel}.`);
  };

  const discardSession = () => {
    if (!session) return;
    commit({ ...state, activeSession: undefined });
    setAnswer('');
    setNote('');
    setScreen('today');
    setStatus('The unfinished practice was discarded. Nothing was recorded as complete.');
  };

  const answerQuestion = () => {
    if (!session) return;
    const questions = questionsByMoment[session.moment];
    const question = questions[session.questionIndex];
    if (!question || !validatesRequiredAnswer(question, answer)) return;
    const answers: Answers = { ...session.answers, [question.id]: answer.trim() };
    if (session.questionIndex < questions.length - 1) {
      const questionIndex = session.questionIndex + 1;
      updateSession({ ...session, answers, questionIndex }, 'question');
      setAnswer(answers[questions[questionIndex].id] ?? '');
      setStatus(`Answer ${questionIndex} saved locally.`);
      return;
    }
    const nextRecommendation = routeRecommendation(session.moment, answers);
    const phase = session.moment === 'night' && !nextRecommendation.professionalRoute ? 'pattern' : 'recommendation';
    updateSession({ ...session, answers, recommendationKey: nextRecommendation.key, phase, questionIndex: questions.length - 1 }, phase);
    setAnswer('');
    setStatus(phase === 'pattern' ? 'A possible pattern is ready for you to confirm or reject.' : 'Your recommendation is ready.');
  };

  const previousQuestion = () => {
    if (!session || session.questionIndex === 0) return;
    const questionIndex = session.questionIndex - 1;
    const question = questionsByMoment[session.moment][questionIndex];
    updateSession({ ...session, questionIndex }, 'question');
    setAnswer(session.answers[question.id] ?? '');
  };

  const confirmPattern = (patternState: PatternState) => {
    if (!session) return;
    if (patternState === 'alternative') {
      setScreen('pattern-options');
      return;
    }
    if (patternState === 'rejected') {
      commit({ ...state, activeSession: undefined });
      setScreen('today');
      setStatus('Noted. The possibility was rejected and was not added to your private record.');
      return;
    }
    updateSession({ ...session, patternState, phase: 'recommendation' }, 'recommendation');
    setStatus(patternState === 'confirmed' ? 'You confirmed that this possibility fits.' : 'No personal pattern will be saved. You can still use the practical action.');
  };

  const chooseAlternativePattern = (value: string) => {
    if (!session) return;
    const nextRecommendation = recommendationForNightPossibility(value);
    updateSession({ ...session, patternState: 'alternative', recommendationKey: nextRecommendation.key, phase: 'recommendation' }, 'recommendation');
    setStatus('Your selected possibility changed the suggested experiment.');
  };

  const startPractice = () => {
    if (!session) return;
    updateSession({ ...session, state: 'active', phase: 'practice', practiceStep: 0 }, 'practice');
    setStatus('Practice started.');
  };

  const completeStep = () => {
    if (!session || !recommendation) return;
    if (session.practiceStep < recommendation.steps.length - 1) {
      const practiceStep = session.practiceStep + 1;
      updateSession({ ...session, practiceStep }, 'practice');
      setStatus(`Action ${practiceStep} confirmed. The next action is ready.`);
      return;
    }
    if (session.moment === 'focus') {
      const durationSeconds = Math.max(60, Number(session.answers.focus_time || 5) * 60);
      updateSession({ ...session, phase: 'focus-session', timerDurationSeconds: durationSeconds, timerRemainingSeconds: durationSeconds }, 'focus-session');
      setStatus('Preparation complete. Your work window is ready to start.');
      return;
    }
    updateSession({ ...session, phase: 'reflection' }, 'reflection');
    setStatus('The practice actions are complete. Nothing has been scored.');
  };

  const startFocusTimer = () => {
    if (!session) return;
    const remaining = session.timerRemainingSeconds ?? session.timerDurationSeconds ?? 300;
    updateSession({ ...session, timerRemainingSeconds: remaining, timerEndAt: new Date(Date.now() + remaining * 1000).toISOString() }, 'focus-session');
    setClock(Date.now());
    setStatus(`Work window started for ${Math.ceil(remaining / 60)} minutes.`);
  };

  const pauseFocusTimer = () => {
    if (!session?.timerEndAt) return;
    const remaining = Math.max(0, Math.ceil((new Date(session.timerEndAt).getTime() - Date.now()) / 1000));
    updateSession({ ...session, timerRemainingSeconds: remaining, timerEndAt: undefined }, 'focus-session');
    setStatus(`Work window paused with ${Math.ceil(remaining / 60)} minutes remaining.`);
  };

  const closeFocusSession = (reason: 'complete' | 'early' | 'interrupted') => {
    if (!session) return;
    updateSession({ ...session, answers: { ...session.answers, focus_session_close: reason }, timerEndAt: undefined, phase: 'reflection' }, 'reflection');
    setStatus(reason === 'complete' ? 'Work window finished. Record only what is true now.' : 'Work window ended early. Ending early is not a failure.');
  };

  const completePractice = (outcome: Outcome) => {
    if (!session || !recommendation) return;
    const record = recordFromSession(session, recommendation.name, outcome, note);
    commit({ ...state, activeSession: undefined, records: [...state.records, record] });
    setLastRecordId(record.id);
    setScreen('complete');
    setStatus('Practice completed. Nothing was silently saved for tomorrow.');
  };

  const saveLastPractice = () => {
    if (!lastRecord) return;
    commit({ ...state, records: state.records.map((record) => record.id === lastRecord.id ? { ...record, saved: true } : record) });
    setStatus('Saved. This practice now appears in your private record so you can return to it deliberately.');
  };

  const startExperiment = () => {
    if (!lastRecord) return;
    const experiment = experimentForRecord(lastRecord);
    if (!experiment) return;
    const withoutSamePractice = state.experiments.filter((item) => !(item.status === 'active' && item.practiceKey === experiment.practiceKey));
    commit({ ...state, experiments: [...withoutSamePractice, experiment] });
    setExperimentValue('');
    setExperimentDetail('');
    setScreen('experiment');
    setStatus(`${experiment.plannedSessions}-${experiment.moment === 'night' ? 'night' : experiment.moment === 'waking' ? 'morning' : 'session'} experiment started. No score will be calculated.`);
  };

  const recordExperimentObservation = (experiment: UnifiedExperiment, provenance: 'live' | 'recalled' | 'confirmed', values: Record<string, string>) => {
    const observation = { id: `observation-${experiment.id}-${Date.now()}`, recordedAt: new Date().toISOString(), provenance, values };
    const observations = [...experiment.observations, observation];
    const updated: UnifiedExperiment = { ...experiment, observations, status: observations.length >= experiment.plannedSessions ? 'complete' : 'active' };
    commit({ ...state, experiments: state.experiments.map((item) => item.id === experiment.id ? updated : item) });
    setExperimentValue('');
    setExperimentDetail('');
    setStatus(updated.status === 'complete' ? 'Experiment complete. Your observations are shown without a score or verdict.' : `Observation recorded locally. ${observations.length} of ${experiment.plannedSessions} complete.`);
  };

  const deleteData = () => {
    deleteAllMirellisLocalData(window.localStorage);
    setState(initialUnifiedState);
    setDeleteOpen(false);
    setScreen('today');
    setLastRecordId(undefined);
    setStatus('All local Mirellis data was deleted from this browser.');
  };

  if (!hydrated) return <main className="mirellis-shell"><p className="quiet-loading">Opening your private space…</p></main>;

  const currentQuestion = session ? questionsByMoment[session.moment][session.questionIndex] : undefined;
  const currentStep = recommendation && session ? recommendation.steps[session.practiceStep] : undefined;
  const focusRemaining = session?.timerEndAt
    ? Math.max(0, Math.ceil((new Date(session.timerEndAt).getTime() - clock) / 1000))
    : session?.timerRemainingSeconds ?? session?.timerDurationSeconds ?? 0;

  return <main className={`mirellis-shell ${state.preferences.reducedMotion ? 'motion-reduced' : ''}`}>
    <p className="sr-status" role="status" aria-live="polite">{status}</p>

    {screen !== 'today' && <AppHeader
      destination={screen === 'record' ? 'My record' : screen === 'practices' ? 'Practices' : screen === 'settings' ? 'Settings' : session ? momentDefinitions[session.moment].shortLabel : 'Mirellis'}
      onHome={() => setScreen('today')}
      onSettings={() => setScreen('settings')}
    />}

    {screen === 'today' && <Today
      activeSession={session}
      activeExperiment={activeExperiment}
      onResume={resume}
      onDiscard={discardSession}
      onBegin={beginMoment}
      onExperiment={() => setScreen('experiment')}
      intention={focusIntention}
      duration={focusDuration}
      boundary={focusBoundary}
      onBeginFocusedNow={beginFocusedNow}
      onSetup={() => setScreen('focus-setup')}
      onShare={shareFocusInvite}
    />}

    {screen === 'focus-setup' && <FocusSetupScreen
      intention={focusIntention}
      duration={focusDuration}
      boundary={focusBoundary}
      onIntention={changeFocusIntention}
      onDuration={changeFocusDuration}
      onBoundary={changeFocusBoundary}
      onBegin={beginFocusedNow}
      onBack={() => setScreen('today')}
    />}

    {screen === 'question' && session && currentQuestion && <QuestionScreen
      moment={session.moment}
      question={currentQuestion}
      index={session.questionIndex}
      total={questionsByMoment[session.moment].length}
      value={answer}
      onChange={setAnswer}
      onBack={previousQuestion}
      onContinue={answerQuestion}
      onLeave={leaveForNow}
    />}

    {screen === 'pattern' && session && recommendation && <section className="mirellis-screen pattern-screen">
      <p className="section-kicker">One possibility—not a verdict</p>
      <h1>{recommendation.name}</h1>
      <p className="mirellis-lead">{candidatePatternCopy(recommendation, session.answers)}</p>
      <section className="evidence-card">
        <p className="section-kicker">The local evidence used</p>
        {['night_activity', 'sleepiness', 'night_function'].map((id) => session.answers[id] && <p key={id}>{optionLabel('night', id, session.answers[id])}</p>)}
      </section>
      <div className="stacked-actions">
        <button className="primary-button" onClick={() => confirmPattern('confirmed')}>This fits</button>
        <button className="secondary-button" onClick={() => confirmPattern('alternative')}>Another possibility fits better</button>
        <button className="secondary-button" onClick={() => confirmPattern('rejected')}>This does not fit</button>
        <button className="text-button" onClick={() => confirmPattern('unlabelled')}>I do not want to label it</button>
      </div>
    </section>}

    {screen === 'pattern-options' && session && <section className="mirellis-screen">
      <p className="section-kicker">Choose only if it is true</p>
      <h1>What fits better?</h1>
      <p className="mirellis-lead">This choice changes the experiment. Mirellis will keep only the possibility you explicitly select.</p>
      <div className="answer-list">{nightPossibilityOptions.map((option) => <button key={option.value} className="answer-card" onClick={() => chooseAlternativePattern(option.value)}>{option.label}</button>)}</div>
      <button className="text-button" onClick={() => setScreen('pattern')}>Back to the first possibility</button>
    </section>}

    {screen === 'recommendation' && session && recommendation && <RecommendationScreen
      recommendation={recommendation}
      onStart={startPractice}
      onChooseAnother={() => beginMoment(session.moment)}
      onLeave={leaveForNow}
    />}

    {screen === 'practice' && session && recommendation && currentStep && <section className={`mirellis-screen action-screen moment-${session.moment}`}>
      <Progress current={session.practiceStep + 1} total={recommendation.steps.length} label="Practice action" />
      <p className="section-kicker">Action {session.practiceStep + 1} of {recommendation.steps.length}</p>
      <h1>{currentStep.title}</h1>
      <p className="mirellis-lead">{currentStep.body}</p>
      <section className="do-card"><span>Do this now</span><p>{currentStep.action}</p></section>
      {recommendation.professionalRoute && <a className="secondary-button link-button" href={professionalLinks[recommendation.professionalRoute]}>Open professional support</a>}
      <button className="primary-button" onClick={completeStep}>{currentStep.confirmation}</button>
      <button className="text-button" onClick={leaveForNow}>Pause and return later</button>
    </section>}

    {screen === 'focus-session' && session?.moment === 'focus' && recommendation && <section className="mirellis-screen focus-session-screen moment-focus">
      <p className="section-kicker">Your protected work window</p>
      <h1>{focusRemaining > 0 ? 'Stay with what matters.' : 'The work window has ended.'}</h1>
      <section className="focus-result-card"><span>Current intention</span><p>{session.answers.focus_result}</p><small>{session.answers.focus_barrier}</small></section>
      <FocusOrbit seconds={focusRemaining} duration={session.timerDurationSeconds ?? focusDuration * 60} state={session.timerEndAt ? 'In progress' : focusRemaining > 0 ? 'Paused' : 'Finished'} />
      {!session.timerEndAt && focusRemaining > 0 && <button className="primary-button focus-primary" onClick={startFocusTimer}>Continue focus <ArrowRight size={24} weight="regular" aria-hidden="true" /></button>}
      {session.timerEndAt && focusRemaining > 0 && <button className="secondary-button focus-secondary" onClick={pauseFocusTimer}>Pause for a real interruption</button>}
      {focusRemaining === 0 && <button className="primary-button focus-primary" onClick={() => closeFocusSession('complete')}>Reflect on this session <ArrowRight size={24} weight="regular" aria-hidden="true" /></button>}
      {focusRemaining > 0 && <button className="text-button" onClick={() => closeFocusSession(session.timerEndAt ? 'early' : 'interrupted')}>{session.timerEndAt ? 'End this work window early' : 'End this session without restarting'}</button>}
    </section>}

    {screen === 'reflection' && session && recommendation && <section className="mirellis-screen reflection-screen">
      <p className="section-kicker">After the action</p>
      <h1>Was today enough?</h1>
      <p className="mirellis-lead">There is no correct result. Your answer is not turned into a score or diagnosis.</p>
      <div className="answer-list">{outcomeOptions.map((option) => <button key={option.value} className="answer-card outcome-card" onClick={() => completePractice(option.value)}><strong>{option.label}</strong><span>{option.support}</span></button>)}</div>
      <label className="private-note">A private note, if you want one <span>{note.length}/280</span><textarea maxLength={280} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Stored only in this browser. Mirellis does not interpret it." /></label>
      <button className="text-button" onClick={leaveForNow}>Leave without recording an outcome</button>
    </section>}

    {screen === 'complete' && lastRecord && <section className="mirellis-screen complete-screen">
      <p className="section-kicker">For now</p>
      <h1>You made a first choice.</h1>
      <p className="mirellis-lead">That is enough for today.</p>
      <section className="completion-card"><span>What you completed</span><p>{lastRecord.practiceName}</p></section>
      <button className="primary-button" onClick={() => setScreen('today')}>Back to today</button>
      {!lastRecord.saved && <button className="secondary-button" onClick={saveLastPractice}>Keep this practice</button>}
      {lastRecord.moment !== 'after-work' && !state.experiments.some((experiment) => experiment.practiceKey === lastRecord.practiceKey && experiment.status === 'active') && <button className="secondary-button" onClick={startExperiment}>{lastRecord.moment === 'focus' ? 'Test this for 3 work sessions' : lastRecord.moment === 'waking' ? 'Test this for 7 mornings' : 'Test this for 7 nights'}</button>}
      {lastRecord.saved && <p className="visible-status">Saved. This practice is now visible in My record.</p>}
      {lastRecord.saved && <button className="text-button" onClick={() => setScreen('record')}>Open My record</button>}
    </section>}

    {screen === 'experiment' && experimentInView && <ExperimentScreen
      experiment={experimentInView}
      value={experimentValue}
      detail={experimentDetail}
      onValue={setExperimentValue}
      onDetail={setExperimentDetail}
      onRecord={(provenance, values) => recordExperimentObservation(experimentInView, provenance, values)}
      onBack={() => setScreen('today')}
    />}

    {screen === 'experiment' && !experimentInView && <section className="mirellis-screen true-empty"><h1>No active experiment.</h1><p>Begin from a completed Waking, Focus or Night practice.</p><button className="primary-button" onClick={() => setScreen('today')}>Back to today</button></section>}

    {screen === 'practices' && <Practices onBegin={beginMoment} />}

    {screen === 'record' && <RecordScreen records={visibleRecords} onBegin={() => setScreen('today')} onExport={() => { downloadRecord(state); setStatus('Private record downloaded. Nothing was sent to Mirellis.'); }} />}

    {screen === 'settings' && <section className="mirellis-screen settings-screen">
      <p className="section-kicker">Control</p><h1>Your local experience.</h1>
      <p className="mirellis-lead">No account is required. Your choices remain in this browser.</p>
      <div className="settings-stack">
        <section><div><h2>Reduce motion</h2><p>Show state changes without nonessential animation.</p></div><button className="setting-control" aria-pressed={state.preferences.reducedMotion} onClick={() => { commit({ ...state, preferences: { ...state.preferences, reducedMotion: !state.preferences.reducedMotion } }); setStatus(`Reduced motion ${state.preferences.reducedMotion ? 'disabled' : 'enabled'}.`); }}>{state.preferences.reducedMotion ? 'On' : 'Off'}</button></section>
        <section><div><h2>Analytics</h2><p>Analytics are not active in this build.</p></div></section>
        <section><div><h2>Export</h2><p>Download completed and deliberately saved records as JSON. Notes are included only if you wrote them.</p></div><button className="secondary-button compact-button" onClick={() => { downloadRecord(state); setStatus('Private record downloaded. Nothing was sent to Mirellis.'); }}>Download my record</button></section>
        <section><div><h2>Delete local data</h2><p>This removes the unified app record and the preserved After Work programme from this browser.</p></div><button ref={deleteTriggerRef} className="secondary-button compact-button" onClick={() => setDeleteOpen(true)}>Delete local data</button></section>
      </div>
      {deleteOpen && <section ref={deleteDialogRef} className="unified-delete-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
        <h2 id="delete-title">Delete all local Mirellis data?</h2>
        <p id="delete-description">This removes unfinished sessions, private records and the 21-day After Work programme from this browser. It cannot be undone.</p>
        <div><button autoFocus className="secondary-button compact-button" onClick={() => { setDeleteOpen(false); setStatus('Deletion cancelled. Nothing was removed.'); window.setTimeout(() => deleteTriggerRef.current?.focus(), 0); }}>Cancel</button><button className="primary-button compact-button destructive" onClick={deleteData}>Delete all local data</button></div>
      </section>}
    </section>}

    {screen === 'help' && <HelpScreen />}

    {!['today', 'focus-setup', 'question', 'pattern', 'pattern-options', 'recommendation', 'practice', 'focus-session', 'reflection'].includes(screen) && <BottomNav screen={screen} onNavigate={setScreen} />}
  </main>;
}

function AppHeader({ destination, onHome, onSettings }: { destination: string; onHome: () => void; onSettings: () => void }) {
  return <header className="mirellis-header"><button className="mirellis-wordmark" onClick={onHome} aria-label="Return to Today"><MirellisBrand /></button><span>{destination}</span><button className="mirellis-settings" onClick={onSettings}>Settings</button></header>;
}

function Today({ activeSession, activeExperiment, onResume, onDiscard, onBegin, onExperiment, intention, duration, boundary, onBeginFocusedNow, onSetup, onShare }: {
  activeSession?: UnifiedSession;
  activeExperiment?: UnifiedExperiment;
  onResume: () => void;
  onDiscard: () => void;
  onBegin: (moment: MomentKey) => void;
  onExperiment: () => void;
  intention: string;
  duration: number;
  boundary: string;
  onBeginFocusedNow: () => void;
  onSetup: () => void;
  onShare: () => void;
}) {
  const greeting = new Intl.DateTimeFormat(undefined, { hour: 'numeric', hour12: false }).format(new Date());
  const hour = Number(greeting);
  const salutation = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return <section className="focus-home">
    <p className="focus-salutation">{salutation}.</p>
    <h1>Your attention, kept.</h1>
    {activeSession?.moment === 'focus' ? <section className="focus-resume-panel"><p>There is an unfinished focus session.</p><button onClick={onResume}>Resume it <ArrowRight size={21} aria-hidden="true" /></button><button onClick={onDiscard}>Release it</button></section> : <>
      <section className="focus-intention" aria-label="Current focus intention">
        <span>Current intention</span>
        <div><p>{intention || 'One important piece of work'}</p><button onClick={onSetup} aria-label="Edit focus intention"><PencilSimple size={22} weight="regular" aria-hidden="true" /></button></div>
      </section>
      <FocusOrbit seconds={duration * 60} duration={duration * 60} state="Ready" />
      <button className="focus-primary" onClick={onBeginFocusedNow}>Begin now <ArrowRight size={28} weight="regular" aria-hidden="true" /></button>
      <button className="focus-secondary" onClick={onSetup}>Make a boundary <ShieldCheck size={23} weight="regular" aria-hidden="true" /></button>
      <section className="focus-promise" aria-label="Today’s focus promise"><Leaf size={29} weight="thin" aria-hidden="true" /><div><span>Today’s promise</span><p>Protect one mindful block of time.</p></div><ArrowRight size={25} weight="regular" aria-hidden="true" /></section>
      <section className="focus-boundary-status" aria-label="Focus boundary"><BellSimple size={30} weight="thin" aria-hidden="true" /><p>{boundary}.</p><span aria-hidden="true" /></section>
      <button className="focus-partner" onClick={onShare}><span><UsersThree size={26} weight="thin" aria-hidden="true" /></span><p>Invite a focus partner</p><ArrowRight size={25} weight="regular" aria-hidden="true" /></button>
      {activeExperiment && <button className="focus-experiment" onClick={onExperiment}>Continue your {activeExperiment.practiceName} experiment</button>}
      <details className="focus-other-moments"><summary>Need help with another moment?</summary><div>{momentOrder.filter((moment) => moment !== 'focus').map((moment) => <button key={moment} onClick={() => onBegin(moment)}>{momentDefinitions[moment].shortLabel}<ArrowRight size={18} aria-hidden="true" /></button>)}</div></details>
    </>}
  </section>;
}

function FocusSetupScreen({ intention, duration, boundary, onIntention, onDuration, onBoundary, onBegin, onBack }: {
  intention: string;
  duration: number;
  boundary: string;
  onIntention: (value: string) => void;
  onDuration: (value: 15 | 25 | 45) => void;
  onBoundary: (value: string) => void;
  onBegin: () => void;
  onBack: () => void;
}) {
  const boundaries = ['Pause social feeds until this session ends', 'Put my phone out of reach', 'Only open the tabs this task needs'];
  return <section className="mirellis-screen focus-setup-screen moment-focus">
    <button className="focus-back" onClick={onBack}>Back to today</button>
    <p className="section-kicker">Set the conditions</p>
    <h1>Make this block easier to keep.</h1>
    <label className="focus-intention-field"><span>What matters for this session?</span><input value={intention} onChange={(event) => onIntention(event.target.value)} maxLength={100} placeholder="One visible piece of work" /></label>
    <section className="focus-setup-group"><span>How long is realistic?</span><div role="radiogroup" aria-label="Focus duration">{([15, 25, 45] as const).map((value) => <button key={value} role="radio" aria-checked={duration === value} className={duration === value ? 'is-selected' : ''} onClick={() => onDuration(value)}>{value} min</button>)}</div></section>
    <section className="focus-setup-group"><span>Choose one boundary</span><div role="radiogroup" aria-label="Focus boundary">{boundaries.map((value) => <button key={value} role="radio" aria-checked={boundary === value} className={boundary === value ? 'is-selected' : ''} onClick={() => onBoundary(value)}><ShieldCheck size={22} weight="regular" aria-hidden="true" />{value}</button>)}</div></section>
    <p className="focus-setup-note">You can change this at any time. A boundary is support, not a test.</p>
    <button className="focus-primary" onClick={onBegin}>Begin this focus block <ArrowRight size={25} weight="regular" aria-hidden="true" /></button>
  </section>;
}

function FocusOrbit({ seconds, duration, state }: { seconds: number; duration: number; state: string }) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const progress = duration ? Math.max(0, Math.min(1, seconds / duration)) : 0;
  return <section className="focus-orbit" aria-label={`${state}, ${minutes} minutes ${remainingSeconds} seconds`}>
    <img src="/images/focus-orbit-backdrop.png" alt="" />
    <div className="focus-orbit-copy" role="timer" aria-live="off"><span>Focus session</span><strong>{state === 'Ready' ? `${Math.ceil(seconds / 60)}` : `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`}</strong><em>{state === 'Ready' ? 'minutes' : state}</em><progress value={progress} max="1" aria-label={`${Math.round(progress * 100)} percent remaining`} /><p>Stay with what matters.</p></div>
  </section>;
}

function QuestionScreen({ moment, question, index, total, value, onChange, onBack, onContinue, onLeave }: {
  moment: MomentKey; question: ProductQuestion; index: number; total: number; value: string; onChange: (value: string) => void; onBack: () => void; onContinue: () => void; onLeave: () => void;
}) {
  const valid = validatesRequiredAnswer(question, value);
  return <section className={`mirellis-screen question-screen moment-${moment}`}>
    <Progress current={index + 1} total={total} label="Questions" />
    <p className="section-kicker">{momentDefinitions[moment].shortLabel}</p>
    <h1>{question.prompt}</h1>
    {question.reason && <p className="question-reason">Why this matters: {question.reason}</p>}
    {question.type === 'single' && <div className="answer-list" role="radiogroup" aria-label={question.prompt}>{question.options?.map((option) => <button role="radio" aria-checked={value === option.value} className={value === option.value ? 'answer-card is-selected' : 'answer-card'} key={option.value} onClick={() => onChange(option.value)}><strong>{option.label}</strong>{option.support && <span>{option.support}</span>}</button>)}</div>}
    {question.type === 'text' && <label className="single-field"><span>Your answer</span><textarea autoFocus value={value} onChange={(event) => onChange(event.target.value)} placeholder={question.placeholder} /></label>}
    {question.type === 'time' && <label className="single-field"><span>Time</span><input type="time" value={value} onChange={(event) => onChange(event.target.value)} /></label>}
    <button className="primary-button" disabled={!valid} onClick={onContinue}>{index === total - 1 ? 'See what might help' : 'Continue'}</button>
    <div className="quiet-actions">{index > 0 && <button className="text-button" onClick={onBack}>Back</button>}<button className="text-button" onClick={onLeave}>Leave for now</button></div>
  </section>;
}

function RecommendationScreen({ recommendation, onStart, onChooseAnother, onLeave }: { recommendation: Recommendation; onStart: () => void; onChooseAnother: () => void; onLeave: () => void }) {
  return <section className={`mirellis-screen recommendation-screen moment-${recommendation.moment}`}>
    <p className="section-kicker">A recommendation for this moment</p>
    <h1>{recommendation.name}</h1>
    <p className="recommendation-ack">{recommendation.acknowledgement}</p>
    <section className="recommendation-why"><span>Why this fits</span><p>{recommendation.fit}</p></section>
    <section className="recommendation-promise"><span>The small promise</span><p>{recommendation.promise}</p><small>{recommendation.duration}</small></section>
    <button className="primary-button" onClick={onStart}>{recommendation.professionalRoute ? 'See the next step' : 'Start this practice'}</button>
    <button className="secondary-button" onClick={onChooseAnother}>Choose another approach</button>
    <button className="text-button" onClick={onLeave}>Leave for now</button>
  </section>;
}

function Practices({ onBegin }: { onBegin: (moment: MomentKey) => void }) {
  return <section className="mirellis-screen practices-screen"><p className="section-kicker">Explore deliberately</p><h1>Practices for four moments.</h1><p className="mirellis-lead">Choose a moment when you want to explore. Today remains the faster place to begin.</p><div className="practice-catalogue">{momentOrder.map((moment) => <article key={moment} className={`catalogue-card moment-${moment}`}><span>{momentDefinitions[moment].shortLabel}</span><h2>{momentDefinitions[moment].label}</h2><p>{momentDefinitions[moment].support}</p><button className="secondary-button" onClick={() => onBegin(moment)}>Begin with this moment</button></article>)}</div><article className="legacy-programme"><span>Optional maintenance</span><h2>After Work · 21 sessions</h2><p>The preserved programme remains available with its existing progress. One session per day; missing a day does not reset anything.</p><a className="primary-button link-button" href="/after-work">Open the 21-session programme</a></article></section>;
}

function ExperimentScreen({ experiment, value, detail, onValue, onDetail, onRecord, onBack }: {
  experiment: UnifiedExperiment;
  value: string;
  detail: string;
  onValue: (value: string) => void;
  onDetail: (value: string) => void;
  onRecord: (provenance: 'live' | 'recalled' | 'confirmed', values: Record<string, string>) => void;
  onBack: () => void;
}) {
  const completed = experiment.status === 'complete';
  const first = experiment.observations[0];
  const last = experiment.observations.at(-1);
  return <section className={`mirellis-screen experiment-screen moment-${experiment.moment}`}>
    <p className="section-kicker">{completed ? 'Experiment complete' : `${experiment.observations.length} of ${experiment.plannedSessions} observations`}</p>
    <h1>{completed ? 'See what you recorded.' : experiment.moment === 'night' ? 'Record the real stopping moment.' : experiment.moment === 'waking' ? 'What happened this morning?' : 'What happened in this work session?'}</h1>
    <p className="mirellis-lead">Testing: {experiment.practiceName}. Mirellis shows your own observations without a score, judgment or inferred progress.</p>

    {completed && <section className="experiment-comparison">
      <div><span>First observation</span><p>{first ? observationSentence(experiment, first) : 'Nothing recorded.'}</p></div>
      <div><span>Last observation</span><p>{last ? observationSentence(experiment, last) : 'Nothing recorded.'}</p></div>
      <p>No conclusion is added. You decide whether this practice is worth keeping.</p>
    </section>}

    {!completed && experiment.moment === 'night' && <div className="experiment-entry">
      <section className="live-marker"><h2>Are you stopping now?</h2><p>Use the live marker only at the moment the activity ends. It records the current time locally.</p><button className="primary-button" onClick={() => onRecord('live', { stopTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })}>I’m stopping now</button></section>
      <section className="recalled-marker"><h2>Adding it later?</h2><p>Recalled time is kept clearly separate from a live marker.</p><label className="single-field"><span>Recalled stop time</span><input type="time" value={value} onChange={(event) => onValue(event.target.value)} /></label><button className="secondary-button" disabled={!value} onClick={() => onRecord('recalled', { stopTime: value })}>Record this as recalled</button></section>
    </div>}

    {!completed && experiment.moment === 'waking' && <div className="experiment-entry">
      <h2>Did you try the chosen action?</h2>
      <ChoiceListSimple label="Action attempted" value={value} onChoose={onValue} options={['Yes', 'Partly', 'No']} />
      <h2>How did beginning feel?</h2>
      <ChoiceListSimple label="Beginning felt" value={detail} onChoose={onDetail} options={['Easier', 'About the same', 'Harder', 'Not sure']} />
      <button className="primary-button" disabled={!value || !detail} onClick={() => onRecord('confirmed', { actionAttempted: value, beginningFelt: detail })}>Record this morning</button>
    </div>}

    {!completed && experiment.moment === 'focus' && <div className="experiment-entry">
      <h2>Did you begin the task you chose?</h2>
      <ChoiceListSimple label="Task begun" value={value} onChoose={onValue} options={['Yes', 'Partly', 'No']} />
      <h2>What existed at the end?</h2>
      <ChoiceListSimple label="Result at end" value={detail} onChoose={onDetail} options={['The result I named', 'A useful part of it', 'A clearer next action', 'Nothing visible yet']} />
      <button className="primary-button" disabled={!value || !detail} onClick={() => onRecord('confirmed', { taskBegun: value, resultAtEnd: detail })}>Record this work session</button>
    </div>}

    <section className="observation-history"><h2>Your explicit observations</h2>{experiment.observations.length === 0 ? <p>Nothing recorded yet.</p> : experiment.observations.map((observation, index) => <article key={observation.id}><span>{index + 1}</span><p>{observationSentence(experiment, observation)}</p><small>{new Date(observation.recordedAt).toLocaleDateString()} · {observation.provenance}</small></article>)}</section>
    <button className="text-button" onClick={onBack}>Back to today</button>
  </section>;
}

function observationSentence(experiment: UnifiedExperiment, observation: UnifiedExperiment['observations'][number]) {
  if (experiment.moment === 'night') return `Stopped at ${observation.values.stopTime}.`;
  if (experiment.moment === 'waking') return `Action attempted: ${observation.values.actionAttempted}. Beginning felt: ${observation.values.beginningFelt}.`;
  return `Task begun: ${observation.values.taskBegun}. Result at end: ${observation.values.resultAtEnd}.`;
}

function ChoiceListSimple({ label, value, onChoose, options }: { label: string; value: string; onChoose: (value: string) => void; options: readonly string[] }) {
  return <div className="answer-list" role="radiogroup" aria-label={label}>{options.map((option) => <button role="radio" aria-checked={value === option} className={value === option ? 'answer-card is-selected' : 'answer-card'} key={option} onClick={() => onChoose(option)}>{option}</button>)}</div>;
}

function RecordScreen({ records, onBegin, onExport }: { records: UnifiedRecord[]; onBegin: () => void; onExport: () => void }) {
  return <section className="mirellis-screen record-screen"><p className="section-kicker">Private and local</p><h1>My record.</h1><p className="mirellis-lead">Only completed or deliberately saved practices appear here. There are no scores, inferred trends or hidden conclusions.</p>{records.length === 0 ? <section className="true-empty"><h2>Nothing yet.</h2><p>Complete one practice to build a route you can use without Mirellis.</p><button className="primary-button" onClick={onBegin}>Back to today</button></section> : <><button className="secondary-button record-download" onClick={onExport}>Download my private record</button><div className="unified-record-list">{records.map((record) => <article key={record.id}><span>{momentDefinitions[record.moment].shortLabel} · {new Date(record.completedAt).toLocaleDateString()}</span><h2>{record.practiceName}</h2><p>Outcome you selected: {outcomeOptions.find((item) => item.value === record.outcome)?.label}</p>{record.patternState === 'confirmed' && <p>Possibility confirmed by you.</p>}{record.note && <details><summary>Private note</summary><p>{record.note}</p></details>}{record.saved && <small>Deliberately kept</small>}</article>)}</div></>}</section>;
}

function HelpScreen() {
  return <section className="mirellis-screen help-screen">
    <p className="section-kicker">Help and boundaries</p>
    <h1>Use the right kind of help.</h1>
    <p className="mirellis-lead">Mirellis supports ordinary transitions. It does not diagnose or replace medical, psychological, emergency or crisis care.</p>
    <div className="help-list">
      <article>
        <h2>Sleep or breathing concerns</h2>
        <p>Persistent sleep difficulty, gasping, choking, witnessed breathing pauses or dangerous daytime sleepiness deserve qualified assessment.</p>
        <a href={professionalLinks.sleep}>Find sleep specialists</a>
      </article>
      <article>
        <h2>Persistent attention difficulty</h2>
        <p>Focus difficulty can have many causes. A qualified professional can assess what is relevant in your case.</p>
        <a href={professionalLinks.attention}>Find focus specialists</a>
      </article>
      <article>
        <h2>Rest that does not restore you</h2>
        <p>If exhaustion, overwhelm, or difficulty switching off persists, find support that matches the concern rather than relying on another self-guided practice.</p>
        <a href={professionalLinks.restoration}>Find restoration support</a>
      </article>
      <article>
        <h2>Immediate danger or crisis</h2>
        <p>If you or someone else is in immediate danger in India, call 112. For public tele-mental-health support, Tele-MANAS can be reached by calling 14416.</p>
        <a href={professionalLinks.crisis}>Open India’s 112 emergency service</a>
        <a href={professionalLinks.mentalHealth}>Open official Tele-MANAS information</a>
      </article>
      <article>
        <h2>Continue outside the app</h2>
        <p>Return to Mirellis for plain-language concern guides, current public records, and the limits of what the information can tell you.</p>
        <a href="https://mirellis.in/pages/understand">Understand what is happening</a>
        <a href="https://mirellis.in">Return to Mirellis</a>
      </article>
    </div>
  </section>;
}

function BottomNav({ screen, onNavigate }: { screen: Screen; onNavigate: (screen: Screen) => void }) {
  const items: readonly { screen: Screen; label: string }[] = [{ screen: 'today', label: 'Today' }, { screen: 'practices', label: 'Practices' }, { screen: 'record', label: 'My record' }, { screen: 'help', label: 'Help' }];
  return <nav className="mirellis-nav" aria-label="Primary navigation">{items.map((item) => <button key={item.screen} aria-current={screen === item.screen ? 'page' : undefined} className={screen === item.screen ? 'is-active' : ''} onClick={() => onNavigate(item.screen)}>{item.label}</button>)}</nav>;
}

function Progress({ current, total, label }: { current: number; total: number; label: string }) {
  return <div className="unified-progress" role="progressbar" aria-label={label} aria-valuemin={1} aria-valuemax={total} aria-valuenow={current}><span style={{ width: `${(current / total) * 100}%` }} /></div>;
}
