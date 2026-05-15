'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/enter/backend');
      else setCheckingSession(false);
    });
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.replace('/enter/backend');
    }
  }

  if (checkingSession) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-montserrat)', color: '#888899', fontSize: 13, letterSpacing: '0.1em' }}>CHECKING SESSION...</div>
      </div>
    );
  }

  return (
    <div style={{
      background: '#0a0a0f',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div style={{
        background: 'rgba(17,17,24,0.9)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '40px 36px',
        width: '100%',
        maxWidth: 400,
        position: 'relative',
        backdropFilter: 'blur(12px)',
      }}>
        {/* Logo + title */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/rcc-logo.png" alt="RCC" style={{ height: 48, marginBottom: 16 }} />
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.6rem', color: '#D4AF37', letterSpacing: '0.1em' }}>
            ADMIN PANEL
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#555566', marginTop: 4, letterSpacing: '0.08em' }}>
            RACQUETS CLUB COMMUNITY
          </div>
        </div>

        {/* Gold accent line */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)', marginBottom: 28 }} />

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', color: '#888899', textTransform: 'uppercase', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@example.com"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#e8e8ec',
                padding: '11px 14px',
                width: '100%',
                fontFamily: 'var(--font-inter)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11, letterSpacing: '0.1em', color: '#888899', textTransform: 'uppercase', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#e8e8ec',
                padding: '11px 14px',
                width: '100%',
                fontFamily: 'var(--font-inter)',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(194,24,24,0.1)',
              border: '1px solid rgba(194,24,24,0.3)',
              borderRadius: 8,
              padding: '10px 14px',
              marginBottom: 16,
              fontFamily: 'var(--font-inter)',
              fontSize: 13,
              color: '#ff6b6b',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? 'rgba(194,24,24,0.5)' : '#C21818',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 20px',
              width: '100%',
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.06em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center', fontFamily: 'var(--font-inter)', fontSize: 11, color: '#444455', letterSpacing: '0.05em' }}>
          Authorised personnel only
        </div>
      </div>
    </div>
  );
}
