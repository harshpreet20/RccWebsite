'use client';

import { useActionState } from 'react';
import { submitInquiry, type InquiryFormState } from '@/app/actions/inquiries';

const INTEREST_OPTIONS = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'corporate', label: 'Corporate Event / Industry Tournament' },
  { value: 'partnership', label: 'Partnership' },
];

const inputClass =
  'rounded-lg border border-border-white bg-panel px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-teal';

export default function QueryForm() {
  const [state, formAction, pending] = useActionState<InquiryFormState | undefined, FormData>(
    submitInquiry,
    undefined,
  );

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-teal/30 bg-panel p-8 text-center">
        <p className="font-display text-2xl uppercase tracking-wide text-fg">Thank You!</p>
        <p className="mt-2 font-body text-sm text-muted">
          We&apos;ve received your enquiry and will get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <input
        name="name"
        placeholder="Your Name"
        required
        className={`${inputClass} sm:col-span-1`}
      />
      <input
        name="email"
        type="email"
        placeholder="Email Address"
        required
        className={`${inputClass} sm:col-span-1`}
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone Number (optional)"
        className={`${inputClass} sm:col-span-1`}
      />
      <select
        name="interest"
        aria-label="What are you enquiring about?"
        defaultValue="general"
        className={`${inputClass} sm:col-span-1`}
      >
        {INTEREST_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <textarea
        name="message"
        placeholder="Tell us what you're looking for..."
        rows={4}
        className={`${inputClass} sm:col-span-2`}
      />

      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400 sm:col-span-2">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-fit items-center justify-center rounded-full bg-gold-bright px-6 py-3 font-body text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:bg-gold disabled:opacity-50 sm:col-span-2"
      >
        {pending ? 'Sending…' : 'Send Enquiry'}
      </button>
    </form>
  );
}
