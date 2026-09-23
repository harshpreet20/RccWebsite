'use client';

import { useState } from 'react';
import { LinkButton, Button } from '@/components/ui/Button';
import EventRegisterModal from '@/components/ui/EventRegisterModal';

export default function EventRegisterButton({
  eventId,
  eventTitle,
  externalUrl,
}: {
  eventId: string | null;
  eventTitle: string;
  externalUrl: string | null;
}) {
  const [open, setOpen] = useState(false);

  // An admin-set register_url (e.g. Hudle, a ticketing link) always wins.
  if (externalUrl) {
    return (
      <LinkButton href={externalUrl} variant="primary">
        Register Now
      </LinkButton>
    );
  }

  // No real published event to register for (e.g. the hardcoded fallback
  // shown when there are no upcoming events) -- nothing to open.
  if (!eventId) {
    return (
      <LinkButton href="#event" variant="primary">
        Register Now
      </LinkButton>
    );
  }

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Register Now
      </Button>
      {open && (
        <EventRegisterModal eventId={eventId} eventTitle={eventTitle} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
