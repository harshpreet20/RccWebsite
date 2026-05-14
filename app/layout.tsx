import type { Metadata } from 'next';
import { Montserrat, Inter } from 'next/font/google';
import './globals.css';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import SmoothScroll from '@/components/layout/SmoothScroll';
import JoinPopup from '@/components/ui/JoinPopup';
import CustomCursor from '@/components/ui/CustomCursor';
import ScrollProgress from '@/components/ui/ScrollProgress';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  variable: '--font-inter',
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
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body className="antialiased bg-[#131315] text-[#e4e2e5] overflow-x-hidden cursor-none">
        <CustomCursor />
        <ScrollProgress />
        <SmoothScroll>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <JoinPopup />
        </SmoothScroll>
      </body>
    </html>
  );
}
