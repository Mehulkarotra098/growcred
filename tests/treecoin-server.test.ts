import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getTreeCoinMintServerConfig,
  sanitizeMintBatchLimit,
} from "../src/lib/treecoin/server";

describe("TreeCoin server mint configuration", () => {
  it("reports missing Solana mint configuration without exposing secrets", () => {
    const result = getTreeCoinMintServerConfig({});

    assert.equal(result.ok, false);
    assert.deepEqual(result.missing, ["TREECOIN_SOLANA_MINT_ADDRESS"]);
    assert.equal(JSON.stringify(result).includes("[1,2,3]"), false);
  });

  it("defaults to devnet and accepts configured mint settings", () => {
    const result = getTreeCoinMintServerConfig({
      TREECOIN_SOLANA_MINT_ADDRESS: "Mint111111111111111111111111111111111111111",
      SOLANA_RPC_URL: "https://api.devnet.solana.com",
    });

    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.config.cluster, "devnet");
      assert.equal(result.config.rpcUrl, "https://api.devnet.solana.com");
      assert.equal(result.config.mintAddress, "Mint111111111111111111111111111111111111111");
    }
  });

  it("keeps mint processor batches bounded", () => {
    assert.equal(sanitizeMintBatchLimit(undefined), 10);
    assert.equal(sanitizeMintBatchLimit("3"), 3);
    assert.equal(sanitizeMintBatchLimit("999"), 25);
    assert.equal(sanitizeMintBatchLimit("-1"), 10);
  });
});
