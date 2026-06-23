import { createClient } from "@supabase/supabase-js";
import {
  isSupabaseAdminConfigured,
  proofStorageBucket,
  supabaseServiceRoleKey,
  supabaseUrl,
} from "./config";

export function getSupabaseAdminClient() {
  if (!isSupabaseAdminConfigured()) return null;

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function ensureProofStorageBucket() {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { ok: false, message: "Supabase service role is not configured." };

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) return { ok: false, message: listError.message };

  if (buckets.some((bucket) => bucket.name === proofStorageBucket)) {
    return { ok: true, message: "Bucket exists." };
  }

  const { error } = await supabase.storage.createBucket(proofStorageBucket, {
    public: false,
    fileSizeLimit: 104_857_600,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"],
  });

  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Bucket created." };
}
