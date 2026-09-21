'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

function parseFeatures(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function eventFromForm(formData: FormData) {
  return {
    title: String(formData.get('title') ?? '').trim(),
    subtitle: String(formData.get('subtitle') ?? '').trim() || null,
    event_date: String(formData.get('event_date') ?? ''),
    venue: String(formData.get('venue') ?? '').trim() || null,
    features: parseFeatures(String(formData.get('features') ?? '')),
    register_url: String(formData.get('register_url') ?? '').trim() || null,
    is_published: formData.get('is_published') === 'on',
  };
}

export async function createEvent(_prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('events').insert(eventFromForm(formData));

  if (error) return { error: error.message };

  revalidatePath('/admin/events');
  revalidatePath('/');
  redirect('/admin/events');
}

export async function updateEvent(id: string, _prevState: unknown, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from('events').update(eventFromForm(formData)).eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/events');
  revalidatePath('/');
  redirect('/admin/events');
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  await supabase.from('events').delete().eq('id', id);
  revalidatePath('/admin/events');
  revalidatePath('/');
}
