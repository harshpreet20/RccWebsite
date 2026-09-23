import { Play, Calendar, MapPin, Check } from 'lucide-react';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import { LinkButton } from '@/components/ui/Button';
import PlaceholderPanel from '@/components/ui/PlaceholderPanel';
import { createClient } from '@/lib/supabase/server';
import type { EventRow } from '@/app/admin/events/types';

const FALLBACK_EVENT = {
  title: 'RCC Cup 2024',
  subtitle: 'Mix Skill Doubles Tournament',
  event_date: '2024-08-25',
  venue: 'Siri Fort Sports Complex',
  features: ['Exciting Matches', 'Trophies & Prizes', 'Goodies & More'],
  register_url: '#event',
};

async function getNextEvent() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('event_date', { ascending: true })
      .limit(1)
      .returns<EventRow[]>();

    return data?.[0] ?? FALLBACK_EVENT;
  } catch {
    return FALLBACK_EVENT;
  }
}

export default async function Event() {
  const event = await getNextEvent();
  const eventDateLabel = new Date(event.event_date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

  // An admin-set register_url (e.g. Hudle, a ticketing link) always wins;
  // otherwise a real published event (has an id, unlike FALLBACK_EVENT)
  // gets RCC's own registration form, so there's always somewhere to
  // register once a real event exists.
  const registerHref =
    event.register_url && event.register_url !== '#event'
      ? event.register_url
      : 'id' in event
        ? `/events/register?event=${event.id}`
        : '#event';

  return (
    <section id="event" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl border border-border-white">
        <div className="absolute inset-0">
          <PlaceholderPanel alt={`${event.title} event`} watermark className="h-full w-full" />
        </div>
        <div className="relative flex flex-col gap-5 bg-bg/60 p-8 sm:p-12">
          <SectionEyebrow>Upcoming Event</SectionEyebrow>
          <h3 className="font-display text-4xl uppercase tracking-wide text-fg sm:text-5xl">
            {event.title}
          </h3>
          {event.subtitle && (
            <p className="flex items-center gap-2 font-body text-sm text-muted">
              <Play className="h-3.5 w-3.5 text-teal" aria-hidden="true" />
              {event.subtitle}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-body text-sm text-fg">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal" aria-hidden="true" />
              {eventDateLabel}
            </span>
            {event.venue && (
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-teal" aria-hidden="true" />
                {event.venue}
              </span>
            )}
          </div>
          {event.features.length > 0 && (
            <ul className="flex flex-col gap-2">
              {event.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 font-body text-sm text-fg">
                  <Check className="h-4 w-4 shrink-0 text-teal" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <LinkButton href={registerHref} variant="primary">
              Register Now
            </LinkButton>
            <LinkButton href="#event" variant="text">
              View All Events
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
