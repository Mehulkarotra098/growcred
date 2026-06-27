"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import type { ProofSubmissionResult } from "@/lib/types";
import {
  parseCoordinates,
  readFormString,
  readOptionalFile,
  safeFileName,
} from "@/lib/validation";
import { getServerSupabaseClient } from "@/lib/supabase/server";
import { ensureProofStorageBucket } from "@/lib/supabase/admin";
import { proofStorageBucket } from "@/lib/supabase/config";

const MAX_PHOTO_SIZE = 15 * 1024 * 1024;
const MAX_VIDEO_SIZE = 80 * 1024 * 1024;

export async function submitProofAction(
  formData: FormData,
): Promise<ProofSubmissionResult> {
  const nickname = readFormString(formData, "nickname");
  const species = readFormString(formData, "species");
  const plantedAt = readFormString(formData, "plantedAt");
  const locationName = readFormString(formData, "locationName");
  const coordinates = readFormString(formData, "coordinates");
  const notes = readFormString(formData, "notes");
  const photo = readOptionalFile(formData, "photo");
  const video = readOptionalFile(formData, "video");

  const issues = [
    !nickname ? "Tree nickname is required." : "",
    !species ? "Tree species is required." : "",
    !plantedAt ? "Planting date is required." : "",
    !locationName ? "Location/city is required." : "",
    !photo ? "Photo proof is required." : "",
    photo && photo.size > MAX_PHOTO_SIZE ? "Photo must be 15MB or smaller." : "",
    video && video.size > MAX_VIDEO_SIZE ? "Video must be 80MB or smaller." : "",
    formData.get("legalConsent") !== "on"
      ? "Legal planting and care confirmation is required."
      : "",
    formData.get("permissionConsent") !== "on"
      ? "Land permission confirmation is required."
      : "",
    formData.get("nativeConsent") !== "on"
      ? "Native/local tree confirmation is required."
      : "",
    formData.get("careConsent") !== "on"
      ? "Care commitment is required."
      : "",
  ].filter(Boolean);

  if (issues.length > 0) {
    return {
      ok: false,
      mode: "preview",
      message: "Please fix the proof details before submitting.",
      issues,
    };
  }

  const supabase = await getServerSupabaseClient();
  if (!supabase) {
    return {
      ok: true,
      mode: "preview",
      message: "Your proof is ready for review.",
      treeId: `preview-tree-${randomUUID()}`,
      proofSubmissionId: `preview-proof-${randomUUID()}`,
      status: "under_review",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      mode: "supabase",
      message: "Sign in to track your impact.",
      issues: ["Sign in before submitting saved proof."],
    };
  }

  await ensureProofStorageBucket();

  const { latitude, longitude } = parseCoordinates(coordinates);
  const displayName =
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "GrowCred User";

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    name: displayName,
    email: user.email ?? "",
    country: "India",
  });

  if (profileError) {
    return {
      ok: false,
      mode: "supabase",
      message: "We could not prepare your profile right now.",
      issues: [profileError.message],
    };
  }

  const { data: tree, error: treeError } = await supabase
    .from("trees")
    .insert({
      user_id: user.id,
      nickname,
      species,
      location_name: locationName,
      latitude,
      longitude,
      planted_at: plantedAt,
      status: "submitted",
      photos: [],
      treecoins_earned: 0,
      next_care_reminder: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      survival_stage: "new",
    })
    .select("id")
    .single();

  if (treeError || !tree) {
    return {
      ok: false,
      mode: "supabase",
      message: treeError?.message ?? "We could not save the tree details.",
    };
  }

  const photoPath = await uploadProofFile(supabase, user.id, tree.id, photo!);
  if (!photoPath.ok) {
    return {
      ok: false,
      mode: "supabase",
      message: photoPath.message,
      treeId: tree.id,
    };
  }

  const videoPath = video
    ? await uploadProofFile(supabase, user.id, tree.id, video)
    : null;
  if (videoPath && !videoPath.ok) {
    return {
      ok: false,
      mode: "supabase",
      message: videoPath.message,
      treeId: tree.id,
    };
  }

  await supabase
    .from("trees")
    .update({
      photos: [photoPath.path],
      video_url: videoPath?.path ?? null,
      status: "under_review",
    })
    .eq("id", tree.id);

  const { data: proof, error: proofError } = await supabase
    .from("proof_submissions")
    .insert({
      tree_id: tree.id,
      user_id: user.id,
      type: "planting",
      photo_url: photoPath.path,
      video_url: videoPath?.path ?? null,
      notes,
      status: "under_review",
    })
    .select("id")
    .single();

  if (proofError || !proof) {
    return {
      ok: false,
      mode: "supabase",
      message: proofError?.message ?? "We could not save the proof submission.",
      treeId: tree.id,
    };
  }

  await supabase.from("treecoin_ledger").insert({
    user_id: user.id,
    tree_id: tree.id,
    proof_submission_id: proof.id,
    action: "Verified planting proof pending review",
    amount: 10,
    status: "submitted",
  });

  await supabase.from("care_reminders").insert({
    user_id: user.id,
    tree_id: tree.id,
    message: `30-day care check-in for ${nickname}`,
    due_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    channel: "in_app",
    status: "scheduled",
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin");

  return {
    ok: true,
    mode: "supabase",
    message: "Your proof is ready for review.",
    treeId: tree.id,
    proofSubmissionId: proof.id,
    status: "under_review",
  };
}

async function uploadProofFile(
  supabase: NonNullable<Awaited<ReturnType<typeof getServerSupabaseClient>>>,
  userId: string,
  treeId: string,
  file: File,
) {
  const path = `${userId}/${treeId}/${randomUUID()}-${safeFileName(file)}`;
  const { error } = await supabase.storage
    .from(proofStorageBucket)
    .upload(path, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    });

  if (error) return { ok: false as const, message: error.message };
  return { ok: true as const, path };
}
