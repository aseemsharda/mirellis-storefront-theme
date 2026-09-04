'use client';

import { MirellisBrand } from '@/components/MirellisBrand';

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="app-shell centered-shell"><section className="card safety-card"><div className="error-brand"><MirellisBrand label="Mirellis" /></div><h1>This moment did not open as expected.</h1><p>Your local data remains in this browser. You can try again, or leave and return when useful.</p><button className="primary-button" onClick={reset}>Try again</button><button className="text-button" onClick={() => window.history.back()}>Leave for now</button></section></main>;
}
