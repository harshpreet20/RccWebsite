'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { submitInquiry, type InquiryFormState } from '@/app/actions/inquiries';

const INTEREST_OPTIONS = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'corporate', label: 'Corporate Event / Industry Tournament' },
  { value: 'partnership', label: 'Partnership' },
];

const inputClass =
  'rounded-lg border border-border-white bg-panel px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-teal';

const ALTFIT_CONNECT_URL = 'https://www.altfit.org/connect/rcc';
const ALTFIT_STATE_KEY = 'altfit_connect_state';

export default function QueryForm() {
  const [state, formAction, pending] = useActionState<InquiryFormState | undefined, FormData>(
    submitInquiry,
    undefined,
  );

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [autofillStatus, setAutofillStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  // Handles the redirect back from AltFit's consent page: a short-lived
  // signed token in the URL that /api/altfit/verify exchanges for the
  // member's name/email/phone. Still just fills the fields -- nothing is
  // submitted until the person reviews and clicks Send.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('altfit_token');
    const returnedState = params.get('altfit_state');
    if (!token) return;

    const expectedState = sessionStorage.getItem(ALTFIT_STATE_KEY);
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    sessionStorage.removeItem(ALTFIT_STATE_KEY);

    if (!expectedState || returnedState !== expectedState) {
      queueMicrotask(() => setAutofillStatus('error'));
      return;
    }

    queueMicrotask(() => setAutofillStatus('loading'));
    fetch('/api/altfit/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        if (nameRef.current) nameRef.current.value = data.profile.name;
        if (emailRef.current) emailRef.current.value = data.profile.email;
        if (phoneRef.current && data.profile.phone) phoneRef.current.value = data.profile.phone;
        setAutofillStatus('done');
      })
      .catch(() => setAutofillStatus('error'));
  }, []);

  function connectAltFit() {
    const nonce = crypto.randomUUID();
    sessionStorage.setItem(ALTFIT_STATE_KEY, nonce);
    const returnTo = window.location.origin + window.location.pathname + window.location.hash;
    const url = new URL(ALTFIT_CONNECT_URL);
    url.searchParams.set('return_to', returnTo);
    url.searchParams.set('state', nonce);
    window.location.href = url.toString();
  }

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
      <div className="flex items-center justify-between gap-3 sm:col-span-2">
        <p className="font-body text-xs text-muted">Fill in your details below, or</p>
        <button
          type="button"
          onClick={connectAltFit}
          disabled={autofillStatus === 'loading'}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-white px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-teal transition-colors hover:border-teal disabled:opacity-50"
        >
          {autofillStatus === 'loading' ? 'Loading your AltFit profile…' : 'Autofill from AltFit'}
        </button>
      </div>
      {autofillStatus === 'done' && (
        <p className="font-body text-xs text-teal sm:col-span-2">
          Filled in from your AltFit profile - feel free to edit anything below.
        </p>
      )}
      {autofillStatus === 'error' && (
        <p className="font-body text-xs text-red-400 sm:col-span-2">
          Couldn&apos;t load your AltFit profile - just fill in the fields below instead.
        </p>
      )}
      <input
        ref={nameRef}
        name="name"
        placeholder="Your Name"
        required
        className={`${inputClass} sm:col-span-1`}
      />
      <input
        ref={emailRef}
        name="email"
        type="email"
        placeholder="Email Address"
        required
        className={`${inputClass} sm:col-span-1`}
      />
      <input
        ref={phoneRef}
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
