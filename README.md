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
- TreeCoin appears only as an in-app reward point.
- Do not add financial-product mechanics or speculative reward language.
- Use clear proof, permission, local suitability, and care commitment language wherever reward decisions appear.
