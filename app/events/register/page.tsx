import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, MapPin } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionEyebrow from '@/components/ui/SectionEyebrow';
import EventRegisterForm from '@/components/ui/EventRegisterForm';
import { createClient } from '@/lib/supabase/server';
import type { EventRow } from '@/app/admin/events/types';

export const metadata: Metadata = {
  title: 'Register | Racquets Club Community',
  description: 'Register for an upcoming RCC event.',
};

async function getEvent(id: string): Promise<EventRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle<EventRow>();
  return data;
}

export default async function EventRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string }>;
}) {
  const { event: eventId } = await searchParams;
  if (!eventId) notFound();

  const event = await getEvent(eventId);
  if (!event) notFound();

  const eventDateLabel = new Date(event.event_date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <>
      <Navbar />
      <main className="bg-bg">
        <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <SectionEyebrow>Register</SectionEyebrow>
            <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-fg sm:text-5xl">
              {event.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-body text-sm text-muted">
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
          </div>

          <div className="mt-10">
            <EventRegisterForm eventId={event.id} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
