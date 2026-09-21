import type { Metadata } from 'next';
import { CheckCircle2, Camera, Star, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { LinkButton } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Community Rules & FAQs | Racquets Club Community',
  description:
    "RCC's community rules and frequently asked questions for members: booking, pairings, cost-sharing and conduct.",
};

const RULES = [
  'Regular & weekend games.',
  'Skill-based pairings & friendly tournaments.',
  'We book courts and provide shuttles.',
  "Rivalries or issues: any rivalry, enmity or personal discomfort with a member must be disclosed to the admins in advance, so we can avoid overlaps in pairings.",
  'No personal promotions or pulling players into other groups without admin approval.',
];

const LINKS = [
  {
    icon: Camera,
    label: 'Follow RCC on Instagram',
    href: 'https://www.instagram.com/racquetsclubcommunity/',
  },
  {
    icon: Star,
    label: 'Review us on Trustpilot',
    href: 'https://www.trustpilot.com/review/racquetsclubcommunity.com',
  },
  {
    icon: MapPin,
    label: 'Review us on Google My Business',
    href: 'https://maps.app.goo.gl/P9xKMFVvL1CkHGN56',
  },
];

export default function CommunityRulesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg">
        <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal">
            Community Rules &amp; FAQs
          </p>
          <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-fg sm:text-5xl">
            Racquets Club Community, Delhi
          </h1>
          <p className="mt-6 font-body text-base text-muted-alt sm:text-lg">
            RCC is a closed, invite-only badminton community for sincere players, from
            beginners to advanced. It&apos;s not an open forum, and it&apos;s not for
            selling, spamming or poaching members.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {RULES.map((rule) => (
              <li key={rule} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
                <span className="font-body text-sm text-fg sm:text-base">{rule}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-border-white bg-panel/60 px-5 py-4 transition-colors hover:border-teal"
              >
                <link.icon className="h-5 w-5 shrink-0 text-teal" aria-hidden="true" />
                <span className="font-body text-sm font-medium text-fg">{link.label}</span>
              </a>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border-white bg-panel/60 p-6 sm:p-8">
            <h2 className="font-display text-2xl uppercase tracking-wide text-fg">
              Booking &amp; Payment
            </h2>
            <p className="mt-4 font-body text-sm text-muted sm:text-base">
              All bookings are against advance payment only. Weekend slots are limited
              and strictly first come, first served. Backouts are fully payable. Advance
              is non-refundable unless you arrange a timely substitute.
            </p>

            <div className="mt-6 rounded-xl border border-gold/30 bg-bg-alt/80 p-5">
              <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-gold-bright">
                Fixed Cost Per Session
              </p>
              <p className="mt-2 font-display text-2xl tracking-wide text-fg">
                (Court fee &divide; No. of players) + &#8377;40
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="font-display text-2xl uppercase tracking-wide text-fg sm:text-3xl">
              In Delhi, badminton is more than a game. It&apos;s a community.
            </p>
            <div className="mt-6 flex justify-center">
              <LinkButton
                href="https://www.instagram.com/racquetsclubcommunity/"
                variant="primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Follow @racquetsclubcommunity
              </LinkButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
