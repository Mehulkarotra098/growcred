import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import {
  createConnection,
  ensureClusterFunding,
  ensureProjectDirs,
  explorerUrl,
  getCluster,
  getTreeCoinPaths,
  loadOrCreateKeypair,
  parseArgs,
  readJson,
  toPublicKey,
  writeJson,
} from "./treecoin-solana-utils.mjs";

const args = parseArgs(process.argv.slice(2));
if (args.cluster) {
  process.env.SOLANA_CLUSTER = args.cluster;
}
if (args["rpc-url"]) {
  process.env.SOLANA_RPC_URL = args["rpc-url"];
}

const cluster = getCluster();
const paths = getTreeCoinPaths(cluster);
const amount = BigInt(args.amount ?? "10");
const proofHash = args.proof ?? `manual-${Date.now()}`;
const reason = args.reason ?? "verified-tree-care";

if (amount <= 0n) {
  throw new Error("TreeCoin mint amount must be greater than zero.");
}

await ensureProjectDirs(paths);

const mintArtifact = await readJson(paths.mintArtifact).catch((error) => {
  if (error.code === "ENOENT") {
    throw new Error(
      `TreeCoin ${cluster} mint not found. Run the create command for ${cluster} first.`,
    );
  }

  throw error;
});

const connection = createConnection(cluster);
const { keypair: authority } = await loadOrCreateKeypair(
  paths.authorityKeypair,
  "TreeCoin Solana authority",
);

if (authority.publicKey.toBase58() !== mintArtifact.mintAuthority) {
  throw new Error(
    "The local TreeCoin authority does not match the saved mint authority.",
  );
}

await ensureClusterFunding(connection, authority, cluster);

const mint = new PublicKey(mintArtifact.mintAddress);
let recipient;

if (args.recipient) {
  recipient = toPublicKey(args.recipient, "Recipient");
} else {
  const { keypair: demoRecipient } = await loadOrCreateKeypair(
    paths.demoRecipientKeypair,
    "TreeCoin demo recipient",
  );
  recipient = demoRecipient.publicKey;
}

const recipientTokenAccount = await getAssociatedTokenAddress(
  mint,
  recipient,
  false,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
);

const instructions = [];
const existingTokenAccount = await connection.getAccountInfo(
  recipientTokenAccount,
  "confirmed",
);

if (!existingTokenAccount) {
  instructions.push(
    createAssociatedTokenAccountInstruction(
      authority.publicKey,
      recipientTokenAccount,
      recipient,
      mint,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
  );
}

instructions.push(
  createMintToCheckedInstruction(
    mint,
    recipientTokenAccount,
    authority.publicKey,
    amount,
    mintArtifact.decimals,
    [],
    TOKEN_2022_PROGRAM_ID,
  ),
);

const signature = await sendAndConfirmTransaction(
  connection,
  new Transaction().add(...instructions),
  [authority],
  { commitment: "confirmed" },
);

const receipt = {
  mintAddress: mint.toBase58(),
  recipientAddress: recipient.toBase58(),
  recipientTokenAccount: recipientTokenAccount.toBase58(),
  amount: amount.toString(),
  proofHash,
  reason,
  cluster: mintArtifact.cluster,
  tokenProgramId: TOKEN_2022_PROGRAM_ID.toBase58(),
  transactionSignature: signature,
  transactionUrl: explorerUrl("tx", signature),
  mintedAt: new Date().toISOString(),
};

const receiptPath = `${paths.receiptsDir}/${new Date()
  .toISOString()
  .replace(/[:.]/g, "-")}-${signature.slice(0, 8)}.json`;

await writeJson(receiptPath, receipt);

console.log(`TreeCoin reward minted on Solana ${receipt.cluster}.`);
console.log(`Mint: ${receipt.mintAddress}`);
console.log(`Recipient: ${receipt.recipientAddress}`);
console.log(`Token account: ${receipt.recipientTokenAccount}`);
console.log(`Amount: ${receipt.amount}`);
console.log(`Transaction: ${receipt.transactionUrl}`);
console.log(`Receipt: ${receiptPath}`);
