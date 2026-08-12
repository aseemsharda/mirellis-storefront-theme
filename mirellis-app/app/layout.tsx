import type { Metadata, Viewport } from 'next';
import { PwaRegistration } from '@/components/PwaRegistration';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mirellis',
  description: 'A daily practice for ending work on purpose.',
  applicationName: 'Mirellis',
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
