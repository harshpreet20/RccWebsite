-- RCC Website Database Schema
-- Run this in your Supabase SQL editor

-- ─────────────────────────────────────────
-- EVENTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  venue TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  slots_total INTEGER DEFAULT 16,
  slots_left INTEGER DEFAULT 16,
  skill_level TEXT DEFAULT 'All Levels',
  type TEXT DEFAULT 'upcoming' CHECK (type IN ('upcoming', 'past')),
  event_type TEXT DEFAULT 'Session',
  image_url TEXT,
  registration_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- GALLERY
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video')),
  category TEXT DEFAULT 'General',
  thumbnail_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- SPONSORS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  category TEXT DEFAULT 'General',
  tier TEXT DEFAULT 'Community Partner',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- ANNOUNCEMENTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- SITE SETTINGS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- COMMUNITY MEMBERS  (onboarding + birthdays)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  birthday DATE,                          -- MM-DD stored, year optional
  skill_level TEXT DEFAULT 'Beginner' CHECK (skill_level IN ('Beginner','Intermediate','Advanced','Professional')),
  court_preference TEXT,
  years_playing INTEGER DEFAULT 0,
  how_heard TEXT,                         -- how they found RCC
  agree_guidelines BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- JOIN REQUESTS  (popup form submissions)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  skill_level TEXT DEFAULT 'Beginner',
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- BIRTHDAY SUBMISSIONS  (member self-service)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS birthday_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  birthday_month INTEGER NOT NULL CHECK (birthday_month BETWEEN 1 AND 12),
  birthday_day INTEGER NOT NULL CHECK (birthday_day BETWEEN 1 AND 31),
  birth_year INTEGER,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- SEED DATA
-- ─────────────────────────────────────────
INSERT INTO site_settings (key, value) VALUES
  ('active_players', '150'),
  ('events_hosted', '50'),
  ('weekend_sessions', '200'),
  ('community_partners', '10'),
  ('whatsapp_url', 'https://chat.whatsapp.com/KeznsK95pHK1JKT4nqpcsv'),
  ('instagram_url', 'https://www.instagram.com/racquetsclubcommunity'),
  ('facebook_url', 'https://www.facebook.com/share/1CP9eke83b/?mibextid=wwXIfr')
ON CONFLICT (key) DO NOTHING;

INSERT INTO sponsors (name, tier, category) VALUES
  ('Racquets Club Community', 'Title Partner', 'Title Partner'),
  ('SUM India', 'Community Partner', 'Community Partner'),
  ('Soul Stretch', 'Wellness Partner', 'Wellness Partner'),
  ('Portronics', 'Equipment Partner', 'Equipment Partner')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE birthday_submissions ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (active = true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);

-- Public insert (forms)
CREATE POLICY "Public insert join_requests" ON join_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert birthday_submissions" ON birthday_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert community_members" ON community_members FOR INSERT WITH CHECK (true);

-- Public read birthdays (for upcoming birthday display)
CREATE POLICY "Public read birthdays" ON birthday_submissions FOR SELECT USING (true);
CREATE POLICY "Public read members" ON community_members FOR SELECT USING (status = 'approved');
