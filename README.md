# GrowCred

GrowCred helps people plant real trees, prove the action, protect the tree over time, and earn TreeCoins for verified care.

TreeCoin is an in-app reward point during MVP and is not a tradable financial asset.

## Brand

- Main brand: GrowCred
- Tagline: Plant. Prove. Protect.
- Slogan: Grow good. Earn green.
- Supporting line: Turn real tree care into real impact.
- Reward name: TreeCoin

GrowCred should always feel youthful, clean, trustworthy, and focused on real environmental proof.

## Run Locally

```powershell
npm.cmd install
npm.cmd run assets:stickers
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Checks

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd audit --omit=dev
```

## TreeCoin On Solana

TreeCoin is set up as a Solana Token-2022 reward token on devnet first, with
localnet support for offline development.

The current token foundation is built for reward distribution, not market speculation:

- `TreeCoin` / `TREE`
- whole reward points with `0` decimals
- Solana Token-2022
- devnet-first setup
- non-transferable reward-token configuration
- minting controlled by the local GrowCred reward authority
- GrowCred queue rows and mint receipts include a proof hash for auditability

TreeCoin is an in-app reward point during MVP and is not a tradable financial asset.

Create the devnet TreeCoin mint:

```powershell
npm.cmd run treecoin:create
```

The script does the setup work:

- creates a local devnet authority keypair in `.secrets/`
- requests devnet SOL for setup fees
- creates the Token-2022 mint with the non-transferable extension
- writes the public mint artifact to `artifacts/treecoin/solana-devnet.json`

Mint a test reward after the mint exists:

```powershell
npm.cmd run treecoin:mint -- --amount 10 --proof proof-demo-001 --reason verified-tree-care
```

If no recipient public key is provided, the script creates a local demo recipient in `.secrets/` and mints to that recipient account. To mint to a real recipient public key later:

```powershell
npm.cmd run treecoin:mint -- --recipient <SOLANA_PUBLIC_KEY> --amount 10 --proof <PROOF_ID>
```

Do not delete or share files in `.secrets/`. They control the devnet reward authority. Do not move TreeCoin to Solana mainnet without legal review, security review, recovery procedures, and a clear recipient process.

If `treecoin:create` reports `429 Too Many Requests`, the Solana public devnet faucet is rate-limited or temporarily dry. The script prints the public authority address it created. Fund that address with devnet SOL from an approved faucet, then rerun:

```powershell
npm.cmd run treecoin:create
```

For local Solana development, start a local validator first, then run:

```powershell
npm.cmd run treecoin:create:local
npm.cmd run treecoin:mint:local -- --amount 10 --proof proof-demo-001 --reason verified-tree-care
```

The localnet artifact is written to `artifacts/treecoin/solana-localnet.json`.

## Vercel Preview Sharing

Use Vercel previews when you want to share GrowCred with friends, collaborators, or reviewers.

```powershell
npx.cmd -y vercel@latest login
npx.cmd -y vercel@latest link
npx.cmd -y vercel@latest deploy --yes
```

For a custom preview or production URL, set:

```powershell
NEXT_PUBLIC_SITE_URL=https://your-growcred-url.vercel.app
```

If `NEXT_PUBLIC_SITE_URL` is not set on Vercel, metadata falls back to the current Vercel deployment URL.

## Backend Setup

The current app can run locally with mock data. To connect persistence and authentication:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create `.env.local` from `.env.example`.
4. Fill:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET=tree-proof-media`
   - `REMINDER_WEBHOOK_SECRET`
5. Restart `npm.cmd run dev`.

Backend-ready surfaces:

- `/auth` supports Supabase Auth when credentials are configured.
- `/submit-proof` uses a server action and can upload media to Supabase Storage.
- `/admin` review actions can persist through the service-role server action.
- Approved TreeCoin ledger entries can be queued in `treecoin_mint_requests` for Solana devnet reward minting.
- `/api/cron/reminders` can queue due care reminders into `notification_outbox`.
- `/api/health/backend` reports backend connection readiness for technical checks.

## Asset Pipeline

Approved image assets live in `public/assets/growcred/`. The original sticker pack stays untouched. Run:

```powershell
npm.cmd run assets:stickers
```

The script writes clean transparent sticker PNG/WebP files into `public/assets/growcred/processed/stickers/`, which is what the app imports through `src/lib/assets.ts`.

## Product Guardrails

- GrowCred is the public brand.
- TreeCoin appears as a verified reward point and controlled reward-token foundation.
- Do not add financial-product mechanics or speculative reward language.
- Use clear proof, permission, local suitability, and care commitment language wherever reward decisions appear.
