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

const navSections = [
  {
    heading: null,
    links: [
      { href: '/', label: 'Dashboard' },
    ],
  },
  {
    heading: 'Content',
    links: [
      { href: '/modules', label: 'Modules' },
      { href: '/resources', label: 'Resources' },
      { href: '/users', label: 'Users' },
    ],
  },
  {
    heading: 'Marketing',
    links: [
      { href: '/marketing/traffic', label: 'Traffic' },
      { href: '/marketing/email', label: 'Email' },
      { href: '/marketing/ads', label: 'Ads' },
      { href: '/marketing/sales', label: 'Sales' },
      { href: '/marketing/funnel', label: 'Funnel' },
      { href: '/marketing/keywords', label: 'Keywords' },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <body className="bg-background font-body text-text">
        <div className="flex min-h-screen">
          <aside className="w-56 border-r border-border bg-surface p-4">
            <h2 className="font-heading text-lg text-primary">GYP Admin</h2>
            <nav className="mt-6 space-y-5 text-sm">
              {navSections.map((section, i) => (
                <div key={i}>
                  {section.heading && (
                    <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {section.heading}
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {section.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block rounded-input px-3 py-2 hover:bg-background"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
