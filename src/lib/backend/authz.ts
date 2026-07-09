import { canReviewProof } from "@/lib/backend/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export type AdminAuthorizationResult =
  | {
      ok: true;
      mode: "preview" | "supabase";
      userId?: string;
      role?: string;
    }
  | {
      ok: false;
      mode: "supabase";
      status: 401 | 403 | 500;
      message: string;
    };

export async function requireAdminReviewer(): Promise<AdminAuthorizationResult> {
  const supabase = await getServerSupabaseClient();
  const admin = getSupabaseAdminClient();

  if (!supabase || !admin) {
    return { ok: true, mode: "preview" };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      mode: "supabase",
      status: 401,
      message: "Sign in with an admin account to review proof.",
    };
  }

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    return {
      ok: false,
      mode: "supabase",
      status: 500,
      message: "Admin role could not be verified.",
    };
  }

  const role = typeof profile?.role === "string" ? profile.role : "grower";

  if (!canReviewProof({ email: user.email, role })) {
    return {
      ok: false,
      mode: "supabase",
      status: 403,
      message: "This account cannot review GrowCred proof.",
    };
  }

  return { ok: true, mode: "supabase", userId: user.id, role };
}
