// supabase.js

const SUPABASE_URL = 'https://sforgndgcxkbbzstbehu.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QHZWgDbGu-7PVGgHRKJn3A_AqY2UvB-'; // ⚠️ use anon public key

// verifica se lib foi carregada
if (!window.supabase) {
  console.error("Supabase não carregado! Verifique o script CDN.");
}

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.supabaseClient = supabase;