'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import type { EventRow } from './types';

type FormAction = (prevState: unknown, formData: FormData) => Promise<{ error: string } | void>;

export default function EventForm({
  action,
  event,
}: {
  action: FormAction;
  event?: EventRow;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Title">
        <input
          name="title"
          defaultValue={event?.title}
          required
          className={inputClass}
        />
      </Field>

      <Field label="Subtitle">
        <input name="subtitle" defaultValue={event?.subtitle ?? ''} className={inputClass} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Date">
          <input
            type="date"
            name="event_date"
            defaultValue={event?.event_date}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Venue">
          <input name="venue" defaultValue={event?.venue ?? ''} className={inputClass} />
        </Field>
      </div>

      <Field label="Features (one per line)">
        <textarea
          name="features"
          rows={3}
          defaultValue={event?.features?.join('\n')}
          className={inputClass}
        />
      </Field>

      <Field label="Register URL">
        <input
          name="register_url"
          type="url"
          placeholder="https://…"
          defaultValue={event?.register_url ?? ''}
          className={inputClass}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={event?.is_published ?? false}
          className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
        />
        Published (visible on the homepage)
      </label>

      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600">{state.error}</p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {pending ? 'Saving…' : 'Save Event'}
        </button>
        <Link
          href="/admin/events"
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

const inputClass =
  'rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-[15px] text-neutral-900 outline-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-700">{label}</label>
      {children}
    </div>
  );
}
