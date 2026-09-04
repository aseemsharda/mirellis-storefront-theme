'use client';

import { useEffect, useMemo, useState } from 'react';
import { MirellisBrand } from '@/components/MirellisBrand';
import { deleteData, loadData, saveData } from '@/lib/local-store';
import { createCue, noteForRecord, sortedRecords } from '@/lib/observatory';
import { afterWorkDestination, assertRouteEngineIntegrity, routeFor, routes, stillness, type Route } from '@/lib/route-engine';
import { initialData, type AppData, type ObservatoryRecord, type TransitionOutcome } from '@/lib/types';

type View = 'today' | 'recognition' | 'recommendation' | 'practice' | 'checkin' | 'complete' | 'observatory' | 'settings' | 'help';

const outcomeOptions: { label: string; value: TransitionOutcome }[] = [
  { label: 'I have a little more room.', value: 'enough' },
  { label: 'Partly enough for today.', value: 'partly' },
  { label: 'This approach did not fit today.', value: 'different' },
  { label: 'Nothing yet.', value: 'nothing-yet' },
];

const pilotExperience = {
  id: 'after-work-pilot-v1',
  curriculumVersion: '1.0.0',
};

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
  const [routeId, setRouteId] = useState<Route['id']>('open-loop');
  const [stepIndex, setStepIndex] = useState(0);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [lastOutcome, setLastOutcome] = useState<TransitionOutcome>();
  const [lastRecord, setLastRecord] = useState<ObservatoryRecord>();
  const [excludedRouteId, setExcludedRouteId] = useState<Route['id']>();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const route = routeFor(routeId);
  const activeAttempt = data.attempt;
  const currentStep = route.steps[stepIndex] ?? route.steps[0];
  const records = useMemo(() => sortedRecords(data).filter((record) => data.savedCues.some((cue) => cue.originRecordId === record.id)), [data]);
  const savedRoute = useMemo(() => {
    const cue = data.savedCues.slice().reverse().find((item) => routeForSavedCue(item.label));
    return routeForSavedCue(cue?.label);
  }, [data.savedCues]);
  const savedThisPractice = lastRecord ? data.savedCues.some((cue) => cue.originRecordId === lastRecord.id) : false;

  useEffect(() => {
    loadData().then((stored) => {
      setData(stored);
      setReady(true);
      if (!stored.attempt || !routes.some((item) => item.id === stored.attempt?.entryId)) return;
      setRouteId(stored.attempt.entryId as Route['id']);
      setStepIndex(Math.min(stored.attempt.stepIndex ?? 0, routeFor(stored.attempt.entryId).steps.length - 1));
      setNote(stored.attempt.note ?? '');
    });
  }, []);

  const commit = (next: AppData) => {
    setData(next);
    void saveData(next);
  };

  const chooseRoute = (nextRoute: Route) => {
    setRouteId(nextRoute.id);
    setStepIndex(0);
    setNote('');
    setLastRecord(undefined);
    setLastOutcome(undefined);
    setExcludedRouteId(undefined);
    setView('recommendation');
  };

  const startPractice = () => {
    setStepIndex(0);
    commit({
      ...data,
      safetyAcknowledged: true,
      attempt: {
        transitionId: afterWorkDestination.id,
        experienceId: pilotExperience.id,
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
    if (!activeAttempt || !routes.some((item) => item.id === activeAttempt.entryId)) return;
    const resumedRoute = routeFor(activeAttempt.entryId);
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
    if (!data.attempt) return;
    commit({ ...data, attempt: undefined });
    setLastOutcome(outcome);
    setLastRecord(undefined);
    setStatus(outcome === 'enough' || outcome === 'partly' ? 'Nothing has been saved. You can choose whether to keep this practice.' : 'Nothing was saved.');
    setView('complete');
  };

  const keepForTomorrow = () => {
    if (lastOutcome !== 'enough' && lastOutcome !== 'partly') return;
    const record: ObservatoryRecord = {
      id: `record-${crypto.randomUUID()}`,
      transitionId: afterWorkDestination.id,
      experienceId: pilotExperience.id,
      curriculumVersion: pilotExperience.curriculumVersion,
      occurredAtLocal: new Date().toISOString(),
      routeType: 'primary',
      explicitResponse: `${route.label} · ${lastOutcome}`,
      policyVersion: 'v2.2',
    };
    const withRecord: AppData = {
      ...data,
      completed: { ...data.completed, [progressKey(afterWorkDestination.id, pilotExperience.id)]: 'guided' },
      observatoryRecords: [...data.observatoryRecords, record],
      privateNotes: note.trim()
        ? [...data.privateNotes, { id: `note-${crypto.randomUUID()}`, linkedRecordId: record.id, createdAtLocal: new Date().toISOString(), text: note.trim(), source: 'local' }]
        : data.privateNotes,
    };
    commit(createCue(withRecord, record, route.label));
    setLastRecord(record);
    setStatus('Saved. Tomorrow’s suggestion will build on this practice.');
  };

  if (!ready) return <main className="app-shell"><p className="quiet-loading">Opening your private space…</p></main>;

  return <main className={`app-shell ${data.reducedMotion ? 'motion-reduced' : ''}`}>
    <p className="sr-status" role="status" aria-live="polite">{status}</p>

    {view === 'today' && <TodayScreen
      activeRoute={activeAttempt && routes.some((item) => item.id === activeAttempt.entryId) ? routeFor(activeAttempt.entryId) : undefined}
      savedRoute={savedRoute}
      onResume={resume}
      onChooseAfterWork={() => setView('recognition')}
      onChooseSavedRoute={chooseRoute}
      onRecord={() => setView('observatory')}
      onSettings={() => setView('settings')}
    />}

    {view === 'recognition' && <section className="screen ritual-screen">
      <Header destination="After work" onHome={() => setView('today')} onSettings={() => setView('settings')} />
      <div className="ritual-copy context-copy">
        <p className="eyebrow">Today</p>
        <h1>{afterWorkDestination.question}</h1>
        <p className="lead">Choose the closest sentence. It changes the first practice you receive.</p>
        <div className="choice-grid">{routes.filter((item) => item.id !== excludedRouteId).map((item) => <button className="choice-card" key={item.id} onClick={() => chooseRoute(item)}>{item.label}</button>)}</div>
        <button className="text-button" onClick={leaveForNow}>Leave for now</button>
      </div>
    </section>}

    {view === 'recommendation' && <section className="screen ritual-screen orientation-screen">
      <Header destination="After work" onHome={leaveForNow} onSettings={() => setView('settings')} />
      <div className="ritual-copy orientation-copy">
        <p className="eyebrow">A private practice</p>
        <h1>After work.</h1>
        <p className="orientation-acknowledgement">{route.acknowledgement}</p>
        <p className="lead">{route.promise}</p>
        <p className="session-time">About ten minutes. You can leave and return at any point.</p>
        <button className="primary-button" onClick={startPractice}>Start this practice</button>
        <button className="text-button" onClick={leaveForNow}>Leave for now</button>
      </div>
    </section>}

    {view === 'practice' && <section className="screen ritual-screen guide-screen">
      <Header destination="After work" onHome={leaveForNow} onSettings={() => setView('settings')} />
      <div className="guide-progress" role="progressbar" aria-label="Practice step" aria-valuemin={1} aria-valuemax={route.steps.length} aria-valuenow={stepIndex + 1}><span style={{ width: `${((stepIndex + 1) / route.steps.length) * 100}%` }} /></div>
      <div className={`ritual-copy guide-copy ${currentStep.kind === 'quiet' ? 'quiet-copy' : ''}`}>
        <p className="eyebrow">{currentStep.duration}</p>
        <h1>{currentStep.title}</h1>
        <p className="practice-cue">{currentStep.body}</p>
        <p className="guide-action">{currentStep.action}</p>
        {currentStep.kind === 'quiet' && <aside className="support-card"><p className="eyebrow">Optional sound</p><strong>{stillness.label}</strong><p>{stillness.description}</p><a className="support-link" href={stillness.href} target="_blank" rel="noreferrer" onClick={() => setStatus('Stillness opened in a new tab. Nothing was saved.')}>Listen in Spotify <span aria-hidden="true">↗</span></a></aside>}
        <button className="primary-button" onClick={advancePractice}>{currentStep.completion}</button>
        <button className="text-button" onClick={leaveForNow}>Leave for now</button>
      </div>
    </section>}

    {view === 'checkin' && <section className="screen ritual-screen">
      <Header destination="After work" onHome={leaveForNow} onSettings={() => setView('settings')} />
      <div className="ritual-copy reflection-copy">
        <p className="eyebrow">After the practice</p>
        <h1>What is true now, if anything?</h1>
        <p className="lead">There is no correct result. Mirellis does not turn your response into a score.</p>
        <div className="choice-grid">{outcomeOptions.map((option) => <button className="choice-card" key={option.value} onClick={() => resolve(option.value)}>{option.label}</button>)}</div>
        <label className="note-field">A private note, if you want one <span>({note.length}/280)</span><textarea value={note} maxLength={280} onChange={(event) => setNote(event.target.value)} placeholder="Stored only on this device. Mirellis does not use it to interpret you." /></label>
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
        {lastOutcome === 'different' && <button className="secondary-button" onClick={() => { setExcludedRouteId(route.id); setView('recognition'); }}>Choose another approach</button>}
        {(lastOutcome === 'enough' || lastOutcome === 'partly') && !savedThisPractice && <button className="secondary-button" onClick={keepForTomorrow}>Keep this practice for tomorrow</button>}
        {savedThisPractice && <p className="saved-confirmation">Saved. Tomorrow’s suggestion will build on this practice.</p>}
        {savedThisPractice && <button className="text-button" onClick={() => setView('observatory')}>Open Personal Observatory</button>}
      </div>
    </section>}

    {view === 'observatory' && <section className="screen ritual-screen">
      <Header destination="Personal Observatory" onHome={() => setView('today')} onSettings={() => setView('settings')} />
      <div className="ritual-copy observatory-copy">
        <p className="eyebrow">Private and local</p>
        <h1>Your private record.</h1>
        <p className="lead">Only practices you deliberately kept appear here. Nothing is a score, diagnosis, or hidden interpretation.</p>
        {records.length === 0 ? <section className="empty-state"><p>Complete one practice to build a route you can use without Mirellis.</p></section> : <div className="record-list">{records.map((record) => <article className="record-row" key={record.id}><div><strong>{record.explicitResponse?.split(' · ')[0] ?? 'After work'}</strong><p>After work · {new Date(record.occurredAtLocal).toLocaleDateString()}</p>{noteForRecord(data, record.id) && <p className="record-note">Private note kept</p>}<p className="record-note">Kept for tomorrow</p></div><span>Saved</span></article>)}</div>}
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
        <section className="setting-row"><div><h2>Delete local data</h2><p>This removes your kept practices and private notes from this browser.</p></div><button className="secondary-button" onClick={() => setConfirmDelete(true)}>Delete</button></section>
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
  return <header className="topbar"><button className="wordmark" onClick={onHome} aria-label="Return to Mirellis today"><MirellisBrand /></button><span className="destination">{destination}</span>{onSettings && <button className="header-settings" onClick={onSettings}>Settings</button>}</header>;
}

function TodayScreen({ activeRoute, savedRoute, onResume, onChooseAfterWork, onChooseSavedRoute, onRecord, onSettings }: {
  activeRoute?: Route;
  savedRoute?: Route;
  onResume: () => void;
  onChooseAfterWork: () => void;
  onChooseSavedRoute: (route: Route) => void;
  onRecord: () => void;
  onSettings: () => void;
}) {
  return <section className="screen threshold-screen">
    <div className="threshold-image" role="img" aria-label="Late afternoon light falling across a quiet desk by a window">
      <header className="threshold-header"><span className="threshold-wordmark"><MirellisBrand label="Mirellis" /></span><span>Today</span></header>
    </div>
    <div className="threshold-copy">
      <p className="eyebrow">A private practice companion. No account required.</p>
      <h1>What brings you here today?</h1>
      <div className="gold-rule" aria-hidden="true" />
      {activeRoute ? <section className="resume-line"><p>Your place is kept: <strong>{activeRoute.label}</strong></p><button className="primary-button" onClick={onResume}>Return when it is useful</button></section> : savedRoute ? <section className="resume-line"><p>You kept this practice: <strong>{savedRoute.label}</strong></p><button className="primary-button" onClick={() => onChooseSavedRoute(savedRoute)}>Return to this practice</button></section> : <section className="today-entry"><p>When work has ended but work is still with you, begin here.</p><button className="primary-button" onClick={onChooseAfterWork}>{afterWorkDestination.todayLabel}</button></section>}
      <footer className="threshold-footer"><button className="footer-button" onClick={onRecord}>Personal Observatory</button><span aria-hidden="true">·</span><button className="footer-button" onClick={onSettings}>Settings</button></footer>
    </div>
  </section>;
}
