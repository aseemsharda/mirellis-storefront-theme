'use client';

import { useEffect, useRef, useState } from 'react';
import { isRecoveryEntryId, workRecoveryProtocolFor, workRecoveryProtocols, type RecoveryEntryId } from '@/lib/work-recovery-protocol';

type Tab = 'today' | 'programme' | 'library' | 'record' | 'settings';
type ReminderMode = 'calendar' | 'none';
type ResumeView = 'day1-plan' | 'day1-urgent' | 'day1-close' | 'day2-review' | 'day2-cue' | 'day2-close' | 'daily-question' | 'daily-action' | 'daily-close';
type SessionView = 'home' | 'paused' | 'quick-reset' | ResumeView | 'complete';

type PracticeRecord = {
  day: number;
  date: string;
  title: string;
  tomorrowAction?: string;
  urgentItem?: string;
  review?: string;
  cue?: string;
  chosenAction: string;
  nextActivity?: string;
};

type AppData = {
  version: 3;
  hasStarted: boolean;
  entryId?: RecoveryEntryId;
  resetCompleted: boolean;
  time: string;
  reminderMode: ReminderMode;
  day: number;
  completedDays: number[];
  records: PracticeRecord[];
};

type Draft = {
  view: ResumeView;
  unfinishedItem: string;
  tomorrowAction: string;
  urgentChoice: '' | 'none' | 'yes';
  urgentItem: string;
  urgentAction: string;
  urgentHandled: boolean;
  closingAction: string;
  nextActivity: string;
  otherActivity: string;
  day2Review: string;
  day2Cue: string;
  day2Action: string;
  laterAnswer: string;
  laterAction: string;
};

type ProgrammeDay = {
  day: number;
  title: string;
  purpose: string;
  question?: string;
  options?: string[];
  actions?: string[];
};

const STORAGE_KEY = 'mirellis-after-work-v2';
const DRAFT_KEY = 'mirellis-after-work-draft-v2';

const defaultData: AppData = {
  version: 3,
  hasStarted: false,
  resetCompleted: false,
  time: '18:30',
  reminderMode: 'calendar',
  day: 1,
  completedDays: [],
  records: [],
};

const programmeDays: ProgrammeDay[] = [
  { day: 1, title: 'Make a clear ending', purpose: 'Choose tomorrow’s first action, check whether anything truly cannot wait, and leave work deliberately.' },
  { day: 2, title: 'Notice what pulls you back', purpose: 'Check whether yesterday’s plan helped and change one real cue that brought work back into your evening.' },
  { day: 3, title: 'Define what is actually urgent', purpose: 'Create a plain rule for the rare situation that deserves your attention after work.', question: 'Which situation should be allowed to interrupt your evening?', options: ['A safety or financial risk before morning', 'Someone is blocked and truly cannot wait until tomorrow', 'A named person uses an agreed urgent channel', 'Nothing should interrupt my evening tonight'], actions: ['Write my one exception in a single sentence', 'Tell one person which urgent channel to use', 'Mute every other work channel until tomorrow', 'Keep tonight fully closed'] },
  { day: 4, title: 'Change the setting', purpose: 'Use one physical change to make the end of work visible.', question: 'What keeps the workday physically present after you stop?', options: ['My laptop or work phone stays beside me', 'I stay in the same chair or room', 'Work papers remain open', 'My workspace is already separate'], actions: ['Put the work device in a different place', 'Leave the workspace and change rooms', 'Clear or cover the visible work materials', 'Repeat the separation that already works'] },
  { day: 5, title: 'Silence one cue', purpose: 'Remove one prompt that routinely invites you back into work.', question: 'Which cue most often brings work back after you stop?', options: ['Work email', 'Work chat or messages', 'Task notifications', 'Seeing the work device'], actions: ['Mute work email until tomorrow', 'Silence work chat except one agreed urgent channel', 'Turn off task notifications for the evening', 'Put the work device out of sight and reach'] },
  { day: 6, title: 'Begin the evening', purpose: 'Make the next part of the day concrete instead of waiting to feel ready.', question: 'What usually makes the first part of your evening drift?', options: ['I do not decide what comes next', 'I keep checking work while choosing', 'I stay at the desk too long', 'I am too tired for a large plan'], actions: ['Choose one ten-minute evening activity now', 'Put the work device away before choosing', 'Leave the desk before making another decision', 'Choose the smallest possible evening action'] },
  { day: 7, title: 'Review the first week', purpose: 'Keep only what you explicitly found useful.', question: 'Which part of your ending was most useful this week?', options: ['Writing tomorrow’s first action', 'Checking what was genuinely urgent', 'Changing a work cue or setting', 'Starting something outside work'], actions: ['Keep that step in next week’s ending', 'Make that step easier to repeat', 'Remove one step that did not help', 'Write my three-step ending in my own words'] },
  { day: 8, title: 'Make the ending smaller', purpose: 'Build a version you can still complete on a demanding day.', question: 'What makes your usual ending feel too large?', options: ['Too many unfinished tasks', 'Too many closing steps', 'Too little time', 'Too much mental noise'], actions: ['Choose only one unfinished item for tomorrow', 'Keep only one closing action tonight', 'Use a two-minute closing sequence', 'Write one sentence, then physically leave work'] },
  { day: 9, title: 'Name what can wait', purpose: 'Give one unfinished task a deliberate place tomorrow.', question: 'What makes it hard to let an unfinished item wait?', options: ['I worry I will forget it', 'The next action is unclear', 'I feel I should finish everything', 'Someone may ask about it'], actions: ['Write when and where I will restart it', 'Write the first visible action only', 'Choose one clear stopping point', 'Send a factual update before I stop'] },
  { day: 10, title: 'Handle late requests', purpose: 'Respond to a late request without surrendering the whole evening.', question: 'What kind of late request is hardest to leave?', options: ['A request from my manager', 'A customer or client message', 'A colleague asking for quick help', 'A request with no clear deadline'], actions: ['Acknowledge it and state when I will respond', 'Ask whether it is needed before tomorrow', 'Offer one urgent channel and close the rest', 'Put it into tomorrow’s first-action plan'] },
  { day: 11, title: 'Protect the first twenty minutes', purpose: 'Give the evening enough time to begin before work can return.', question: 'What interrupts the first twenty minutes after work?', options: ['Notifications', 'An unfinished thought', 'Other people’s requests', 'Staying near the workspace'], actions: ['Mute the cue for twenty minutes', 'Write the thought down without reopening work', 'State when I will next be available', 'Move to a different place for twenty minutes'] },
  { day: 12, title: 'Close digitally', purpose: 'Make your digital workday visibly end.', question: 'Which digital surface stays open after work?', options: ['Email', 'Chat', 'Browser tabs', 'Task or calendar apps'], actions: ['Close email and remove its badge', 'Set my status, then close chat', 'Save what matters and close the work tabs', 'Record tomorrow’s first action, then close the app'] },
  { day: 13, title: 'Close physically', purpose: 'Give your body and environment a clear change of context.', question: 'Which physical signal would make work feel finished?', options: ['Closing and storing the device', 'Changing rooms', 'Changing clothes', 'Going outside briefly'], actions: ['Store the work device now', 'Move to a non-work room now', 'Change into non-work clothes now', 'Step outside or walk for five minutes'] },
  { day: 14, title: 'Review the second week', purpose: 'Choose the cue change that you want to keep.', question: 'Which change made ending work most concrete?', options: ['A notification rule', 'A physical change', 'A clear tomorrow plan', 'A chosen evening activity'], actions: ['Keep this as a permanent part of my ending', 'Make the action easier to begin', 'Tell someone else about this boundary', 'Write a backup version for difficult days'] },
  { day: 15, title: 'Return after interruption', purpose: 'Practise closing work again after it unexpectedly returns.', question: 'What most often reopens work after you have stopped?', options: ['A message', 'A thought I forgot to record', 'A request from someone', 'Opening the device for a personal reason'], actions: ['Answer only if it meets my urgent rule, then close again', 'Record the thought without reopening the task', 'State when I will respond tomorrow', 'Use a different device or immediately close work apps'] },
  { day: 16, title: 'Leave while work is unfinished', purpose: 'Choose a safe stopping point without pretending everything is complete.', question: 'What makes stopping unfinished work hardest tonight?', options: ['The task feels close to done', 'I cannot see tomorrow’s first step', 'I feel guilty leaving it', 'Other people may expect more'], actions: ['Name the exact stopping point', 'Write tomorrow’s first visible action', 'State what I completed and what remains', 'Send a brief factual update, then stop'] },
  { day: 17, title: 'Make the plan portable', purpose: 'Keep your ending usable when your location or schedule changes.', question: 'What is different about today’s work ending?', options: ['I am away from my usual workspace', 'I am ending later than usual', 'I am ending earlier than usual', 'My day was interrupted'], actions: ['Use a note as my portable return point', 'Use only the shortest closing sequence', 'Choose tomorrow’s first action before leaving', 'Restart the sequence from the current moment'] },
  { day: 18, title: 'Ask for support clearly', purpose: 'Make one boundary understandable to another person.', question: 'Who most needs to understand when your workday ends?', options: ['My manager', 'My team', 'A client or customer', 'Someone at home'], actions: ['State when I stop and when I respond again', 'Agree on one genuine urgent channel', 'Set a clear response expectation', 'Explain the small action that helps me leave work'] },
  { day: 19, title: 'Use it on a difficult day', purpose: 'Keep one reliable action when the full sequence feels impossible.', question: 'What is making today harder than usual?', options: ['Too much unfinished work', 'Low energy', 'A late interruption', 'An unclear tomorrow'], actions: ['Choose one item and write one restart action', 'Close physically without adding more decisions', 'Apply my urgent rule once, then close again', 'Choose tomorrow’s exact first ten minutes'] },
  { day: 20, title: 'Build your own ending', purpose: 'Select the steps that have earned a place in your personal sequence.', question: 'Which three-part sequence fits you best?', options: ['Plan tomorrow, close devices, begin the evening', 'Check urgency, change rooms, begin the evening', 'Send an update, store work, begin the evening', 'I want to choose each step myself'], actions: ['Save this sequence as my usual ending', 'Write my own three steps in a personal note', 'Create a shorter backup sequence', 'Tell one person how my ending works'] },
  { day: 21, title: 'Use it without Mirellis', purpose: 'Leave with a sequence you chose and can use independently.', question: 'What do you want to carry forward after today?', options: ['My tomorrow-start sentence', 'My urgency rule', 'My physical closing action', 'My complete three-step sequence'], actions: ['Copy it into my own notes', 'Add it to my calendar or routine', 'Share it with one relevant person', 'Use it now without any further prompt'] },
];

const day2CueActions: Record<string, string[]> = {
  'Work email or chat': ['Mute work email and chat until tomorrow', 'Keep one agreed urgent channel and close everything else', 'Set one chosen check time, then stop checking'],
  'An unfinished thought': ['Write one next action without reopening the task', 'Put the thought into tomorrow’s plan', 'Say the thought aloud, record one sentence, then close notes'],
  'The work device or workspace': ['Put the work device out of sight and reach', 'Leave the workspace and change rooms', 'Clear the visible work surface'],
  'A person needed me': ['Tell them when I will be available tomorrow', 'Agree on one genuine urgent channel', 'Answer the factual need, then explicitly close work again'],
  'Nothing pulled me back': ['Repeat yesterday’s closing action', 'Make yesterday’s action easier to repeat', 'Keep the first twenty minutes of the evening work-free'],
};

const closingActions = [
  'Save tomorrow’s first action, then close all work apps',
  'Close the laptop and put the work device out of reach',
  'Leave the desk or workspace and change rooms',
  'Tell one relevant person I am done for today, then disconnect',
];

const eveningActivities = [
  'Prepare or eat something',
  'Take a shower or change clothes',
  'Go for a short walk or stretch',
  'Call or spend time with someone',
  'Read, listen, or rest',
  'Something else I choose',
];

function dateLabel(date: Date) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
}

function calendarDate(date: Date, time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  const next = new Date(date);
  next.setDate(next.getDate() + 1);
  next.setHours(hours, minutes, 0, 0);
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${next.getFullYear()}${pad(next.getMonth() + 1)}${pad(next.getDate())}T${pad(next.getHours())}${pad(next.getMinutes())}00`;
}

function downloadCalendarReminder(time: string) {
  const start = calendarDate(new Date(), time);
  const calendar = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Mirellis//After Work//EN', 'BEGIN:VEVENT', `UID:mirellis-after-work-${Date.now()}@mirellis.in`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`, `DTSTART:${start}`, 'DURATION:PT10M', 'RRULE:FREQ=DAILY;COUNT=21', 'SUMMARY:Mirellis — After Work practice', 'DESCRIPTION:Open https://app.mirellis.in for today\'s seven-minute practice.', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
  const url = URL.createObjectURL(new Blob([calendar], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'mirellis-after-work-21-days.ics';
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const emptyDraft: Omit<Draft, 'view'> = {
  unfinishedItem: '', tomorrowAction: '', urgentChoice: '', urgentItem: '', urgentAction: '', urgentHandled: false,
  closingAction: '', nextActivity: '', otherActivity: '', day2Review: '', day2Cue: '', day2Action: '', laterAnswer: '', laterAction: '',
};

export function AfterWorkApp() {
  const [data, setData] = useState<AppData>(defaultData);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<Tab>('today');
  const [view, setView] = useState<SessionView>('home');
  const [resumeView, setResumeView] = useState<ResumeView>();
  const [onboarding, setOnboarding] = useState(0);
  const [resetStep, setResetStep] = useState(0);
  const [status, setStatus] = useState('');
  const [completedRecord, setCompletedRecord] = useState<PracticeRecord>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AppData>;
        setData({ ...defaultData, ...parsed, entryId: parsed.entryId ?? (parsed.hasStarted ? 'unfinished' : undefined), version: 3 });
      }
      const savedDraft = window.localStorage.getItem(DRAFT_KEY);
      if (savedDraft) {
        const restored = JSON.parse(savedDraft) as Draft;
        setDraft(restored);
        setResumeView(restored.view);
        setView('paused');
        setStatus('Your unfinished daily practice is saved in this browser.');
      }
    } catch {
      setStatus('This browser could not load prior practice data.');
    } finally {
      const search = new URLSearchParams(window.location.search);
      const requestedEntry = search.get('friction') ?? undefined;
      const requestedView = search.get('view');
      if (requestedView === 'record' || requestedView === 'library' || requestedView === 'programme') {
        setTab(requestedView);
        setView('home');
        setStatus(requestedView === 'record' ? 'Your private record is open.' : `${requestedView[0].toUpperCase()}${requestedView.slice(1)} is open.`);
      }
      if (!savedProgrammeStarted() && isRecoveryEntryId(requestedEntry)) {
        setData((current) => ({ ...current, entryId: requestedEntry }));
        setOnboarding(1);
      }
      setHydrated(true);
    }

    function savedProgrammeStarted() {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        return saved ? Boolean((JSON.parse(saved) as Partial<AppData>).hasStarted) : false;
      } catch {
        return false;
      }
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const active = view !== 'home' && view !== 'paused' && view !== 'complete' && view !== 'quick-reset' ? view : view === 'paused' ? resumeView : undefined;
    if (!active) {
      window.localStorage.removeItem(DRAFT_KEY);
      return;
    }
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...draft, view: active } satisfies Draft));
  }, [draft, hydrated, resumeView, view]);

  const dayNumber = Math.min(data.day, 21);
  const day = programmeDays[dayNumber - 1];
  const selectedProtocol = workRecoveryProtocolFor(data.entryId);
  const previousRecord = data.records.find((record) => record.day === dayNumber - 1);
  const chosenActivity = draft.nextActivity === 'Something else I choose' ? draft.otherActivity.trim() : draft.nextActivity;

  const setDraftValue = <K extends keyof typeof emptyDraft>(key: K, value: (typeof emptyDraft)[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const initialView = (): ResumeView => dayNumber === 1 ? 'day1-plan' : dayNumber === 2 ? 'day2-review' : 'daily-question';

  const startPractice = () => {
    setDraft(emptyDraft);
    const next = initialView();
    setResumeView(next);
    setView(next);
    setTab('today');
    setStatus(`Day ${dayNumber} started: ${day.title}.`);
  };

  const pausePractice = (from: ResumeView) => {
    setResumeView(from);
    setView('paused');
    setStatus('Practice paused. Your answers are saved in this browser.');
  };

  const discardPractice = () => {
    setDraft(emptyDraft);
    setResumeView(undefined);
    setView('home');
    setStatus('The unfinished practice was discarded. Nothing was recorded as complete.');
  };

  const completePractice = (record: PracticeRecord) => {
    setData((current) => ({
      ...current,
      day: current.day < 21 ? current.day + 1 : current.day,
      completedDays: current.completedDays.includes(record.day) ? current.completedDays : [...current.completedDays, record.day],
      records: [...current.records.filter((item) => item.day !== record.day), record],
    }));
    setCompletedRecord(record);
    setResumeView(undefined);
    setView('complete');
    setStatus(`Day ${record.day} recorded as complete.`);
  };

  const finishDayOne = () => completePractice({
    day: 1, date: dateLabel(new Date()), title: programmeDays[0].title,
    tomorrowAction: draft.tomorrowAction.trim(), urgentItem: draft.urgentChoice === 'yes' ? `${draft.urgentItem.trim()} — ${draft.urgentAction.trim()}` : undefined,
    chosenAction: draft.closingAction, nextActivity: chosenActivity,
  });

  const finishDayTwo = () => completePractice({
    day: 2, date: dateLabel(new Date()), title: programmeDays[1].title,
    review: draft.day2Review, cue: draft.day2Cue, chosenAction: draft.day2Action, nextActivity: chosenActivity,
  });

  const finishLaterDay = () => completePractice({
    day: dayNumber, date: dateLabel(new Date()), title: day.title,
    review: draft.laterAnswer, chosenAction: draft.laterAction, nextActivity: chosenActivity,
  });

  const beginProgramme = () => {
    setData((current) => ({ ...current, hasStarted: true }));
    if (data.reminderMode === 'calendar') {
      downloadCalendarReminder(data.time);
      setStatus('Your programme is ready. A 21-day calendar reminder file was downloaded for your calendar app.');
    } else setStatus('Your programme is ready. No reminder was created.');
    setOnboarding(0);
  };

  const chooseEntry = (entryId: RecoveryEntryId) => {
    setData((current) => ({ ...current, entryId, resetCompleted: false }));
    setResetStep(0);
    setOnboarding(1);
    setStatus(`Selected: ${workRecoveryProtocolFor(entryId).label}`);
  };

  const advanceQuickReset = (fromProgramme = false) => {
    if (resetStep < selectedProtocol.steps.length - 1) {
      const next = resetStep + 1;
      setResetStep(next);
      setStatus(`Step ${next} complete. Step ${next + 1}: ${selectedProtocol.steps[next].title}`);
      return;
    }
    setData((current) => ({ ...current, resetCompleted: true }));
    setResetStep(0);
    if (fromProgramme) {
      setView('home');
      setStatus('Quick practice complete. Nothing was added to your private record.');
    } else {
      setOnboarding(2);
      setStatus('Tonight’s quick practice is complete. Choose what you want next.');
    }
  };

  const addCalendarReminder = () => {
    downloadCalendarReminder(data.time);
    setData((current) => ({ ...current, reminderMode: 'calendar' }));
    setStatus('Calendar reminder downloaded. Open it to add the 21 daily events to your calendar.');
  };

  const copyTomorrowPlan = async () => {
    try {
      await navigator.clipboard.writeText(draft.tomorrowAction);
      setStatus('Tomorrow’s first action was copied. Paste it into your notes if you want it outside Mirellis.');
    } catch {
      setStatus('Copy was unavailable. Your first action is still saved inside Mirellis.');
    }
  };

  const deleteData = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(DRAFT_KEY);
    setData(defaultData);
    setDraft(emptyDraft);
    setTab('today'); setView('home'); setResumeView(undefined); setOnboarding(0); setDeleteOpen(false);
    setStatus('All local Mirellis practice data was deleted.');
  };

  if (!hydrated) return <main className="after-work-shell"><p className="quiet-loading">Opening your practice…</p></main>;

  if (!data.hasStarted && tab === 'today') return <main className="after-work-shell onboarding-shell">
    <p className="sr-status" role="status" aria-live="polite">{status}</p>
    <header className="after-work-header"><span className="after-work-wordmark">MIRELLIS</span><span>After work</span></header>
    {onboarding === 0 && <section className="onboarding-copy onboarding-v2 entry-screen">
      <p className="eyebrow">Help for right now · 2–8 minutes</p>
      <h1>What is keeping work open tonight?</h1>
      <p className="after-work-lead">Choose the closest real situation. Your answer changes what Mirellis asks you to do next.</p>
      <div className="entry-list" role="group" aria-label="What is keeping work open">
        {workRecoveryProtocols.map((protocol) => <button key={protocol.id} className="entry-choice" onClick={() => chooseEntry(protocol.id)}><strong>{protocol.label}</strong><span>{protocol.acknowledgement}</span><small>See what to do now</small></button>)}
      </div>
      <p className="after-work-footnote">This is not an assessment. Mirellis does not infer a diagnosis or personality from your choice.</p>
    </section>}
    {onboarding === 1 && <QuickPractice protocol={selectedProtocol} step={resetStep} onNext={() => advanceQuickReset(false)} onBack={() => { setResetStep(0); setOnboarding(0); }} />}
    {onboarding === 2 && <section className="onboarding-copy onboarding-v2 reset-complete-screen">
      <p className="eyebrow">Tonight’s action is complete</p>
      <h1>You made work end in a visible way.</h1>
      <p className="after-work-lead">You can leave now. If you want to make this easier to repeat, choose one honest next step.</p>
      <div className="next-paths">
        <button className="primary-button" onClick={() => setOnboarding(3)}>Build my 21-day ending</button>
        <a className="secondary-button resource-action" href="https://open.spotify.com/playlist/6VG02jtawiXTcOGi0nZzp6" target="_blank" rel="noreferrer">Listen while I leave work</a>
        <a className="secondary-button resource-action" href="https://mirellis.in/pages/work-to-recovery">Understand why work stays open</a>
        <a className="text-button leave-link" href="https://mirellis.in">Leave for tonight</a>
      </div>
      <p className="after-work-footnote">Spotify opens in a new tab. Mirellis does not record what you play.</p>
    </section>}
    {onboarding === 3 && <section className="onboarding-copy onboarding-v2">
      <p className="eyebrow">After Work · 21 days</p>
      <h1>Build an ending you can use without Mirellis.</h1>
      <p className="after-work-lead">One seven-minute practice each day. The programme begins with the difficulty you selected and gradually helps you make work closure more deliberate.</p>
      <ol className="plain-steps"><li><strong>Decide what remains.</strong><span>Choose what can safely wait until tomorrow.</span></li><li><strong>Make one closing choice.</strong><span>Take a real action that ends work today.</span></li><li><strong>Begin what comes next.</strong><span>Start one small part of your evening.</span></li></ol>
      <p className="programme-promise">One practice per day · about 7 minutes · missing a day does not reset anything</p>
      <button className="primary-button" onClick={() => setOnboarding(4)}>Set up my 21 days</button>
      <button className="text-button" onClick={() => setOnboarding(data.resetCompleted ? 2 : 0)}>Back</button>
      <p className="after-work-footnote">Your programme and answers stay in this browser. There is no score or inferred progress.</p>
    </section>}
    {onboarding === 4 && <section className="onboarding-copy onboarding-v2">
      <p className="eyebrow">Your daily time</p><h1>When do you usually want work to end?</h1>
      <p className="after-work-lead">This time helps you create a calendar reminder. The practice is still available whenever you open Mirellis.</p>
      <label className="time-control">Usual end time<input type="time" value={data.time} onChange={(event) => setData((current) => ({ ...current, time: event.target.value }))} /></label>
      <button className="primary-button" onClick={() => setOnboarding(5)}>Choose how I’ll remember</button><button className="text-button" onClick={() => setOnboarding(3)}>Back</button>
    </section>}
    {onboarding === 5 && <section className="onboarding-copy onboarding-v2">
      <p className="eyebrow">How reminders work</p><h1>Choose a real reminder.</h1>
      <p className="after-work-lead">This web app cannot ring an alarm or send a push notification. Mirellis can download a 21-day calendar event instead. Your calendar—not Mirellis—will deliver the alert.</p>
      <div className="reminder-options" role="group" aria-label="Reminder choice">
        <button className={data.reminderMode === 'calendar' ? 'reminder-choice is-selected' : 'reminder-choice'} aria-pressed={data.reminderMode === 'calendar'} onClick={() => setData((current) => ({ ...current, reminderMode: 'calendar' }))}><strong>Add it to my calendar</strong><span>Downloads one daily event at {data.time} for the next 21 days. You open the file and add it to your calendar.</span></button>
        <button className={data.reminderMode === 'none' ? 'reminder-choice is-selected' : 'reminder-choice'} aria-pressed={data.reminderMode === 'none'} onClick={() => setData((current) => ({ ...current, reminderMode: 'none' }))}><strong>No reminder</strong><span>I will open Mirellis myself. No alert will be created.</span></button>
      </div>
      <button className="primary-button" onClick={beginProgramme}>{data.reminderMode === 'calendar' ? 'Start and download calendar reminder' : 'Start without a reminder'}</button><button className="text-button" onClick={() => setOnboarding(4)}>Back</button>
    </section>}
  </main>;

  const nextDay = completedRecord && completedRecord.day < 21 ? programmeDays[completedRecord.day] : undefined;
  const homeSteps = dayNumber === 1 ? ['Plan tomorrow’s first action', 'Check whether anything truly cannot wait', 'Close work and begin one evening activity'] : dayNumber === 2 ? ['Check whether yesterday’s plan helped', 'Name what actually pulled you back', 'Change one real cue tonight'] : [day.question ?? 'Notice today’s situation', 'Choose one action that fits', 'Do it and record only what you chose'];

  return <main className="after-work-shell">
    <p className="sr-status" role="status" aria-live="polite">{status}</p>
    <header className="after-work-header"><button className="after-work-wordmark" onClick={() => setTab('today')}>MIRELLIS</button><span>After Work · Day {completedRecord && view === 'complete' ? completedRecord.day : dayNumber}</span><button className="after-work-plain-button" onClick={() => setTab('settings')}>Settings</button></header>

    {tab === 'today' && view === 'home' && <section className="after-work-screen today-screen today-v2">
      <p className="eyebrow">Day {dayNumber} of 21 · One practice today</p><h1>{data.completedDays.length >= 21 ? 'Your programme is complete.' : day.title}</h1><p className="after-work-lead">{data.completedDays.length >= 21 ? 'Your private record contains the actions you chose across all 21 days.' : day.purpose}</p>
      {data.completedDays.length < 21 && <p className="focus-note"><span>You began with</span>{selectedProtocol.label}</p>}
      {data.completedDays.length < 21 && <section className="today-plan"><p className="eyebrow">What you will do · about 7 minutes</p><ol>{homeSteps.map((step) => <li key={step}>{step}</li>)}</ol></section>}
      {data.completedDays.length >= 21 ? <button className="primary-button" onClick={() => setTab('record')}>View my 21-day record</button> : <button className="primary-button" onClick={startPractice}>Start Day {dayNumber}</button>}
      <button className="text-button" onClick={() => setTab('programme')}>See all 21 days</button>
      {data.completedDays.length < 21 && <button className="text-button" onClick={() => { setResetStep(0); setView('quick-reset'); }}>I need help leaving work right now</button>}
      {data.completedDays.length < 21 && <p className="tomorrow-preview"><strong>Tomorrow: Day {Math.min(dayNumber + 1, 21)} — {programmeDays[Math.min(dayNumber, 20)].title}</strong><span>{programmeDays[Math.min(dayNumber, 20)].purpose}</span></p>}
    </section>}

    {tab === 'today' && view === 'quick-reset' && <QuickPractice protocol={selectedProtocol} step={resetStep} onNext={() => advanceQuickReset(true)} onBack={() => { setResetStep(0); setView('home'); setStatus('Quick practice closed. Nothing was recorded.'); }} />}

    {tab === 'today' && view === 'paused' && <section className="after-work-screen compact-screen paused-screen"><p className="eyebrow">Day {dayNumber} is paused</p><h1>Your answers are still here.</h1><p className="after-work-lead">Continue from the exact step where you stopped. Nothing has been recorded as complete.</p><button className="primary-button" onClick={() => resumeView && setView(resumeView)}>Resume Day {dayNumber}</button><button className="text-button" onClick={discardPractice}>Discard this unfinished practice</button></section>}

    {tab === 'today' && view === 'day1-plan' && <section className="after-work-screen practice-screen v2-practice"><StepHeader step={1} title="Plan tomorrow’s first action" />
      <h1>Choose one unfinished item to leave for tomorrow.</h1><p className="after-work-lead"><strong>You are not being asked to work on it now.</strong> You are giving it a clear place to restart so you do not have to keep rehearsing it tonight.</p>
      <label className="training-field">What are you leaving unfinished today?<textarea value={draft.unfinishedItem} onChange={(event) => setDraftValue('unfinishedItem', event.target.value)} placeholder="Example: Redesign the Amazon Brand Page" /></label>
      <label className="training-field">What exact action will begin it tomorrow?<textarea value={draft.tomorrowAction} onChange={(event) => setDraftValue('tomorrowAction', event.target.value)} placeholder="Example: At 9:15, open the Amazon Brand Page and replace the first banner copy" /></label>
      <p className="explanation-box"><strong>A useful first action is visible and small.</strong> “Redesign the page” is broad. “Open the page and replace the first banner copy” tells tomorrow-you exactly where to begin.</p>
      <button className="primary-button" disabled={draft.unfinishedItem.trim().length < 3 || draft.tomorrowAction.trim().length < 10} onClick={() => { setView('day1-urgent'); setResumeView('day1-urgent'); setStatus('Tomorrow’s first action saved for today’s practice.'); }}>Save this plan and continue</button><button className="text-button" onClick={() => pausePractice('day1-plan')}>Pause and return later</button>
    </section>}

    {tab === 'today' && view === 'day1-urgent' && <section className="after-work-screen practice-screen v2-practice"><StepHeader step={2} title="Check for one genuine exception" />
      <h1>Does anything truly need action tonight?</h1><p className="after-work-lead">“Truly needs action” means there is a real deadline before morning, someone is blocked before tomorrow, or leaving it would create a concrete problem. Ordinary unfinished work can wait.</p>
      <div className="plain-choice-list" role="group" aria-label="Urgency check"><button className={draft.urgentChoice === 'none' ? 'plain-choice is-selected' : 'plain-choice'} aria-pressed={draft.urgentChoice === 'none'} onClick={() => { setDraftValue('urgentChoice', 'none'); setDraftValue('urgentHandled', false); }}><strong>Nothing needs action tonight</strong><span>Tomorrow’s plan is enough. I can stop.</span></button><button className={draft.urgentChoice === 'yes' ? 'plain-choice is-selected' : 'plain-choice'} aria-pressed={draft.urgentChoice === 'yes'} onClick={() => setDraftValue('urgentChoice', 'yes')}><strong>One thing genuinely cannot wait</strong><span>I will name the smallest action that makes it safe to stop.</span></button></div>
      {draft.urgentChoice === 'yes' && <section className="conditional-panel"><label className="training-field">What genuinely cannot wait?<textarea value={draft.urgentItem} onChange={(event) => { setDraftValue('urgentItem', event.target.value); setDraftValue('urgentHandled', false); }} /></label><label className="training-field">What is the smallest action needed tonight?<textarea value={draft.urgentAction} onChange={(event) => { setDraftValue('urgentAction', event.target.value); setDraftValue('urgentHandled', false); }} /></label><p>Do that action outside Mirellis. Return only when it is handled or when you decide it can safely wait.</p><div className="inline-actions"><button className="secondary-button" disabled={draft.urgentItem.trim().length < 3 || draft.urgentAction.trim().length < 6} onClick={() => { setDraftValue('urgentHandled', true); setStatus('You confirmed that the necessary action was handled.'); }}>I handled this action</button><button className="text-button" onClick={() => { setDraftValue('urgentChoice', 'none'); setDraftValue('urgentHandled', false); setStatus('The item was moved to tomorrow.'); }}>It can wait after all</button></div>{draft.urgentHandled && <p className="positive-copy" role="status">Confirmed. You said the necessary action is handled.</p>}</section>}
      <button className="primary-button" disabled={!draft.urgentChoice || (draft.urgentChoice === 'yes' && !draft.urgentHandled)} onClick={() => { setView('day1-close'); setResumeView('day1-close'); }}>Continue to close work</button><button className="text-button" onClick={() => pausePractice('day1-urgent')}>Pause and return later</button>
    </section>}

    {tab === 'today' && view === 'day1-close' && <section className="after-work-screen practice-screen v2-practice"><StepHeader step={3} title="Close work and begin the evening" />
      <h1>Take two clear actions now.</h1><section className="saved-plan"><p className="eyebrow">Tomorrow’s first action</p><p>{draft.tomorrowAction}</p><button className="text-button" onClick={copyTomorrowPlan}>Copy this plan</button></section>
      <p className="choice-prompt">First, how will you make the end of work visible?</p><ChoiceList label="Closing action" options={closingActions} value={draft.closingAction} onChoose={(value) => setDraftValue('closingAction', value)} />
      <ActivityChoice value={draft.nextActivity} other={draft.otherActivity} onChoose={(value) => setDraftValue('nextActivity', value)} onOther={(value) => setDraftValue('otherActivity', value)} />
      {draft.closingAction && chosenActivity && <section className="do-now"><p className="eyebrow">Do this now</p><ol><li>{draft.closingAction}.</li><li>Begin: {chosenActivity}.</li></ol><p>No timer is required. Return when you have taken both actions.</p></section>}
      <button className="primary-button" disabled={!draft.closingAction || !chosenActivity} onClick={finishDayOne}>I completed these two actions</button><button className="text-button" onClick={() => pausePractice('day1-close')}>Pause and return later</button>
    </section>}

    {tab === 'today' && view === 'day2-review' && <section className="after-work-screen practice-screen v2-practice"><StepHeader step={1} title="Check yesterday’s plan" />
      <h1>Did yesterday’s starting point help today?</h1>{previousRecord?.tomorrowAction && <section className="saved-plan"><p className="eyebrow">What you planned</p><p>{previousRecord.tomorrowAction}</p></section>}<p className="after-work-lead">Choose only what you know. This is not a score and Mirellis will not interpret your answer.</p>
      <ChoiceList label="Yesterday’s plan" options={['Yes, I used it', 'Partly — it needed more detail', 'No — I did not use it', 'I do not remember']} value={draft.day2Review} onChoose={(value) => setDraftValue('day2Review', value)} />
      <button className="primary-button" disabled={!draft.day2Review} onClick={() => { setView('day2-cue'); setResumeView('day2-cue'); }}>Continue</button><button className="text-button" onClick={() => pausePractice('day2-review')}>Pause and return later</button>
    </section>}

    {tab === 'today' && view === 'day2-cue' && <section className="after-work-screen practice-screen v2-practice"><StepHeader step={2} title="Name what pulled you back" />
      <h1>After you stopped yesterday, what brought work back?</h1><p className="after-work-lead">Choose the closest real answer. If nothing pulled you back, say that.</p>
      <ChoiceList label="What pulled work back" options={Object.keys(day2CueActions)} value={draft.day2Cue} onChoose={(value) => { setDraftValue('day2Cue', value); setDraftValue('day2Action', ''); }} />
      {draft.day2Cue && <><p className="choice-prompt">Choose one change you will actually make tonight.</p><ChoiceList label="Tonight’s change" options={day2CueActions[draft.day2Cue]} value={draft.day2Action} onChoose={(value) => setDraftValue('day2Action', value)} /></>}
      <button className="primary-button" disabled={!draft.day2Cue || !draft.day2Action} onClick={() => { setView('day2-close'); setResumeView('day2-close'); }}>Use this change tonight</button><button className="text-button" onClick={() => pausePractice('day2-cue')}>Pause and return later</button>
    </section>}

    {tab === 'today' && view === 'day2-close' && <section className="after-work-screen practice-screen v2-practice"><StepHeader step={3} title="Take the action" />
      <h1>Make the change, then begin your evening.</h1><section className="do-now"><p className="eyebrow">Your chosen change</p><p>{draft.day2Action}.</p></section><ActivityChoice value={draft.nextActivity} other={draft.otherActivity} onChoose={(value) => setDraftValue('nextActivity', value)} onOther={(value) => setDraftValue('otherActivity', value)} />
      {chosenActivity && <section className="do-now"><p className="eyebrow">Do this now</p><ol><li>{draft.day2Action}.</li><li>Begin: {chosenActivity}.</li></ol><p>Return when you have taken both actions.</p></section>}
      <button className="primary-button" disabled={!chosenActivity} onClick={finishDayTwo}>I completed these two actions</button><button className="text-button" onClick={() => pausePractice('day2-close')}>Pause and return later</button>
    </section>}

    {tab === 'today' && view === 'daily-question' && <section className="after-work-screen practice-screen v2-practice"><StepHeader step={1} title={day.title} />
      <h1>{day.question}</h1><p className="after-work-lead">{day.purpose} Choose the closest real answer; Mirellis will record only what you select.</p><ChoiceList label={`Day ${dayNumber} situation`} options={day.options ?? []} value={draft.laterAnswer} onChoose={(value) => setDraftValue('laterAnswer', value)} />
      <button className="primary-button" disabled={!draft.laterAnswer} onClick={() => { setView('daily-action'); setResumeView('daily-action'); }}>Choose today’s action</button><button className="text-button" onClick={() => pausePractice('daily-question')}>Pause and return later</button>
    </section>}

    {tab === 'today' && view === 'daily-action' && <section className="after-work-screen practice-screen v2-practice"><StepHeader step={2} title="Choose one action" />
      <h1>What will you actually do tonight?</h1><section className="saved-plan"><p className="eyebrow">What you selected</p><p>{draft.laterAnswer}</p></section><ChoiceList label="Today’s action" options={day.actions ?? []} value={draft.laterAction} onChoose={(value) => setDraftValue('laterAction', value)} />
      <button className="primary-button" disabled={!draft.laterAction} onClick={() => { setView('daily-close'); setResumeView('daily-close'); }}>Use this action</button><button className="text-button" onClick={() => pausePractice('daily-action')}>Pause and return later</button>
    </section>}

    {tab === 'today' && view === 'daily-close' && <section className="after-work-screen practice-screen v2-practice"><StepHeader step={3} title="Do it and leave work" />
      <h1>Take the action, then begin your evening.</h1><section className="do-now"><p className="eyebrow">Your chosen action</p><p>{draft.laterAction}.</p></section><ActivityChoice value={draft.nextActivity} other={draft.otherActivity} onChoose={(value) => setDraftValue('nextActivity', value)} onOther={(value) => setDraftValue('otherActivity', value)} />
      {chosenActivity && <section className="do-now"><p className="eyebrow">Do this now</p><ol><li>{draft.laterAction}.</li><li>Begin: {chosenActivity}.</li></ol></section>}
      <button className="primary-button" disabled={!chosenActivity} onClick={finishLaterDay}>I completed these two actions</button><button className="text-button" onClick={() => pausePractice('daily-close')}>Pause and return later</button>
    </section>}

    {tab === 'today' && view === 'complete' && completedRecord && <section className="after-work-screen completion-screen completion-v2"><p className="eyebrow">Day {completedRecord.day} of 21 complete</p><h1>Work is closed for today.</h1><p className="after-work-lead">This record contains only the choices and actions you confirmed.</p>
      <section className="result-sheet">{completedRecord.tomorrowAction && <p><span>Tomorrow I will</span>{completedRecord.tomorrowAction}</p>}{completedRecord.urgentItem && <p><span>Handled before stopping</span>{completedRecord.urgentItem}</p>}{completedRecord.review && <p><span>What I selected</span>{completedRecord.review}</p>}{completedRecord.cue && <p><span>What pulled work back</span>{completedRecord.cue}</p>}<p><span>My closing action</span>{completedRecord.chosenAction}</p>{completedRecord.nextActivity && <p><span>My evening begins with</span>{completedRecord.nextActivity}</p>}</section>
      {nextDay ? <section className="tomorrow-card"><p className="eyebrow">Tomorrow · Day {nextDay.day}</p><h2>{nextDay.title}</h2><p>{nextDay.purpose}</p></section> : <section className="tomorrow-card"><p className="eyebrow">Programme complete</p><h2>Your ending belongs to you.</h2><p>Your private record contains the sequence you explicitly chose.</p></section>}
      <button className="primary-button" onClick={() => { setView('home'); setCompletedRecord(undefined); }}>Back to today</button><button className="text-button" onClick={() => { setView('home'); setCompletedRecord(undefined); setTab('record'); }}>View my private record</button>
    </section>}

    {tab === 'programme' && <section className="after-work-screen compact-screen"><p className="eyebrow">The complete programme</p><h1>One practice each day for 21 days.</h1><p className="after-work-lead">Every day has three steps and takes about seven minutes. Missing a day does not reset your programme.</p>{!data.hasStarted && <button className="primary-button" onClick={() => { setTab('today'); setOnboarding(0); setStatus('Choose what is keeping work open to begin.'); }}>Begin with what is difficult tonight</button>}<div className="programme-list-v2">{programmeDays.map((item) => { const state = data.completedDays.includes(item.day) ? 'complete' : item.day === dayNumber ? 'today' : item.day > dayNumber ? 'later' : 'available'; return <button key={item.day} className={`programme-row-v2 ${state}`} onClick={() => { if (!data.hasStarted) { setTab('today'); setOnboarding(0); setStatus('Choose what is keeping work open to begin.'); } else if (item.day === dayNumber && data.completedDays.length < 21) startPractice(); else setStatus(state === 'complete' ? `Day ${item.day} was completed.` : state === 'later' ? `Day ${item.day} becomes available after the earlier days.` : `Day ${item.day} is available.`); }}><span>Day {item.day}</span><strong>{item.title}</strong><small>{state === 'complete' ? 'Complete' : state === 'today' ? 'Today' : 'Later'}</small></button>; })}</div></section>}

    {tab === 'library' && <section className="after-work-screen compact-screen"><p className="eyebrow">Support in different forms</p><h1>Choose what helps you act.</h1><p className="after-work-lead">The programme is not the only way to leave work. These are optional, direct supports for the same moment.</p><div className="resource-list"><article><p className="eyebrow">Listen · Spotify</p><h2>Stillness</h2><p>Use the playlist while you close the work surface, move rooms, or begin the evening.</p><a className="secondary-button resource-action" href="https://open.spotify.com/playlist/6VG02jtawiXTcOGi0nZzp6" target="_blank" rel="noreferrer">Open the Stillness playlist</a><small>Opens Spotify. Mirellis does not record what you play.</small></article><article><p className="eyebrow">Understand · Mirellis</p><h2>Why work can remain mentally open</h2><p>Read the current explanation, its limits, and the practical connection to closure.</p><a className="secondary-button resource-action" href="https://mirellis.in/pages/work-to-recovery">Read the Workday Exit guide</a></article><article><p className="eyebrow">Optional ritual instrument</p><h2>Stillness Elixir</h2><p>A scent-and-touch cue for people who want a physical signal at the end of work. The programme works without it.</p><a className="secondary-button resource-action" href="https://mirellis.in/products/mirellis-stillness-elixir">See the product and price</a></article></div></section>}

    {tab === 'record' && <section className="after-work-screen compact-screen"><p className="eyebrow">Private record</p><h1>Only what you chose and confirmed.</h1><p className="after-work-lead">No score, diagnosis, or inferred progress appears here.</p>{data.records.length === 0 ? <section className="record-empty"><h2>Nothing recorded yet.</h2><p>Complete one daily practice to create your first practical ending record.</p><button className="primary-button" onClick={() => { setTab('today'); setOnboarding(0); setStatus('Choose what is keeping work open to begin.'); }}>Begin with what is difficult tonight</button></section> : <div className="record-list-new">{[...data.records].reverse().map((record) => <article key={record.day}><p className="eyebrow">Day {record.day} · {record.date}</p><h2>{record.title}</h2>{record.tomorrowAction && <p><span>Tomorrow</span>{record.tomorrowAction}</p>}{record.review && <p><span>Selected</span>{record.review}</p>}{record.cue && <p><span>Work returned through</span>{record.cue}</p>}<p><span>Closing action</span>{record.chosenAction}</p>{record.nextActivity && <p><span>Evening began with</span>{record.nextActivity}</p>}</article>)}</div>}</section>}

    {tab === 'settings' && <section className="after-work-screen compact-screen"><p className="eyebrow">Settings</p><h1>Your time, reminder, and data.</h1><section className="settings-list-new"><div><h2>Daily time</h2><p>Your chosen end-of-work time is {data.time}.</p><label className="time-control">Change time<input type="time" value={data.time} onChange={(event) => { setData((current) => ({ ...current, time: event.target.value })); setStatus('Time saved. Download a new calendar reminder if you want your calendar to use it.'); }} /></label></div><div><h2>Reminder</h2><p>Mirellis cannot ring an alarm or send a web push notification. A calendar reminder is delivered by your own calendar app.</p><button className="secondary-button" onClick={addCalendarReminder}>Download a 21-day calendar reminder</button><button className="text-button settings-text-button" onClick={() => { setData((current) => ({ ...current, reminderMode: 'none' })); setStatus('Mirellis will not create a reminder. Remove any previously added event in your calendar app separately.'); }}>Use Mirellis without a reminder</button></div><div><h2>Analytics</h2><p>Analytics are not active in this build.</p></div><div><h2>Local data</h2><p>Your programme, answers, and practice record are stored only in this browser.</p><button ref={deleteTriggerRef} className="secondary-button" onClick={() => setDeleteOpen(true)}>Delete local data</button></div></section>{deleteOpen && <section className="delete-dialog" role="alertdialog" aria-labelledby="delete-title" aria-describedby="delete-description"><h2 id="delete-title">Delete this browser’s practice data?</h2><p id="delete-description">This removes your programme, saved answers, and practice record from this browser. It cannot be undone.</p><div><button autoFocus className="secondary-button" onClick={() => { setDeleteOpen(false); setStatus('Deletion cancelled.'); window.setTimeout(() => deleteTriggerRef.current?.focus(), 0); }}>Cancel</button><button className="primary-button destructive" onClick={deleteData}>Delete everything</button></div></section>}</section>}

    <nav className="after-work-nav" aria-label="After Work navigation"><button aria-current={tab === 'today' ? 'page' : undefined} className={tab === 'today' ? 'is-active' : ''} onClick={() => { setTab('today'); if (view === 'quick-reset') setView('home'); }}>Today</button><button aria-current={tab === 'programme' ? 'page' : undefined} className={tab === 'programme' ? 'is-active' : ''} onClick={() => setTab('programme')}>21 days</button><button aria-current={tab === 'library' ? 'page' : undefined} className={tab === 'library' ? 'is-active' : ''} onClick={() => setTab('library')}>Library</button><button aria-current={tab === 'record' ? 'page' : undefined} className={tab === 'record' ? 'is-active' : ''} onClick={() => setTab('record')}>Record</button></nav>
  </main>;
}

function QuickPractice({ protocol, step, onNext, onBack }: { protocol: ReturnType<typeof workRecoveryProtocolFor>; step: number; onNext: () => void; onBack: () => void }) {
  const current = protocol.steps[step];
  return <section className="onboarding-copy onboarding-v2 quick-practice">
    <div className="session-progress" aria-label={`Action ${step + 1} of ${protocol.steps.length}`}><span style={{ width: `${((step + 1) / protocol.steps.length) * 100}%` }} /></div>
    <p className="eyebrow">Action {step + 1} of {protocol.steps.length} · {current.duration}</p>
    <h1>{current.title}</h1>
    <p className="after-work-lead">{current.body}</p>
    <section className="do-now"><p className="eyebrow">Do this outside the screen</p><p>{current.action}</p></section>
    <button className="primary-button" onClick={onNext}>{step === protocol.steps.length - 1 ? 'I did this and left work' : current.completion}</button>
    <button className="text-button" onClick={onBack}>Leave this practice</button>
    <p className="after-work-footnote">Mirellis moves forward only when you confirm the action. Leaving does not count as completion.</p>
  </section>;
}

function StepHeader({ step, title }: { step: number; title: string }) {
  return <><div className="session-progress" aria-label={`Step ${step} of 3`}><span style={{ width: `${(step / 3) * 100}%` }} /></div><p className="eyebrow">Step {step} of 3 · {title}</p></>;
}

function ChoiceList({ label, options, value, onChoose }: { label: string; options: string[]; value: string; onChoose: (value: string) => void }) {
  return <div className="plain-choice-list" role="group" aria-label={label}>{options.map((option) => <button key={option} className={value === option ? 'plain-choice is-selected' : 'plain-choice'} aria-pressed={value === option} onClick={() => onChoose(option)}>{option}</button>)}</div>;
}

function ActivityChoice({ value, other, onChoose, onOther }: { value: string; other: string; onChoose: (value: string) => void; onOther: (value: string) => void }) {
  return <section className="activity-choice"><p className="choice-prompt">Next, what small part of your evening will you begin?</p><ChoiceList label="Evening activity" options={eveningActivities} value={value} onChoose={onChoose} />{value === 'Something else I choose' && <label className="training-field">What will you begin?<input value={other} onChange={(event) => onOther(event.target.value)} placeholder="Name one small, specific activity" /></label>}</section>;
}
