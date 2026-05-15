import { Lock, Users, CalendarDays, Trophy, Megaphone, Image, Star, ShieldAlert } from 'lucide-react';

const MODULES = [
  { icon: Users,        label: 'Member Approvals',    desc: 'Review and approve pending membership applications.' },
  { icon: CalendarDays, label: 'Event Management',     desc: 'Create, edit and publish upcoming events and tournaments.' },
  { icon: Trophy,       label: 'Leaderboard Editor',   desc: 'Manually adjust ELO scores, streaks and badge assignments.' },
  { icon: Megaphone,    label: 'Announcements',        desc: 'Post new community feed updates and pin important notices.' },
  { icon: Image,        label: 'Instagram Posts',      desc: 'Add curated Instagram posts to the homepage feed grid.' },
  { icon: Star,         label: 'Player Spotlights',    desc: 'Feature members in the Player Spotlight carousel section.' },
];

export default function BackendPage() {
  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e8e8ec', fontFamily: 'var(--font-inter)' }}>
      {/* Header */}
      <div style={{
        background: '#080810',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '20px clamp(20px, 5vw, 60px)',
        display: 'flex', alignItems: 'center', gap: '14px',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/rcc-logo.png" alt="RCC" style={{ height: '36px', width: 'auto' }} />
        <div>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: '1.4rem', color: '#D4AF37', lineHeight: 1, letterSpacing: '0.06em' }}>
            RCC ADMIN PANEL
          </div>
          <div style={{ fontSize: '11px', color: '#888899', letterSpacing: '0.1em', marginTop: '2px' }}>
            RACQUETS CLUB COMMUNITY
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(32px, 5vw, 60px) clamp(20px, 5vw, 40px)' }}>
        {/* Warning banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'rgba(194,24,24,0.08)', border: '1px solid rgba(194,24,24,0.25)',
          borderRadius: '10px', padding: '14px 20px', marginBottom: '40px',
        }}>
          <ShieldAlert size={18} color="#C21818" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
            This panel is for authorised RCC administrators only. Unauthorised access is prohibited.
          </p>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-bebas)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          color: '#e8e8ec', letterSpacing: '0.04em', lineHeight: 1, marginBottom: '8px',
        }}>
          DASHBOARD
        </h1>
        <p style={{ fontSize: '14px', color: '#888899', marginBottom: '40px' }}>
          Select a module to manage.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {MODULES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              style={{
                background: 'rgba(17,17,24,0.8)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                padding: '24px',
                position: 'relative',
                opacity: 0.7,
              }}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '3px 8px', background: 'rgba(255,255,255,0.06)',
                borderRadius: '4px', marginBottom: '14px',
              }}>
                <Lock size={9} color="#888899" />
                <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', color: '#888899', textTransform: 'uppercase' }}>
                  Coming Soon
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Icon size={20} color="#D4AF37" />
                <span style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '14px', color: '#e8e8ec', letterSpacing: '0.02em' }}>
                  {label}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#888899', lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
