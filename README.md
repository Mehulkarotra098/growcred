# GrowCred

GrowCred is a Next.js App Router prototype for verified tree care. Users plant real trees, submit proof, and earn TreeCoins as in-app reward points.

TreeCoin is an in-app reward point only and has no financial use in this MVP.

## Run Locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
npm.cmd audit --omit=dev
```

## Phase 3 Backend Setup

The app runs in demo mode without credentials. To enable Supabase persistence:

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Create `.env.local` from `.env.example`.
4. Fill:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_STORAGE_BUCKET=tree-proof-media`
   - `REMINDER_WEBHOOK_SECRET`
5. Restart `npm.cmd run dev`.

Implemented backend-ready surfaces:

- `/auth` uses Supabase Auth when env vars exist, demo session otherwise.
- `/submit-proof` submits through a server action and uploads media to Supabase Storage when configured.
- `/admin` review actions persist through the service-role server action when configured.
- `/api/cron/reminders` queues due care reminders into `notification_outbox`.
- `/api/health/backend` reports whether the app is in demo or Supabase-ready mode.

## Brand Rules

- Public brand: GrowCred.
- Reward point: TreeCoin.
- Tagline: Plant. Prove. Protect.
- Main slogan: Grow good. Earn green.
- Keep the product focused on verified environmental action, not speculation.
