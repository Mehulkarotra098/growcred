import { createHash } from "node:crypto";
import type { ProofStatus, TreeCoinMintRequest } from "@/lib/types";

type MintNetwork = TreeCoinMintRequest["network"];

interface LedgerEntryForMint {
  id: string;
  userId: string;
  amount: number;
}

export interface VerifiedMintRequestInput {
  proofSubmissionId: string;
  ledgerEntries: LedgerEntryForMint[];
  network?: MintNetwork;
}

export interface TreeCoinMintRequestInsert {
  ledger_id: string;
  user_id: string;
  proof_submission_id: string;
  amount: number;
  proof_hash: string;
  status: "recipient_needed";
  network: MintNetwork;
}

export function isRewardReleaseDecision(decision: ProofStatus) {
  return decision === "verified";
}

export function createTreeCoinProofHash(
  proofSubmissionId: string,
  ledgerId: string,
) {
  return `0x${createHash("sha256")
    .update(`${proofSubmissionId}:${ledgerId}`)
    .digest("hex")}`;
}

export function buildVerifiedMintRequests({
  proofSubmissionId,
  ledgerEntries,
  network = "devnet",
}: VerifiedMintRequestInput): TreeCoinMintRequestInsert[] {
  return ledgerEntries
    .filter((entry) => Number.isFinite(entry.amount) && entry.amount > 0)
    .map((entry) => ({
      ledger_id: entry.id,
      user_id: entry.userId,
      proof_submission_id: proofSubmissionId,
      amount: entry.amount,
      proof_hash: createTreeCoinProofHash(proofSubmissionId, entry.id),
      status: "recipient_needed",
      network,
    }));
}
