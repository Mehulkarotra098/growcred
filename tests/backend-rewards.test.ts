import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildVerifiedMintRequests,
  createTreeCoinProofHash,
  isRewardReleaseDecision,
} from "../src/lib/backend/rewards";

describe("TreeCoin reward release rules", () => {
  it("releases rewards only for verified proof decisions", () => {
    assert.equal(isRewardReleaseDecision("verified"), true);
    assert.equal(isRewardReleaseDecision("under_review"), false);
    assert.equal(isRewardReleaseDecision("needs_more_info"), false);
    assert.equal(isRewardReleaseDecision("rejected"), false);
  });

  it("builds stable proof hashes for mint requests", () => {
    assert.equal(
      createTreeCoinProofHash("proof-123", "ledger-456"),
      createTreeCoinProofHash("proof-123", "ledger-456"),
    );
    assert.match(createTreeCoinProofHash("proof-123", "ledger-456"), /^0x[a-f0-9]{64}$/);
  });

  it("builds proof-bound mint requests for positive ledger entries", () => {
    const requests = buildVerifiedMintRequests({
      proofSubmissionId: "proof-1",
      network: "devnet",
      ledgerEntries: [
        { id: "ledger-1", userId: "user-1", amount: 10 },
        { id: "ledger-2", userId: "user-2", amount: 0 },
      ],
    });

    assert.deepEqual(requests, [
      {
        ledger_id: "ledger-1",
        user_id: "user-1",
        proof_submission_id: "proof-1",
        amount: 10,
        proof_hash: createTreeCoinProofHash("proof-1", "ledger-1"),
        status: "recipient_needed",
        network: "devnet",
      },
    ]);
  });
});
