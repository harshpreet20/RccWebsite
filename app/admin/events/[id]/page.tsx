import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import EventForm from '../EventForm';
import { updateEvent } from '../actions';
import type { EventRow } from '../types';

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle<EventRow>();

  if (!event) notFound();

  return (
    <div className="max-w-xl rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <EventForm action={updateEvent.bind(null, id)} event={event} />
    </div>
  );
}
