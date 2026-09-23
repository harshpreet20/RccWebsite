'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

const ALTFIT_CONNECT_URL = 'https://www.altfit.org/connect/rcc';
const ALTFIT_CALLBACK_PATH = '/altfit/callback';
const ALTFIT_STATE_KEY = 'altfit_connect_state';
const POPUP_FEATURES = 'width=420,height=640,menubar=no,toolbar=no,location=no,status=no';

export type AltFitAutofillStatus = 'idle' | 'loading' | 'done' | 'error';

/**
 * "Autofill from AltFit," browser-password-manager style: clicking it opens
 * a small popup window to AltFit's login/consent screen; once approved, the
 * popup hands back a signed profile token via postMessage and closes itself
 * (app/altfit/callback/page.tsx is the popup's target, not this page), and
 * this window fills the given refs. Nothing is submitted automatically --
 * the person still reviews and submits the form themselves.
 */
export function useAltFitAutofill(refs: {
  name: RefObject<HTMLInputElement | null>;
  email: RefObject<HTMLInputElement | null>;
  phone: RefObject<HTMLInputElement | null>;
}) {
  const [status, setStatus] = useState<AltFitAutofillStatus>('idle');
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    function stopPolling() {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    }

    function handleMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (!event.data || event.data.type !== 'altfit_token') return;

      stopPolling();
      popupRef.current = null;

      const expectedState = sessionStorage.getItem(ALTFIT_STATE_KEY);
      sessionStorage.removeItem(ALTFIT_STATE_KEY);
      if (!expectedState || event.data.state !== expectedState) {
        setStatus('error');
        return;
      }

      setStatus('loading');
      fetch('/api/altfit/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: event.data.token }),
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
    }

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function connectAltFit() {
    const nonce = crypto.randomUUID();
    sessionStorage.setItem(ALTFIT_STATE_KEY, nonce);

    const returnTo = window.location.origin + ALTFIT_CALLBACK_PATH;
    const url = new URL(ALTFIT_CONNECT_URL);
    url.searchParams.set('return_to', returnTo);
    url.searchParams.set('state', nonce);

    const popup = window.open(url.toString(), 'altfit_connect', POPUP_FEATURES);
    if (!popup) {
      setStatus('error');
      return;
    }
    popupRef.current = popup;

    // Resets the button if the person closes the popup themselves without
    // finishing (declining, or just giving up) -- otherwise it would stay
    // stuck disabled forever since no message ever arrives in that case.
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      if (popupRef.current?.closed) {
        clearInterval(pollRef.current!);
        pollRef.current = null;
        popupRef.current = null;
        setStatus((current) => (current === 'loading' || current === 'done' ? current : 'idle'));
      }
    }, 500);
  }

  return { status, connectAltFit };
}
