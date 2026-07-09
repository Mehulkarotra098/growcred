import type { TreeCoinMintRequest } from "@/lib/types";

export type TreeCoinCluster = TreeCoinMintRequest["network"];

export interface TreeCoinMintServerConfig {
  cluster: TreeCoinCluster;
  rpcUrl?: string;
  mintAddress: string;
}

export type TreeCoinMintServerConfigResult =
  | { ok: true; config: TreeCoinMintServerConfig }
  | { ok: false; missing: string[] };

export function getTreeCoinMintServerConfig(
  env: Record<string, string | undefined> = process.env,
): TreeCoinMintServerConfigResult {
  const missing: string[] = [];
  const mintAddress = env.TREECOIN_SOLANA_MINT_ADDRESS?.trim();

  if (!mintAddress) missing.push("TREECOIN_SOLANA_MINT_ADDRESS");

  if (missing.length > 0) return { ok: false, missing };

  return {
    ok: true,
    config: {
      cluster: normalizeCluster(env.SOLANA_CLUSTER),
      rpcUrl: env.SOLANA_RPC_URL?.trim() || undefined,
      mintAddress: mintAddress!,
    },
  };
}

export function sanitizeMintBatchLimit(value: string | undefined) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return 10;
  return Math.min(parsed, 25);
}

export function normalizeCluster(value: string | undefined): TreeCoinCluster {
  if (value === "localnet" || value === "mainnet-beta") return value;
  return "devnet";
}
