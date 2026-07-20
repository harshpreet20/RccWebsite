import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Racquets Club Community | Delhi's Badminton Community",
  description:
    "RCC is a community of badminton lovers, united by passion and the love for the game.",
  icons: {
    icon: '/rcc-crest.webp',
    shortcut: '/rcc-crest.webp',
    apple: '/rcc-crest.webp',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="bg-bg text-white font-body overflow-x-hidden antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
