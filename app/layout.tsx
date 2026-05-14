import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import SmoothScroll from '@/components/layout/SmoothScroll';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Racquets Club Community (RCC) — Delhi's Invite-Only Badminton Community",
  description:
    "RCC is Delhi's invite-only badminton community for serious players. Regular games, tournaments, and meaningful player connections. Smash. Connect. Compete.",
  keywords: 'badminton, Delhi, invite-only, community, RCC, Racquets Club, tournaments, sports',
  openGraph: {
    title: 'Racquets Club Community (RCC)',
    description: "Delhi's invite-only badminton community. Smash. Connect. Compete.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-[#050810] text-white overflow-x-hidden">
        <SmoothScroll>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </SmoothScroll>
      </body>
    </html>
  );
}
