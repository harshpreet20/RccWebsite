import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body className="antialiased bg-[#050505] text-white overflow-x-hidden">{children}</body>
    </html>
  );
}
