'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { rccadminFetch } from '@/lib/rccadmin-api';

type Event = {
  id: string;
  title: string;
  description: string;
  event_type: string;
  event_date: string;
  venue: string;
  format: string;
  status: string;
};

function RegisterForm({ event, onDone }: { event: Event; onDone: (ticketId: string) => void }) {
  const [form, setForm] = useState({ member_name: '', member_email: '', phone: '', skill_level: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.member_name.trim() || !form.member_email.trim() || !form.skill_level) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const json = await rccadminFetch('/api/public/events/register', {
        method: 'POST',
        body: JSON.stringify({ event_id: event.id, ...form }),
      });
      onDone(json.ticket_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
      {error && <p className="text-sm text-red-400">{error}</p>}
      <input
        placeholder="Full name"
        value={form.member_name}
        onChange={(e) => setForm({ ...form, member_name: e.target.value })}
        className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-gold)]/50"
      />
      <input
        type="email"
        placeholder="Email"
        value={form.member_email}
        onChange={(e) => setForm({ ...form, member_email: e.target.value })}
        className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-gold)]/50"
      />
      <input
        placeholder="Phone (optional)"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-gold)]/50"
      />
      <select
        value={form.skill_level}
        onChange={(e) => setForm({ ...form, skill_level: e.target.value })}
        className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-[var(--color-gold)]/50"
      >
        <option value="">Skill level</option>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
        <option>Professional</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex items-center justify-center gap-2 rounded-md bg-[var(--color-gold)] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-110 disabled:opacity-60"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? 'Registering…' : 'Register & Get Ticket'}
      </button>
    </form>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Event | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    rccadminFetch('/api/public/events')
      .then((json) => setEvents(json.events || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] pt-24">
      <Navbar />
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--color-teal)]">Events</p>
        <h1 className="mt-3 font-[var(--font-montserrat)] text-4xl font-extrabold uppercase text-white">Upcoming RCC Events</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={28} className="animate-spin text-white/30" />
          </div>
        ) : events.length === 0 ? (
          <p className="mt-10 text-white/50">No upcoming events right now — check back soon.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {events.map((ev) => (
              <div key={ev.id} className="rounded-3xl border border-white/10 bg-[#111111] p-6">
                <h3 className="font-[var(--font-montserrat)] text-xl font-extrabold uppercase text-white">{ev.title}</h3>
                <p className="mt-2 text-sm text-white/60">{ev.description}</p>
                <div className="mt-4 space-y-1.5 text-sm text-white/50">
                  <p className="flex items-center gap-2"><Calendar size={14} className="text-[var(--color-teal)]" /> {new Date(ev.event_date).toLocaleDateString()}</p>
                  <p className="flex items-center gap-2"><MapPin size={14} className="text-[var(--color-teal)]" /> {ev.venue}</p>
                </div>

                {selected?.id === ev.id ? (
                  ticketId ? (
                    <div className="mt-5 flex items-center gap-2 rounded-md border border-[var(--color-teal)]/30 bg-[var(--color-teal)]/10 p-4 text-sm text-[var(--color-teal)]">
                      <CheckCircle2 size={16} /> Registered! Ticket: {ticketId}
                    </div>
                  ) : (
                    <RegisterForm event={ev} onDone={(id) => setTicketId(id)} />
                  )
                ) : (
                  <button
                    onClick={() => setSelected(ev)}
                    className="mt-5 rounded-md bg-[var(--color-gold)] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:brightness-110"
                  >
                    Register Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
