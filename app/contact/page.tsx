'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { rccadminFetch } from '@/lib/rccadmin-api';

const inputClass = 'rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-gold)]/50';

export default function ContactPage() {
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in your name, email and message.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await rccadminFetch('/api/public/contact', { method: 'POST', body: JSON.stringify(form) });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] pt-24">
      <Navbar />
      <div className="mx-auto max-w-lg px-6 py-16 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-teal)]">Get In Touch</p>
        <h1 className="mt-3 font-[var(--font-montserrat)] text-4xl font-extrabold uppercase text-white">Contact Us</h1>

        {done ? (
          <div className="mt-8 flex items-center gap-3 rounded-md border border-[var(--color-teal)]/30 bg-[var(--color-teal)]/10 p-5 text-[var(--color-teal)]">
            <CheckCircle2 size={20} />
            <p>Message sent — we&apos;ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            {error && <p className="text-sm text-red-400">{error}</p>}
            <input placeholder="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={inputClass} />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
            <input placeholder="Phone (optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
            <input placeholder="Subject (optional)" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClass} />
            <textarea placeholder="Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={inputClass} />
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[var(--color-gold)] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-110 disabled:opacity-60"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              {loading ? 'Sending…' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
      <Footer />
    </main>
  );
}
