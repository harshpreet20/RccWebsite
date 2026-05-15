'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Check, ArrowRight } from 'lucide-react';

interface Tier {
  id: 'monthly' | 'quarterly' | 'annual';
  label: string;
  price: string;
  period: string;
  tag?: string;
  benefits: string[];
  highlight: boolean;
}

const TIERS: Tier[] = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '₹999',
    period: '/month',
    benefits: [
      '4 court sessions/month',
      '1 group coaching session',
      'Access to Ladder League',
      'Community Discord access',
      'Match tracking & ELO',
      'Monthly newsletter',
    ],
    highlight: false,
  },
  {
    id: 'quarterly',
    label: 'Quarterly',
    price: '₹2,499',
    period: '/quarter',
    tag: 'MOST POPULAR',
    benefits: [
      '14 court sessions/quarter',
      '3 group coaching sessions',
      'Tournament eligibility',
      'Community Discord access',
      'Match tracking & ELO',
      'Guest passes (2/quarter)',
      'Priority court booking',
    ],
    highlight: true,
  },
  {
    id: 'annual',
    label: 'Annual',
    price: '₹7,999',
    period: '/year',
    benefits: [
      'Unlimited court sessions',
      '12 coaching sessions/year',
      'All tournaments included',
      'Community Discord access',
      'Match tracking & ELO',
      'Guest passes (6/year)',
      'Priority court booking',
      'RCC merchandise kit',
      'Dedicated coach pairing',
    ],
    highlight: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function MembershipSection() {
  const [selected, setSelected] = useState<'monthly' | 'quarterly' | 'annual'>('quarterly');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    skill_level: 'intermediate',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: err } = await supabase.from('members').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      skill_level: form.skill_level,
      membership_type: selected,
      status: 'pending',
    });

    if (err) {
      setError('Something went wrong. Please try again.');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '80px clamp(16px, 5vw, 120px)',
        background: '#0a0a0f',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(194,24,24,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            color: '#e8e8ec',
            transform: 'skewX(-4deg)',
            display: 'inline-block',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          JOIN{' '}
          <span className="text-gradient-gold">RCC</span>
          {' '}TODAY
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '15px',
            color: '#888899',
            maxWidth: '480px',
            margin: '0 auto',
          }}
        >
          Choose your membership tier and become part of Delhi's most elite badminton community.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1000px',
          margin: '0 auto 60px',
        }}
      >
        {TIERS.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            isSelected={selected === tier.id}
            onSelect={() => setSelected(tier.id)}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5 }}
        style={{
          maxWidth: '560px',
          margin: '0 auto',
          background: 'rgba(17,17,24,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '16px',
          padding: 'clamp(24px, 4vw, 40px)',
        }}
      >
        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(212,175,55,0.15)',
                border: '2px solid #D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <Check size={32} color="#D4AF37" />
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '2.2rem',
                color: '#D4AF37',
                marginBottom: '12px',
              }}
            >
              WELCOME TO RCC!
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '15px',
                color: '#888899',
                lineHeight: 1.6,
              }}
            >
              Your membership application has been received. Our team will reach out within 24 hours to complete the onboarding process.
            </p>
          </div>
        ) : (
          <>
            <h3
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: '1.8rem',
                color: '#e8e8ec',
                marginBottom: '4px',
              }}
            >
              MEMBERSHIP APPLICATION
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '13px',
                color: '#888899',
                marginBottom: '28px',
              }}
            >
              Selected:{' '}
              <span style={{ color: '#D4AF37', fontWeight: 600 }}>
                {TIERS.find((t) => t.id === selected)?.label} —{' '}
                {TIERS.find((t) => t.id === selected)?.price}
                {TIERS.find((t) => t.id === selected)?.period}
              </span>
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <FormField
                label="Full Name"
                type="text"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Your full name"
              />
              <FormField
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="your@email.com"
              />
              <FormField
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="+91 98765 43210"
              />
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    color: '#888899',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                  }}
                >
                  Skill Level
                </label>
                <select
                  value={form.skill_level}
                  onChange={(e) => setForm({ ...form, skill_level: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: '#111118',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#e8e8ec',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="elite">Elite</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-montserrat)',
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                    color: '#888899',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                  }}
                >
                  Membership Plan
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {TIERS.map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelected(tier.id)}
                      style={{
                        flex: 1,
                        padding: '10px 8px',
                        borderRadius: '8px',
                        border: selected === tier.id ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                        background: selected === tier.id ? 'rgba(212,175,55,0.1)' : 'transparent',
                        color: selected === tier.id ? '#D4AF37' : '#888899',
                        fontFamily: 'var(--font-montserrat)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p style={{ fontFamily: 'var(--font-inter)', fontSize: '13px', color: '#C21818' }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px',
                  background: loading ? 'rgba(194,24,24,0.5)' : '#C21818',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '13px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '8px',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.background = '#D4AF37';
                    (e.currentTarget as HTMLButtonElement).style.color = '#0a0a0f';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    (e.currentTarget as HTMLButtonElement).style.background = '#C21818';
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }
                }}
              >
                {loading ? 'SUBMITTING...' : 'APPLY FOR MEMBERSHIP'}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </section>
  );
}

function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: 'var(--font-montserrat)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: '#888899',
          marginBottom: '8px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          color: '#e8e8ec',
          fontFamily: 'var(--font-inter)',
          fontSize: '14px',
          outline: 'none',
        }}
      />
    </div>
  );
}

function TierCard({
  tier,
  isSelected,
  onSelect,
}: {
  tier: Tier;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.div
      variants={cardVariants}
      onClick={onSelect}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: tier.highlight
          ? 'rgba(212,175,55,0.06)'
          : 'rgba(17,17,24,0.7)',
        backdropFilter: 'blur(20px)',
        border: isSelected
          ? tier.highlight
            ? '1px solid rgba(212,175,55,0.6)'
            : '1px solid rgba(194,24,24,0.5)'
          : tier.highlight
          ? '1px solid rgba(212,175,55,0.25)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: tier.highlight && isSelected
          ? '0 0 40px rgba(212,175,55,0.2)'
          : isSelected
          ? '0 0 30px rgba(194,24,24,0.15)'
          : 'none',
        transition: 'all 0.3s',
        padding: '28px 24px',
      }}
    >
      {tier.tag && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            padding: '4px 10px',
            background: '#D4AF37',
            borderRadius: '4px',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.12em',
            color: '#0a0a0f',
          }}
        >
          {tier.tag}
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '13px',
            fontWeight: 600,
            color: tier.highlight ? '#D4AF37' : '#888899',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          {tier.label}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
          <span
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: '3rem',
              color: tier.highlight ? '#D4AF37' : '#e8e8ec',
              lineHeight: 1,
            }}
          >
            {tier.price}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-inter)',
              fontSize: '13px',
              color: '#888899',
            }}
          >
            {tier.period}
          </span>
        </div>
      </div>

      <div className="divider" style={{ marginBottom: '20px' }} />

      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        {tier.benefits.map((b, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: tier.highlight ? 'rgba(212,175,55,0.15)' : 'rgba(194,24,24,0.15)',
                border: tier.highlight ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(194,24,24,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              <Check size={10} color={tier.highlight ? '#D4AF37' : '#C21818'} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-inter)',
                fontSize: '13px',
                color: 'rgba(232,232,236,0.75)',
                lineHeight: 1.4,
              }}
            >
              {b}
            </span>
          </li>
        ))}
      </ul>

      <div
        style={{
          height: '3px',
          borderRadius: '2px',
          background: isSelected
            ? tier.highlight
              ? 'linear-gradient(to right, #D4AF37, #f0cc55)'
              : 'linear-gradient(to right, #C21818, #D4AF37)'
            : 'rgba(255,255,255,0.08)',
          transition: 'background 0.3s',
        }}
      />
    </motion.div>
  );
}
