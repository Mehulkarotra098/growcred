"use server";

import { revalidatePath } from "next/cache";
import type { ProofStatus } from "@/lib/types";
import { requireAdminReviewer } from "@/lib/backend/authz";
import {
  buildVerifiedMintRequests,
  isRewardReleaseDecision,
} from "@/lib/backend/rewards";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

interface ReviewProofInput {
  proofSubmissionId: string;
  decision: ProofStatus;
  notes?: string;
  fraudFlags?: string[];
}

export async function reviewProofAction(input: ReviewProofInput) {
  const authorization = await requireAdminReviewer();
  if (!authorization.ok) {
    return {
      ok: false,
      mode: authorization.mode,
      message: authorization.message,
    };
  }

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return {
      ok: true,
      mode: "preview" as const,
      message: "Review decision noted for this proof.",
    };
  }

  const { data: proof, error: proofError } = await supabase
    .from("proof_submissions")
    .select("id, tree_id, user_id, type")
    .eq("id", input.proofSubmissionId)
    .single();

  if (proofError || !proof) {
    return {
      ok: false,
      mode: "supabase" as const,
      message: proofError?.message ?? "Proof submission was not found.",
    };
  }

  const reviewedAt = new Date().toISOString();

  const { error: submissionError } = await supabase
    .from("proof_submissions")
    .update({
      status: input.decision,
      reviewed_at: reviewedAt,
      reviewer_id: authorization.userId ?? null,
    })
    .eq("id", input.proofSubmissionId);

  if (submissionError) {
    return { ok: false, mode: "supabase" as const, message: submissionError.message };
  }

  await supabase.from("admin_reviews").insert({
    proof_submission_id: input.proofSubmissionId,
    reviewer_id: authorization.userId ?? null,
    decision: input.decision,
    notes: input.notes ?? "",
    fraud_flags: input.fraudFlags ?? [],
    reviewed_at: reviewedAt,
  });

  await supabase
    .from("trees")
    .update({ status: input.decision })
    .eq("id", proof.tree_id);

  if (isRewardReleaseDecision(input.decision)) {
    const { data: ledgerEntries } = await supabase
      .from("treecoin_ledger")
      .update({ status: "verified" })
      .eq("proof_submission_id", input.proofSubmissionId)
      .select("id,user_id,amount");

    if (ledgerEntries && ledgerEntries.length > 0) {
      const mintRequests = buildVerifiedMintRequests({
        proofSubmissionId: input.proofSubmissionId,
        ledgerEntries: ledgerEntries.map((entry) => ({
          id: entry.id,
          userId: entry.user_id,
          amount: entry.amount,
        })),
        network: "devnet",
      });

      const { error: mintQueueError } = await supabase
        .from("treecoin_mint_requests")
        .upsert(mintRequests, { onConflict: "proof_hash" });

      if (mintQueueError) {
        console.error("TreeCoin mint request was not queued:", mintQueueError.message);
      }
    }
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return {
    ok: true,
    mode: "supabase" as const,
    message: "Review decision saved.",
  };
}
