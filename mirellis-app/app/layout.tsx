import type { Metadata, Viewport } from 'next';
import { PwaRegistration } from '@/components/PwaRegistration';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://app.mirellis.in'),
  title: 'After Work — End the Workday Clearly | Mirellis',
  description: 'Choose what is keeping work open, take one relevant action now, or build a private 21-day workday-exit practice.',
  applicationName: 'Mirellis After Work',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'After Work — End the Workday Clearly',
    description: 'A private, action-first Mirellis practice for people who find that work continues after the workday ends.',
    url: 'https://app.mirellis.in',
    siteName: 'Mirellis',
    type: 'website',
  },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Mirellis After Work' },
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
