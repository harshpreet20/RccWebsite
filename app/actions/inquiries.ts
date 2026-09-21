'use server';

import { createClient } from '@/lib/supabase/server';

export type InquiryFormState = { error: string; success?: false } | { success: true };

export async function submitInquiry(
  _prevState: InquiryFormState | undefined,
  formData: FormData,
): Promise<InquiryFormState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim() || null;
  const interest = String(formData.get('interest') ?? 'general');
  const message = String(formData.get('message') ?? '').trim() || null;

  if (!name || !email) {
    return { error: 'Name and email are required.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('inquiries').insert({
    name,
    email,
    phone,
    interest,
    message,
  });

  if (error) {
    return { error: 'Something went wrong. Please try again.' };
  }

  return { success: true };
}
