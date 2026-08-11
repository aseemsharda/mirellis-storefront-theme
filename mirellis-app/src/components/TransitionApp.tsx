'use client';

import { useEffect, useMemo, useState } from 'react';
import { v1Transitions } from '@/lib/v1-transition-model';
import { deleteData, loadData, saveData } from '@/lib/local-store';
import { createCue, noteForRecord, sortedRecords } from '@/lib/observatory';
import { assertRouteEngineIntegrity, destinationFor, destinations, routeFor, routes, routesFor, type Route } from '@/lib/route-engine';
import { initialData, type AppData, type ObservatoryRecord, type TransitionOutcome } from '@/lib/types';

type View = 'today' | 'routes' | 'recommendation' | 'practice' | 'checkin' | 'complete' | 'explore' | 'observatory' | 'settings' | 'help';

const outcomeOptions: { label: string; value: TransitionOutcome }[] = [
  { label: 'I have a little more room.', value: 'enough' },
  { label: 'Partly enough for today.', value: 'partly' },
  { label: 'This approach did not fit today.', value: 'different' },
  { label: 'Nothing yet.', value: 'nothing-yet' },
];

assertRouteEngineIntegrity();

function progressKey(transitionId: string, experienceId: string) {
  return `${transitionId}:${experienceId}`;
}

function routeForSavedCue(label?: string) {
  return routes.find((route) => route.label === label);
}

export function TransitionApp() {
  const [data, setData] = useState<AppData>(initialData);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>('today');
  const [destinationId, setDestinationId] = useState(destinations[0].id);
  const [routeId, setRouteId] = useState(routes[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [lastRecord, setLastRecord] = useState<ObservatoryRecord>();
  const [lastOutcome, setLastOutcome] = useState<TransitionOutcome>();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const route = routeFor(routeId);
  const destination = destinationFor(destinationId);
  const activeAttempt = data.attempt;
  const currentStep = route.steps[stepIndex] ?? route.steps[0];
  const support = stepIndex === route.steps.length - 1 ? route.support : undefined;
  const records = useMemo(() => sortedRecords(data), [data]);
  const savedRoute = useMemo(() => {
    const cue = data.savedCues.slice().reverse().find((item) => routeForSavedCue(item.label));
    return routeForSavedCue(cue?.label);
  }, [data.savedCues]);
  const savedThisPractice = lastRecord ? data.savedCues.some((cue) => cue.originRecordId === lastRecord.id) : false;

  useEffect(() => {
    loadData().then((stored) => {
      setData(stored);
      setReady(true);
      const resumedRoute = routeFor(stored.attempt?.entryId);
      if (!stored.attempt || !routes.some((item) => item.id === stored.attempt?.entryId)) return;
      setDestinationId(resumedRoute.transitionId);
      setRouteId(resumedRoute.id);
      setStepIndex(Math.min(stored.attempt.stepIndex ?? 0, resumedRoute.steps.length - 1));
      setNote(stored.attempt.note ?? '');
    });
  }, []);

  const commit = (next: AppData) => {
    setData(next);
    void saveData(next);
  };

  const chooseDestination = (id: typeof destinationId) => {
    setDestinationId(id);
    setView('routes');
  };

  const chooseRoute = (nextRoute: Route) => {
    setDestinationId(nextRoute.transitionId);
    setRouteId(nextRoute.id);
    setStepIndex(0);
    setNote('');
    setLastRecord(undefined);
    setLastOutcome(undefined);
    setView('recommendation');
  };

  const startPractice = () => {
    const transition = v1Transitions.find((item) => item.id === route.transitionId) ?? v1Transitions[0];
    const experience = transition.experiences[0];
    setStepIndex(0);
    commit({
      ...data,
      safetyAcknowledged: true,
      attempt: {
        transitionId: route.transitionId,
        experienceId: experience.id,
        currentStep: 'guided',
        entryId: route.id,
        stepIndex: 0,
        routeType: 'guided',
        startedAt: new Date().toISOString(),
      },
    });
    setView('practice');
  };

  const advancePractice = () => {
    if (!activeAttempt) return;
    if (stepIndex >= route.steps.length - 1) {
      commit({ ...data, attempt: { ...activeAttempt, currentStep: 'outcome', stepIndex, note } });
      setView('checkin');
      return;
    }
    const nextIndex = stepIndex + 1;
    setStepIndex(nextIndex);
    commit({ ...data, attempt: { ...activeAttempt, currentStep: 'guided', stepIndex: nextIndex, note } });
  };

  const resume = () => {
    if (!activeAttempt) return;
    const resumedRoute = routeFor(activeAttempt.entryId);
    setDestinationId(resumedRoute.transitionId);
    setRouteId(resumedRoute.id);
    setStepIndex(Math.min(activeAttempt.stepIndex ?? 0, resumedRoute.steps.length - 1));
    setNote(activeAttempt.note ?? '');
    setView(activeAttempt.currentStep === 'outcome' || activeAttempt.currentStep === 'reflect' ? 'checkin' : 'practice');
  };

  const leaveForNow = () => {
    setStatus('Your place is kept on this device. Return when it is useful.');
    setView('today');
  };

  const resolve = (outcome: TransitionOutcome) => {
    const attempt = data.attempt;
    if (!attempt) return;
    let record: ObservatoryRecord | undefined;
    let next = { ...data, attempt: undefined as AppData['attempt'] };
    if (outcome === 'enough' || outcome === 'partly') {
      const transition = v1Transitions.find((item) => item.id === route.transitionId) ?? v1Transitions[0];
      const experience = transition.experiences[0];
      record = {
        id: `record-${crypto.randomUUID()}`,
        transitionId: route.transitionId,
        experienceId: experience.id,
        curriculumVersion: experience.semanticVersion,
        occurredAtLocal: new Date().toISOString(),
        routeType: 'primary',
        explicitResponse: `${route.label} · ${outcome}`,
        policyVersion: 'v2.2',
      };
      next = {
        ...next,
        completed: { ...next.completed, [progressKey(route.transitionId, experience.id)]: 'guided' },
        observatoryRecords: [...next.observatoryRecords, record],
        privateNotes: note.trim()
          ? [...next.privateNotes, { id: `note-${crypto.randomUUID()}`, linkedRecordId: record.id, createdAtLocal: new Date().toISOString(), text: note.trim(), source: 'local' }]
          : next.privateNotes,
      };
    }
    commit(next);
    setLastRecord(record);
    setLastOutcome(outcome);
    setStatus(record ? 'Completed. Your explicit response is stored only on this device.' : 'Nothing was saved.');
    setView('complete');
  };

  const keepForTomorrow = () => {
    if (!lastRecord) return;
    commit(createCue(data, lastRecord, route.label));
    setStatus('Saved. Tomorrow’s suggestion will build on this practice.');
  };

  if (!ready) return <main className="app-shell"><p className="quiet-loading">Opening your private space…</p></main>;

  return <main className={`app-shell ${data.reducedMotion ? 'motion-reduced' : ''}`}>
    <p className="sr-status" role="status" aria-live="polite">{status}</p>

    {view === 'today' && <TodayScreen
      activeRoute={activeAttempt ? routeFor(activeAttempt.entryId) : undefined}
      savedRoute={savedRoute}
      onResume={resume}
      onChooseDestination={chooseDestination}
      onChooseSavedRoute={chooseRoute}
      onExplore={() => setView('explore')}
      onRecord={() => setView('observatory')}
      onSettings={() => setView('settings')}
    />}

    {view === 'routes' && <section className="screen ritual-screen">
      <Header destination={destination.label} onHome={() => setView('today')} onSettings={() => setView('settings')} />
      <div className="ritual-copy context-copy">
        <p className="eyebrow">Today</p>
        <h1>{destination.question}</h1>
        <p className="lead">Choose the closest sentence. It changes the practice you receive.</p>
        <div className="choice-grid">{routesFor(destination.id).map((item) => <button className="choice-card" key={item.id} onClick={() => chooseRoute(item)}>{item.label}</button>)}</div>
        <button className="text-button" onClick={leaveForNow}>Leave for now</button>
      </div>
    </section>}

    {view === 'recommendation' && <section className="screen ritual-screen orientation-screen">
      <Header destination={route.destination} onHome={leaveForNow} onSettings={() => setView('settings')} />
      <div className="ritual-copy orientation-copy">
        <p className="eyebrow">A guided practice</p>
        <h1>{route.destination}</h1>
        <p className="orientation-acknowledgement">{route.acknowledgement}</p>
        <p className="lead">{route.promise}</p>
        <button className="primary-button" onClick={startPractice}>Start this practice</button>
        <button className="text-button" onClick={leaveForNow}>Leave for now</button>
      </div>
    </section>}

    {view === 'practice' && <section className="screen ritual-screen guide-screen">
      <Header destination={route.destination} onHome={leaveForNow} onSettings={() => setView('settings')} />
      <div className="guide-progress" role="progressbar" aria-label="Practice progress" aria-valuemin={1} aria-valuemax={route.steps.length} aria-valuenow={stepIndex + 1}><span style={{ width: `${((stepIndex + 1) / route.steps.length) * 100}%` }} /></div>
      <div className="ritual-copy guide-copy">
        <p className="eyebrow">{currentStep.duration}</p>
        <h1>{currentStep.title}</h1>
        <p className="practice-cue">{currentStep.body}</p>
        <p className="guide-action">{currentStep.action}</p>
        {support && <aside className="support-card"><p className="eyebrow">Optional support</p><strong>{support.label}</strong><p>{support.description}</p><a className="support-link" href={support.href} target="_blank" rel="noreferrer" onClick={() => setStatus(`${support.label} opened in a new tab. Nothing is saved.`)}>{support.kind === 'listen' ? 'Listen in Spotify' : 'Open resource'} <span aria-hidden="true">↗</span></a></aside>}
        <button className="primary-button" onClick={advancePractice}>{stepIndex === route.steps.length - 1 ? 'I am ready to check in' : currentStep.completion}</button>
        <button className="text-button" onClick={leaveForNow}>Leave for now</button>
      </div>
    </section>}

    {view === 'checkin' && <section className="screen ritual-screen">
      <Header destination="Check-in" onHome={leaveForNow} onSettings={() => setView('settings')} />
      <div className="ritual-copy reflection-copy">
        <p className="eyebrow">After the practice</p>
        <h1>What is true now, if anything?</h1>
        <p className="lead">There is no correct result. Your response is not a score and is never interpreted for you.</p>
        <div className="choice-grid">{outcomeOptions.map((option) => <button className="choice-card" key={option.value} onClick={() => resolve(option.value)}>{option.label}</button>)}</div>
        <label className="note-field">A private note, if you want one <span>({note.length}/280)</span><textarea value={note} maxLength={280} onChange={(event) => setNote(event.target.value)} placeholder="Stored only on this device. Not used to interpret you." /></label>
        <button className="text-button" onClick={leaveForNow}>Leave for now</button>
      </div>
    </section>}

    {view === 'complete' && <section className="screen ritual-screen completion-screen">
      <Header destination="Today" onHome={() => setView('today')} onSettings={() => setView('settings')} />
      <div className="ritual-copy completion-copy">
        <p className="eyebrow">For now</p>
        <h1>You made a first choice.</h1>
        <p className="lead">That is enough for today.</p>
        {lastOutcome === 'different' && <p className="completion-detail">This approach did not fit today. You can choose another approach, or simply leave it here.</p>}
        {lastOutcome === 'nothing-yet' && <p className="completion-detail">Nothing has to shift for this to have been a real pause.</p>}
        <button className="primary-button" onClick={() => setView('today')}>Back to today</button>
        {lastOutcome === 'different' && <button className="secondary-button" onClick={() => setView('routes')}>Choose another approach</button>}
        {lastRecord && !savedThisPractice && <button className="secondary-button" onClick={keepForTomorrow}>Keep this practice for tomorrow</button>}
        {savedThisPractice && <p className="saved-confirmation">Saved. Tomorrow’s suggestion will build on this practice.</p>}
        {lastRecord && <button className="text-button" onClick={() => setView('observatory')}>Open Personal Observatory</button>}
      </div>
    </section>}

    {view === 'explore' && <section className="screen ritual-screen">
      <Header destination="Explore moments" onHome={() => setView('today')} onSettings={() => setView('settings')} />
      <div className="ritual-copy explore-copy">
        <p className="eyebrow">Explore other moments</p>
        <h1>Choose the moment that fits.</h1>
        <p className="lead">You do not need to know the product model to begin.</p>
        <div className="moment-list">{destinations.map((item) => <button className="moment-row" key={item.id} onClick={() => chooseDestination(item.id)}><span>{item.label}</span><strong>See what might help</strong><small>{item.description}</small></button>)}</div>
        <button className="text-button" onClick={() => setView('today')}>Back to today</button>
      </div>
    </section>}

    {view === 'observatory' && <section className="screen ritual-screen">
      <Header destination="Personal Observatory" onHome={() => setView('today')} onSettings={() => setView('settings')} />
      <div className="ritual-copy observatory-copy">
        <p className="eyebrow">Private and local</p>
        <h1>Your Personal Observatory.</h1>
        <p className="lead">Only completed or deliberately saved practices appear here. Nothing is a score, diagnosis, or hidden interpretation.</p>
        {records.length === 0 ? <section className="empty-state"><p>Complete one practice to build a route you can use without Mirellis.</p></section> : <div className="record-list">{records.map((record) => <article className="record-row" key={record.id}><div><strong>{record.explicitResponse?.split(' · ')[0] ?? destinationFor(record.transitionId).label}</strong><p>{destinationFor(record.transitionId).label} · {new Date(record.occurredAtLocal).toLocaleDateString()}</p>{noteForRecord(data, record.id) && <p className="record-note">Private note kept</p>}{data.savedCues.some((cue) => cue.originRecordId === record.id) && <p className="record-note">Kept for tomorrow</p>}</div><span>Completed</span></article>)}</div>}
        <button className="text-button" onClick={() => setView('today')}>Back to today</button>
      </div>
    </section>}

    {view === 'settings' && <section className="screen ritual-screen">
      <Header destination="Settings" onHome={() => setView('today')} />
      <div className="ritual-copy settings-copy">
        <p className="eyebrow">Control</p>
        <h1>Your local experience.</h1>
        <p className="lead">No account is required. Your choices remain in this browser.</p>
        <section className="setting-row"><div><h2>Reduce motion</h2><p>Show changes without animated transitions.</p></div><button className="toggle" aria-pressed={data.reducedMotion} onClick={() => commit({ ...data, reducedMotion: !data.reducedMotion })}>{data.reducedMotion ? 'On' : 'Off'}</button></section>
        <section className="setting-row"><div><h2>Analytics</h2><p>Analytics are not active in this build.</p></div></section>
        <section className="setting-row"><div><h2>Delete local data</h2><p>This removes your practices, saved routes, and private notes from this browser.</p></div><button className="secondary-button" onClick={() => setConfirmDelete(true)}>Delete</button></section>
        {confirmDelete && <section className="delete-confirmation" role="alertdialog" aria-modal="false" aria-labelledby="delete-title"><h2 id="delete-title">Delete all local data?</h2><p>This cannot be undone. You can cancel and keep everything as it is.</p><div className="button-row"><button className="secondary-button" onClick={() => setConfirmDelete(false)}>Cancel</button><button className="text-button destructive-button" onClick={async () => { await deleteData(); setData(initialData); setConfirmDelete(false); setStatus('Local data deleted.'); setView('today'); }}>Delete all local data</button></div></section>}
        <button className="text-button" onClick={() => setView('help')}>Help and boundaries</button>
      </div>
    </section>}

    {view === 'help' && <section className="screen ritual-screen">
      <Header destination="Help" onHome={() => setView('settings')} onSettings={() => setView('settings')} />
      <div className="ritual-copy help-copy"><p className="eyebrow">Help and boundaries</p><h1>Attend to what needs you first.</h1><p className="lead">Mirellis is for ordinary moments. It does not assess you or provide medical, emergency, clinical, or crisis support. You are free to leave whenever something else needs you.</p><button className="primary-button" onClick={() => setView('today')}>Back to today</button></div>
    </section>}
  </main>;
}

function Header({ destination, onHome, onSettings }: { destination: string; onHome: () => void; onSettings?: () => void }) {
  return <header className="topbar"><button className="wordmark" onClick={onHome} aria-label="Return to Mirellis today">MIRELLIS</button><span className="destination">{destination}</span>{onSettings && <button className="header-settings" onClick={onSettings}>Settings</button>}</header>;
}

function TodayScreen({ activeRoute, savedRoute, onResume, onChooseDestination, onChooseSavedRoute, onExplore, onRecord, onSettings }: {
  activeRoute?: Route;
  savedRoute?: Route;
  onResume: () => void;
  onChooseDestination: (id: typeof destinations[number]['id']) => void;
  onChooseSavedRoute: (route: Route) => void;
  onExplore: () => void;
  onRecord: () => void;
  onSettings: () => void;
}) {
  return <section className="screen threshold-screen">
    <div className="threshold-image" role="img" aria-label="Late afternoon light falling across a quiet desk by a window">
      <header className="threshold-header"><span className="threshold-wordmark">MIRELLIS</span><span>Today</span></header>
    </div>
    <div className="threshold-copy">
      <p className="eyebrow">A private practice companion</p>
      <h1>What brings you here today?</h1>
      <div className="gold-rule" aria-hidden="true" />
      {activeRoute ? <section className="resume-line"><p>Your practice is ready to resume: <strong>{activeRoute.label}</strong></p><button className="primary-button" onClick={onResume}>Resume where you left off</button></section> : savedRoute ? <section className="resume-line"><p>You chose this approach before: <strong>{savedRoute.label}</strong></p><button className="primary-button" onClick={() => onChooseSavedRoute(savedRoute)}>Return to this practice</button></section> : <div className="today-choices">{destinations.map((item) => <button key={item.id} className="today-choice" onClick={() => onChooseDestination(item.id)}>{item.todayLabel}</button>)}</div>}
      <button className="text-button" onClick={onExplore}>Explore other moments</button>
      <footer className="threshold-footer"><button className="footer-button" onClick={onRecord}>Personal Observatory</button><span aria-hidden="true">·</span><button className="footer-button" onClick={onSettings}>Settings</button></footer>
    </div>
  </section>;
}
