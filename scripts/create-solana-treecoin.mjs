import {
  ExtensionType,
  createInitializeMintInstruction,
  createInitializeNonTransferableMintInstruction,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  createConnection,
  ensureClusterFunding,
  ensureProjectDirs,
  explorerUrl,
  getCluster,
  getRpcUrl,
  getTreeCoinPaths,
  loadOrCreateKeypair,
  parseArgs,
  readJson,
  TREECOIN_DECIMALS,
  TREECOIN_DISCLAIMER,
  TREECOIN_NAME,
  TREECOIN_SYMBOL,
  writeJson,
} from "./treecoin-solana-utils.mjs";

const args = parseArgs(process.argv.slice(2));
if (args.cluster) {
  process.env.SOLANA_CLUSTER = args.cluster;
}
if (args["rpc-url"]) {
  process.env.SOLANA_RPC_URL = args["rpc-url"];
}

const force = args.force === "true";
const cluster = getCluster();
const paths = getTreeCoinPaths(cluster);

await ensureProjectDirs(paths);

if (!force) {
  try {
    const existing = await readJson(paths.mintArtifact);

    if (existing?.mintAddress) {
      console.log(`TreeCoin Solana ${cluster} mint already exists.`);
      console.log(`Mint: ${existing.mintAddress}`);
      console.log(`Explorer: ${existing.explorerUrl}`);
      console.log(
        `Use --force only if you intentionally want a brand-new ${cluster} mint.`,
      );
      process.exit(0);
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}

const connection = createConnection(cluster);
const { keypair: authority } = await loadOrCreateKeypair(
  paths.authorityKeypair,
  "TreeCoin Solana authority",
);

await ensureClusterFunding(connection, authority, cluster);

const mint = Keypair.generate();
const extensions = [ExtensionType.NonTransferable];
const mintSpace = getMintLen(extensions);
const lamports = await connection.getMinimumBalanceForRentExemption(mintSpace);

const transaction = new Transaction().add(
  SystemProgram.createAccount({
    fromPubkey: authority.publicKey,
    newAccountPubkey: mint.publicKey,
    space: mintSpace,
    lamports,
    programId: TOKEN_2022_PROGRAM_ID,
  }),
  createInitializeNonTransferableMintInstruction(
    mint.publicKey,
    TOKEN_2022_PROGRAM_ID,
  ),
  createInitializeMintInstruction(
    mint.publicKey,
    TREECOIN_DECIMALS,
    authority.publicKey,
    authority.publicKey,
    TOKEN_2022_PROGRAM_ID,
  ),
);

const creationSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [authority, mint],
  { commitment: "confirmed" },
);

const artifact = {
  name: TREECOIN_NAME,
  symbol: TREECOIN_SYMBOL,
  decimals: TREECOIN_DECIMALS,
  cluster,
  rpcUrl: getRpcUrl(cluster),
  tokenProgram: "Token-2022",
  tokenProgramId: TOKEN_2022_PROGRAM_ID.toBase58(),
  mintAddress: mint.publicKey.toBase58(),
  mintAuthority: authority.publicKey.toBase58(),
  freezeAuthority: authority.publicKey.toBase58(),
  nonTransferable: true,
  rewardOnly: true,
  disclaimer: TREECOIN_DISCLAIMER,
  createdAt: new Date().toISOString(),
  creationSignature,
  explorerUrl: explorerUrl("address", mint.publicKey.toBase58()),
  creationTransactionUrl: explorerUrl("tx", creationSignature),
};

await writeJson(paths.mintArtifact, artifact);

console.log(`TreeCoin Solana ${cluster} mint created.`);
console.log(`Mint: ${artifact.mintAddress}`);
console.log(`Authority: ${artifact.mintAuthority}`);
console.log(`Explorer: ${artifact.explorerUrl}`);
console.log(`Artifact: ${paths.mintArtifact}`);
