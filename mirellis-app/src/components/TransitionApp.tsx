'use client';

import { useEffect, useMemo, useState } from 'react';
import { v1Transitions as transitions } from '@/lib/v1-transition-model';
import { assertCurriculumIntegrity, CURRICULUM_VERSION, transitionDossiers } from '@/curriculum/stewardship';
import { deleteData, loadData, saveData } from '@/lib/local-store';
import { createCue, createPersonalRoute, createReviewNote, exportObservatory, noteForRecord, removeCue, removeRecord, removeTransitionObservatoryData, routeTypeForRecord, savePrivateNote, sortedRecords } from '@/lib/observatory';
import { assertProductExperienceIntegrity, consumerLabelFor, consumerMomentFor, consumerMoments, problemChoiceFor, problemChoices, type ProblemKey } from '@/lib/product-experience';
import { evaluateRoute, evidenceExpiry, type Constraint, type Suggestion } from '@/lib/route-policy';
import { initialData, type AppData, type Attempt, type ExplicitFit, type Experience, type ObservatoryRecord, type RouteType, type Transition } from '@/lib/types';
import { assertLaunchOperationsIntegrity, LAUNCH_OPERATIONS_VERSION, launchGates, launchState, operatingBoundary } from '@/operations/launch';

type View = 'safety' | 'how-it-works' | 'today' | 'moments' | 'not-sure' | 'path' | 'checkin' | 'suggestion' | 'preview' | 'choice' | 'action' | 'reflect' | 'complete' | 'routes' | 'self-guide' | 'self-guide-reflect' | 'record' | 'curriculum' | 'launch' | 'settings' | 'help';

assertCurriculumIntegrity();
assertLaunchOperationsIntegrity();
assertProductExperienceIntegrity();

const checkInOptions: { constraint: Constraint; label: string }[] = [
  { constraint: 'open', label: 'I’m ready to try something.' },
  { constraint: 'crowded', label: 'I need the smallest version.' },
  { constraint: 'urgent', label: 'Something needs my attention first.' },
  { constraint: 'unsure', label: 'I’m not sure.' },
];

const fitOptions: { label: string; value: ExplicitFit | 'not-sure' }[] = [
  { label: 'This fit today.', value: 'fit' },
  { label: 'Partly fit today.', value: 'partly-fit' },
  { label: 'Not for me today.', value: 'not-for-me' },
  { label: 'Nothing changed yet.', value: 'not-sure' },
];

function timeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning.';
  if (hour < 18) return 'Good afternoon.';
  return 'Good evening.';
}

function progressKey(transitionId: string, experienceId: string) {
  return `${transitionId}:${experienceId}`;
}

function allExperiences(transition: Transition) {
  return transition.experiences;
}

export function TransitionApp() {
  const [data, setData] = useState<AppData>(initialData);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>('safety');
  const [transitionId, setTransitionId] = useState(transitions[0].id);
  const [experienceId, setExperienceId] = useState(transitions[0].experiences[0].id);
  const [constraint, setConstraint] = useState<Constraint>('open');
  const [note, setNote] = useState('');
  const [whyOpen, setWhyOpen] = useState<string>();
  const [problemKey, setProblemKey] = useState<ProblemKey>('unsure');
  const [status, setStatus] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const transition = useMemo(
    () => transitions.find((item) => item.id === transitionId) ?? transitions[0],
    [transitionId],
  );
  const experience = useMemo(
    () => transition.experiences.find((item) => item.id === experienceId) ?? transition.experiences[0],
    [transition, experienceId],
  );
  const decision = useMemo(() => evaluateRoute(transition, data, constraint), [transition, data, constraint]);
  const latestRecord = useMemo(() => sortedRecords(data)[0], [data]);
  const latestTitle = latestRecord ? transitions.find((item) => item.id === latestRecord.transitionId)?.experiences.find((item) => item.id === latestRecord.experienceId)?.title : undefined;
  const inPractice = ['preview', 'choice', 'action', 'reflect', 'complete'].includes(view);

  useEffect(() => {
    loadData().then((stored) => {
      setData(stored);
      setReady(true);
      if (stored.safetyAcknowledged) setView(stored.attempt ? stored.attempt.currentStep : 'today');
      if (stored.attempt) {
        setTransitionId(stored.attempt.transitionId);
        setExperienceId(stored.attempt.experienceId);
        setNote(stored.attempt.note ?? '');
      }
    });
  }, []);

  const commit = (next: AppData) => {
    setData(next);
    void saveData(next);
  };

  const setAttempt = (currentStep: Attempt['currentStep'], patch: Partial<Attempt> = {}) => {
    const attempt: Attempt = {
      transitionId,
      experienceId,
      currentStep,
      startedAt: data.attempt?.startedAt ?? new Date().toISOString(),
      selectedValue: data.attempt?.selectedValue,
      note: data.attempt?.note,
      routeType: data.attempt?.routeType ?? 'guided',
      ...patch,
    };
    commit({ ...data, attempt });
  };

  const selectExperience = (nextTransition: Transition, nextExperience: Experience, nextView: View = 'preview', routeType: RouteType = 'guided') => {
    setTransitionId(nextTransition.id);
    setExperienceId(nextExperience.id);
    setNote('');
    commit({
      ...data,
      attempt: {
        transitionId: nextTransition.id,
        experienceId: nextExperience.id,
        currentStep: nextView === 'preview' ? 'preview' : nextView as Attempt['currentStep'],
        routeType,
        startedAt: new Date().toISOString(),
      },
    });
    setView(nextView);
  };

  const completeExperience = (nextView: View = 'today') => {
    const key = progressKey(transition.id, experience.id);
    const attempt = data.attempt;
    const record: ObservatoryRecord | undefined = attempt ? {
      id: `record-${crypto.randomUUID()}`,
      transitionId: transition.id,
      experienceId: experience.id,
      curriculumVersion: experience.semanticVersion,
      occurredAtLocal: new Date().toISOString(),
      routeType: routeTypeForRecord(attempt.routeType),
      explicitResponse: attempt.selectedValue,
      policyVersion: 'v2.0',
    } : undefined;
    commit({
      ...data,
      completed: { ...data.completed, [key]: data.attempt?.routeType ?? 'guided' },
      observatoryRecords: record ? [...data.observatoryRecords, record] : data.observatoryRecords,
      privateNotes: record && attempt?.note?.trim() ? [...data.privateNotes, { id: `note-${crypto.randomUUID()}`, linkedRecordId: record.id, createdAtLocal: new Date().toISOString(), text: attempt.note.trim(), source: 'local' }] : data.privateNotes,
      attempt: undefined,
    });
    setStatus('Practice completed. You can return whenever it is useful.');
    setView(nextView);
  };

  const leaveForToday = () => {
    setAttempt(data.attempt?.currentStep ?? 'preview');
    setView('today');
  };

  const nextExperience = (nextTransition: Transition) =>
    allExperiences(nextTransition).find((item) => !data.completed[progressKey(nextTransition.id, item.id)]) ?? nextTransition.experiences[0];

  const completeInTransition = (target: Transition) =>
    target.experiences.filter((item) => data.completed[progressKey(target.id, item.id)]).length;

  const startTransition = (target: Transition) => {
    setTransitionId(target.id);
    setConstraint('open');
    setWhyOpen(undefined);
    setView('checkin');
  };

  const chooseProblem = (key: ProblemKey) => {
    const problem = problemChoiceFor(key);
    const target = transitions.find((item) => item.id === problem.transitionId) ?? transitions[0];
    setProblemKey(key);
    setTransitionId(target.id);
    setConstraint('open');
    setWhyOpen(undefined);
    setView('suggestion');
  };

  const openPath = (target: Transition) => {
    setTransitionId(target.id);
    setView('path');
  };

  const recordFit = (value: ExplicitFit | 'not-sure') => {
    const selectedValue = `${data.attempt?.selectedValue ?? ''} · ${value}`;
    const evidence = value === 'not-sure' ? data.evidence : [
      ...data.evidence,
      {
        id: `evidence-${crypto.randomUUID()}`,
        transitionId: transition.id,
        experienceId: experience.id,
        kind: value,
        createdAt: new Date().toISOString(),
        expiresAt: evidenceExpiry(),
      },
    ];
    setAttempt('complete', { selectedValue, note, routeType: data.attempt?.routeType ?? 'guided' });
    commit({ ...data, evidence, attempt: { ...data.attempt!, selectedValue, note, currentStep: 'complete', routeType: data.attempt?.routeType ?? 'guided' } });
    setView('complete');
  };

  const hideSuggestion = (suggestion: Suggestion) => {
    commit({
      ...data,
      evidence: [...data.evidence, {
        id: `evidence-${crypto.randomUUID()}`,
        transitionId: transition.id,
        experienceId: suggestion.experience.id,
        kind: 'not-for-me',
        createdAt: new Date().toISOString(),
        expiresAt: evidenceExpiry(),
      }],
    });
    setWhyOpen(undefined);
  };

  const saveSelfGuidedReflection = (value: ExplicitFit | 'not-sure') => {
    const shouldCount = value === 'fit' || value === 'partly-fit';
    commit({
      ...data,
      selfGuidedReflections: shouldCount
        ? { ...data.selfGuidedReflections, [transition.id]: (data.selfGuidedReflections[transition.id] ?? 0) + 1 }
        : data.selfGuidedReflections,
    });
    setView('today');
  };

  if (!ready) return <main className="app-shell"><p className="quiet-loading">Opening your local space…</p></main>;

  if (view === 'safety') {
    return <main className="app-shell centered-shell"><Brand /><section className="card safety-card" aria-labelledby="safety-heading"><p className="eyebrow">Mirellis</p><h1 id="safety-heading">A small way to change gears through your day.</h1><p>You don’t have to finish the whole journey today. One small practice is enough.</p><p className="muted">Private on this device. You can leave at any time.</p><button className="primary-button" onClick={() => setView('how-it-works')}>See what might help</button><button className="text-button" onClick={() => { commit({ ...data, safetyAcknowledged: true }); setView('today'); }}>Begin</button><button className="text-button" onClick={() => setView('help')}>Help and boundaries</button></section></main>;
  }

  return <main className={`app-shell mode-${transition.id} ${data.reducedMotion ? 'motion-reduced' : ''}`}>
    <header className="topbar"><button className="wordmark" onClick={() => setView('today')} aria-label="Return to Mirellis today">Mirellis</button>{inPractice ? <button className="quiet-control" onClick={leaveForToday}>Leave for now</button> : <nav className="primary-nav" aria-label="Main navigation"><button className="quiet-control" onClick={() => setView('today')}>Today</button><button className="quiet-control" onClick={() => setView('path')}>Journey</button><button className="quiet-control" onClick={() => setView('record')}>Observe</button><button className="quiet-control" onClick={() => setView('settings')}>Profile</button></nav>}</header>
    <p className="sr-status" role="status" aria-live="polite">{status}</p>

    {view === 'how-it-works' && <section className="screen centered-content"><Back onClick={() => setView('safety')} /><p className="eyebrow">How it works</p><h1>Choose. Try. Notice. Keep what fits.</h1><p className="lead">Mirellis offers small approaches for ordinary moments. You remain free to skip, stop, choose another way, or continue without the app.</p><ol className="how-it-works-list"><li><strong>Choose</strong><span>Name what feels difficult right now.</span></li><li><strong>Try</strong><span>Take one small practice.</span></li><li><strong>Notice</strong><span>Say what happened, if you want to.</span></li><li><strong>Keep what fits</strong><span>Your record remains private on this device.</span></li></ol><button className="primary-button" onClick={() => { commit({ ...data, safetyAcknowledged: true }); setView('today'); }}>See what might help</button><button className="text-button" onClick={() => { commit({ ...data, safetyAcknowledged: true }); setView('today'); }}>Begin</button></section>}

    {view === 'today' && <section className="screen"><p className="eyebrow">{timeGreeting()}</p><h1>What brings you here today?</h1><p className="lead">When one part of your day is hard to leave or begin, Mirellis helps you try one small practice and decide what is enough today.</p>{data.attempt && <section className="resume-card"><span>Continue where you left off?</span><strong>{transitions.find((item) => item.id === data.attempt?.transitionId)?.experiences.find((item) => item.id === data.attempt?.experienceId)?.title}</strong><div className="button-row"><button className="secondary-button" onClick={() => setView(data.attempt?.currentStep ?? 'preview')}>Continue this practice</button><button className="text-button" onClick={() => commit({ ...data, attempt: undefined })}>Start fresh</button></div></section>}{!data.attempt && latestTitle && <section className="continuity-line"><p>Last time, you practised <strong>{latestTitle}</strong>. Start with what is true today.</p></section>}<ChoiceGrid options={problemChoices.map((choice) => choice.label)} onSelect={(label) => chooseProblem(problemChoices.find((choice) => choice.label === label)?.key ?? 'unsure')} /><p className="muted">You don’t have to finish the whole journey today. One small practice is enough.</p><button className="text-button" onClick={() => setView('path')}>Explore the journey</button></section>}

    {view === 'moments' && <section className="screen"><Back onClick={() => setView('today')} /><p className="eyebrow">Today</p><h1>What would be helpful right now?</h1><p className="lead">Choose a familiar moment. There is no right choice.</p><div className="moment-grid" aria-label="Choose a moment">{consumerMoments.map((moment) => <button className="moment-card" key={moment.transitionId} onClick={() => { setTransitionId(moment.transitionId); setView('checkin'); }}><strong>{moment.label}</strong><span>{moment.description}</span></button>)}<button className="moment-card" onClick={() => setView('not-sure')}><strong>Not sure</strong><span>Start with a neutral small pause.</span></button></div><button className="text-button" onClick={() => setView('path')}>Explore all moments</button></section>}

    {view === 'not-sure' && <section className="screen centered-content"><Back onClick={() => setView('moments')} /><p className="eyebrow">Today</p><h1>Not sure? Start with a small pause.</h1><p className="lead">You do not need to explain or work anything out first.</p><button className="primary-button" onClick={() => { setTransitionId('focus-recovery'); startTransition(transitions.find((item) => item.id === 'focus-recovery') ?? transitions[0]); }}>Try a small pause</button><button className="secondary-button" onClick={() => setView('moments')}>Choose a different moment</button><button className="text-button" onClick={() => setView('today')}>Leave for today</button></section>}

    {view === 'path' && <section className="screen"><Back onClick={() => setView('today')} /><p className="eyebrow">Explore other moments</p><h1>Explore a moment.</h1><p className="lead">Practices are here whenever you want to look more widely. There is nothing to finish.</p><select className="transition-select" value={transition.id} onChange={(event) => setTransitionId(event.target.value)} aria-label="Choose a life moment">{transitions.map((item) => <option value={item.id} key={item.id}>{consumerLabelFor(item.id)}</option>)}</select><div className="experience-list">{transition.experiences.map((item) => { const key = progressKey(transition.id, item.id); const unfinished = data.attempt?.transitionId === transition.id && data.attempt.experienceId === item.id; const completed = Boolean(data.completed[key]); return <button className="experience-row" key={item.id} onClick={() => unfinished ? setView(data.attempt?.currentStep ?? 'preview') : selectExperience(transition, item)}><strong>{item.title}</strong><em>{unfinished ? `Continue ${item.title}` : completed ? `Return to ${item.title}` : `Start with ${item.title}`}</em></button>; })}</div><div className="button-row"><button className="secondary-button" onClick={() => setView('routes')}>Your saved approaches</button><button className="text-button" onClick={() => setView('today')}>Leave for now</button></div></section>}

    {view === 'checkin' && <section className="screen centered-content"><Back onClick={() => setView('moments')} /><p className="eyebrow">{consumerMomentFor(transition.id)?.orientation ?? 'This moment'}</p><h1>What feels closest right now?</h1><p className="lead">This only changes what Mirellis offers next. It does not label you.</p><ChoiceGrid options={checkInOptions.map((item) => item.label)} onSelect={(label) => { setConstraint(checkInOptions.find((item) => item.label === label)?.constraint ?? 'unsure'); setWhyOpen(undefined); setView('suggestion'); }} /><button className="text-button" onClick={() => setView('today')}>Leave for today</button></section>}

    {view === 'suggestion' && <SuggestionScreen transition={transition} problem={problemChoiceFor(problemKey)} decision={decision} onBack={() => setView('today')} onChoose={(item, routeType) => selectExperience(transition, item, 'preview', routeType)} onChooseAnother={() => setView('path')} onLeave={() => setView('today')} whyOpen={whyOpen} onToggleWhy={setWhyOpen} onHide={hideSuggestion} onOpenRoute={() => setView('routes')} hasSavedRoute={(data.routes[transition.id]?.length ?? 0) > 0} />}

    {view === 'preview' && <section className="screen centered-content"><Back onClick={leaveForToday} label="Leave for now" /><p className="eyebrow">A small practice</p><h1>{experience.title}</h1><p className="lead">In the next 1–3 minutes, you’ll practise {experience.prompt.toLowerCase()}</p><div className="card preview-card"><p>Take only the smallest version that feels possible. You can change direction or leave at any time.</p></div><button className="primary-button" onClick={() => { setAttempt('action'); setView('action'); }}>Start this practice</button><button className="secondary-button" onClick={() => { setAttempt('reflect', { routeType: 'minimum' }); setView('reflect'); }}>Try a smaller version</button><button className="text-button" onClick={() => setView('path')}>Choose another</button></section>}

    {view === 'choice' && <section className="screen centered-content"><Back onClick={leaveForToday} label="Leave for today" /><p className="eyebrow">Step 1 of 4 · Notice</p><h1>{experience.choicePrompt}</h1><p className="lead">Choose what feels closest. This is a mirror, not a rating.</p><ChoiceGrid options={experience.options.map((item) => item.label)} onSelect={(value) => { setAttempt('action', { selectedValue: value }); setView('action'); }} /><button className="text-button" onClick={() => setView('path')}>Try a different approach</button></section>}

    {view === 'action' && <section className="screen centered-content"><Back onClick={leaveForToday} label="Leave for now" /><p className="eyebrow">Try</p><h1>{data.attempt?.routeType === 'minimum' ? 'Take one comfortable breath, then notice where your body is supported.' : experience.action}</h1><p className="lead">Take the smallest version that feels possible.</p><button className="primary-button" onClick={() => { setAttempt('reflect'); setView('reflect'); }}>Notice what happened</button><button className="secondary-button" onClick={() => { setAttempt('action', { routeType: 'minimum' }); }}>Need something shorter?</button></section>}

    {view === 'reflect' && <section className="screen centered-content"><Back onClick={leaveForToday} label="Leave for today" /><p className="eyebrow">Step 3 of 4 · Notice</p><h1>What did you notice?</h1><p className="lead">{experience.observation} {experience.reflection}</p><ChoiceGrid options={fitOptions.map((item) => item.label)} onSelect={(label) => recordFit(fitOptions.find((item) => item.label === label)?.value ?? 'not-sure')} /><label className="note-field">Add a private note (optional) <span>({note.length}/140)</span><textarea value={note} maxLength={140} onChange={(event) => setNote(event.target.value)} placeholder="Only stored on this device. It is not used for suggestions." /></label></section>}

    {view === 'complete' && <section className="screen centered-content"><p className="eyebrow">A small practice</p><h1>You made a first choice.</h1><p className="lead">That is enough for today.</p><section className="card preview-card"><h2>Was today enough?</h2><ChoiceGrid options={['Yes.', 'Not yet.', 'I’m not sure.']} onSelect={(answer) => { if (answer === 'Not yet.') { setAttempt('action', { routeType: 'minimum' }); setView('action'); } else completeExperience('today'); }} /></section><button className="primary-button" onClick={() => completeExperience('today')}>Back to today</button><button className="secondary-button" onClick={() => { setStatus('Your private note can be added in Observe.'); completeExperience('record'); }}>Add a private note</button><button className="text-button" onClick={() => completeExperience('today')}>Leave for now</button></section>}

    {view === 'routes' && <RouteBuilder transition={transition} data={data} onBack={() => setView('today')} onSave={(route) => { commit({ ...data, routes: { ...data.routes, [transition.id]: route } }); setStatus('Saved. Your approach is ready to use without Mirellis.'); }} onTransitionChange={setTransitionId} onUseWithout={() => setView('self-guide')} />}

    {view === 'self-guide' && <SelfGuide transition={transition} route={data.routes[transition.id] ?? []} onBack={() => setView('today')} onReflect={() => setView('self-guide-reflect')} />}

    {view === 'self-guide-reflect' && <section className="screen centered-content"><Back onClick={() => setView('today')} /><p className="eyebrow">Your route</p><h1>Did it fit?</h1><p className="lead">Only your explicit answer is stored locally. Choosing not to use the route is valid.</p><ChoiceGrid options={[...fitOptions.map((item) => item.label), 'I did not use it.']} onSelect={(label) => saveSelfGuidedReflection(fitOptions.find((item) => item.label === label)?.value ?? 'not-sure')} /></section>}

    {view === 'record' && <PersonalObservatory data={data} onBack={() => setView('today')} onCommit={commit} onStatus={setStatus} onDeleteAll={async () => { await deleteData(); setData(initialData); setView('safety'); }} />}

    {view === 'curriculum' && <CurriculumRecord onBack={() => setView('settings')} />}

    {view === 'launch' && <LaunchRecord onBack={() => setView('settings')} />}

    {view === 'settings' && <section className="screen settings-screen"><Back onClick={() => setView('today')} /><p className="eyebrow">Profile</p><h1>Control your local experience.</h1><p className="lead">No account is required. Your choices stay in this browser.</p><section className="setting-row"><div><h2>Reduce motion</h2><p>Show changes without animated transitions.</p></div><Toggle active={data.reducedMotion} onClick={() => commit({ ...data, reducedMotion: !data.reducedMotion })} /></section><section className="setting-row"><div><h2>Observe</h2><p>See, export, or remove only what you explicitly kept.</p></div><button className="secondary-button" onClick={() => setView('record')}>Open</button></section><section className="setting-row"><div><h2>Analytics</h2><p>Analytics are not active in this build.</p></div></section><section className="setting-row"><div><h2>Delete local data</h2><p>This removes practices, approaches, and private records from this browser.</p></div><button className="secondary-button" onClick={() => setConfirmDelete(true)}>Delete</button></section>{confirmDelete && <section className="card delete-confirmation" role="alertdialog" aria-modal="false" aria-labelledby="delete-title"><h2 id="delete-title">Delete all local data?</h2><p>This cannot be undone. You can cancel and keep everything as it is.</p><div className="button-row"><button className="secondary-button" onClick={() => setConfirmDelete(false)}>Cancel</button><button className="text-button destructive-button" onClick={async () => { await deleteData(); setData(initialData); setConfirmDelete(false); setStatus('Local data deleted.'); setView('safety'); }}>Delete all local data</button></div></section>}<button className="text-button" onClick={() => setView('help')}>Help and boundaries</button></section>}

    {view === 'help' && <section className="screen centered-content"><Back onClick={() => setView(data.safetyAcknowledged ? 'today' : 'safety')} /><p className="eyebrow">Help and boundaries</p><h1>Attend to what needs you first.</h1><p className="lead">Mirellis is for ordinary moments. It does not assess you or provide medical, emergency, clinical, or crisis support. If something needs your attention first, leave this experience and do what fits your situation.</p><p className="muted">For product support, Mirellis can help with access, local data controls, consent, and accessibility. It cannot replace support your situation may need.</p><div className="button-row"><button className="primary-button" onClick={() => setView(data.safetyAcknowledged ? 'today' : 'safety')}>Return</button><button className="secondary-button" onClick={() => window.history.back()}>Leave this app</button></div></section>}
  </main>;
}

function SuggestionScreen({ transition, problem, decision, onBack, onChoose, onChooseAnother, onLeave, whyOpen, onToggleWhy, onHide, onOpenRoute, hasSavedRoute }: { transition: Transition; problem: ReturnType<typeof problemChoiceFor>; decision: ReturnType<typeof evaluateRoute>; onBack: () => void; onChoose: (experience: Experience, routeType: RouteType) => void; onChooseAnother: () => void; onLeave: () => void; whyOpen?: string; onToggleWhy: (id?: string) => void; onHide: (suggestion: Suggestion) => void; onOpenRoute: () => void; hasSavedRoute: boolean }) {
  if (decision.safetyRoute) return <section className="screen centered-content"><Back onClick={onBack} /><p className="eyebrow">This moment</p><h1>Attend to what needs you first.</h1><p className="lead">Nothing needs to be completed before you leave. You can return when useful.</p><div className="button-row"><button className="primary-button" onClick={onLeave}>Leave for today</button><button className="secondary-button" onClick={onChooseAnother}>Choose a different moment</button></div></section>;
  if (!decision.primary) return <section className="screen centered-content"><Back onClick={onBack} /><h1>Choose in the moment.</h1><p className="lead">There is no suggested approach right now.</p><button className="secondary-button" onClick={onChooseAnother}>Try a different approach</button></section>;
  const renderSuggestion = (item: Suggestion, primary = false) => <article className={`suggestion-card ${primary ? 'suggestion-primary' : ''}`} key={item.experience.id}><p className="eyebrow">{primary ? 'A small approach' : 'Another approach'}</p><h2>{item.experience.title}</h2><p className="muted">{item.experience.prompt}</p><button className={primary ? 'primary-button' : 'secondary-button'} onClick={() => onChoose(item.experience, item.routeType)}>{item.routeType === 'minimum' ? 'Make this smaller' : 'Try this now'}</button><button className="text-button why-button" aria-expanded={whyOpen === item.experience.id} onClick={() => onToggleWhy(whyOpen === item.experience.id ? undefined : item.experience.id)}>Why this approach?</button>{whyOpen === item.experience.id && <div className="why-card"><p>{item.explanation}</p>{item.evidenceExpiresAt && <p className="muted">A choice you made earlier expires from suggestions on {new Date(item.evidenceExpiresAt).toLocaleDateString()}.</p>}<button className="text-button" onClick={() => onHide(item)}>Do not offer this for 30 days</button></div>}</article>;
  return <section className="screen centered-content"><Back onClick={onBack} /><p className="eyebrow">Today</p><h1>{problem.acknowledgement}</h1><p className="lead">Today, try: <strong>{decision.primary.experience.title}</strong>.</p><article className="suggestion-card suggestion-primary"><p className="muted">{problem.whyNow}</p><h2>In the next 1–3 minutes, you’ll practise {decision.primary.experience.prompt.toLowerCase()}</h2><p className="muted">You can choose another practice or leave at any time.</p><button className="primary-button" onClick={() => onChoose(decision.primary!.experience, decision.primary!.routeType)}>Start this practice</button><button className="secondary-button" onClick={() => onChoose(decision.primary!.experience, 'minimum')}>Try a smaller version</button></article>{decision.alternatives.length > 0 && <section className="alternative-list"><p className="eyebrow">Another approach</p>{decision.alternatives.map((item) => renderSuggestion(item))}</section>}{hasSavedRoute && <article className="suggestion-card"><p className="eyebrow">A saved approach</p><h2>You chose this before.</h2><p className="muted">It remains editable and is never a hidden default.</p><button className="secondary-button" onClick={onOpenRoute}>Open saved approaches</button></article>}<div className="button-row"><button className="secondary-button" onClick={onChooseAnother}>Choose another approach</button><button className="text-button" onClick={onLeave}>Leave for now</button></div></section>;
}

function RouteBuilder({ transition, data, onBack, onSave, onTransitionChange, onUseWithout }: { transition: Transition; data: AppData; onBack: () => void; onSave: (route: string[]) => void; onTransitionChange: (id: string) => void; onUseWithout: () => void }) {
  const [route, setRoute] = useState<string[]>(data.routes[transition.id] ?? []);
  useEffect(() => setRoute(data.routes[transition.id] ?? []), [data.routes, transition.id]);
  const available = transition.experiences.filter((item) => data.completed[progressKey(transition.id, item.id)]);
  const cueLabel = (id: string) => id === 'my-own-choice' ? 'My own choice.' : transition.experiences.find((item) => item.id === id)?.title ?? id;
  const toggle = (id: string) => setRoute((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 2 ? [...current, id] : [current[1], id]);
  const move = (index: number, direction: -1 | 1) => setRoute((current) => { const next = [...current]; const target = index + direction; if (target < 0 || target >= next.length) return current; [next[index], next[target]] = [next[target], next[index]]; return next; });
  return <section className="screen"><Back onClick={onBack} /><p className="eyebrow">Observe</p><h1>Your saved approaches.</h1><p className="lead">Choose up to two completed practices, then use them without opening Mirellis.</p><select className="transition-select" value={transition.id} onChange={(event) => onTransitionChange(event.target.value)} aria-label="Choose a life moment">{transitions.map((item) => <option value={item.id} key={item.id}>{consumerLabelFor(item.id)}</option>)}</select>{available.length === 0 ? <section className="card observatory-card"><p>Complete one practice to build a route you can use without Mirellis.</p></section> : <><div className="route-list">{available.map((item) => <button className={`route-choice ${route.includes(item.id) ? 'route-choice-selected' : ''}`} key={item.id} onClick={() => toggle(item.id)}><span>{route.includes(item.id) ? 'Selected' : 'Choose'}</span>{item.title}</button>)}</div>{route.length > 0 && <ol className="route-order" aria-label="Approach order">{route.map((id, index) => <li key={id}><span>{cueLabel(id)}</span><button className="text-button" disabled={index === 0} onClick={() => move(index, -1)}>Earlier</button><button className="text-button" disabled={index === route.length - 1} onClick={() => move(index, 1)}>Later</button><button className="text-button" onClick={() => toggle(id)}>Remove</button></li>)}</ol>}<button className="primary-button" disabled={route.length === 0 || route.length > 2} onClick={() => onSave(route)}>Save this approach</button></>}{(data.routes[transition.id]?.length ?? 0) > 0 && <section className="card observatory-card"><p><strong>Saved approach</strong></p><ol className="route-steps">{(data.routes[transition.id] ?? []).map((id) => <li key={id}>{cueLabel(id)}</li>)}</ol><button className="secondary-button" onClick={onUseWithout}>Use without Mirellis</button></section>}<p className="muted">Your approach stays on this device. Using it without Mirellis is a complete outcome.</p></section>;
}

function SelfGuide({ transition, route, onBack, onReflect }: { transition: Transition; route: string[]; onBack: () => void; onReflect: () => void }) {
  const label = (id: string) => id === 'my-own-choice' ? 'My own choice.' : transition.experiences.find((item) => item.id === id)?.title ?? id;
  return <section className="screen centered-content"><Back onClick={onBack} /><p className="eyebrow">Your route</p><h1>Use your route first; return when useful.</h1><p className="lead">Mirellis does not need to observe what happens. If you return, you may reflect in your own words or leave it there.</p><ol className="route-steps">{route.map((id) => <li key={id}>{label(id)}</li>)}</ol><button className="primary-button" onClick={onReflect}>Return to reflect</button><button className="text-button" onClick={onBack}>Leave for today</button></section>;
}

function PersonalObservatory({ data, onBack, onCommit, onStatus, onDeleteAll }: { data: AppData; onBack: () => void; onCommit: (next: AppData) => void; onStatus: (message: string) => void; onDeleteAll: () => Promise<void> }) {
  const [tab, setTab] = useState<'moments' | 'cues' | 'routes' | 'review' | 'controls'>('moments');
  const [selectedId, setSelectedId] = useState<string>();
  const [cueLabel, setCueLabel] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [routeTransitionId, setRouteTransitionId] = useState(transitions[0].id);
  const [routeCueIds, setRouteCueIds] = useState<string[]>([]);
  const [routeLabel, setRouteLabel] = useState('');
  const records = sortedRecords(data);
  const selected = records.find((record) => record.id === selectedId);
  const selectedPrivateNote = selected ? noteForRecord(data, selected.id) : undefined;
  const selectedTransition = selected ? transitions.find((item) => item.id === selected.transitionId) : undefined;
  const reviewTransitionId = records[0]?.transitionId;
  const recordTitle = (record: ObservatoryRecord) => transitions.find((item) => item.id === record.transitionId)?.experiences.find((item) => item.id === record.experienceId)?.title ?? 'A past practice';
  const download = () => {
    const blob = new Blob([exportObservatory(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mirellis-personal-observatory.json';
    link.click();
    URL.revokeObjectURL(url);
  };
  const visibleCues = data.savedCues.filter((cue) => cue.transitionId === routeTransitionId);
  const toggleRouteCue = (cueId: string) => setRouteCueIds((current) => current.includes(cueId) ? current.filter((id) => id !== cueId) : current.length < 2 ? [...current, cueId] : [current[1], cueId]);

  return <section className="screen centered-content observatory-screen"><Back onClick={onBack} /><p className="eyebrow">Observe</p><h1>Your private record.</h1><p className="lead">What you chose to keep in Mirellis. Private on this device. Nothing here is a score, diagnosis, or hidden interpretation.</p><div className="observatory-tabs" aria-label="Observe sections">{([['moments', 'Practices'], ['cues', 'Saved approaches'], ['routes', 'Your approaches'], ['review', 'Review'], ['controls', 'Privacy']] as const).map(([id, label]) => <button key={id} className={tab === id ? 'tab-active' : 'tab-button'} aria-pressed={tab === id} onClick={() => { setTab(id); setSelectedId(undefined); }}>{label}</button>)}</div>
    {tab === 'moments' && <>{selected ? <article className="moment-detail"><button className="back-button" onClick={() => setSelectedId(undefined)}>← All practices</button><p className="eyebrow">One practice · {new Date(selected.occurredAtLocal).toLocaleDateString()}</p><h2>{recordTitle(selected)}</h2><p className="muted">{consumerLabelFor(selected.transitionId)} · {selected.routeType.replace('-', ' ')} approach</p>{selectedPrivateNote && <section className="card observatory-card"><strong>Private note</strong><p>{selectedPrivateNote.text}</p></section>}<label className="note-field">Add or replace a private note <span>(stored on this device · {cueLabel.length}/280)</span><textarea value={cueLabel} maxLength={280} onChange={(event) => setCueLabel(event.target.value)} placeholder="Optional. Not used for recommendations, analytics, research, or AI." /></label><div className="button-row"><button className="secondary-button" onClick={() => { const text = cueLabel.trim(); if (text) { try { onCommit(savePrivateNote(data, selected.id, text)); onStatus('Private note saved on this device.'); } catch { } } setCueLabel(''); }}>Keep private note</button><button className="secondary-button" onClick={() => { const defaultLabel = selectedTransition?.experiences.find((item) => item.id === selected.experienceId)?.title || 'This practice'; try { onCommit(createCue(data, selected, defaultLabel)); onStatus('Saved. This practice is available as an approach.'); } catch { } }}>Save as an approach</button><button className="text-button" onClick={() => { if (confirm('Delete this local practice and any approach that depends on it?')) { onCommit(removeRecord(data, selected.id)); setSelectedId(undefined); } }}>Delete this practice</button></div></article> : <>{records.length < 3 && data.savedCues.length === 0 ? <section className="card observatory-card"><h2>This is where your own record can live.</h2><p>After a few practices—or when you decide to keep a note or approach—this space will hold only what you choose.</p></section> : <div className="record-list">{records.map((record) => <button className="record-row moment-row" key={record.id} onClick={() => { setSelectedId(record.id); setCueLabel(noteForRecord(data, record.id)?.text ?? ''); }}><div><strong>{recordTitle(record)}</strong><p className="muted">{consumerLabelFor(record.transitionId)} · {new Date(record.occurredAtLocal).toLocaleDateString()}</p>{record.explicitResponse && <p className="muted">You selected: {record.explicitResponse}</p>}</div><span>Open</span></button>)}</div>}</>}</>}
    {tab === 'cues' && <><p className="muted">A cue is saved only when you choose it. Its source remains visible.</p><div className="record-list">{data.savedCues.map((cue) => { const source = records.find((record) => record.id === cue.originRecordId); return <article className="record-row curriculum-row" key={cue.id}><div><strong>{cue.label}</strong><p className="muted">You saved this after {source ? recordTitle(source) : 'a removed moment'} on {new Date(cue.createdAtLocal).toLocaleDateString()}.</p><p className="muted">{cue.suggestionState === 'hidden-by-user' ? 'Hidden from suggestions by you.' : 'Available as a user-controlled cue.'}</p></div><div className="inline-actions"><button className="text-button" onClick={() => onCommit({ ...data, savedCues: data.savedCues.map((item) => item.id === cue.id ? { ...item, suggestionState: item.suggestionState === 'available' ? 'hidden-by-user' : 'available' } : item) })}>{cue.suggestionState === 'available' ? 'Hide' : 'Restore'}</button><button className="text-button" onClick={() => onCommit(removeCue(data, cue.id))}>Delete</button></div></article>; })}{data.savedCues.length === 0 && <p className="muted">Open a kept moment to make an explicit cue from it.</p>}</div></>}
    {tab === 'routes' && <><p className="muted">Build a one- or two-practice approach. Using it without Mirellis is a complete outcome.</p><select className="transition-select" value={routeTransitionId} onChange={(event) => { setRouteTransitionId(event.target.value); setRouteCueIds([]); }} aria-label="Life moment for a saved approach">{transitions.map((item) => <option value={item.id} key={item.id}>{consumerLabelFor(item.id)}</option>)}</select><div className="route-list">{visibleCues.map((cue) => <button className={`route-choice ${routeCueIds.includes(cue.id) ? 'route-choice-selected' : ''}`} key={cue.id} onClick={() => toggleRouteCue(cue.id)}><span>{routeCueIds.includes(cue.id) ? 'Selected' : 'Choose'}</span>{cue.label}</button>)}</div><label className="note-field">Optional approach name <input value={routeLabel} maxLength={80} onChange={(event) => setRouteLabel(event.target.value)} placeholder="Only stored on this device." /></label><button className="primary-button" disabled={routeCueIds.length === 0} onClick={() => { try { onCommit(createPersonalRoute(data, routeTransitionId, routeCueIds, routeLabel)); setRouteCueIds([]); setRouteLabel(''); onStatus('Saved. Your approach is available to use without Mirellis.'); } catch { } }}>Save this approach</button><div className="record-list">{data.personalRoutes.map((route) => <article className="record-row curriculum-row" key={route.id}><div><strong>{route.label || 'My approach'}</strong><p className="muted">{consumerLabelFor(route.transitionId)} · {route.cueIds.map((id) => data.savedCues.find((cue) => cue.id === id)?.label).filter(Boolean).join(' → ')}</p></div><div className="inline-actions"><button className="text-button" onClick={() => alert('Use this approach in your own way. Mirellis does not track what happens next.')}>Use without Mirellis</button><button className="text-button" onClick={() => onCommit({ ...data, personalRoutes: data.personalRoutes.filter((item) => item.id !== route.id) })}>Delete</button></div></article>)}</div></>}
    {tab === 'review' && <><p className="lead">Review only the moments you can see. Mirellis will not generate a conclusion.</p>{records.length === 0 ? <p className="muted">Keep a moment first if you would like to review it later.</p> : <><section className="card observatory-card"><strong>What do you notice across these moments?</strong><p className="muted">A private note is optional. You can close without saving anything.</p><label className="note-field">Private review note <span>({reviewText.length}/280)</span><textarea value={reviewText} maxLength={280} onChange={(event) => setReviewText(event.target.value)} placeholder="Stays on this device. Never used for routes or interpretation." /></label><button className="secondary-button" disabled={!reviewText.trim()} onClick={() => { if (!reviewTransitionId) return; try { onCommit(createReviewNote(data, reviewTransitionId, records.filter((record) => record.transitionId === reviewTransitionId).map((record) => record.id), reviewText)); setReviewText(''); } catch { } }}>Keep this private note</button></section><div className="record-list">{data.reviewNotes.map((note) => <article className="record-row curriculum-row" key={note.id}><div><strong>Private review · {new Date(note.createdAtLocal).toLocaleDateString()}</strong><p>{note.text}</p></div><button className="text-button" onClick={() => onCommit({ ...data, reviewNotes: data.reviewNotes.filter((item) => item.id !== note.id) })}>Delete</button></article>)}</div></>}</>}
    {tab === 'controls' && <><section className="card observatory-card"><h2>Export my record</h2><p>Creates a local JSON file containing your visible practices, saved approaches, and private review notes. Nothing is uploaded.</p><button className="secondary-button" onClick={download}>Download local export</button></section><section className="card observatory-card"><h2>Reset one moment</h2><p>Select a life moment to remove its local practices, approaches, and review notes.</p><select className="transition-select" value={routeTransitionId} onChange={(event) => setRouteTransitionId(event.target.value)} aria-label="Life moment to reset">{transitions.map((item) => <option value={item.id} key={item.id}>{consumerLabelFor(item.id)}</option>)}</select><button className="secondary-button" onClick={() => { if (confirm(`Delete local data for ${consumerLabelFor(routeTransitionId)}?`)) onCommit(removeTransitionObservatoryData(data, routeTransitionId)); }}>Reset this moment</button></section><section className="card observatory-card"><h2>Delete all local data</h2><p>Removes practices, approaches, review notes, and settings from this browser.</p><button className="text-button destructive-button" onClick={() => { if (confirm('Delete all Mirellis local data from this browser?')) void onDeleteAll(); }}>Delete all local data</button></section></>}
  </section>;
}

function CurriculumRecord({ onBack }: { onBack: () => void }) {
  return <section className="screen centered-content"><Back onClick={onBack} /><p className="eyebrow">Curriculum record · V{CURRICULUM_VERSION}</p><h1>Deliberate, not automatic.</h1><p className="lead">Each active transition is versioned in the app’s curriculum source. The app does not use analytics, AI, or popularity to rewrite what it offers.</p><div className="record-list">{transitionDossiers.map((dossier) => <article className="record-row curriculum-row" key={dossier.id}><div><strong>{dossier.id} · {dossier.title}</strong><p className="muted">{dossier.experienceInventory.length} experiences · {dossier.stateMap.length} learning states</p><p className="muted">{dossier.boundary}</p></div></article>)}</div><p className="muted">Existing experience meanings remain unchanged. Any future semantic, safety, evidence, or route change requires a documented review and rollback path.</p></section>;
}

function LaunchRecord({ onBack }: { onBack: () => void }) {
  return <section className="screen centered-content"><Back onClick={onBack} /><p className="eyebrow">Launch & operations · V{LAUNCH_OPERATIONS_VERSION}</p><h1>Public use, with honest limits.</h1><p className="lead">Mirellis is a private learning tool for everyday transitions: small guided experiments that help people notice and choose a next step. It is not therapy, medical advice, crisis support, an AI companion, a social network, or a productivity score.</p><div className="record-list">{launchGates.map((gate) => <article className="record-row curriculum-row" key={gate.id}><div><strong>{gate.label}</strong><p className={`status-pill status-${gate.status}`}>{gate.status === 'ready' ? 'In the build' : 'Needs recorded verification'}</p><p className="muted">{gate.detail}</p></div></article>)}</div><section className="card launch-boundary"><h2>What stays fixed</h2><p>{operatingBoundary.accountFree ? 'No account is required for core use. ' : ''}{operatingBoundary.localFirst ? 'Choices stay local by default. ' : ''}Analytics and research remain separate optional choices.</p><p className="muted">Formal launch state: {launchState.status}. A future Version 4 decision must be evidence-bound, human-reviewed, and reversible; it cannot be driven by engagement.</p></section></section>;
}

function Brand() { return <div className="brand-mark" aria-label="Mirellis">Mirellis</div>; }
function Back({ onClick, label = 'Back' }: { onClick: () => void; label?: string }) { return <button className="back-button" onClick={onClick}>← {label}</button>; }
function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) { return <button className="toggle" aria-pressed={active} onClick={onClick}>{active ? 'On' : 'Off'}</button>; }
function ChoiceGrid({ options, onSelect }: { options: string[]; onSelect: (option: string) => void }) { return <div className="choice-grid">{options.map((option) => <button key={option} className="choice-card" onClick={() => onSelect(option)}>{option}</button>)}</div>; }
