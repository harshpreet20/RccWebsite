export type EventRow = {
  id: string;
  title: string;
  subtitle: string | null;
  event_date: string;
  venue: string | null;
  features: string[];
  register_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};
