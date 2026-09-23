import type { AltFitAutofillStatus } from '@/lib/useAltFitAutofill';

export default function AltFitAutofillButton({
  status,
  onClick,
}: {
  status: AltFitAutofillStatus;
  onClick: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 sm:col-span-2">
        <p className="font-body text-xs text-muted">Fill in your details below, or</p>
        <button
          type="button"
          onClick={onClick}
          disabled={status === 'loading'}
          className="inline-flex items-center gap-1.5 rounded-full border border-border-white px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-wide text-teal transition-colors hover:border-teal disabled:opacity-50"
        >
          {status === 'loading' ? 'Loading your AltFit profile…' : 'Autofill from AltFit'}
        </button>
      </div>
      {status === 'done' && (
        <p className="font-body text-xs text-teal sm:col-span-2">
          Filled in from your AltFit profile - feel free to edit anything below.
        </p>
      )}
      {status === 'error' && (
        <p className="font-body text-xs text-red-400 sm:col-span-2">
          Couldn&apos;t load your AltFit profile - just fill in the fields below instead.
        </p>
      )}
    </>
  );
}
