import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const home = process.env.USERPROFILE ?? process.env.HOME;
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const configDir = path.join(home, ".config", "solana", "cli");
const configPath = path.join(configDir, "config.yml");
const keypairPath = path
  .join(projectRoot, ".secrets", "treecoin-solana-authority-devnet.json")
  .replace(/\\/g, "/");

const config = [
  "---",
  "json_rpc_url: \"https://api.devnet.solana.com\"",
  "websocket_url: \"wss://api.devnet.solana.com/\"",
  `keypair_path: \"${keypairPath}\"`,
  "commitment: confirmed",
  "",
].join("\n");

await mkdir(configDir, { recursive: true });
await writeFile(configPath, config);

console.log(`Solana devnet CLI config written to ${configPath}`);
