import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SignCategory = 'official' | 'grassroots';

export interface Sign {
  id: string;
  photo_url: string;
  latitude: number;
  longitude: number;
  languages: string[];
  category: SignCategory;
  note: string | null;
  created_at: string;
}

export const COMMON_LANGUAGES = [
  'English',
  'Spanish',
  'Polish',
  'Urdu',
  'Arabic',
  'Mandarin',
  'Tagalog',
  'Vietnamese',
  'Korean',
  'Russian',
  'Hindi',
  'Gujarati',
  'French',
  'German',
  'Portuguese',
  'Other',
];
