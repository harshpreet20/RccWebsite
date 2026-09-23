'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function deleteEventRegistration(eventId: string, id: string) {
  const supabase = await createClient();
  await supabase.from('event_registrations').delete().eq('id', id);
  revalidatePath(`/admin/events/${eventId}/registrations`);
}
