import type { Metadata } from 'next';
import './globals.css';
import { Shell } from '@/components/Shell';

export const metadata: Metadata = {
  title: 'Crawford Feeding — Admin Portal',
  description: 'Bursary and hostel feeding management',
};

/**
 * Root layout — Shell handles collapsible sidebar + login-only guard.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F4F5F7] text-gray-900 antialiased">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
