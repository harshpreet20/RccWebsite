'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type Member = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  skill_level?: string;
  membership_plan?: string;
  status: string;
  created_at: string;
};

type Event = {
  id: string;
  title: string;
  description?: string;
  event_type: string;
  event_date: string;
  registration_deadline?: string;
  venue?: string;
  max_participants?: number;
  current_participants?: number;
  entry_fee?: number;
  prize_pool?: string;
  status: string;
  banner_url?: string;
};

type EventRegistration = {
  id: string;
  full_name: string;
  email: string;
  skill_level?: string;
  registered_at: string;
  events: { title: string; event_date: string } | null;
};

type LeaderboardEntry = {
  id: string;
  player_name: string;
  elo_rating: number;
  wins: number;
  losses: number;
  streak: number;
  skill_level?: string;
  badges?: string[];
};

type Announcement = {
  id: string;
  title: string;
  body: string;
  category?: string;
  author?: string;
  image_url?: string;
  pinned: boolean;
  created_at: string;
};

type InstagramPost = {
  id: string;
  image_url: string;
  caption?: string;
  post_url?: string;
  likes?: number;
  posted_at: string;
};

type PlayerSpotlight = {
  id: string;
  player_name: string;
  tagline?: string;
  bio?: string;
  skill_level?: string;
  youtube_url?: string;
  avatar_url?: string;
  achievements?: string[];
  featured: boolean;
  display_order?: number;
};

type Sponsor = {
  id: string;
  name: string;
  logo_url?: string;
  website_url?: string;
  tier?: string;
  category?: string;
  active: boolean;
  display_order?: number;
};

type OverviewStats = {
  totalMembers: number;
  pendingMembers: number;
  totalEvents: number;
  upcomingEvents: number;
  leaderboardEntries: number;
  announcements: number;
  instagramPosts: number;
  spotlights: number;
  sponsors: number;
  testimonials: number;
};

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  color: '#e8e8ec',
  padding: '10px 14px',
  width: '100%',
  fontFamily: 'var(--font-inter)',
  fontSize: 14,
  boxSizing: 'border-box',
  outline: 'none',
};

const primaryBtn: React.CSSProperties = {
  background: '#C21818',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '10px 20px',
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: '0.04em',
  cursor: 'pointer',
};

const dangerBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(194,24,24,0.4)',
  color: '#C21818',
  borderRadius: 6,
  padding: '5px 12px',
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
};

const successBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(34,197,94,0.4)',
  color: '#22c55e',
  borderRadius: 6,
  padding: '5px 12px',
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
};

const goldBtn: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(212,175,55,0.4)',
  color: '#D4AF37',
  borderRadius: 6,
  padding: '5px 12px',
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
};

const glassCard: React.CSSProperties = {
  background: 'rgba(17,17,24,0.8)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 14,
  padding: 24,
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  fontFamily: 'var(--font-montserrat)',
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: '0.08em',
  color: '#888899',
  textTransform: 'uppercase',
  borderBottom: '1px solid rgba(255,255,255,0.08)',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 14px',
  fontFamily: 'var(--font-inter)',
  fontSize: 13,
  color: '#e8e8ec',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 700,
  color: '#888899',
  letterSpacing: '0.06em',
  marginBottom: 6,
  textTransform: 'uppercase',
};

// ─── Toast component ──────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  if (!msg) return null;
  return (
    <div style={{
      padding: '10px 18px',
      borderRadius: 8,
      marginBottom: 16,
      background: type === 'success' ? 'rgba(34,197,94,0.12)' : 'rgba(194,24,24,0.12)',
      border: `1px solid ${type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(194,24,24,0.3)'}`,
      color: type === 'success' ? '#22c55e' : '#C21818',
      fontFamily: 'var(--font-inter)',
      fontSize: 13,
    }}>
      {msg}
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ value }: { value: string }) {
  const MAP: Record<string, [string, string]> = {
    active: ['rgba(34,197,94,0.15)', '#22c55e'],
    pending: ['rgba(212,175,55,0.15)', '#D4AF37'],
    inactive: ['rgba(194,24,24,0.15)', '#C21818'],
    upcoming: ['rgba(212,175,55,0.15)', '#D4AF37'],
    ongoing: ['rgba(34,197,94,0.15)', '#22c55e'],
    completed: ['rgba(136,136,153,0.15)', '#888899'],
    cancelled: ['rgba(194,24,24,0.15)', '#C21818'],
  };
  const [bg, color] = MAP[value] ?? ['rgba(255,255,255,0.08)', '#888899'];
  return (
    <span style={{
      background: bg,
      color,
      borderRadius: 5,
      padding: '2px 8px',
      fontSize: 11,
      fontFamily: 'var(--font-montserrat)',
      fontWeight: 700,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    }}>
      {value}
    </span>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({ title, count, action }: { title: string; count?: number; action?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#e8e8ec', letterSpacing: '0.04em', margin: 0 }}>
        {title}
        {count != null && <span style={{ fontSize: '1rem', color: '#888899', marginLeft: 8 }}>({count})</span>}
      </h2>
      {action}
    </div>
  );
}

// ─── Form section ─────────────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ ...glassCard, marginBottom: 24 }}>
      <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: '#D4AF37', margin: '0 0 16px 0', letterSpacing: '0.04em' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

// ─── Table placeholders ───────────────────────────────────────────────────────

function LoadingRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} style={{ ...tdStyle, textAlign: 'center', color: '#888899', padding: 32 }}>Loading…</td>
    </tr>
  );
}

function EmptyRow({ cols, msg }: { cols: number; msg: string }) {
  return (
    <tr>
      <td colSpan={cols} style={{ ...tdStyle, textAlign: 'center', color: '#888899', padding: 32 }}>{msg}</td>
    </tr>
  );
}

// ─── TAB 1: OVERVIEW ─────────────────────────────────────────────────────────

function OverviewModule() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const [
      { count: totalMembers },
      { count: pendingMembers },
      { count: totalEvents },
      { count: upcomingEvents },
      { count: leaderboardEntries },
      { count: announcements },
      { count: instagramPosts },
      { count: spotlights },
      { count: sponsors },
      { count: testimonials },
    ] = await Promise.all([
      supabase.from('members').select('*', { count: 'exact', head: true }),
      supabase.from('members').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
      supabase.from('leaderboard').select('*', { count: 'exact', head: true }),
      supabase.from('announcements').select('*', { count: 'exact', head: true }),
      supabase.from('instagram_posts').select('*', { count: 'exact', head: true }),
      supabase.from('player_spotlights').select('*', { count: 'exact', head: true }),
      supabase.from('sponsors').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    ]);
    setStats({
      totalMembers: totalMembers ?? 0,
      pendingMembers: pendingMembers ?? 0,
      totalEvents: totalEvents ?? 0,
      upcomingEvents: upcomingEvents ?? 0,
      leaderboardEntries: leaderboardEntries ?? 0,
      announcements: announcements ?? 0,
      instagramPosts: instagramPosts ?? 0,
      spotlights: spotlights ?? 0,
      sponsors: sponsors ?? 0,
      testimonials: testimonials ?? 0,
    });
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const cards: { icon: string; label: string; value: number; sub?: string }[] = stats
    ? [
        { icon: '👥', label: 'Total Members', value: stats.totalMembers, sub: `${stats.pendingMembers} pending` },
        { icon: '📅', label: 'Events', value: stats.totalEvents, sub: `${stats.upcomingEvents} upcoming` },
        { icon: '🏆', label: 'Leaderboard', value: stats.leaderboardEntries },
        { icon: '📢', label: 'Announcements', value: stats.announcements },
        { icon: '📸', label: 'Instagram Posts', value: stats.instagramPosts },
        { icon: '⭐', label: 'Player Spotlights', value: stats.spotlights },
        { icon: '🤝', label: 'Partners', value: stats.sponsors },
        { icon: '💬', label: 'Testimonials', value: stats.testimonials },
      ]
    : [];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#e8e8ec', letterSpacing: '0.04em', margin: 0 }}>OVERVIEW</h2>
        <button style={primaryBtn} onClick={fetchStats}>↻ Refresh</button>
      </div>
      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading stats…</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
            {cards.map(card => (
              <div key={card.label} style={glassCard}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{card.icon}</div>
                <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.2rem', color: '#D4AF37', lineHeight: 1 }}>{card.value}</div>
                <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#888899', marginTop: 4 }}>{card.label}</div>
                {card.sub && <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#D4AF37', marginTop: 3 }}>{card.sub}</div>}
              </div>
            ))}
          </div>
          {lastUpdated && (
            <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899' }}>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── TAB 2: MEMBERS ───────────────────────────────────────────────────────────

function MembersModule() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setMembers(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('members').update({ status }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast(`Member ${status}`, 'success'); fetchMembers(); }
  };

  const deleteMember = async (id: string) => {
    if (!window.confirm('Delete this member?')) return;
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Member deleted', 'success'); fetchMembers(); }
  };

  const pending = members.filter(m => m.status === 'pending').length;

  return (
    <div>
      <SectionHeading title="MEMBERS" count={members.length} />
      {pending > 0 && (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#D4AF37', marginBottom: 16 }}>
          {pending} pending approval
        </p>
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Name', 'Email', 'Phone', 'Skill', 'Plan', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <LoadingRow cols={8} />}
            {!loading && members.length === 0 && <EmptyRow cols={8} msg="No members found." />}
            {members.map(m => (
              <tr key={m.id}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{m.full_name}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{m.email}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{m.phone ?? '—'}</td>
                <td style={tdStyle}>{m.skill_level ?? '—'}</td>
                <td style={tdStyle}>{m.membership_plan ?? '—'}</td>
                <td style={tdStyle}><StatusBadge value={m.status} /></td>
                <td style={{ ...tdStyle, color: '#888899' }}>{new Date(m.created_at).toLocaleDateString()}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {m.status === 'pending' && (
                      <>
                        <button style={successBtn} onClick={() => updateStatus(m.id, 'active')}>Approve</button>
                        <button style={dangerBtn} onClick={() => updateStatus(m.id, 'inactive')}>Reject</button>
                      </>
                    )}
                    {m.status === 'inactive' && (
                      <button style={successBtn} onClick={() => updateStatus(m.id, 'active')}>Activate</button>
                    )}
                    {m.status === 'active' && (
                      <button style={dangerBtn} onClick={() => updateStatus(m.id, 'inactive')}>Deactivate</button>
                    )}
                    <button style={dangerBtn} onClick={() => deleteMember(m.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB 3: REGISTRATIONS ────────────────────────────────────────────────────

function RegistrationsModule() {
  const [regs, setRegs] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchRegs = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*, events(title, event_date)')
      .order('registered_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setRegs((data as EventRegistration[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRegs(); }, [fetchRegs]);

  const deleteReg = async (id: string) => {
    if (!window.confirm('Delete this registration?')) return;
    const { error } = await supabase.from('event_registrations').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Registration deleted', 'success'); fetchRegs(); }
  };

  return (
    <div>
      <SectionHeading title="REGISTRATIONS" count={regs.length} />
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Name', 'Email', 'Skill', 'Event', 'Event Date', 'Registered At', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <LoadingRow cols={7} />}
            {!loading && regs.length === 0 && <EmptyRow cols={7} msg="No registrations found." />}
            {regs.map(r => (
              <tr key={r.id}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{r.full_name}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{r.email}</td>
                <td style={tdStyle}>{r.skill_level ?? '—'}</td>
                <td style={tdStyle}>{r.events?.title ?? '—'}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{r.events?.event_date ? new Date(r.events.event_date).toLocaleDateString() : '—'}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{new Date(r.registered_at).toLocaleString()}</td>
                <td style={tdStyle}>
                  <button style={dangerBtn} onClick={() => deleteReg(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB 4: EVENTS ────────────────────────────────────────────────────────────

function EventsModule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', event_type: 'weekend_tournament',
    event_date: '', registration_deadline: '', venue: '',
    max_participants: '', entry_fee: '', prize_pool: '',
    status: 'upcoming', banner_url: '',
  });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setEvents(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const createEvent = async () => {
    const payload = {
      title: form.title,
      description: form.description || null,
      event_type: form.event_type,
      event_date: form.event_date || null,
      registration_deadline: form.registration_deadline || null,
      venue: form.venue || null,
      max_participants: form.max_participants ? parseInt(form.max_participants) : null,
      entry_fee: form.entry_fee ? parseFloat(form.entry_fee) : null,
      prize_pool: form.prize_pool || null,
      status: form.status,
      banner_url: form.banner_url || null,
    };
    const { error } = await supabase.from('events').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Event created!', 'success');
      setForm({ title: '', description: '', event_type: 'weekend_tournament', event_date: '', registration_deadline: '', venue: '', max_participants: '', entry_fee: '', prize_pool: '', status: 'upcoming', banner_url: '' });
      setShowForm(false);
      fetchEvents();
    }
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Event deleted', 'success'); fetchEvents(); }
  };

  const textFields: { key: string; label: string; type: string }[] = [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'venue', label: 'Venue', type: 'text' },
    { key: 'event_date', label: 'Date & Time', type: 'datetime-local' },
    { key: 'registration_deadline', label: 'Registration Deadline', type: 'datetime-local' },
    { key: 'max_participants', label: 'Max Participants', type: 'number' },
    { key: 'entry_fee', label: 'Entry Fee', type: 'number' },
    { key: 'prize_pool', label: 'Prize Pool', type: 'text' },
    { key: 'banner_url', label: 'Banner URL', type: 'text' },
  ];

  return (
    <div>
      <SectionHeading
        title="EVENTS"
        count={events.length}
        action={<button style={primaryBtn} onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancel' : '+ Create Event'}</button>}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <FormSection title="NEW EVENT">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {textFields.map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Event Type</label>
              <select value={form.event_type} onChange={e => setForm(p => ({ ...p, event_type: e.target.value }))} style={inputStyle}>
                {['weekend_tournament', 'ladder_league', 'smash_night', 'corporate_cup', 'open_session'].map(t => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                {['upcoming', 'ongoing', 'completed', 'cancelled'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          {form.banner_url && (
            <div style={{ marginTop: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.banner_url} alt="Banner preview" style={{ height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
          <div style={{ marginTop: 12 }}>
            <label style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <button style={{ ...primaryBtn, marginTop: 16 }} onClick={createEvent}>Create Event</button>
        </FormSection>
      )}

      <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Title', 'Type', 'Date', 'Participants', 'Fee', 'Status', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <LoadingRow cols={7} />}
            {!loading && events.length === 0 && <EmptyRow cols={7} msg="No events found." />}
            {events.map(ev => (
              <tr key={ev.id}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{ev.title}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{ev.event_type?.replace(/_/g, ' ')}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{ev.event_date ? new Date(ev.event_date).toLocaleDateString() : '—'}</td>
                <td style={tdStyle}>{ev.current_participants ?? 0} / {ev.max_participants ?? '∞'}</td>
                <td style={tdStyle}>{ev.entry_fee != null ? `$${ev.entry_fee}` : '—'}</td>
                <td style={tdStyle}><StatusBadge value={ev.status} /></td>
                <td style={tdStyle}>
                  <button style={dangerBtn} onClick={() => deleteEvent(ev.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB 5: LEADERBOARD ───────────────────────────────────────────────────────

function LeaderboardModule() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ elo_rating: '', wins: '', losses: '', streak: '' });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ player_name: '', elo_rating: '1200', wins: '0', losses: '0', streak: '0', skill_level: 'intermediate', badges: '' });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('leaderboard').select('*').order('elo_rating', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setEntries(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const startEdit = (e: LeaderboardEntry) => {
    setEditId(e.id);
    setEditForm({ elo_rating: String(e.elo_rating), wins: String(e.wins), losses: String(e.losses), streak: String(e.streak) });
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from('leaderboard').update({
      elo_rating: Number(editForm.elo_rating),
      wins: Number(editForm.wins),
      losses: Number(editForm.losses),
      streak: Number(editForm.streak),
    }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Updated!', 'success'); setEditId(null); fetchEntries(); }
  };

  const deleteEntry = async (id: string) => {
    if (!window.confirm('Delete this player?')) return;
    const { error } = await supabase.from('leaderboard').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Deleted', 'success'); fetchEntries(); }
  };

  const addPlayer = async () => {
    const payload = {
      player_name: addForm.player_name,
      elo_rating: parseInt(addForm.elo_rating) || 1200,
      wins: parseInt(addForm.wins) || 0,
      losses: parseInt(addForm.losses) || 0,
      streak: parseInt(addForm.streak) || 0,
      skill_level: addForm.skill_level || null,
      badges: addForm.badges ? addForm.badges.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    const { error } = await supabase.from('leaderboard').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Player added!', 'success');
      setAddForm({ player_name: '', elo_rating: '1200', wins: '0', losses: '0', streak: '0', skill_level: 'intermediate', badges: '' });
      setShowAdd(false);
      fetchEntries();
    }
  };

  const numInput = (val: string, onChange: (v: string) => void) => (
    <input type="number" value={val} onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle, width: 70, padding: '4px 8px', fontSize: 12 }} />
  );

  const addFields: { key: string; label: string; type: string }[] = [
    { key: 'player_name', label: 'Player Name', type: 'text' },
    { key: 'elo_rating', label: 'ELO Rating', type: 'number' },
    { key: 'wins', label: 'Wins', type: 'number' },
    { key: 'losses', label: 'Losses', type: 'number' },
    { key: 'streak', label: 'Streak', type: 'number' },
  ];

  return (
    <div>
      <SectionHeading
        title="LEADERBOARD"
        count={entries.length}
        action={<button style={primaryBtn} onClick={() => setShowAdd(v => !v)}>{showAdd ? 'Cancel' : '+ Add Player'}</button>}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showAdd && (
        <FormSection title="ADD PLAYER">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {addFields.map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} value={(addForm as Record<string, string>)[f.key]}
                  onChange={e => setAddForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Skill Level</label>
              <select value={addForm.skill_level} onChange={e => setAddForm(p => ({ ...p, skill_level: e.target.value }))} style={inputStyle}>
                {['beginner', 'intermediate', 'advanced', 'elite'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Badges (comma-separated)</label>
              <input type="text" value={addForm.badges} onChange={e => setAddForm(p => ({ ...p, badges: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <button style={{ ...primaryBtn, marginTop: 16 }} onClick={addPlayer}>Add Player</button>
        </FormSection>
      )}

      <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['#', 'Name', 'ELO', 'Wins', 'Losses', 'W/L%', 'Streak', 'Skill', 'Badges', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <LoadingRow cols={10} />}
            {!loading && entries.length === 0 && <EmptyRow cols={10} msg="No entries found." />}
            {entries.map((e, i) => {
              const wlPct = (e.wins + e.losses) > 0 ? Math.round((e.wins / (e.wins + e.losses)) * 100) : 0;
              return (
                <tr key={e.id}
                  onMouseEnter={el => (el.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={el => (el.currentTarget.style.background = 'transparent')}>
                  <td style={{ ...tdStyle, color: '#888899' }}>#{i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{e.player_name}</td>
                  <td style={tdStyle}>
                    {editId === e.id
                      ? numInput(editForm.elo_rating, v => setEditForm(p => ({ ...p, elo_rating: v })))
                      : <span style={{ color: '#D4AF37', fontWeight: 700 }}>{e.elo_rating}</span>}
                  </td>
                  <td style={tdStyle}>
                    {editId === e.id ? numInput(editForm.wins, v => setEditForm(p => ({ ...p, wins: v }))) : e.wins}
                  </td>
                  <td style={tdStyle}>
                    {editId === e.id ? numInput(editForm.losses, v => setEditForm(p => ({ ...p, losses: v }))) : e.losses}
                  </td>
                  <td style={{ ...tdStyle, color: wlPct >= 50 ? '#22c55e' : '#888899' }}>{wlPct}%</td>
                  <td style={tdStyle}>
                    {editId === e.id ? numInput(editForm.streak, v => setEditForm(p => ({ ...p, streak: v }))) : e.streak}
                  </td>
                  <td style={{ ...tdStyle, color: '#888899' }}>{e.skill_level ?? '—'}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                      {(e.badges ?? []).map(b => (
                        <span key={b} style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700 }}>{b}</span>
                      ))}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {editId === e.id ? (
                        <>
                          <button style={successBtn} onClick={() => saveEdit(e.id)}>Save</button>
                          <button style={dangerBtn} onClick={() => setEditId(null)}>Cancel</button>
                        </>
                      ) : (
                        <button style={goldBtn} onClick={() => startEdit(e)}>Edit</button>
                      )}
                      <button style={dangerBtn} onClick={() => deleteEntry(e.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TAB 6: ANNOUNCEMENTS ────────────────────────────────────────────────────

function AnnouncementsModule() {
  const [posts, setPosts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', category: 'general', author: 'RCC Admin', image_url: '', pinned: false });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setPosts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const createPost = async () => {
    const { error } = await supabase.from('announcements').insert([{
      title: form.title,
      body: form.body,
      category: form.category,
      author: form.author || null,
      image_url: form.image_url || null,
      pinned: form.pinned,
    }]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Announcement posted!', 'success');
      setForm({ title: '', body: '', category: 'general', author: 'RCC Admin', image_url: '', pinned: false });
      setShowForm(false);
      fetchPosts();
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Deleted', 'success'); fetchPosts(); }
  };

  const togglePin = async (id: string, pinned: boolean) => {
    const { error } = await supabase.from('announcements').update({ pinned: !pinned }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast(pinned ? 'Unpinned' : 'Pinned!', 'success'); fetchPosts(); }
  };

  const catColor: Record<string, string> = {
    match_result: '#D4AF37', event: '#22c55e', announcement: '#888899', achievement: '#C21818', general: '#888899',
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div>
      <SectionHeading
        title="ANNOUNCEMENTS"
        count={posts.length}
        action={<button style={primaryBtn} onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancel' : '+ New Post'}</button>}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <FormSection title="NEW ANNOUNCEMENT">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Author</label>
              <input type="text" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
                {['match_result', 'event', 'announcement', 'achievement', 'general'].map(c => (
                  <option key={c} value={c}>{c.replace(/_/g, ' ').replace(/\b\w/g, x => x.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Image URL (optional)</label>
              <input type="text" value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Body</label>
            <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.pinned} onChange={e => setForm(p => ({ ...p, pinned: e.target.checked }))} />
              Pin this post
            </label>
            <button style={primaryBtn} onClick={createPost}>Post</button>
          </div>
        </FormSection>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {posts.map(p => (
            <div key={p.id} style={glassCard}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    {p.pinned && (
                      <span style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700 }}>
                        📌 PINNED
                      </span>
                    )}
                    <span style={{ background: `${catColor[p.category ?? 'general']}22`, color: catColor[p.category ?? 'general'] ?? '#888899', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {p.category ?? 'general'}
                    </span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899' }}>{timeAgo(p.created_at)}</span>
                    {p.author && <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899' }}>by {p.author}</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#e8e8ec', marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#888899', lineHeight: 1.6 }}>
                    {p.body?.slice(0, 120)}{(p.body?.length ?? 0) > 120 ? '…' : ''}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  <button style={goldBtn} onClick={() => togglePin(p.id, p.pinned)}>{p.pinned ? 'Unpin' : 'Pin'}</button>
                  <button style={dangerBtn} onClick={() => deletePost(p.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', ...glassCard, textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 14 }}>
              No announcements yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TAB 7: INSTAGRAM ────────────────────────────────────────────────────────

function InstagramModule() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ image_url: '', caption: '', post_url: '', likes: '' });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('instagram_posts').select('*').order('posted_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setPosts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const addPost = async () => {
    const payload = {
      image_url: form.image_url,
      caption: form.caption || null,
      post_url: form.post_url || null,
      likes: form.likes ? parseInt(form.likes) : 0,
      posted_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('instagram_posts').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Post added!', 'success');
      setForm({ image_url: '', caption: '', post_url: '', likes: '' });
      setShowForm(false);
      fetchPosts();
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('Delete this post?')) return;
    const { error } = await supabase.from('instagram_posts').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Deleted', 'success'); fetchPosts(); }
  };

  const igFields: { key: string; label: string; type: string }[] = [
    { key: 'image_url', label: 'Image URL', type: 'text' },
    { key: 'post_url', label: 'Post URL', type: 'text' },
    { key: 'likes', label: 'Likes', type: 'number' },
  ];

  return (
    <div>
      <SectionHeading
        title="INSTAGRAM POSTS"
        count={posts.length}
        action={<button style={primaryBtn} onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancel' : '+ Add Post'}</button>}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <FormSection title="NEW INSTAGRAM POST">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
            {igFields.map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Caption</label>
            <textarea value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <button style={primaryBtn} onClick={addPost}>Add Post</button>
        </FormSection>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {posts.map(p => (
            <div key={p.id}
              style={{ ...glassCard, padding: 0, overflow: 'hidden', position: 'relative' }}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}>
              <div style={{ position: 'relative', height: 180, background: '#111118' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url} alt={p.caption ?? ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
                {hoveredId === p.id && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <button style={{ ...dangerBtn, background: 'rgba(194,24,24,0.8)' }} onClick={() => deletePost(p.id)}>Delete</button>
                  </div>
                )}
              </div>
              <div style={{ padding: '10px 12px' }}>
                {p.caption && (
                  <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899', lineHeight: 1.5, marginBottom: 6 }}>
                    {p.caption.slice(0, 100)}{(p.caption?.length ?? 0) > 100 ? '…' : ''}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#D4AF37' }}>♥ {p.likes ?? 0}</span>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899' }}>{new Date(p.posted_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', ...glassCard, textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 14 }}>
              No posts yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TAB 8: PLAYER SPOTLIGHTS ─────────────────────────────────────────────────

function SpotlightsModule() {
  const [spotlights, setSpotlights] = useState<PlayerSpotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    player_name: '', tagline: '', bio: '', skill_level: 'intermediate',
    achievements: '', youtube_url: '', avatar_url: '', featured: false,
  });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSpotlights = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('player_spotlights')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setSpotlights(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSpotlights(); }, [fetchSpotlights]);

  const createSpotlight = async () => {
    const payload = {
      player_name: form.player_name,
      tagline: form.tagline || null,
      bio: form.bio || null,
      skill_level: form.skill_level,
      youtube_url: form.youtube_url || null,
      avatar_url: form.avatar_url || null,
      achievements: form.achievements ? form.achievements.split(',').map(s => s.trim()).filter(Boolean) : [],
      featured: form.featured,
    };
    const { error } = await supabase.from('player_spotlights').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Spotlight created!', 'success');
      setForm({ player_name: '', tagline: '', bio: '', skill_level: 'intermediate', achievements: '', youtube_url: '', avatar_url: '', featured: false });
      setShowForm(false);
      fetchSpotlights();
    }
  };

  const deleteSpotlight = async (id: string) => {
    if (!window.confirm('Delete this spotlight?')) return;
    const { error } = await supabase.from('player_spotlights').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Deleted', 'success'); fetchSpotlights(); }
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    const { error } = await supabase.from('player_spotlights').update({ featured: !featured }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast(featured ? 'Unfeatured' : 'Featured!', 'success'); fetchSpotlights(); }
  };

  const spFields: { key: string; label: string }[] = [
    { key: 'player_name', label: 'Player Name' },
    { key: 'tagline', label: 'Tagline' },
    { key: 'youtube_url', label: 'YouTube URL' },
    { key: 'avatar_url', label: 'Avatar URL' },
  ];

  return (
    <div>
      <SectionHeading
        title="PLAYER SPOTLIGHTS"
        count={spotlights.length}
        action={<button style={primaryBtn} onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancel' : '+ New Spotlight'}</button>}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <FormSection title="NEW SPOTLIGHT">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
            {spFields.map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type="text" value={String((form as Record<string, unknown>)[f.key] ?? '')}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={labelStyle}>Skill Level</label>
              <select value={form.skill_level} onChange={e => setForm(p => ({ ...p, skill_level: e.target.value }))} style={inputStyle}>
                {['beginner', 'intermediate', 'advanced', 'elite'].map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Achievements (comma-separated)</label>
            <input type="text" value={form.achievements} onChange={e => setForm(p => ({ ...p, achievements: e.target.value }))} style={inputStyle} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec', cursor: 'pointer', marginBottom: 16 }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
            Featured spotlight
          </label>
          <button style={primaryBtn} onClick={createSpotlight}>Create Spotlight</button>
        </FormSection>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {spotlights.map(s => (
            <div key={s.id} style={glassCard}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {s.featured && (
                    <span style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700, display: 'inline-block', marginBottom: 6 }}>★ FEATURED</span>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#e8e8ec', margin: '0 0 4px 0' }}>{s.player_name}</h3>
                  {s.tagline && <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899' }}>{s.tagline}</div>}
                </div>
                <span style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700, flexShrink: 0 }}>{s.skill_level}</span>
              </div>
              {s.bio && (
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899', lineHeight: 1.6, marginBottom: 10 }}>
                  {s.bio.slice(0, 150)}{(s.bio?.length ?? 0) > 150 ? '…' : ''}
                </p>
              )}
              {(s.achievements ?? []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
                  {(s.achievements ?? []).slice(0, 3).map(a => (
                    <span key={a} style={{ background: 'rgba(255,255,255,0.06)', color: '#888899', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-inter)' }}>{a}</span>
                  ))}
                </div>
              )}
              {s.youtube_url && (
                <a href={s.youtube_url} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#C21818', textDecoration: 'none', display: 'inline-block', marginBottom: 10 }}>
                  ▶ Watch on YouTube
                </a>
              )}
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={goldBtn} onClick={() => toggleFeatured(s.id, s.featured)}>{s.featured ? 'Unfeature' : 'Feature'}</button>
                <button style={dangerBtn} onClick={() => deleteSpotlight(s.id)}>Delete</button>
              </div>
            </div>
          ))}
          {spotlights.length === 0 && (
            <div style={{ gridColumn: '1 / -1', ...glassCard, textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 14 }}>
              No spotlights yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TAB 9: PARTNERS ─────────────────────────────────────────────────────────

function PartnersModule() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', logo_url: '', website_url: '', tier: '', category: '', display_order: '0', active: true });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSponsors = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('sponsors').select('*').order('display_order', { ascending: true });
    if (error) showToast(error.message, 'error');
    else setSponsors(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSponsors(); }, [fetchSponsors]);

  const addPartner = async () => {
    const payload = {
      name: form.name,
      logo_url: form.logo_url || null,
      website_url: form.website_url || null,
      tier: form.tier || null,
      category: form.category || null,
      display_order: parseInt(form.display_order) || 0,
      active: form.active,
    };
    const { error } = await supabase.from('sponsors').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Partner added!', 'success');
      setForm({ name: '', logo_url: '', website_url: '', tier: '', category: '', display_order: '0', active: true });
      setShowForm(false);
      fetchSponsors();
    }
  };

  const deleteSponsor = async (id: string) => {
    if (!window.confirm('Delete this partner?')) return;
    const { error } = await supabase.from('sponsors').delete().eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast('Partner deleted', 'success'); fetchSponsors(); }
  };

  const toggleActive = async (id: string, active: boolean) => {
    const { error } = await supabase.from('sponsors').update({ active: !active }).eq('id', id);
    if (error) showToast(error.message, 'error');
    else { showToast(active ? 'Deactivated' : 'Activated!', 'success'); fetchSponsors(); }
  };

  const partnerFields: { key: string; label: string; type: string }[] = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'logo_url', label: 'Logo URL', type: 'text' },
    { key: 'website_url', label: 'Website URL', type: 'text' },
    { key: 'tier', label: 'Tier (e.g. Gold Partner)', type: 'text' },
    { key: 'category', label: 'Category (e.g. Equipment)', type: 'text' },
    { key: 'display_order', label: 'Display Order', type: 'number' },
  ];

  return (
    <div>
      <SectionHeading
        title="PARTNERS"
        count={sponsors.length}
        action={<button style={primaryBtn} onClick={() => setShowForm(v => !v)}>{showForm ? 'Cancel' : '+ Add Partner'}</button>}
      />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <FormSection title="NEW PARTNER">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
            {partnerFields.map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <input type={f.type} value={(form as Record<string, string | boolean>)[f.key] as string}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
          </div>
          {form.logo_url && (
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Logo Preview</label>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.logo_url} alt="Logo preview" style={{ height: 60, objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: 8, borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec', cursor: 'pointer', marginBottom: 16 }}>
            <input type="checkbox" checked={form.active} onChange={e => setForm(p => ({ ...p, active: e.target.checked }))} />
            Active
          </label>
          <button style={primaryBtn} onClick={addPartner}>Add Partner</button>
        </FormSection>
      )}

      <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['#', 'Logo', 'Name', 'Tier', 'Category', 'Website', 'Active', 'Order', 'Actions'].map(h => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <LoadingRow cols={9} />}
            {!loading && sponsors.length === 0 && <EmptyRow cols={9} msg="No partners found." />}
            {sponsors.map((s, i) => (
              <tr key={s.id}
                style={{ opacity: s.active ? 1 : 0.45 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ ...tdStyle, color: '#888899' }}>{i + 1}</td>
                <td style={tdStyle}>
                  {s.logo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={s.logo_url} alt={s.name} style={{ height: 40, objectFit: 'contain' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <span style={{ color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 12 }}>No logo</span>
                  )}
                </td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>{s.name}</td>
                <td style={{ ...tdStyle, color: '#D4AF37' }}>{s.tier ?? '—'}</td>
                <td style={{ ...tdStyle, color: '#888899' }}>{s.category ?? '—'}</td>
                <td style={tdStyle}>
                  {s.website_url ? (
                    <a href={s.website_url} target="_blank" rel="noreferrer" style={{ color: '#D4AF37', fontFamily: 'var(--font-inter)', fontSize: 12 }}>
                      {s.website_url.replace(/^https?:\/\//, '')}
                    </a>
                  ) : <span style={{ color: '#888899' }}>—</span>}
                </td>
                <td style={tdStyle}>
                  <span style={{ color: s.active ? '#22c55e' : '#C21818', fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 11 }}>
                    {s.active ? 'YES' : 'NO'}
                  </span>
                </td>
                <td style={{ ...tdStyle, color: '#888899' }}>{s.display_order ?? 0}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={s.active ? dangerBtn : successBtn} onClick={() => toggleActive(s.id, s.active)}>
                      {s.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button style={dangerBtn} onClick={() => deleteSponsor(s.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── TABS CONFIG ──────────────────────────────────────────────────────────────

type TabKey = 'overview' | 'members' | 'registrations' | 'events' | 'leaderboard' | 'announcements' | 'instagram' | 'spotlights' | 'partners';

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function BackendPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .then(({ count }) => { if (count != null) setPendingCount(count); });
  }, []);

  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'members', label: 'Members', badge: pendingCount > 0 ? pendingCount : undefined },
    { key: 'registrations', label: 'Registrations' },
    { key: 'events', label: 'Events' },
    { key: 'leaderboard', label: 'Leaderboard' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'spotlights', label: 'Spotlights' },
    { key: 'partners', label: 'Partners' },
  ];

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e8e8ec', fontFamily: 'var(--font-inter)' }}>
      {/* Header */}
      <div style={{
        background: '#080810',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '16px clamp(20px,5vw,60px)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/rcc-logo.png" alt="RCC" style={{ height: 36 }} />
        <div>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.5rem', color: '#D4AF37', letterSpacing: '0.06em', lineHeight: 1 }}>
            RCC ADMIN PANEL
          </div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899', letterSpacing: '0.1em', marginTop: 2 }}>
            RACQUETS CLUB COMMUNITY
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899' }}>
          ⚠️ Authorised access only
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        background: '#111118',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 clamp(20px,5vw,60px)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        overflowX: 'auto',
      }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === t.key ? '2px solid #D4AF37' : '2px solid transparent',
              color: activeTab === t.key ? '#D4AF37' : '#888899',
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.06em',
              padding: '14px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              transition: 'color 0.15s',
            }}
          >
            {t.label}
            {t.badge != null && (
              <span style={{
                background: '#C21818',
                color: '#fff',
                borderRadius: 10,
                padding: '1px 6px',
                fontSize: 10,
                fontWeight: 700,
                lineHeight: 1.4,
              }}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 'clamp(24px,4vw,48px) clamp(20px,5vw,60px)', maxWidth: 1400, margin: '0 auto' }}>
        {activeTab === 'overview'      && <OverviewModule />}
        {activeTab === 'members'       && <MembersModule />}
        {activeTab === 'registrations' && <RegistrationsModule />}
        {activeTab === 'events'        && <EventsModule />}
        {activeTab === 'leaderboard'   && <LeaderboardModule />}
        {activeTab === 'announcements' && <AnnouncementsModule />}
        {activeTab === 'instagram'     && <InstagramModule />}
        {activeTab === 'spotlights'    && <SpotlightsModule />}
        {activeTab === 'partners'      && <PartnersModule />}
      </div>
    </div>
  );
}
