'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

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
  venue?: string;
  max_participants?: number;
  entry_fee?: number;
  prize_pool?: number;
  status: string;
  current_participants?: number;
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
  achievements?: string[];
  featured: boolean;
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
  const colors: Record<string, { bg: string; color: string }> = {
    active: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
    pending: { bg: 'rgba(212,175,55,0.15)', color: '#D4AF37' },
    inactive: { bg: 'rgba(194,24,24,0.15)', color: '#C21818' },
    upcoming: { bg: 'rgba(212,175,55,0.15)', color: '#D4AF37' },
    ongoing: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
    completed: { bg: 'rgba(136,136,153,0.15)', color: '#888899' },
    cancelled: { bg: 'rgba(194,24,24,0.15)', color: '#C21818' },
  };
  const c = colors[value] ?? { bg: 'rgba(255,255,255,0.08)', color: '#888899' };
  return (
    <span style={{
      background: c.bg,
      color: c.color,
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

// ─── MEMBERS MODULE ───────────────────────────────────────────────────────────

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

  const pending = members.filter(m => m.status === 'pending').length;

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#e8e8ec', letterSpacing: '0.04em', marginBottom: 4 }}>
        MEMBERS <span style={{ fontSize: '1rem', color: '#888899' }}>({members.length})</span>
      </h2>
      {pending > 0 && (
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#D4AF37', marginBottom: 16 }}>
          {pending} pending approval
        </p>
      )}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading...</div>
      ) : (
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
              {members.map(m => (
                <tr key={m.id} style={{ transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={tdStyle}>{m.full_name}</td>
                  <td style={{ ...tdStyle, color: '#888899' }}>{m.email}</td>
                  <td style={{ ...tdStyle, color: '#888899' }}>{m.phone ?? '—'}</td>
                  <td style={tdStyle}>{m.skill_level ?? '—'}</td>
                  <td style={tdStyle}>{m.membership_plan ?? '—'}</td>
                  <td style={tdStyle}><StatusBadge value={m.status} /></td>
                  <td style={{ ...tdStyle, color: '#888899' }}>{new Date(m.created_at).toLocaleDateString()}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
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
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr><td colSpan={8} style={{ ...tdStyle, textAlign: 'center', color: '#888899', padding: 32 }}>No members found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── EVENTS MODULE ────────────────────────────────────────────────────────────

function EventsModule() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', event_type: 'weekend_tournament',
    event_date: '', venue: '', max_participants: '', entry_fee: '', prize_pool: '',
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
      ...form,
      max_participants: form.max_participants ? parseInt(form.max_participants) : null,
      entry_fee: form.entry_fee ? parseFloat(form.entry_fee) : null,
      prize_pool: form.prize_pool ? parseFloat(form.prize_pool) : null,
      status: 'upcoming',
    };
    const { error } = await supabase.from('events').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Event created!', 'success');
      setForm({ title: '', description: '', event_type: 'weekend_tournament', event_date: '', venue: '', max_participants: '', entry_fee: '', prize_pool: '' });
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

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#e8e8ec', letterSpacing: '0.04em' }}>
          EVENTS <span style={{ fontSize: '1rem', color: '#888899' }}>({events.length})</span>
        </h2>
        <button style={primaryBtn} onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ Create Event'}
        </button>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: '#D4AF37', marginBottom: 16, letterSpacing: '0.04em' }}>NEW EVENT</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {[
              { key: 'title', label: 'Title', type: 'text' },
              { key: 'venue', label: 'Venue', type: 'text' },
              { key: 'event_date', label: 'Date & Time', type: 'datetime-local' },
              { key: 'max_participants', label: 'Max Participants', type: 'number' },
              { key: 'entry_fee', label: 'Entry Fee', type: 'number' },
              { key: 'prize_pool', label: 'Prize Pool', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>{f.label}</label>
                <input
                  type={f.type}
                  value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  style={inputStyle}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Event Type</label>
              <select value={form.event_type} onChange={e => setForm(p => ({ ...p, event_type: e.target.value }))} style={{ ...inputStyle }}>
                {['weekend_tournament', 'ladder_league', 'smash_night', 'corporate_cup', 'open_session'].map(t => (
                  <option key={t} value={t}>{t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
          <button style={{ ...primaryBtn, marginTop: 16 }} onClick={createEvent}>Create Event</button>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading...</div>
      ) : (
        <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Title', 'Type', 'Date', 'Participants', 'Status', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev.id}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{ev.title}</td>
                  <td style={{ ...tdStyle, color: '#888899' }}>{ev.event_type?.replace(/_/g, ' ')}</td>
                  <td style={{ ...tdStyle, color: '#888899' }}>{ev.event_date ? new Date(ev.event_date).toLocaleString() : '—'}</td>
                  <td style={tdStyle}>{ev.current_participants ?? 0} / {ev.max_participants ?? '∞'}</td>
                  <td style={tdStyle}><StatusBadge value={ev.status} /></td>
                  <td style={tdStyle}>
                    <button style={dangerBtn} onClick={() => deleteEvent(ev.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#888899', padding: 32 }}>No events found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── LEADERBOARD MODULE ───────────────────────────────────────────────────────

function LeaderboardModule() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LeaderboardEntry>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ player_name: '', elo_rating: '1200', wins: '0', losses: '0', streak: '0', skill_level: '', badges: '' });
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
    setEditForm({ elo_rating: e.elo_rating, wins: e.wins, losses: e.losses, streak: e.streak });
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
      setAddForm({ player_name: '', elo_rating: '1200', wins: '0', losses: '0', streak: '0', skill_level: '', badges: '' });
      setShowAdd(false);
      fetchEntries();
    }
  };

  const numInput = (val: string | number | undefined, onChange: (v: string) => void) => (
    <input type="number" value={val ?? ''} onChange={e => onChange(e.target.value)}
      style={{ ...inputStyle, width: 70, padding: '4px 8px', fontSize: 12 }} />
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#e8e8ec', letterSpacing: '0.04em' }}>
          LEADERBOARD <span style={{ fontSize: '1rem', color: '#888899' }}>({entries.length})</span>
        </h2>
        <button style={primaryBtn} onClick={() => setShowAdd(v => !v)}>
          {showAdd ? 'Cancel' : '+ Add Player'}
        </button>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showAdd && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: '#D4AF37', marginBottom: 16, letterSpacing: '0.04em' }}>ADD PLAYER</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { key: 'player_name', label: 'Player Name', type: 'text' },
              { key: 'elo_rating', label: 'ELO Rating', type: 'number' },
              { key: 'wins', label: 'Wins', type: 'number' },
              { key: 'losses', label: 'Losses', type: 'number' },
              { key: 'streak', label: 'Streak', type: 'number' },
              { key: 'skill_level', label: 'Skill Level', type: 'text' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>{f.label}</label>
                <input type={f.type} value={(addForm as Record<string, string>)[f.key]}
                  onChange={e => setAddForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Badges (comma-separated)</label>
              <input type="text" value={addForm.badges}
                onChange={e => setAddForm(p => ({ ...p, badges: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <button style={{ ...primaryBtn, marginTop: 16 }} onClick={addPlayer}>Add Player</button>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading...</div>
      ) : (
        <div style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Rank', 'Name', 'ELO', 'W / L', 'Streak', 'Skill', 'Badges', 'Actions'].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr key={e.id}
                  onMouseEnter={el => (el.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={el => (el.currentTarget.style.background = 'transparent')}>
                  <td style={{ ...tdStyle, color: '#888899' }}>#{i + 1}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{e.player_name}</td>
                  <td style={tdStyle}>
                    {editId === e.id ? numInput(editForm.elo_rating, v => setEditForm(p => ({ ...p, elo_rating: Number(v) }))) : <span style={{ color: '#D4AF37', fontWeight: 700 }}>{e.elo_rating}</span>}
                  </td>
                  <td style={tdStyle}>
                    {editId === e.id
                      ? <span style={{ display: 'flex', gap: 4 }}>{numInput(editForm.wins, v => setEditForm(p => ({ ...p, wins: Number(v) })))} / {numInput(editForm.losses, v => setEditForm(p => ({ ...p, losses: Number(v) })))}</span>
                      : `${e.wins} / ${e.losses}`}
                  </td>
                  <td style={tdStyle}>
                    {editId === e.id ? numInput(editForm.streak, v => setEditForm(p => ({ ...p, streak: Number(v) }))) : e.streak}
                  </td>
                  <td style={{ ...tdStyle, color: '#888899' }}>{e.skill_level ?? '—'}</td>
                  <td style={tdStyle}>
                    {(e.badges ?? []).map(b => (
                      <span key={b} style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', borderRadius: 4, padding: '1px 6px', fontSize: 10, marginRight: 3, fontFamily: 'var(--font-montserrat)', fontWeight: 700 }}>{b}</span>
                    ))}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {editId === e.id
                        ? <button style={successBtn} onClick={() => saveEdit(e.id)}>Save</button>
                        : <button style={goldBtn} onClick={() => startEdit(e)}>Edit</button>}
                      <button style={dangerBtn} onClick={() => deleteEntry(e.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr><td colSpan={8} style={{ ...tdStyle, textAlign: 'center', color: '#888899', padding: 32 }}>No entries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── ANNOUNCEMENTS MODULE ─────────────────────────────────────────────────────

function AnnouncementsModule() {
  const [posts, setPosts] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', category: 'general', author: '', pinned: false });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (error) showToast(error.message, 'error');
    else setPosts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const createPost = async () => {
    const { error } = await supabase.from('announcements').insert([form]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Announcement posted!', 'success');
      setForm({ title: '', body: '', category: 'general', author: '', pinned: false });
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

  const categoryColors: Record<string, string> = {
    general: '#888899', event: '#D4AF37', urgent: '#C21818', update: '#22c55e',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#e8e8ec', letterSpacing: '0.04em' }}>
          ANNOUNCEMENTS <span style={{ fontSize: '1rem', color: '#888899' }}>({posts.length})</span>
        </h2>
        <button style={primaryBtn} onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: '#D4AF37', marginBottom: 16, letterSpacing: '0.04em' }}>NEW ANNOUNCEMENT</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Title</label>
              <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Author</label>
              <input type="text" value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Body</label>
            <textarea value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ ...inputStyle, width: 160 }}>
                {['general', 'event', 'urgent', 'update'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec', cursor: 'pointer', marginTop: 20 }}>
              <input type="checkbox" checked={form.pinned} onChange={e => setForm(p => ({ ...p, pinned: e.target.checked }))} />
              Pin this post
            </label>
            <button style={{ ...primaryBtn, marginTop: 16 }} onClick={createPost}>Post</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {posts.map(p => (
            <div key={p.id} style={{ ...glassCard, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    {p.pinned && <span style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700 }}>📌 PINNED</span>}
                    <span style={{ background: `rgba(${categoryColors[p.category ?? 'general'] === '#888899' ? '136,136,153' : categoryColors[p.category ?? 'general'] === '#D4AF37' ? '212,175,55' : categoryColors[p.category ?? 'general'] === '#C21818' ? '194,24,24' : '34,197,94'},0.15)`, color: categoryColors[p.category ?? 'general'] ?? '#888899', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700, textTransform: 'uppercase' }}>{p.category ?? 'general'}</span>
                    <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899' }}>{new Date(p.created_at).toLocaleDateString()}</span>
                    {p.author && <span style={{ fontFamily: 'var(--font-inter)', fontSize: 11, color: '#888899' }}>by {p.author}</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#e8e8ec', marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: '#888899', lineHeight: 1.6 }}>{p.body?.slice(0, 200)}{(p.body?.length ?? 0) > 200 ? '…' : ''}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                  <button style={goldBtn} onClick={() => togglePin(p.id, p.pinned)}>{p.pinned ? 'Unpin' : 'Pin'}</button>
                  <button style={dangerBtn} onClick={() => deletePost(p.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && <div style={{ ...glassCard, textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 14 }}>No announcements yet.</div>}
        </div>
      )}
    </div>
  );
}

// ─── INSTAGRAM POSTS MODULE ───────────────────────────────────────────────────

function InstagramModule() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ image_url: '', caption: '', post_url: '', likes: '' });
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

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#e8e8ec', letterSpacing: '0.04em' }}>
          INSTAGRAM POSTS <span style={{ fontSize: '1rem', color: '#888899' }}>({posts.length})</span>
        </h2>
        <button style={primaryBtn} onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ Add Post'}
        </button>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: '#D4AF37', marginBottom: 16, letterSpacing: '0.04em' }}>NEW INSTAGRAM POST</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
            {[
              { key: 'image_url', label: 'Image URL' },
              { key: 'post_url', label: 'Post URL' },
              { key: 'likes', label: 'Likes' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>{f.label}</label>
                <input type={f.key === 'likes' ? 'number' : 'text'} value={(form as Record<string, string>)[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Caption</label>
            <textarea value={form.caption} onChange={e => setForm(p => ({ ...p, caption: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <button style={primaryBtn} onClick={addPost}>Add Post</button>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {posts.map(p => (
            <div key={p.id} style={{ ...glassCard, padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative', paddingTop: '100%', background: '#111118' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image_url} alt={p.caption ?? ''} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
              <div style={{ padding: '12px 14px' }}>
                {p.caption && <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899', lineHeight: 1.5, marginBottom: 8 }}>{p.caption.slice(0, 100)}{(p.caption?.length ?? 0) > 100 ? '…' : ''}</p>}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#D4AF37' }}>♥ {p.likes ?? 0}</span>
                  <button style={dangerBtn} onClick={() => deletePost(p.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div style={{ gridColumn: '1 / -1', ...glassCard, textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 14 }}>No posts yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PLAYER SPOTLIGHTS MODULE ─────────────────────────────────────────────────

function SpotlightsModule() {
  const [spotlights, setSpotlights] = useState<PlayerSpotlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ player_name: '', tagline: '', bio: '', skill_level: 'intermediate', youtube_url: '', achievements: '', featured: false });
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSpotlights = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('player_spotlights').select('*').order('created_at', { ascending: false });
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
      achievements: form.achievements ? form.achievements.split(',').map(s => s.trim()).filter(Boolean) : [],
      featured: form.featured,
    };
    const { error } = await supabase.from('player_spotlights').insert([payload]);
    if (error) showToast(error.message, 'error');
    else {
      showToast('Spotlight created!', 'success');
      setForm({ player_name: '', tagline: '', bio: '', skill_level: 'intermediate', youtube_url: '', achievements: '', featured: false });
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

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.8rem', color: '#e8e8ec', letterSpacing: '0.04em' }}>
          PLAYER SPOTLIGHTS <span style={{ fontSize: '1rem', color: '#888899' }}>({spotlights.length})</span>
        </h2>
        <button style={primaryBtn} onClick={() => setShowForm(v => !v)}>
          {showForm ? 'Cancel' : '+ New Spotlight'}
        </button>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {showForm && (
        <div style={{ ...glassCard, marginBottom: 24 }}>
          <h3 style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 14, color: '#D4AF37', marginBottom: 16, letterSpacing: '0.04em' }}>NEW SPOTLIGHT</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 12 }}>
            {[
              { key: 'player_name', label: 'Player Name' },
              { key: 'tagline', label: 'Tagline' },
              { key: 'youtube_url', label: 'YouTube URL' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>{f.label}</label>
                <input type="text" value={String((form as Record<string, unknown>)[f.key] ?? '')}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Skill Level</label>
              <select value={form.skill_level} onChange={e => setForm(p => ({ ...p, skill_level: e.target.value }))} style={{ ...inputStyle }}>
                {['beginner', 'intermediate', 'advanced', 'elite'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Bio</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-montserrat)', fontSize: 11, fontWeight: 700, color: '#888899', letterSpacing: '0.06em', marginBottom: 6, textTransform: 'uppercase' }}>Achievements (comma-separated)</label>
            <input type="text" value={form.achievements} onChange={e => setForm(p => ({ ...p, achievements: e.target.value }))} style={inputStyle} />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-inter)', fontSize: 13, color: '#e8e8ec', cursor: 'pointer', marginBottom: 16 }}>
            <input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} />
            Featured spotlight
          </label>
          <button style={primaryBtn} onClick={createSpotlight}>Create Spotlight</button>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#888899', fontFamily: 'var(--font-inter)', padding: 24 }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {spotlights.map(s => (
            <div key={s.id} style={glassCard}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  {s.featured && <span style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700, display: 'inline-block', marginBottom: 6 }}>★ FEATURED</span>}
                  <div style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: 15, color: '#e8e8ec' }}>{s.player_name}</div>
                  {s.tagline && <div style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#D4AF37', marginTop: 2 }}>{s.tagline}</div>}
                </div>
                <span style={{ background: 'rgba(212,175,55,0.08)', color: '#D4AF37', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-montserrat)', fontWeight: 700, flexShrink: 0 }}>{s.skill_level}</span>
              </div>
              {s.bio && <p style={{ fontFamily: 'var(--font-inter)', fontSize: 12, color: '#888899', lineHeight: 1.6, marginBottom: 12 }}>{s.bio.slice(0, 150)}{(s.bio?.length ?? 0) > 150 ? '…' : ''}</p>}
              {(s.achievements ?? []).length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                  {(s.achievements ?? []).slice(0, 3).map(a => (
                    <span key={a} style={{ background: 'rgba(255,255,255,0.06)', color: '#888899', borderRadius: 4, padding: '2px 7px', fontSize: 10, fontFamily: 'var(--font-inter)' }}>{a}</span>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={goldBtn} onClick={() => toggleFeatured(s.id, s.featured)}>{s.featured ? 'Unfeature' : 'Feature'}</button>
                <button style={dangerBtn} onClick={() => deleteSpotlight(s.id)}>Delete</button>
              </div>
            </div>
          ))}
          {spotlights.length === 0 && <div style={{ gridColumn: '1 / -1', ...glassCard, textAlign: 'center', color: '#888899', fontFamily: 'var(--font-inter)', fontSize: 14 }}>No spotlights yet.</div>}
        </div>
      )}
    </div>
  );
}

// ─── TABS CONFIG ──────────────────────────────────────────────────────────────

type TabKey = 'members' | 'events' | 'leaderboard' | 'announcements' | 'instagram' | 'spotlights';

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function BackendPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('members');
  const [pendingCount, setPendingCount] = useState(0);
  const [authChecked, setAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/enter/backend/login');
      } else {
        setUserEmail(data.session.user.email ?? null);
        setAuthChecked(true);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace('/enter/backend/login');
    });
    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    supabase.from('members').select('id', { count: 'exact', head: true }).eq('status', 'pending').then(({ count }) => {
      if (count != null) setPendingCount(count);
    });
  }, [authChecked]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/enter/backend/login');
  }

  if (!authChecked) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--font-montserrat)', color: '#888899', fontSize: 13, letterSpacing: '0.1em' }}>LOADING...</div>
      </div>
    );
  }

  const tabs: { key: TabKey; label: string; badge?: number }[] = [
    { key: 'members', label: 'Members', badge: pendingCount > 0 ? pendingCount : undefined },
    { key: 'events', label: 'Events' },
    { key: 'leaderboard', label: 'Leaderboard' },
    { key: 'announcements', label: 'Announcements' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'spotlights', label: 'Spotlights' },
  ];

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e8e8ec', fontFamily: 'var(--font-inter)' }}>
      {/* Header */}
      <div style={{
        background: '#080810',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '16px clamp(20px,5vw,60px)',
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/rcc-logo.png" alt="RCC" style={{ height: '36px' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.4rem', color: '#D4AF37', letterSpacing: '0.06em', lineHeight: 1 }}>RCC ADMIN PANEL</div>
          <div style={{ fontFamily: 'var(--font-inter)', fontSize: '11px', color: '#888899', letterSpacing: '0.1em' }}>RACQUETS CLUB COMMUNITY</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {userEmail && (
            <span style={{ fontFamily: 'var(--font-inter)', fontSize: '12px', color: '#555566' }}>{userEmail}</span>
          )}
          <button
            onClick={handleSignOut}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 6,
              color: '#888899',
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: '0.06em',
              padding: '6px 14px',
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        background: '#111118',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 clamp(20px,5vw,60px)',
        display: 'flex', alignItems: 'center', gap: 4,
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
              transition: 'color 0.15s',
              textTransform: 'uppercase',
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
              }}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 'clamp(24px,4vw,48px) clamp(20px,5vw,60px)', maxWidth: 1280, margin: '0 auto' }}>
        {activeTab === 'members' && <MembersModule />}
        {activeTab === 'events' && <EventsModule />}
        {activeTab === 'leaderboard' && <LeaderboardModule />}
        {activeTab === 'announcements' && <AnnouncementsModule />}
        {activeTab === 'instagram' && <InstagramModule />}
        {activeTab === 'spotlights' && <SpotlightsModule />}
      </div>
    </div>
  );
}
