"use server";

import { revalidatePath } from "next/cache";
import type { ProofStatus } from "@/lib/types";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

interface ReviewProofInput {
  proofSubmissionId: string;
  decision: ProofStatus;
  notes?: string;
  fraudFlags?: string[];
}

export async function reviewProofAction(input: ReviewProofInput) {
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
    })
    .eq("id", input.proofSubmissionId);

  if (submissionError) {
    return { ok: false, mode: "supabase" as const, message: submissionError.message };
  }

  await supabase.from("admin_reviews").insert({
    proof_submission_id: input.proofSubmissionId,
    decision: input.decision,
    notes: input.notes ?? "",
    fraud_flags: input.fraudFlags ?? [],
    reviewed_at: reviewedAt,
  });

  await supabase
    .from("trees")
    .update({ status: input.decision })
    .eq("id", proof.tree_id);

  if (input.decision === "verified") {
    await supabase
      .from("treecoin_ledger")
      .update({ status: "verified" })
      .eq("proof_submission_id", input.proofSubmissionId);
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return {
    ok: true,
    mode: "supabase" as const,
    message: "Review decision saved.",
  };
}
