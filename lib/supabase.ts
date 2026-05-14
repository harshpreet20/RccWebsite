import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Event = {
  id: string;
  title: string;
  description: string;
  venue: string;
  date: string;
  time: string;
  slots_total: number;
  slots_left: number;
  skill_level: string;
  type: 'upcoming' | 'past';
  image_url?: string;
  registration_url?: string;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video';
  category: string;
  thumbnail_url?: string;
  created_at: string;
};

export type Sponsor = {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  category: string;
  tier: string;
  created_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  active: boolean;
  created_at: string;
};
