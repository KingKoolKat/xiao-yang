import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecretKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isAdminSupabaseConfigured = Boolean(
  supabaseUrl && supabaseSecretKey
);

let adminClient: SupabaseClient | null = null;

export function getAdminSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "Server Supabase access is not configured. Set SUPABASE_SECRET_KEY."
    );
  }

  if (!adminClient) {
    adminClient = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false
      }
    });
  }

  return adminClient;
}
