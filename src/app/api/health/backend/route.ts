import { NextResponse } from "next/server";
import {
  isSupabaseAdminConfigured,
  isSupabaseBrowserConfigured,
  proofStorageBucket,
} from "@/lib/supabase/config";
import { getTreeCoinMintServerConfig } from "@/lib/treecoin/server";

export async function GET() {
  const mintConfig = getTreeCoinMintServerConfig();

  return NextResponse.json({
    ok: true,
    supabasePublicConfigured: isSupabaseBrowserConfigured(),
    supabaseAdminConfigured: isSupabaseAdminConfigured(),
    proofStorageBucket,
    authCallbackPath: "/auth/callback",
    googleAuthReady: isSupabaseBrowserConfigured(),
    emailAuthReady: isSupabaseBrowserConfigured(),
    treeCoinMintProcessorConfigured: mintConfig.ok,
    treeCoinMintMissingConfig: mintConfig.ok ? [] : mintConfig.missing,
    mode: isSupabaseBrowserConfigured() ? "supabase-ready" : "preview",
  });
}
