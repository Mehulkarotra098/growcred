import { NextResponse } from "next/server";
import {
  isSupabaseAdminConfigured,
  isSupabaseBrowserConfigured,
  proofStorageBucket,
} from "@/lib/supabase/config";

export async function GET() {
  return NextResponse.json({
    ok: true,
    supabasePublicConfigured: isSupabaseBrowserConfigured(),
    supabaseAdminConfigured: isSupabaseAdminConfigured(),
    proofStorageBucket,
    mode: isSupabaseBrowserConfigured() ? "supabase-ready" : "preview",
  });
}
