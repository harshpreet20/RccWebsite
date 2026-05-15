'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ExternalLink } from 'lucide-react';

interface InstagramPost {
  id: string;
  caption: string;
  image_url: string;
  post_url: string;
  likes: number;
  posted_at: string;
}

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(6);
      if (data) setPosts(data);
      setLoading(false);
    }
    fetchPosts();
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
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            color: '#D4AF37',
            marginBottom: '16px',
          }}
        >
          <InstagramIcon size={20} />
          <span
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '12px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#888899',
            }}
          >
            @rcc.delhi on Instagram
          </span>
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            color: '#e8e8ec',
            transform: 'skewX(-4deg)',
            display: 'inline-block',
            lineHeight: 1,
          }}
        >
          FOLLOW THE{' '}
          <span className="text-gradient-gold">JOURNEY</span>
        </h2>
        <div
          style={{
            width: '60px',
            height: '3px',
            background: 'linear-gradient(to right, #D4AF37, #f0cc55)',
            margin: '16px auto 0',
            borderRadius: '2px',
          }}
        />
      </div>

      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '1',
                background: 'rgba(17,17,24,0.7)',
                borderRadius: '12px',
                animation: 'pulse 2s ease-in-out infinite',
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
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
          }}
          className="instagram-grid"
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </motion.div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .instagram-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

function PostCard({ post }: { post: InstagramPost }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        aspectRatio: '1',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        border: hovered
          ? '1px solid rgba(212,175,55,0.4)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hovered
          ? '0 0 30px rgba(212,175,55,0.15), 0 0 60px rgba(194,24,24,0.1)'
          : 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      <img
        src={post.image_url}
        alt={post.caption}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.4s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
          transition: 'background 0.3s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.4,
            marginBottom: '8px',
            display: '-webkit-box',
            WebkitLineClamp: hovered ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {post.caption}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: '11px',
              color: '#D4AF37',
              fontWeight: 600,
            }}
          >
            ♥ {post.likes?.toLocaleString()}
          </span>
          {hovered && (
            <a
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '10px',
                color: '#D4AF37',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                fontWeight: 700,
              }}
            >
              VIEW <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
