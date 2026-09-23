'use client';

import { useActionState, useRef } from 'react';
import { submitEventRegistration, type EventRegistrationState } from '@/app/actions/eventRegistrations';
import { useAltFitAutofill } from '@/lib/useAltFitAutofill';
import AltFitAutofillButton from '@/components/ui/AltFitAutofillButton';

const inputClass =
  'rounded-lg border border-border-white bg-panel px-4 py-3 text-sm text-fg outline-none transition-colors focus:border-teal';

export default function EventRegisterForm({ eventId }: { eventId: string }) {
  const [state, formAction, pending] = useActionState<EventRegistrationState | undefined, FormData>(
    submitEventRegistration,
    undefined,
  );

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const { status: autofillStatus, connectAltFit } = useAltFitAutofill({
    name: nameRef,
    email: emailRef,
    phone: phoneRef,
  });

  if (state?.success) {
    return (
      <div className="rounded-2xl border border-teal/30 bg-panel p-8 text-center">
        <p className="font-display text-2xl uppercase tracking-wide text-fg">You&apos;re In!</p>
        <p className="mt-2 font-body text-sm text-muted">
          We&apos;ve got your registration - see you on court.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <input type="hidden" name="eventId" value={eventId} />
      <AltFitAutofillButton status={autofillStatus} onClick={connectAltFit} />
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
        {pending ? 'Registering…' : 'Register'}
      </button>
    </form>
  );
}
