'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Brain,
  CaretRight,
  CheckCircle,
  ChartLineUp,
  Clock,
  House,
  Leaf,
  ListChecks,
  MapTrifold,
  MoonStars,
  Question,
  Sun,
  Target,
  UserCircle,
  Warning,
} from '@phosphor-icons/react';
import { MirellisBrand } from '@/components/MirellisBrand';
import { ensureMirellisProfile, recordMirellisEvent, saveActiveConcern } from '@/lib/mirellis-persistence';
import { getSupabaseBrowserClient, hasSupabaseConfiguration } from '@/lib/supabase/browser';

type Tab = 'today' | 'route' | 'record' | 'help';
type ProtocolStep = 'overview' | 'define' | 'practice' | 'tradeoff';
type Account = { id: string; email: string };

type Concern = {
  id: string;
  family: 'Waking' | 'Focus' | 'Stress' | 'Restoration' | 'Sleep';
  title: string;
  protocol: string;
  action: string;
  detail: string;
  icon: typeof Sun;
};

const concerns: Concern[] = [
  {
    id: 'waking', family: 'Waking', title: 'I wake up groggy and lose the morning.',
    protocol: 'Morning activation route', action: 'Choose one useful first block.',
    detail: 'Begin with a small action that makes this morning visibly different.', icon: Sun,
  },
  {
    id: 'focus', family: 'Focus', title: 'I stare at my screen and nothing happens.',
    protocol: 'Task initiation protocol', action: 'Make the task startable.',
    detail: 'Define a tiny, visible first three minutes before asking for momentum.', icon: Target,
  },
  {
    id: 'stress', family: 'Stress', title: 'My mind will not come down from high alert.',
    protocol: 'Downshift route', action: 'Interrupt the stress loop.',
    detail: 'Name the pressure and choose the next action before it controls the evening.', icon: Brain,
  },
  {
    id: 'restoration', family: 'Restoration', title: 'I rest, but I do not feel restored.',
    protocol: 'Recovery quality route', action: 'Protect one real recovery block.',
    detail: 'Use the time to restore energy, not only to stop working.', icon: Leaf,
  },
  {
    id: 'sleep', family: 'Sleep', title: 'I cannot switch off when it is time to sleep.',
    protocol: 'Sleep wind-down route', action: 'Build a deliberate landing.',
    detail: 'Create a repeatable sequence that tells your day it is ending.', icon: MoonStars,
  },
];

const evidence = [
  ['FOCUS START', '9:00 AM'],
  ['WORK CLOSE', '7:00 PM'],
  ['INTERRUPTION BOUNDARY', '7:30 PM'],
] as const;

export function ConcernRouteApp() {
  const [tab, setTab] = useState<Tab>('today');
  const [currentConcernId, setCurrentConcernId] = useState('focus');
  const [step, setStep] = useState<ProtocolStep>('overview');
  const [answers, setAnswers] = useState({ outcome: '', visibleStep: '', support: '' });
  const [recorded, setRecorded] = useState<string[]>([]);
  const [tradeoff, setTradeoff] = useState<string>();
  const [accountOpen, setAccountOpen] = useState(false);
  const [account, setAccount] = useState<Account>();
  const [email, setEmail] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const [sendingLink, setSendingLink] = useState(false);
  const concern = useMemo(() => concerns.find((item) => item.id === currentConcernId) ?? concerns[1], [currentConcernId]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const applyUser = (user: { id: string; email?: string } | null) => {
      setAccount(user ? { id: user.id, email: user.email ?? 'Your account' } : undefined);
      if (user) void loadAccountData(user.id);
    };
    void client.auth.getUser().then(({ data }) => applyUser(data.user));
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => applyUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const loadAccountData = async (userId: string) => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    try {
      await ensureMirellisProfile(client, userId);
      const [{ data: route, error: routeError }, { data: events, error: eventsError }] = await Promise.all([
        client.from('mirellis_active_routes').select('concern_key').eq('user_id', userId).maybeSingle(),
        client.from('mirellis_journey_events').select('event_data, occurred_at').eq('user_id', userId).eq('event_type', 'protocol_result_recorded').order('occurred_at', { ascending: false }).limit(20),
      ]);
      if (routeError) throw routeError;
      if (eventsError) throw eventsError;
      if (route?.concern_key && concerns.some((item) => item.id === route.concern_key)) setCurrentConcernId(route.concern_key);
      if (events) setRecorded(events.map((event) => String(event.event_data.label ?? 'Protocol result recorded')));
      setSyncMessage('Your route is securely connected.');
    } catch {
      setSyncMessage('We could not load your saved route yet. Your current actions remain visible in this session.');
    }
  };

  const persistEvent = async (eventType: 'concern_selected' | 'protocol_started' | 'protocol_result_recorded' | 'tradeoff_selected', eventData: Record<string, string>) => {
    const client = getSupabaseBrowserClient();
    if (!client || !account) return;
    try {
      await recordMirellisEvent(client, account.id, eventType, eventData);
      setSyncMessage('Saved to your Mirellis record.');
    } catch {
      setSyncMessage('We could not save this yet. Your current session is still open.');
    }
  };

  const openProtocol = () => {
    setStep('define');
    setTab('today');
    void persistEvent('protocol_started', { concern: concern.id, protocol: concern.protocol });
  };
  const chooseConcern = (id: string) => {
    const nextConcern = concerns.find((item) => item.id === id);
    setCurrentConcernId(id);
    setStep('overview');
    setTab('today');
    if (nextConcern && account) {
      const client = getSupabaseBrowserClient();
      if (client) void saveActiveConcern(client, account.id, nextConcern.id, nextConcern.family)
        .then(() => persistEvent('concern_selected', { concern: nextConcern.id, family: nextConcern.family }))
        .catch(() => setSyncMessage('We could not save that route yet.'));
    }
  };
  const recordAttempt = (result: string) => {
    const label = `${concern.family}: ${result}`;
    setRecorded((items) => [label, ...items]);
    setStep('overview');
    setTab('record');
    void persistEvent(result.startsWith('Trade-off') ? 'tradeoff_selected' : 'protocol_result_recorded', { concern: concern.id, label: result });
  };

  const sendMagicLink = async () => {
    const client = getSupabaseBrowserClient();
    if (!client || !email.trim()) return;
    setSendingLink(true);
    setSyncMessage('');
    const { error } = await client.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: window.location.origin } });
    setSendingLink(false);
    setSyncMessage(error ? 'We could not send that link. Check the email address and try again.' : 'Check your email for a secure sign-in link.');
  };

  const signOut = async () => {
    const client = getSupabaseBrowserClient();
    if (client) await client.auth.signOut();
    setAccountOpen(false);
    setSyncMessage('You are signed out.');
  };

  if (step !== 'overview') {
    return <ProtocolScreen
      concern={concern}
      step={step}
      answers={answers}
      tradeoff={tradeoff}
      onBack={() => setStep('overview')}
      onAnswers={setAnswers}
      onReady={() => setStep('practice')}
      onTradeoff={() => setStep('tradeoff')}
      onChooseTradeoff={setTradeoff}
      onRecord={recordAttempt}
    />;
  }

  return <main className="route-app-shell">
    <div className="route-app-frame">
      <header className="route-header">
        <MirellisBrand label="Mirellis" />
        <button className="route-profile" aria-label="Open account settings" onClick={() => setAccountOpen(true)}><UserCircle size={27} weight="light" /></button>
      </header>

      {tab === 'today' && <TodayScreen concern={concern} onStart={openProtocol} onTradeoff={() => setStep('tradeoff')} />}
      {tab === 'route' && <RouteScreen selectedId={currentConcernId} onChoose={chooseConcern} />}
      {tab === 'record' && <RecordScreen records={recorded} onReturn={() => setTab('today')} signedIn={Boolean(account)} />}
      {tab === 'help' && <HelpScreen />}

      <BottomNav active={tab} onChange={setTab} />
      {accountOpen && <AccountSheet
        account={account}
        email={email}
        message={syncMessage}
        sendingLink={sendingLink}
        configured={hasSupabaseConfiguration()}
        onClose={() => setAccountOpen(false)}
        onEmail={setEmail}
        onSend={sendMagicLink}
        onSignOut={signOut}
      />}
    </div>
  </main>;
}

function TodayScreen({ concern, onStart, onTradeoff }: { concern: Concern; onStart: () => void; onTradeoff: () => void }) {
  return <section className="route-content route-today">
    <h1 className="route-page-title">Today’s Route</h1>
    <div className="route-page-rule" />
    <section className="route-current-concern" aria-label="Current concern">
      <p>Current concern</p>
      <h1>{concern.title}</h1>
      <span>{concern.family} <i>·</i> {concern.protocol} <i>·</i> Level 1</span>
    </section>

    <section className="route-active-protocol">
      <div><span className="route-level">Level 1</span><h2>{concern.action}</h2></div>
      <p>{concern.detail}</p>
      <button className="route-primary" onClick={onStart}>I’m ready to begin <CaretRight size={21} aria-hidden="true" /></button>
    </section>

    <section className="route-evidence" aria-label="Today’s evidence">
      <div className="route-section-heading"><span>Today’s evidence</span><ChartLineUp size={21} weight="light" aria-hidden="true" /></div>
      <div className="route-evidence-grid">{evidence.map(([label, time]) => <div key={label}><span>{label}</span><strong>{time}</strong></div>)}</div>
    </section>

    <section className="route-overdue" aria-label="Work close trade-off">
      <div><Warning size={22} weight="light" aria-hidden="true" /><p><strong>At 7:30 · 30 minutes overdue.</strong><br />Continuing work moves tonight’s recovery plan.</p></div>
      <button onClick={onTradeoff}>Choose the trade-off <CaretRight size={17} aria-hidden="true" /></button>
    </section>

    <ProtocolStages active="start" />
  </section>;
}

function RouteScreen({ selectedId, onChoose }: { selectedId: string; onChoose: (id: string) => void }) {
  return <section className="route-content route-list-screen">
    <p className="route-eyebrow">Choose the problem, not a generic habit.</p>
    <h1>What needs your attention?</h1>
    <p className="route-intro">Each route begins with the exact moment that is failing, then gives you a small protocol to test.</p>
    <div className="route-concern-list">{concerns.map((concern) => {
      const Icon = concern.icon;
      return <button className={selectedId === concern.id ? 'route-concern-card is-selected' : 'route-concern-card'} key={concern.id} onClick={() => onChoose(concern.id)}>
        <Icon size={24} weight="light" aria-hidden="true" />
        <span><small>{concern.family}</small><strong>{concern.title}</strong><em>{concern.action}</em></span>
        <CaretRight size={19} aria-hidden="true" />
      </button>;
    })}</div>
  </section>;
}

function RecordScreen({ records, onReturn, signedIn }: { records: string[]; onReturn: () => void; signedIn: boolean }) {
  return <section className="route-content route-record-screen">
    <p className="route-eyebrow">Your record</p>
    <h1>What you actually tried.</h1>
    <p className="route-intro">Mirellis records your chosen actions and outcomes. It does not diagnose you or turn your life into a score.</p>
    {!signedIn && <p className="route-session-note">This is visible for this open session. Sign in from the account icon to keep it across devices.</p>}
    {records.length ? <div className="route-record-list">{records.map((record, index) => <article key={`${record}-${index}`}><CheckCircle size={23} weight="light" aria-hidden="true" /><div><span>Recorded now</span><p>{record}</p></div></article>)}</div> : <section className="route-empty-record"><ListChecks size={38} weight="thin" aria-hidden="true" /><h2>Nothing recorded yet.</h2><p>Start one protocol and record whether you could take the first action.</p><button className="route-secondary" onClick={onReturn}>Return to today</button></section>}
  </section>;
}

function AccountSheet({ account, email, message, sendingLink, configured, onClose, onEmail, onSend, onSignOut }: {
  account?: Account;
  email: string;
  message: string;
  sendingLink: boolean;
  configured: boolean;
  onClose: () => void;
  onEmail: (email: string) => void;
  onSend: () => void;
  onSignOut: () => void;
}) {
  return <section className="route-account-overlay" role="dialog" aria-modal="true" aria-labelledby="account-title">
    <div className="route-account-sheet">
      <button className="route-account-close" onClick={onClose} aria-label="Close account">Close</button>
      <p className="route-eyebrow">Your Mirellis record</p>
      <h2 id="account-title">{account ? 'Your route is connected.' : 'Keep the route you are building.'}</h2>
      {account ? <>
        <p>{account.email}</p>
        <button className="route-secondary" onClick={onSignOut}>Sign out</button>
      </> : configured ? <>
        <p>Use an email link. There is no password to remember.</p>
        <label className="route-email-field"><span>Email address</span><input value={email} type="email" autoComplete="email" placeholder="you@example.com" onChange={(event) => onEmail(event.target.value)} /></label>
        <button className="route-primary" disabled={!email.trim() || sendingLink} onClick={onSend}>{sendingLink ? 'Sending link…' : 'Email me a sign-in link'}</button>
      </> : <p>This app is ready for secure saving, but its Supabase connection has not been configured yet.</p>}
      {message && <p className="route-account-message" role="status">{message}</p>}
    </div>
  </section>;
}

function HelpScreen() {
  return <section className="route-content route-help-screen">
    <p className="route-eyebrow">Help and limits</p>
    <h1>Use the right kind of support.</h1>
    <p className="route-intro">Mirellis helps you practise ordinary changes. It is not a diagnosis, therapy or emergency service.</p>
    <div className="route-help-list">
      <a href="https://mirellis.in/concerns" target="_blank" rel="noreferrer"><Question size={23} weight="light" aria-hidden="true" /><span><strong>Understand a concern</strong><em>Read the Mirellis concern directory</em></span><CaretRight size={18} aria-hidden="true" /></a>
      <a href="https://www.google.com/search?q=mental+health+emergency+India+112+Tele-MANAS" target="_blank" rel="noreferrer"><Warning size={23} weight="light" aria-hidden="true" /><span><strong>Urgent support</strong><em>Use local emergency or qualified care when safety is at risk</em></span><CaretRight size={18} aria-hidden="true" /></a>
    </div>
  </section>;
}

function ProtocolScreen({ concern, step, answers, tradeoff, onBack, onAnswers, onReady, onTradeoff, onChooseTradeoff, onRecord }: {
  concern: Concern;
  step: ProtocolStep;
  answers: { outcome: string; visibleStep: string; support: string };
  tradeoff?: string;
  onBack: () => void;
  onAnswers: (answers: { outcome: string; visibleStep: string; support: string }) => void;
  onReady: () => void;
  onTradeoff: () => void;
  onChooseTradeoff: (choice: string) => void;
  onRecord: (result: string) => void;
}) {
  if (step === 'tradeoff') return <main className="route-app-shell"><div className="route-app-frame route-protocol-frame"><section className="route-protocol-screen">
    <button className="route-back" onClick={onBack}><ArrowLeft size={23} aria-hidden="true" /> Back</button>
    <p className="route-eyebrow">Close the loop</p>
    <h1>Work was planned to close at 7:00.</h1>
    <p className="route-intro">It is 7:30. This extra time must come from somewhere: tonight’s recovery, your evening, or tomorrow’s sleep. Do not leave the cost unnamed.</p>
    <section className="route-tradeoff-options" aria-label="Choose a trade-off">
      {[
        ['Close now', 'Write the next visible step, stop, and keep the rest of the evening.'],
        ['Carry it forward', 'Name the first task for tomorrow. Do not pretend it is still today’s plan.'],
        ['Trade something deliberately', 'Move a flexible activity, then protect a recovery block within the next seven days.'],
      ].map(([choice, detail]) => <button className={tradeoff === choice ? 'is-selected' : ''} key={choice} onClick={() => onChooseTradeoff(choice)}><strong>{choice}</strong><span>{detail}</span></button>)}
    </section>
    <button className="route-primary" disabled={!tradeoff} onClick={() => onRecord(`Trade-off chosen: ${tradeoff}`)}>Record the decision <CaretRight size={21} aria-hidden="true" /></button>
  </section></div></main>;

  if (step === 'practice') return <main className="route-app-shell"><div className="route-app-frame route-protocol-frame"><section className="route-protocol-screen">
    <button className="route-back" onClick={onBack}><ArrowLeft size={23} aria-hidden="true" /> Back</button>
    <p className="route-eyebrow">Start</p>
    <h1>Only do the first three minutes.</h1>
    <section className="route-start-card"><span>Your first visible step</span><p>{answers.visibleStep || 'Open the task and make the first mark.'}</p><small>{answers.support || 'Protect this small start from interruption.'}</small></section>
    <p className="route-intro">You are not proving anything with a timer. Take the step you named, then return to say what happened.</p>
    <button className="route-primary" onClick={() => onRecord('I took the first three minutes')}>I kept the first three minutes <CheckCircle size={21} aria-hidden="true" /></button>
    <button className="route-text-button" onClick={() => onRecord('I could not begin yet')}>I could not begin yet</button>
    <ProtocolStages active="return" />
  </section></div></main>;

  return <main className="route-app-shell"><div className="route-app-frame route-protocol-frame"><section className="route-protocol-screen">
    <button className="route-back" onClick={onBack}><ArrowLeft size={23} aria-hidden="true" /> Back</button>
    <p className="route-eyebrow">Active protocol</p>
    <h1>{concern.title}</h1>
    <p className="route-protocol-meta">{concern.family} <i>·</i> {concern.protocol} <i>·</i> Level 1</p>
    <hr />
    <span className="route-level">Level 1</span>
    <h2>{concern.action}</h2>
    <p className="route-intro">Before momentum comes clarity. Define a small, doable first three minutes.</p>
    <section className="route-define-form">
      <p>Define the first three minutes</p>
      <RouteInput number="1" icon={<Target size={25} weight="light" />} label="What outcome matters right now?" value={answers.outcome} placeholder="Draft the outline for the report" onChange={(outcome) => onAnswers({ ...answers, outcome })} />
      <RouteInput number="2" icon={<ListChecks size={25} weight="light" />} label="What is the first visible step?" value={answers.visibleStep} placeholder="Open the document and add a title" onChange={(visibleStep) => onAnswers({ ...answers, visibleStep })} />
      <RouteInput number="3" icon={<Clock size={25} weight="light" />} label="What will support you for three minutes?" value={answers.support} placeholder="Silence notifications, keep water nearby" onChange={(support) => onAnswers({ ...answers, support })} />
    </section>
    <details className="route-why"><summary>Why this step exists</summary><p>Reducing decision load and choosing a visible first action can make it easier to move from overwhelm into action.</p></details>
    <button className="route-primary" disabled={!answers.outcome || !answers.visibleStep || !answers.support} onClick={onReady}>I’m ready to begin <CaretRight size={21} aria-hidden="true" /></button>
    <ProtocolStages active="start" />
  </section></div></main>;
}

function RouteInput({ number, icon, label, value, placeholder, onChange }: { number: string; icon: React.ReactNode; label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return <label className="route-input-row"><span className="route-input-number">{number}</span><span className="route-input-icon">{icon}</span><span><strong>{label}</strong><input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></span></label>;
}

function ProtocolStages({ active }: { active: 'start' | 'return' }) {
  const items = ['Foundation', 'Start', 'Return', 'Deepen'];
  const activeIndex = active === 'start' ? 1 : 2;
  return <ol className="route-stages" aria-label="Protocol progress">{items.map((item, index) => <li className={index <= activeIndex ? 'is-complete' : ''} key={item}><span>{index < activeIndex ? <CheckCircle size={19} weight="fill" aria-hidden="true" /> : index + 1}</span><small>{item}</small></li>)}</ol>;
}

function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const items: { id: Tab; label: string; icon: typeof House }[] = [
    { id: 'today', label: 'Today', icon: House }, { id: 'route', label: 'Route', icon: MapTrifold },
    { id: 'record', label: 'Record', icon: ChartLineUp }, { id: 'help', label: 'Help', icon: Question },
  ];
  return <nav className="route-bottom-nav" aria-label="Primary navigation">{items.map(({ id, label, icon: Icon }) => <button className={active === id ? 'is-active' : ''} aria-current={active === id ? 'page' : undefined} key={id} onClick={() => onChange(id)}><Icon size={22} weight={active === id ? 'fill' : 'light'} aria-hidden="true" /><span>{label}</span></button>)}</nav>;
}
