import type { Metadata } from 'next';
import './globals.css';
import { Shell } from '@/components/Shell';
import { SessionProvider } from '@/lib/session-context';

export const metadata: Metadata = {
  title: 'Crawford Feeding — Admin Portal',
  description: 'Bursary and hostel feeding management',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
};

/**
 * Root layout — Shell handles collapsible sidebar + login-only guard.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F4F5F7] text-gray-900 antialiased">
        <SessionProvider>
          <Shell>{children}</Shell>
        </SessionProvider>
      </body>
    </html>
  );
}
