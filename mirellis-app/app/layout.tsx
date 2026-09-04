import type { Metadata, Viewport } from 'next';
import { PwaRegistration } from '@/components/PwaRegistration';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://app.mirellis.in'),
  title: 'Mirellis — A Private Companion for Difficult Moments',
  description: 'Choose what is difficult now and begin one practical action for waking, focus, leaving work or stopping for sleep.',
  applicationName: 'Mirellis',
  icons: {
    icon: [
      { url: '/icon.png?v=20260826', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png?v=20260826',
    shortcut: '/icon.png?v=20260826',
  },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Mirellis — A Private Companion for Difficult Moments',
    description: 'A private, action-first companion for waking, focus, leaving work and stopping for sleep.',
    url: 'https://app.mirellis.in',
    siteName: 'Mirellis',
    type: 'website',
  },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Mirellis' },
};

export const viewport: Viewport = {
  themeColor: '#f6f1e8',
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PwaRegistration />
        {children}
      </body>
    </html>
  );
}
