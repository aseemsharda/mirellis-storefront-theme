'use client';

import { useEffect, useMemo, useState } from 'react';
import { v1Transitions as transitions } from '@/lib/v1-transition-model';
import { deleteData, loadData, saveData } from '@/lib/local-store';
import { createCue, noteForRecord, routeTypeForRecord, sortedRecords } from '@/lib/observatory';
import { assertProductExperienceIntegrity, consumerLabelFor, consumerMoments } from '@/lib/product-experience';
import { isRecoveryEntryId, workRecoveryProtocolFor, workRecoveryProtocols } from '@/lib/work-recovery-protocol';
import { initialData, type AppData, type Attempt, type Experience, type ObservatoryRecord, type Transition, type TransitionOutcome } from '@/lib/types';

type View = 'today' | 'context' | 'orientation' | 'guide' | 'outcome' | 'follow-on' | 'complete' | 'explore' | 'observatory' | 'settings' | 'help';

const outcomeOptions: { label: string; value: TransitionOutcome }[] = [
  { label: 'I have a little more room.', value: 'enough' },
  { label: 'Something shifted, but I need a little longer.', value: 'partly' },
  { label: 'This approach did not fit today.', value: 'different' },
  { label: 'Nothing yet.', value: 'nothing-yet' },
];

assertProductExperienceIntegrity();

function progressKey(transitionId: string, experienceId: string) {
  return `${transitionId}:${experienceId}`;
}

function experienceFor(transition: Transition, id?: string): Experience {
  return transition.experiences.find((item) => item.id === id) ?? transition.experiences[0];
}

function entryForAttempt(attempt?: Attempt) {
  return workRecoveryProtocolFor(isRecoveryEntryId(attempt?.entryId) ? attempt.entryId : undefined);
}

function outcomeCopy(outcome?: TransitionOutcome) {
  if (outcome === 'enough') return { heading: 'The workday has an ending now.', body: 'You marked what could wait and chose what comes next. Leave the app and let the evening begin.', primary: 'Leave for your evening' };
  if (outcome === 'partly') return { heading: 'You chose what comes next.', body: 'You completed the transition and gave the evening one more protected moment.', primary: 'Leave for your evening' };
  if (outcome === 'different') return { heading: 'This approach did not fit today.', body: 'That is useful to know. You can choose another way of ending work, or leave without forcing it.', primary: 'Choose another approach' };
  return { heading: 'Nothing needs to be settled right now.', body: 'You can leave this here without trying to manufacture a result.', primary: 'Leave for now' };
}

export function TransitionApp() {
  const recovery = useMemo(() => transitions.find((item) => item.id === 'focus-recovery') ?? transitions[0], []);
  const [data, setData] = useState<AppData>(initialData);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>('today');
  const [transitionId, setTransitionId] = useState(recovery.id);
  const [experienceId, setExperienceId] = useState(recovery.experiences[0].id);
  const [entryId, setEntryId] = useState(workRecoveryProtocols[0].id);
  const [stepIndex, setStepIndex] = useState(0);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [lastRecord, setLastRecord] = useState<ObservatoryRecord>();
  const [lastOutcome, setLastOutcome] = useState<TransitionOutcome>();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const transition = useMemo(() => transitions.find((item) => item.id === transitionId) ?? recovery, [recovery, transitionId]);
  const experience = useMemo(() => experienceFor(transition, experienceId), [experienceId, transition]);
  const activeAttempt = data.attempt;
  const protocol = workRecoveryProtocolFor(entryId);
  const currentStep = protocol.steps[stepIndex] ?? protocol.steps[0];
  const records = useMemo(() => sortedRecords(data), [data]);
  const savedThisPractice = lastRecord ? data.savedCues.some((cue) => cue.originRecordId === lastRecord.id) : false;

  useEffect(() => {
    loadData().then((stored) => {
      setData(stored);
      setReady(true);
      if (!stored.attempt) return;
      const resumedTransition = transitions.find((item) => item.id === stored.attempt?.transitionId) ?? recovery;
      setTransitionId(resumedTransition.id);
      setExperienceId(stored.attempt.experienceId);
      const resumedProtocol = entryForAttempt(stored.attempt);
      setEntryId(resumedProtocol.id);
      setStepIndex(Math.min(stored.attempt.stepIndex ?? 0, resumedProtocol.steps.length - 1));
      setNote(stored.attempt.note ?? '');
    });
  }, [recovery]);

  const commit = (next: AppData) => {
    setData(next);
    void saveData(next);
  };

  const begin = (nextEntryId: typeof entryId) => {
    const targetExperience = recovery.experiences[0];
    setTransitionId(recovery.id);
    setExperienceId(targetExperience.id);
    setEntryId(nextEntryId);
    setStepIndex(0);
    setNote('');
    setLastRecord(undefined);
    setLastOutcome(undefined);
    commit({
      ...data,
      safetyAcknowledged: true,
      attempt: {
        transitionId: recovery.id,
        experienceId: targetExperience.id,
        currentStep: 'orientation',
        entryId: nextEntryId,
        stepIndex: 0,
        routeType: 'guided',
        startedAt: new Date().toISOString(),
      },
    });
    setView('orientation');
  };

  const startGuidance = () => {
    if (!activeAttempt) return;
    const attempt = { ...activeAttempt, currentStep: 'guided' as const, stepIndex: 0 };
    commit({ ...data, attempt });
    setStepIndex(0);
    setView('guide');
  };

  const advanceGuidance = () => {
    if (!activeAttempt) return;
    if (stepIndex >= protocol.steps.length - 1) {
      const attempt = { ...activeAttempt, currentStep: 'outcome' as const, stepIndex, note };
      commit({ ...data, attempt });
      setView('outcome');
      return;
    }
    const nextStepIndex = stepIndex + 1;
    const attempt = { ...activeAttempt, currentStep: 'guided' as const, stepIndex: nextStepIndex, note };
    commit({ ...data, attempt });
    setStepIndex(nextStepIndex);
  };

  const resume = () => {
    if (!activeAttempt) return;
    const resumedProtocol = entryForAttempt(activeAttempt);
    setEntryId(resumedProtocol.id);
    setStepIndex(Math.min(activeAttempt.stepIndex ?? 0, resumedProtocol.steps.length - 1));
    setNote(activeAttempt.note ?? '');
    if (activeAttempt.currentStep === 'orientation' || activeAttempt.currentStep === 'choice' || activeAttempt.currentStep === 'preview') setView('orientation');
    else if (activeAttempt.currentStep === 'outcome' || activeAttempt.currentStep === 'reflect') setView('outcome');
    else if (activeAttempt.currentStep === 'follow-on') setView('follow-on');
    else setView('guide');
  };

  const leaveForNow = () => {
    setStatus('Your place is kept on this device. Return when it is useful.');
    setView('today');
  };

  const resolve = (outcome: TransitionOutcome) => {
    const attempt = data.attempt;
    if (!attempt) return;
    const record: ObservatoryRecord = {
      id: `record-${crypto.randomUUID()}`,
      transitionId: transition.id,
      experienceId: experience.id,
      curriculumVersion: experience.semanticVersion,
      occurredAtLocal: new Date().toISOString(),
      routeType: routeTypeForRecord(attempt.routeType),
      explicitResponse: [workRecoveryProtocolFor(attempt.entryId).label, outcome].join(' · '),
      policyVersion: 'v2.2',
    };
    const nextAttempt = outcome === 'partly' ? { ...attempt, currentStep: 'follow-on' as const, outcome, note } : undefined;
    commit({
      ...data,
      completed: { ...data.completed, [progressKey(transition.id, experience.id)]: attempt.routeType ?? 'guided' },
      observatoryRecords: [...data.observatoryRecords, record],
      privateNotes: note.trim()
        ? [...data.privateNotes, { id: `note-${crypto.randomUUID()}`, linkedRecordId: record.id, createdAtLocal: new Date().toISOString(), text: note.trim(), source: 'local' }]
        : data.privateNotes,
      attempt: nextAttempt,
    });
    setLastRecord(record);
    setLastOutcome(outcome);
    setStatus('Saved. Your response is stored only on this device.');
    setView(outcome === 'partly' ? 'follow-on' : 'complete');
  };

  const finishFollowOn = () => {
    if (!activeAttempt) return;
    commit({ ...data, attempt: undefined });
    setLastOutcome('partly');
    setStatus('Completed. Your response is stored only on this device.');
    setView('complete');
  };

  const keepForTomorrow = () => {
    if (!lastRecord) return;
    const next = createCue(data, lastRecord, 'Workday ending route');
    commit(next);
    setStatus('Saved. This route now appears in your private record for another day.');
  };

  if (!ready) return <main className="app-shell"><p className="quiet-loading">Opening your private space…</p></main>;

  return <main className={`app-shell ${data.reducedMotion ? 'motion-reduced' : ''}`}>
    <p className="sr-status" role="status" aria-live="polite">{status}</p>

    {view === 'today' && <TodayScreen hasAttempt={Boolean(activeAttempt)} activeLabel={activeAttempt ? entryForAttempt(activeAttempt).label : undefined} onResume={resume} onStart={() => setView('context')} onExplore={() => setView('explore')} onRecord={() => setView('observatory')} onSettings={() => setView('settings')} />}

    {view === 'context' && <section className="screen ritual-screen">
      <Header destination="Today" onHome={() => setView('today')} />
      <div className="ritual-copy context-copy">
        <p className="eyebrow">After work</p>
        <h1>What is still asking for your attention?</h1>
        <p className="lead">Choose the closest sentence. It changes the guidance you receive.</p>
        <div className="choice-grid">{workRecoveryProtocols.map((choice) => <button className="choice-card" key={choice.id} onClick={() => begin(choice.id)}>{choice.label}</button>)}</div>
        <button className="text-button" onClick={() => setView('today')}>Leave for now</button>
      </div>
    </section>}

    {view === 'orientation' && <section className="screen ritual-screen orientation-screen">
      <Header destination="After work" onHome={leaveForNow} />
      <div className="ritual-copy orientation-copy">
        <p className="eyebrow">A guided transition</p>
        <h1>Let’s make room for the evening.</h1>
        <p className="orientation-acknowledgement">{protocol.acknowledgement}</p>
        <p className="lead">{protocol.promise}</p>
        <button className="primary-button" onClick={startGuidance}>Begin this guided transition</button>
        <button className="text-button" onClick={leaveForNow}>Leave for now</button>
      </div>
    </section>}

    {view === 'guide' && <section className="screen ritual-screen guide-screen">
      <Header destination="Guided transition" onHome={leaveForNow} />
      <div className="guide-progress" role="progressbar" aria-label="Guided transition progress" aria-valuemin={1} aria-valuemax={protocol.steps.length} aria-valuenow={stepIndex + 1}><span style={{ width: `${((stepIndex + 1) / protocol.steps.length) * 100}%` }} /></div>
      <div className="ritual-copy guide-copy">
        <p className="eyebrow">{currentStep.duration}</p>
        <h1>{currentStep.title}</h1>
        <p className="practice-cue">{currentStep.body}</p>
        <p className="guide-action">{currentStep.action}</p>
        <button className="primary-button" onClick={advanceGuidance}>{currentStep.completion}</button>
        <button className="text-button" onClick={leaveForNow}>Leave for now</button>
      </div>
    </section>}

    {view === 'outcome' && <section className="screen ritual-screen">
      <Header destination="Reflection" onHome={leaveForNow} />
      <div className="ritual-copy reflection-copy">
        <p className="eyebrow">After the transition</p>
        <h1>What changed, if anything?</h1>
        <p className="lead">There is no correct result. Your answer only determines what Mirellis offers next.</p>
        <div className="choice-grid">{outcomeOptions.map((option) => <button className="choice-card" key={option.value} onClick={() => resolve(option.value)}>{option.label}</button>)}</div>
        <label className="note-field">A private note, if you want one <span>({note.length}/280)</span><textarea value={note} maxLength={280} onChange={(event) => setNote(event.target.value)} placeholder="Stored only on this device. Not used to interpret you." /></label>
        <button className="text-button" onClick={leaveForNow}>Leave for now</button>
      </div>
    </section>}

    {view === 'follow-on' && <section className="screen ritual-screen follow-on-screen">
      <Header destination="One more moment" onHome={leaveForNow} />
      <div className="ritual-copy follow-on-copy">
        <p className="eyebrow">A different next step</p>
        <h1>{protocol.followOn.title}</h1>
        <p className="practice-cue">{protocol.followOn.body}</p>
        <p className="guide-action">{protocol.followOn.action}</p>
        <button className="primary-button" onClick={finishFollowOn}>{protocol.followOn.completion}</button>
        <button className="text-button" onClick={leaveForNow}>Leave for now</button>
      </div>
    </section>}

    {view === 'complete' && <section className="screen ritual-screen completion-screen">
      <Header destination="Today" onHome={() => setView('today')} />
      <div className="ritual-copy completion-copy">
        <p className="eyebrow">For now</p>
        <h1>{outcomeCopy(lastOutcome).heading}</h1>
        <p className="lead">{outcomeCopy(lastOutcome).body}</p>
        <button className="primary-button" onClick={() => lastOutcome === 'different' ? setView('context') : setView('today')}>{outcomeCopy(lastOutcome).primary}</button>
        {(lastOutcome === 'enough' || lastOutcome === 'partly') && !savedThisPractice && <button className="secondary-button" onClick={keepForTomorrow}>Keep this route for another day</button>}
        {savedThisPractice && <p className="saved-confirmation">Saved in your private record for another day.</p>}
        <button className="text-button" onClick={() => setView('observatory')}>Open private record</button>
      </div>
    </section>}

    {view === 'explore' && <section className="screen ritual-screen">
      <Header destination="Other moments" onHome={() => setView('today')} />
      <div className="ritual-copy explore-copy">
        <p className="eyebrow">In development</p>
        <h1>Other moments are next.</h1>
        <p className="lead">This preview completes the after-work transition first. The other Mirellis moments will be rebuilt to the same standard before they become available.</p>
        <div className="moment-list">{consumerMoments.map((moment) => <article className="moment-row moment-row-static" key={moment.transitionId}><span>{moment.label}</span><strong>{moment.transitionId === recovery.id ? 'Available now' : 'Being rebuilt'}</strong><small>{moment.description}</small></article>)}</div>
        <button className="text-button" onClick={() => setView('today')}>Back to today</button>
      </div>
    </section>}

    {view === 'observatory' && <section className="screen ritual-screen">
      <Header destination="Private record" onHome={() => setView('today')} />
      <div className="ritual-copy observatory-copy">
        <p className="eyebrow">Personal observatory</p>
        <h1>Your private record.</h1>
        <p className="lead">Only what you completed or deliberately kept. Nothing here is a score, diagnosis, or hidden interpretation.</p>
        {records.length === 0 ? <section className="empty-state"><p>Complete one guided transition to build a private route you can use without Mirellis.</p></section> : <div className="record-list">{records.map((record) => <article className="record-row" key={record.id}><div><strong>{consumerLabelFor(record.transitionId)}</strong><p>{new Date(record.occurredAtLocal).toLocaleDateString()}</p>{noteForRecord(data, record.id) && <p className="record-note">Private note kept</p>}{data.savedCues.some((cue) => cue.originRecordId === record.id) && <p className="record-note">Route kept for another day</p>}</div><span>Completed</span></article>)}</div>}
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
        <section className="setting-row"><div><h2>Delete local data</h2><p>This removes your transitions, saved routes, and private notes from this browser.</p></div><button className="secondary-button" onClick={() => setConfirmDelete(true)}>Delete</button></section>
        {confirmDelete && <section className="delete-confirmation" role="alertdialog" aria-modal="false" aria-labelledby="delete-title"><h2 id="delete-title">Delete all local data?</h2><p>This cannot be undone. You can cancel and keep everything as it is.</p><div className="button-row"><button className="secondary-button" onClick={() => setConfirmDelete(false)}>Cancel</button><button className="text-button destructive-button" onClick={async () => { await deleteData(); setData(initialData); setConfirmDelete(false); setStatus('Local data deleted.'); setView('today'); }}>Delete all local data</button></div></section>}
        <button className="text-button" onClick={() => setView('help')}>Help and boundaries</button>
      </div>
    </section>}

    {view === 'help' && <section className="screen ritual-screen">
      <Header destination="Help" onHome={() => setView('settings')} />
      <div className="ritual-copy help-copy"><p className="eyebrow">Help and boundaries</p><h1>Attend to what needs you first.</h1><p className="lead">Mirellis is for ordinary moments. It does not assess you or provide medical, emergency, clinical, or crisis support. You are free to leave whenever something else needs you.</p><button className="primary-button" onClick={() => setView('today')}>Back to today</button></div>
    </section>}
  </main>;
}

function Header({ destination, onHome }: { destination: string; onHome: () => void }) {
  return <header className="topbar"><button className="wordmark" onClick={onHome} aria-label="Return to Mirellis today">MIRELLIS</button><span className="destination">{destination}</span></header>;
}

function TodayScreen({ hasAttempt, activeLabel, onResume, onStart, onExplore, onRecord, onSettings }: { hasAttempt: boolean; activeLabel?: string; onResume: () => void; onStart: () => void; onExplore: () => void; onRecord: () => void; onSettings: () => void }) {
  return <section className="screen threshold-screen">
    <div className="threshold-image" role="img" aria-label="Late afternoon light falling across a quiet desk by a window">
      <header className="threshold-header"><span className="threshold-wordmark">MIRELLIS</span><span>Today</span></header>
    </div>
    <div className="threshold-copy">
      <h1>Work has ended.<br />Your mind may still be with it.</h1>
      <div className="gold-rule" aria-hidden="true" />
      <p className="lead">A guided way to close the workday and choose what comes next.</p>
      {hasAttempt ? <section className="resume-line"><p>Your guided transition is ready to resume: <strong>{activeLabel}</strong></p><button className="primary-button" onClick={onResume}>Resume where you left off</button></section> : <button className="primary-button" onClick={onStart}>See what might help</button>}
      <button className="text-button" onClick={onExplore}>Explore other moments</button>
      <footer className="threshold-footer"><button className="footer-button" onClick={onRecord}>Private record</button><span aria-hidden="true">·</span><button className="footer-button" onClick={onSettings}>Settings</button></footer>
    </div>
  </section>;
}
