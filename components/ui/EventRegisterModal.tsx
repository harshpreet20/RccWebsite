'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import EventRegisterForm from '@/components/ui/EventRegisterForm';

export default function EventRegisterModal({
  eventId,
  eventTitle,
  onClose,
}: {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-register-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border-white bg-bg p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border-white text-fg transition-colors hover:border-teal hover:text-teal"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal">
          Register
        </p>
        <h2 id="event-register-title" className="mt-2 font-display text-2xl uppercase tracking-wide text-fg sm:text-3xl">
          {eventTitle}
        </h2>

        <div className="mt-6">
          <EventRegisterForm eventId={eventId} />
        </div>
      </div>
    </div>
  );
}
