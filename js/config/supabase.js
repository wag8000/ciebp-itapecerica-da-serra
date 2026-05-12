
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const SUPABASE_URL = 'https://sforgndgcxkbbzstbehu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QHZWgDbGu-7PVGgHRKJn3A_AqY2UvB-'; // ⚠️ use anon public key

export const db = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false
    }
  }
)