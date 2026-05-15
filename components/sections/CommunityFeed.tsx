'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Announcement {
  id: string;
  title: string;
  body: string;
  category: string;
  author: string;
  pinned: boolean;
  created_at: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
  match_result: { bg: 'rgba(212,175,55,0.12)', text: '#D4AF37', border: 'rgba(212,175,55,0.3)', emoji: '🏆' },
  event: { bg: 'rgba(194,24,24,0.12)', text: '#ef4444', border: 'rgba(194,24,24,0.3)', emoji: '🏸' },
  announcement: { bg: 'rgba(59,130,246,0.12)', text: '#60a5fa', border: 'rgba(59,130,246,0.3)', emoji: '📢' },
  achievement: { bg: 'rgba(139,92,246,0.12)', text: '#a78bfa', border: 'rgba(139,92,246,0.3)', emoji: '⭐' },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category?.toLowerCase()] || CATEGORY_COLORS['announcement'];
}

function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function CommunityFeed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  useEffect(() => {
    async function fetchAnnouncements() {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false });
      if (data) setAnnouncements(data);
      setLoading(false);
    }
    fetchAnnouncements();
  }, []);

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
        style={{ marginBottom: '48px' }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            color: '#e8e8ec',
            transform: 'skewX(-4deg)',
            display: 'inline-block',
            lineHeight: 1,
            marginBottom: '12px',
          }}
        >
          COMMUNITY{' '}
          <span className="text-gradient-gold">FEED</span>
        </h2>
        <p style={{ fontFamily: 'var(--font-inter)', fontSize: '15px', color: '#888899' }}>
          Latest news, results, and announcements from the RCC community.
        </p>
      </motion.div>

      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: '180px',
                background: 'rgba(17,17,24,0.7)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{
            columns: 2,
            columnGap: '20px',
          }}
          className="community-columns"
        >
          {announcements.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))}
          {announcements.length === 0 && (
            <div
              style={{
                columnSpan: 'all',
                textAlign: 'center',
                padding: '60px',
                fontFamily: 'var(--font-inter)',
                fontSize: '16px',
                color: '#888899',
              }}
            >
              No announcements yet.
            </div>
          )}
        </motion.div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .community-columns {
            columns: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

function FeedCard({ item }: { item: Announcement }) {
  const catStyle = getCategoryStyle(item.category);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        breakInside: 'avoid',
        marginBottom: '20px',
        background: 'rgba(17,17,24,0.7)',
        backdropFilter: 'blur(20px)',
        border: hovered
          ? `1px solid ${catStyle.border}`
          : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '20px',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 0 30px ${catStyle.bg}` : 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {item.pinned && (
            <span
              style={{
                padding: '3px 8px',
                background: 'rgba(212,175,55,0.15)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '4px',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#D4AF37',
              }}
            >
              📌 PINNED
            </span>
          )}
          <span
            style={{
              padding: '3px 10px',
              background: catStyle.bg,
              border: `1px solid ${catStyle.border}`,
              borderRadius: '4px',
              fontFamily: 'var(--font-montserrat)',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: catStyle.text,
              textTransform: 'uppercase',
            }}
          >
            {catStyle.emoji} {item.category?.replace('_', ' ')}
          </span>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '11px',
            color: '#888899',
          }}
        >
          {timeAgo(item.created_at)}
        </span>
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '16px',
          fontWeight: 700,
          color: '#e8e8ec',
          marginBottom: '8px',
          lineHeight: 1.4,
        }}
      >
        {item.title}
      </h3>

      <p
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '13px',
          color: '#888899',
          lineHeight: 1.7,
          marginBottom: '12px',
        }}
      >
        {item.body}
      </p>

      <div
        style={{
          fontFamily: 'var(--font-montserrat)',
          fontSize: '11px',
          color: '#888899',
          fontWeight: 600,
          letterSpacing: '0.06em',
        }}
      >
        — {item.author}
      </div>
    </motion.div>
  );
}
