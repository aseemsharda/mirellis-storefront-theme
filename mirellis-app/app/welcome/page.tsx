import type { Metadata } from 'next';
import { WelcomeLanding } from '@/components/WelcomeLanding';

export const metadata: Metadata = {
  title: 'Mirellis app — a practical companion for your day',
  description:
    'Mirellis turns waking, focus, stress, restoration, and sleep into practical routes you can use when the moment is real. Add it to your phone in one minute.',
  alternates: { canonical: '/welcome' },
  openGraph: {
    title: 'Mirellis — a practical companion for your day',
    description:
      'Practical routes for waking, focus, stress, restoration, and sleep. Add Mirellis to your phone and use it daily.',
    url: 'https://app.mirellis.in/welcome',
    siteName: 'Mirellis',
    type: 'website',
  },
};

export default function WelcomePage() {
  return <WelcomeLanding />;
}
