'use server';

import { createClient } from '@/lib/supabase/server';

export type EventRegistrationState = { error: string; success?: false } | { success: true };

export async function submitEventRegistration(
  _prevState: EventRegistrationState | undefined,
  formData: FormData,
): Promise<EventRegistrationState> {
  const eventId = String(formData.get('eventId') ?? '').trim();
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim() || null;

  if (!eventId) {
    return { error: 'Missing event.' };
  }
  if (!name || !email) {
    return { error: 'Name and email are required.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('event_registrations').insert({
    event_id: eventId,
    name,
    email,
    phone,
    source: 'web',
  });

  if (error) {
    return { error: 'Something went wrong. Please try again.' };
  }

  return { success: true };
}
