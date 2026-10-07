import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy Supabase client: creation is deferred until first actual use so that
// static builds / prerendering never crash when env vars are missing.
let _client: SupabaseClient | null = null;
let _warned = false;

function getClient(): SupabaseClient {
  if (_client) return _client;

  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Route all Supabase traffic through our own /api/sb proxy so browsers or
  // networks that block *.supabase.co can still reach the database.
  const supabaseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/sb`
      : process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (!_warned) {
      _warned = true;
      console.error(
        'Supabase configuration is missing. Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.'
      );
    }
    // Return a placeholder client instead of throwing at construction time.
    _client = createClient('https://placeholder.supabase.co', 'placeholder-key');
    return _client;
  }

  _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

// Export a proxy so existing `supabase.from(...)` call sites keep working
// unchanged while client creation stays lazy.
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
