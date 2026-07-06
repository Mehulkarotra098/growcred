import { TREECOIN_DISCLAIMER } from "@/lib/copy";

export const TREECOIN_TOKEN = {
  name: "TreeCoin",
  symbol: "TREE",
  decimals: 0,
  chain: "Solana",
  cluster: "devnet",
  tokenProgram: "Token-2022",
  tokenProgramId: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  mintArtifactPath: "artifacts/treecoin/solana-devnet.json",
  localMintArtifactPath: "artifacts/treecoin/solana-localnet.json",
  authorityKeypairPath: ".secrets/treecoin-solana-authority-devnet.json",
  createCommand: "npm.cmd run treecoin:create",
  localCreateCommand: "npm.cmd run treecoin:create:local",
  mintCommand: "npm.cmd run treecoin:mint -- --amount 10",
  localMintCommand: "npm.cmd run treecoin:mint:local -- --amount 10",
  supplyPolicy: "Minted only after verified GrowCred proof decisions.",
  transferPolicy: "Non-transferable Token-2022 reward token.",
  launchStatus:
    "Local Solana validation complete; public test network mint is the next step.",
  rewardDisclaimer: TREECOIN_DISCLAIMER,
} as const;

export const TREECOIN_REWARD_RULES = [
  {
    title: "Verified proof only",
    description:
      "TreeCoins are released after a proof submission passes GrowCred review.",
  },
  {
    title: "Simple points",
    description:
      "Rewards appear as whole TreeCoin points, like +10 for an approved planting proof.",
  },
  {
    title: "Stays with verified impact",
    description:
      "TreeCoins stay tied to the GrowCred proof record that earned them.",
  },
  {
    title: "Approved by review",
    description:
      "Reward release comes from verified review decisions with a clear audit trail.",
  },
] as const;

export const TREECOIN_SOLANA_RECEIPT_FIELDS = [
  "mintAddress",
  "recipientAddress",
  "recipientTokenAccount",
  "amount",
  "proofHash",
  "transactionSignature",
] as const;
