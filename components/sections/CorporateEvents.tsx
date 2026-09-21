import { Briefcase, Trophy, Users2 } from 'lucide-react';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';

const OFFERINGS = [
  {
    icon: Briefcase,
    title: 'Corporate Events',
    copy: 'Team offsites, employee wellness days and company badminton meetups, organized end-to-end.',
  },
  {
    icon: Trophy,
    title: 'Industry Tournaments',
    copy: 'Inter-company and industry-wide tournaments with brackets, umpiring and prizes handled for you.',
  },
  {
    icon: Users2,
    title: 'Team Building',
    copy: 'Mixed-skill matchplay formats designed to get every team member on court and involved.',
  },
];

export default function CorporateEvents() {
  return (
    <section id="corporate" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <SectionEyebrow>Corporate &amp; Industry</SectionEyebrow>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-wide text-fg sm:text-5xl">
          Corporate Events &amp; Industry Tournaments.
        </h2>
        <p className="mt-4 font-body text-sm text-muted sm:text-base">
          RCC organizes corporate badminton days and industry-wide tournaments for
          companies looking to bring their teams together on court.
        </p>
        <LinkButton href="#enquire" variant="primary" className="mt-6">
          Enquire Now
        </LinkButton>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {OFFERINGS.map((offering) => (
          <div
            key={offering.title}
            className="flex flex-col items-start gap-4 rounded-2xl border border-border-white bg-panel/60 p-6"
          >
            <offering.icon className="h-8 w-8 text-teal" aria-hidden="true" />
            <h3 className="font-display text-2xl uppercase tracking-wide text-fg">
              {offering.title}
            </h3>
            <p className="font-body text-sm text-muted">{offering.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
