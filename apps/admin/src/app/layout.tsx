import type { Metadata } from 'next';
import Link from 'next/link';
import { DM_Sans, DM_Serif_Display } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmSerifDisplay = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GYP Admin',
  description: 'Content management for Grow Your Practice.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <body className="bg-background font-body text-text">
        <div className="flex min-h-screen">
          <aside className="w-56 border-r border-border bg-surface p-4">
            <h2 className="font-heading text-lg text-primary">GYP Admin</h2>
            <nav className="mt-6 space-y-2 text-sm">
              <Link href="/" className="block rounded-input px-3 py-2 hover:bg-background">
                Dashboard
              </Link>
              <Link href="/modules" className="block rounded-input px-3 py-2 hover:bg-background">
                Modules
              </Link>
              <Link href="/users" className="block rounded-input px-3 py-2 hover:bg-background">
                Users
              </Link>
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
