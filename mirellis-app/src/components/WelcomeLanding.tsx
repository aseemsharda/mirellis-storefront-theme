'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

type InstallOutcome = { outcome: 'accepted' | 'dismissed' };

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallOutcome>;
}

const concerns = [
  ['Waking up', 'Start your day with a deliberate first action, not another rushed promise.'],
  ['Focus', 'Make the task startable, prepare your environment, and return when attention breaks.'],
  ['Stress', 'Name the pressure you are carrying and take a practical step to reduce it.'],
  ['Restoration', 'Create real recovery after effort, before depletion becomes your normal.'],
  ['Sleep', 'Protect the choices that make a better night and a steadier tomorrow possible.'],
];

export function WelcomeLanding() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setInstalled(standalone);

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const installOrExplain = useCallback(async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      return;
    }
    document.getElementById('install')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [deferredPrompt]);

  return (
    <main className="welcome-page">
      <header className="welcome-header">
        <a className="brand" href="/" aria-label="Open Mirellis">
          <Image src="/brand/mirellis-app-icon-192.png" alt="" width={44} height={44} priority />
          <span>Mirellis</span>
        </a>
        <a className="header-link" href="/">Open app <span aria-hidden="true">→</span></a>
      </header>

      <section className="hero" aria-labelledby="welcome-title">
        <div className="hero-mark">
          <Image src="/brand/mirellis-app-icon-512.png" alt="Mirellis" width={160} height={160} priority />
        </div>
        <p className="eyebrow">Your day, handled with care</p>
        <h1 id="welcome-title">The Mirellis app helps you change the moments that shape your life.</h1>
        <p className="hero-copy">
          Most people know what they should do. The difficult part is acting at the moment it matters.
          Mirellis turns five everyday concerns into a clear route: one honest check-in, one practical step,
          and a record of what you protected.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="/">Open the Mirellis app <span aria-hidden="true">→</span></a>
          {!installed && <button type="button" className="button button-secondary" onClick={installOrExplain}>Install on my phone</button>}
          {installed && <p className="installed-note">Mirellis is already on your home screen.</p>}
        </div>
        <p className="hero-note">No app-store download. Add it from your browser and open it in one tap.</p>
      </section>

      <section className="section concern-section" aria-labelledby="concerns-title">
        <div className="section-intro">
          <p className="eyebrow">Built around the actual problem</p>
          <h2 id="concerns-title">Five concerns. One place to begin.</h2>
          <p>Mirellis does not assume you simply need more time, motivation, or information. Choose the concern that is affecting you now and work through the next right step.</p>
        </div>
        <ol className="concern-list">
          {concerns.map(([title, description], index) => (
            <li key={title}>
              <span className="concern-number">0{index + 1}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </section>

      <section className="section how-section" aria-labelledby="how-title">
        <div className="section-intro">
          <p className="eyebrow">How to use it</p>
          <h2 id="how-title">Open it when the moment is real.</h2>
        </div>
        <div className="steps">
          <article><span>1</span><h3>Choose what is difficult</h3><p>Start with the concern in front of you: waking, focus, stress, restoration, or sleep.</p></article>
          <article><span>2</span><h3>Follow one structured route</h3><p>Each route makes the next action specific enough to begin now — not later, not perfectly.</p></article>
          <article><span>3</span><h3>Return and build evidence</h3><p>Record what happened. Mirellis helps you see the promises you kept and the trade-offs you made.</p></article>
        </div>
      </section>

      <section className="section install-section" id="install" aria-labelledby="install-title">
        <div className="section-intro">
          <p className="eyebrow">Put Mirellis on your phone</p>
          <h2 id="install-title">It installs like an app. It opens like one too.</h2>
          <p>There is nothing to download from an app store. Open this page in your phone browser, add Mirellis to your home screen, and use the gold Mirellis icon whenever you need it.</p>
        </div>
        <div className="install-grid">
          <article className="install-card">
            <div className="platform">Android · Chrome</div>
            <h3>Add it in three taps</h3>
            <ol><li>Open <strong>app.mirellis.in/welcome</strong> in Chrome.</li><li>Tap <strong>Install app</strong> when Chrome offers it, or tap the three-dot menu (⋮).</li><li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li></ol>
            {deferredPrompt && !installed && <button type="button" className="inline-install" onClick={installOrExplain}>Install Mirellis now</button>}
          </article>
          <article className="install-card">
            <div className="platform">iPhone · Safari or Chrome</div>
            <h3>Add it to Home Screen</h3>
            <ol><li>Open <strong>app.mirellis.in/welcome</strong> in Safari or Chrome.</li><li>Tap the browser <strong>Share</strong> button.</li><li>Choose <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.</li></ol>
          </article>
        </div>
        <p className="browser-note">If this page opened inside Instagram, Gmail, or another app, tap its menu and choose <strong>Open in Chrome</strong> (Android) or <strong>Open in Safari</strong> (iPhone) first.</p>
      </section>

      <section className="closing">
        <p className="eyebrow">One clear action today</p>
        <h2>You do not need to solve your whole life tonight.</h2>
        <p>Begin with the concern that is costing you the most right now.</p>
        <a className="button button-primary" href="/">Begin with Mirellis <span aria-hidden="true">→</span></a>
      </section>

      <footer>
        <Image src="/brand/mirellis-app-icon-192.png" alt="" width={34} height={34} />
        <p>Mirellis is a practical wellbeing companion. It is not a substitute for medical or mental-health care.</p>
      </footer>

      <style jsx>{`
        .welcome-page { --paper: #f6f1e8; --ink: #1d2839; --muted: #646262; --line: #ded4c5; --gold: #b88545; --gold-light: #ebcb8c; --night: #121f31; min-height: 100dvh; overflow: hidden; background: var(--paper); color: var(--ink); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .welcome-header, .hero, .section, .closing, footer { width: min(100% - 40px, 1080px); margin: 0 auto; }
        .welcome-header { display: flex; align-items: center; justify-content: space-between; padding: 22px 0; }
        .brand { display: inline-flex; align-items: center; gap: 10px; color: var(--ink); font-family: Georgia, serif; font-size: 1.35rem; font-weight: 600; text-decoration: none; }
        .brand :global(img) { border-radius: 11px; }
        .header-link { color: var(--ink); font-size: .9rem; font-weight: 700; text-decoration: none; }
        .header-link span { color: var(--gold); font-size: 1.2em; }
        .hero { max-width: 880px; padding: clamp(48px, 9vw, 110px) 0 clamp(76px, 12vw, 138px); text-align: center; }
        .hero-mark { display: grid; width: 160px; height: 160px; place-items: center; margin: 0 auto 32px; border-radius: 42px; box-shadow: 0 18px 42px rgba(31, 28, 23, .16); }
        .hero-mark :global(img) { border-radius: 42px; }
        .eyebrow { margin: 0 0 14px; color: #927044; font-size: .72rem; font-weight: 800; letter-spacing: .17em; text-transform: uppercase; }
        h1, h2, h3, p { margin-top: 0; }
        h1, h2 { font-family: Georgia, "Times New Roman", serif; font-weight: 400; letter-spacing: -.045em; }
        h1 { max-width: 17ch; margin: 0 auto 22px; font-size: clamp(2.7rem, 6.2vw, 5rem); line-height: .99; }
        .hero-copy { max-width: 62ch; margin: 0 auto; color: var(--muted); font-size: clamp(1rem, 1.8vw, 1.16rem); line-height: 1.72; }
        .hero-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-top: 30px; }
        .button { display: inline-flex; min-height: 52px; align-items: center; justify-content: center; gap: 16px; border: 1px solid var(--night); border-radius: 99px; padding: 13px 22px; font-size: .95rem; font-weight: 750; text-decoration: none; transition: transform .18s ease, background .18s ease; }
        .button:hover { transform: translateY(-2px); }
        .button-primary { background: var(--night); color: #fff9ef; }
        .button-secondary { background: transparent; color: var(--night); cursor: pointer; }
        .hero-note, .installed-note { width: 100%; margin: 2px 0 0; color: var(--muted); font-size: .82rem; }
        .section { padding: clamp(62px, 10vw, 114px) 0; border-top: 1px solid var(--line); }
        .section-intro { max-width: 660px; }
        .section-intro h2, .closing h2 { margin-bottom: 16px; font-size: clamp(2rem, 4.5vw, 3.55rem); line-height: 1.03; }
        .section-intro > p:last-child { max-width: 60ch; margin-bottom: 0; color: var(--muted); line-height: 1.7; }
        .concern-list { display: grid; margin: 48px 0 0; padding: 0; border-top: 1px solid var(--line); list-style: none; }
        .concern-list li { display: grid; grid-template-columns: 62px minmax(0, 1fr); gap: 18px; padding: 22px 0; border-bottom: 1px solid var(--line); }
        .concern-number { padding-top: 6px; color: var(--gold); font-size: .75rem; font-weight: 800; letter-spacing: .1em; }
        .concern-list h3 { margin-bottom: 6px; font-family: Georgia, serif; font-size: clamp(1.35rem, 2.8vw, 1.85rem); font-weight: 400; letter-spacing: -.025em; }
        .concern-list p { max-width: 60ch; margin-bottom: 0; color: var(--muted); line-height: 1.62; }
        .how-section { width: min(100% - 40px, 1080px); }
        .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 42px; }
        .steps article, .install-card { border: 1px solid var(--line); background: rgba(255,255,255,.36); padding: 26px; }
        .steps span { display: grid; width: 32px; height: 32px; place-items: center; margin-bottom: 38px; border-radius: 50%; background: var(--gold); color: white; font-size: .8rem; font-weight: 800; }
        .steps h3, .install-card h3 { margin-bottom: 10px; font-family: Georgia, serif; font-size: 1.4rem; font-weight: 400; letter-spacing: -.025em; }
        .steps p, .install-card li { margin: 0; color: var(--muted); font-size: .94rem; line-height: 1.65; }
        .install-section { background: linear-gradient(135deg, #1a2b40, #101b2b); color: #fff8ed; }
        .install-section::before { content: ''; position: absolute; left: 0; right: 0; z-index: -1; height: 100%; background: linear-gradient(135deg, #1a2b40, #101b2b); }
        .install-section { position: relative; width: 100%; padding-left: max(20px, calc((100% - 1080px) / 2)); padding-right: max(20px, calc((100% - 1080px) / 2)); border: 0; }
        .install-section .section-intro { margin: 0 auto; }
        .install-section .eyebrow { color: var(--gold-light); }
        .install-section .section-intro > p:last-child, .browser-note { color: #d6d1c8; }
        .install-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; max-width: 1080px; margin: 44px auto 0; }
        .install-card { border-color: rgba(235, 203, 140, .35); background: rgba(255,255,255,.07); }
        .platform { margin-bottom: 30px; color: var(--gold-light); font-size: .68rem; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; }
        .install-card ol { display: grid; gap: 12px; margin: 0; padding-left: 20px; }
        .install-card li { color: #e5e1d9; }
        .inline-install { min-height: 44px; margin-top: 22px; border: 1px solid var(--gold-light); background: transparent; color: #fff8ed; padding: 8px 14px; font: inherit; font-size: .88rem; font-weight: 750; cursor: pointer; }
        .browser-note { max-width: 780px; margin: 24px auto 0; font-size: .86rem; line-height: 1.6; }
        .closing { padding: clamp(72px, 12vw, 138px) 0; text-align: center; }
        .closing h2 { max-width: 18ch; margin: 0 auto 16px; }
        .closing > p:not(.eyebrow) { max-width: 40ch; margin: 0 auto 26px; color: var(--muted); }
        footer { display: flex; align-items: center; justify-content: center; gap: 12px; border-top: 1px solid var(--line); padding: 26px 0 40px; color: var(--muted); font-size: .76rem; text-align: left; }
        footer :global(img) { border-radius: 8px; }
        footer p { max-width: 48ch; margin: 0; }
        @media (max-width: 650px) { .welcome-header, .hero, .section, .closing, footer { width: min(100% - 32px, 1080px); } .hero { padding-top: 50px; } .hero-mark, .hero-mark :global(img) { width: 126px; height: 126px; border-radius: 33px; } .steps, .install-grid { grid-template-columns: 1fr; } .install-section { padding-left: 16px; padding-right: 16px; } .concern-list { margin-top: 34px; } .concern-list li { grid-template-columns: 44px minmax(0,1fr); } .steps span { margin-bottom: 28px; } }
        @media (prefers-reduced-motion: reduce) { .button { transition: none; } }
      `}</style>
    </main>
  );
}
