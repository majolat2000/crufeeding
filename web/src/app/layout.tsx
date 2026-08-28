import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Crawford Feeding — Admin Portal',
  description: 'Bursary and hostel feeding management',
};

/**
 * Root layout — dark sidebar (#1A153B) + light content area.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F5F5F7] text-gray-900 antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 min-w-0">
            <div className="max-w-[1280px] mx-auto p-6 md:p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
