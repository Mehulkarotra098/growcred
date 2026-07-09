import { NextRequest, NextResponse } from "next/server";
import { isAdminEmail, normalizeInternalPath } from "@/lib/backend/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = normalizeInternalPath(requestUrl.searchParams.get("next"));
  const supabase = await getServerSupabaseClient();

  if (!supabase || !code) {
    return NextResponse.redirect(new URL("/auth", requestUrl.origin));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const url = new URL("/auth", requestUrl.origin);
    url.searchParams.set("message", "Sign in could not be completed.");
    return NextResponse.redirect(url);
  }

  await upsertProfileAfterSignIn();

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

async function upsertProfileAfterSignIn() {
  const supabase = await getServerSupabaseClient();
  const admin = getSupabaseAdminClient();
  if (!supabase || !admin) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const displayName =
    (user.user_metadata?.name as string | undefined) ??
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split("@")[0] ??
    "GrowCred User";

  await admin.from("profiles").upsert({
    id: user.id,
    name: displayName,
    email: user.email ?? "",
    avatar_url: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    country: "India",
    role: isAdminEmail(user.email) ? "admin" : "grower",
  });
}
