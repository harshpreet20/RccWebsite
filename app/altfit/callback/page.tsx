'use client';

import { useEffect } from 'react';

// Minimal callback target for the AltFit autofill popup: AltFit's /connect/rcc
// redirects here (this URL, not the form's own page, so the popup doesn't have
// to reload the whole site) with a signed token in the query string. This page's
// only job is to hand that token to the window that opened the popup and close
// itself -- like a password manager's "sign in with X" popup.
export default function AltFitCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('altfit_token');
    const state = params.get('altfit_state');

    if (window.opener && token) {
      window.opener.postMessage({ type: 'altfit_token', token, state }, window.location.origin);
    }
    window.close();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <p className="font-body text-sm text-muted">You can close this window…</p>
    </div>
  );
}
