import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

export const TREECOIN_NAME = "TreeCoin";
export const TREECOIN_SYMBOL = "TREE";
export const TREECOIN_DECIMALS = 0;
export const TREECOIN_DISCLAIMER =
  "TreeCoin is an in-app reward point during MVP and is not a tradable financial asset.";

export const paths = {
  secretsDir: path.join(projectRoot, ".secrets"),
  artifactsDir: path.join(projectRoot, "artifacts", "treecoin"),
  receiptsDir: path.join(projectRoot, "artifacts", "treecoin", "mint-receipts"),
  authorityKeypair: path.join(projectRoot, ".secrets", "treecoin-solana-authority-devnet.json"),
  demoRecipientKeypair: path.join(projectRoot, ".secrets", "treecoin-demo-recipient-devnet.json"),
  mintArtifact: path.join(projectRoot, "artifacts", "treecoin", "solana-devnet.json"),
};

export function getCluster() {
  return process.env.SOLANA_CLUSTER ?? "devnet";
}

export function getTreeCoinPaths(cluster = getCluster()) {
  const safeCluster = cluster.replace(/[^a-z0-9_-]/gi, "-").toLowerCase();

  return {
    secretsDir: path.join(projectRoot, ".secrets"),
    artifactsDir: path.join(projectRoot, "artifacts", "treecoin"),
    receiptsDir: path.join(projectRoot, "artifacts", "treecoin", "mint-receipts"),
    authorityKeypair: path.join(
      projectRoot,
      ".secrets",
      `treecoin-solana-authority-${safeCluster}.json`,
    ),
    demoRecipientKeypair: path.join(
      projectRoot,
      ".secrets",
      `treecoin-demo-recipient-${safeCluster}.json`,
    ),
    mintArtifact: path.join(
      projectRoot,
      "artifacts",
      "treecoin",
      `solana-${safeCluster}.json`,
    ),
  };
}

export function getRpcUrl(cluster = getCluster()) {
  if (process.env.SOLANA_RPC_URL) {
    return process.env.SOLANA_RPC_URL;
  }

  if (cluster === "localnet") {
    return "http://127.0.0.1:8899";
  }

  return clusterApiUrl(cluster);
}

export function createConnection(cluster = getCluster()) {
  return new Connection(getRpcUrl(cluster), "confirmed");
}

export async function ensureProjectDirs(targetPaths = getTreeCoinPaths()) {
  await mkdir(targetPaths.secretsDir, { recursive: true });
  await mkdir(targetPaths.artifactsDir, { recursive: true });
  await mkdir(targetPaths.receiptsDir, { recursive: true });
}

export async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

export async function writeJson(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(`${filePath}.tmp`, `${JSON.stringify(value, null, 2)}\n`);
  await rename(`${filePath}.tmp`, filePath);
}

export async function loadOrCreateKeypair(filePath, label) {
  await mkdir(path.dirname(filePath), { recursive: true });

  try {
    const secretKey = Uint8Array.from(await readJson(filePath));
    return { keypair: Keypair.fromSecretKey(secretKey), created: false };
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    const keypair = Keypair.generate();
    await writeFile(filePath, `${JSON.stringify(Array.from(keypair.secretKey))}\n`, {
      mode: 0o600,
    });
    console.log(`${label} created at ${filePath}`);
    return { keypair, created: true };
  }
}

export async function ensureDevnetFunding(connection, payer) {
  const cluster = getCluster();

  if (cluster !== "devnet") {
    return connection.getBalance(payer.publicKey, "confirmed");
  }

  const currentBalance = await connection.getBalance(payer.publicKey, "confirmed");
  const minimumBalance = 0.08 * LAMPORTS_PER_SOL;

  if (currentBalance >= minimumBalance) {
    return currentBalance;
  }

  console.log("Requesting devnet SOL for the TreeCoin authority...");
  const airdropAmounts = [1, 0.5, 0.2];
  let lastError;

  for (const amount of airdropAmounts) {
    try {
      const signature = await connection.requestAirdrop(
        payer.publicKey,
        Math.floor(amount * LAMPORTS_PER_SOL),
      );
      await confirmSignature(connection, signature);
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      console.log(
        `Devnet airdrop for ${amount} SOL did not complete: ${error.message}`,
      );
      await new Promise((resolve) => setTimeout(resolve, 1800));
    }
  }

  if (lastError) {
    throw new Error(
      `Solana devnet airdrop failed after retries. The local authority is ${payer.publicKey.toBase58()}. Try again later or fund that devnet address manually. Last error: ${lastError.message}`,
    );
  }

  const nextBalance = await connection.getBalance(payer.publicKey, "confirmed");

  if (nextBalance < minimumBalance) {
    throw new Error(
      "The devnet airdrop did not fund the authority enough to create TreeCoin. Try running npm.cmd run treecoin:create again in a few minutes.",
    );
  }

  return nextBalance;
}

export async function ensureClusterFunding(connection, payer, cluster = getCluster()) {
  if (cluster === "devnet") {
    return ensureDevnetFunding(connection, payer);
  }

  const currentBalance = await connection.getBalance(payer.publicKey, "confirmed");
  const minimumBalance = 0.08 * LAMPORTS_PER_SOL;

  if (currentBalance >= minimumBalance) {
    return currentBalance;
  }

  if (cluster === "localnet") {
    console.log("Requesting localnet SOL for the TreeCoin authority...");
    const signature = await connection.requestAirdrop(
      payer.publicKey,
      Math.floor(2 * LAMPORTS_PER_SOL),
    );
    await confirmSignature(connection, signature);
    return connection.getBalance(payer.publicKey, "confirmed");
  }

  throw new Error(
    `TreeCoin authority has insufficient SOL on ${cluster}. Fund ${payer.publicKey.toBase58()} before mint setup.`,
  );
}

export async function confirmSignature(connection, signature) {
  const latestBlockhash = await connection.getLatestBlockhash("confirmed");
  await connection.confirmTransaction(
    {
      signature,
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    },
    "confirmed",
  );
}

export function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];

    if (!item.startsWith("--")) {
      continue;
    }

    const [key, inlineValue] = item.slice(2).split("=");
    const value =
      inlineValue ??
      (argv[index + 1] && !argv[index + 1].startsWith("--")
        ? argv[++index]
        : "true");

    args[key] = value;
  }

  return args;
}

export function toPublicKey(value, label) {
  try {
    return new PublicKey(value);
  } catch {
    throw new Error(`${label} is not a valid Solana public key.`);
  }
}

export function explorerUrl(kind, address) {
  const cluster = getCluster();

  if (cluster === "localnet") {
    return `solana-localnet:${kind}:${address}`;
  }

  const clusterParam = cluster === "mainnet-beta" ? "" : `?cluster=${cluster}`;
  return `https://explorer.solana.com/${kind}/${address}${clusterParam}`;
}
