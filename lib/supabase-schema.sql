-- RCC Website Database Schema
-- Run this in your Supabase SQL editor

-- Events table
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

-- Gallery table
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

-- Sponsors table
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

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('active_players', '150'),
  ('events_hosted', '50'),
  ('weekend_sessions', '200'),
  ('community_partners', '10'),
  ('whatsapp_url', 'https://chat.whatsapp.com/KeznsK95pHK1JKT4nqpcsv'),
  ('instagram_url', 'https://www.instagram.com/racquetsclubcommunity'),
  ('facebook_url', 'https://www.facebook.com/share/1CP9eke83b/?mibextid=wwXIfr')
ON CONFLICT (key) DO NOTHING;

-- Insert default sponsors
INSERT INTO sponsors (name, tier, category) VALUES
  ('Racquets Club Community', 'Title Partner', 'Title Partner'),
  ('SUM India', 'Community Partner', 'Community Partner'),
  ('Soul Stretch', 'Wellness Partner', 'Wellness Partner'),
  ('Portronics', 'Equipment Partner', 'Equipment Partner')
ON CONFLICT DO NOTHING;

-- Row Level Security (allow public read for most tables)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Public read sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
