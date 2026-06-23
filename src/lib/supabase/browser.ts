"use client";

import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseBrowserConfigured, supabaseAnonKey, supabaseUrl } from "./config";

export function getBrowserSupabaseClient() {
  if (!isSupabaseBrowserConfigured()) return null;
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
