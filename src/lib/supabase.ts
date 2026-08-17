import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { publicEnv } from "@/config/env";

let client: SupabaseClient | null | undefined;

/** Returns a singleton browser client only when both public values exist. */
export function getSupabaseBrowserClient() {
  if (client !== undefined) return client;
  if (!publicEnv.supabaseUrl || !publicEnv.supabaseAnonKey) {
    client = null;
    return client;
  }
  client = createClient(publicEnv.supabaseUrl, publicEnv.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: { headers: { "x-client-info": "aranch-pass-web" } },
  });
  return client;
}
