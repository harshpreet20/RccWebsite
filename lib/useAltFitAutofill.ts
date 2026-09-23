'use client';

import { useEffect, type RefObject } from 'react';
import { useState } from 'react';

const ALTFIT_CONNECT_URL = 'https://www.altfit.org/connect/rcc';
const ALTFIT_STATE_KEY = 'altfit_connect_state';

export type AltFitAutofillStatus = 'idle' | 'loading' | 'done' | 'error';

/**
 * Shared "Autofill from AltFit" behavior for any form with name/email/phone
 * fields: handles the redirect back from AltFit's consent page (a
 * short-lived signed token exchanged via /api/altfit/verify) and fills the
 * given refs. Still just fills the fields -- nothing is submitted until the
 * person reviews and submits the form themselves.
 */
export function useAltFitAutofill(refs: {
  name: RefObject<HTMLInputElement | null>;
  email: RefObject<HTMLInputElement | null>;
  phone: RefObject<HTMLInputElement | null>;
}) {
  const [status, setStatus] = useState<AltFitAutofillStatus>('idle');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('altfit_token');
    const returnedState = params.get('altfit_state');
    if (!token) return;

    const expectedState = sessionStorage.getItem(ALTFIT_STATE_KEY);
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    sessionStorage.removeItem(ALTFIT_STATE_KEY);

    if (!expectedState || returnedState !== expectedState) {
      queueMicrotask(() => setStatus('error'));
      return;
    }

    queueMicrotask(() => setStatus('loading'));
    fetch('/api/altfit/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        if (refs.name.current) refs.name.current.value = data.profile.name;
        if (refs.email.current) refs.email.current.value = data.profile.email;
        if (refs.phone.current && data.profile.phone) refs.phone.current.value = data.profile.phone;
        setStatus('done');
      })
      .catch(() => setStatus('error'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return { status, connectAltFit };
}
