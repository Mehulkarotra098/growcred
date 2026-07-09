create extension if not exists pgcrypto;

do $$ begin
  create type proof_status as enum (
    'draft',
    'submitted',
    'under_review',
    'verified',
    'needs_more_info',
    'rejected'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type proof_type as enum ('planting', 'care_checkin', 'survival_update');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  avatar_url text,
  city text,
  country text default 'India',
  total_treecoins integer not null default 0,
  verified_trees integer not null default 0,
  role text not null default 'grower',
  created_at timestamptz not null default now()
);

create table if not exists public.trees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  nickname text not null,
  species text not null,
  location_name text not null,
  latitude numeric,
  longitude numeric,
  planted_at date not null,
  status proof_status not null default 'submitted',
  photos text[] not null default '{}',
  video_url text,
  treecoins_earned integer not null default 0,
  next_care_reminder timestamptz,
  survival_stage text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proof_submissions (
  id uuid primary key default gen_random_uuid(),
  tree_id uuid not null references public.trees(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type proof_type not null,
  photo_url text not null,
  video_url text,
  notes text,
  status proof_status not null default 'under_review',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_id uuid references public.profiles(id)
);

create table if not exists public.treecoin_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tree_id uuid references public.trees(id) on delete set null,
  proof_submission_id uuid references public.proof_submissions(id) on delete set null,
  action text not null,
  amount integer not null,
  status proof_status not null default 'submitted',
  created_at timestamptz not null default now()
);

create table if not exists public.treecoin_mint_requests (
  id uuid primary key default gen_random_uuid(),
  ledger_id uuid not null references public.treecoin_ledger(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  proof_submission_id uuid not null references public.proof_submissions(id) on delete cascade,
  recipient_address text,
  amount integer not null check (amount > 0),
  proof_hash text not null unique,
  status text not null default 'recipient_needed',
  network text not null default 'devnet',
  mint_address text,
  recipient_token_account text,
  transaction_signature text,
  mint_error text,
  created_at timestamptz not null default now(),
  minted_at timestamptz
);

create table if not exists public.admin_reviews (
  id uuid primary key default gen_random_uuid(),
  proof_submission_id uuid not null references public.proof_submissions(id) on delete cascade,
  reviewer_id uuid references public.profiles(id),
  decision proof_status not null,
  notes text,
  fraud_flags text[] not null default '{}',
  reviewed_at timestamptz not null default now()
);

create table if not exists public.care_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  tree_id uuid not null references public.trees(id) on delete cascade,
  message text not null,
  due_at timestamptz not null,
  channel text not null default 'in_app',
  status text not null default 'scheduled',
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create table if not exists public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  care_reminder_id uuid references public.care_reminders(id) on delete set null,
  channel text not null,
  subject text not null,
  body text not null,
  status text not null default 'queued',
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists trees_user_id_idx on public.trees(user_id);
create index if not exists proof_submissions_status_idx on public.proof_submissions(status);
create index if not exists proof_submissions_user_id_idx on public.proof_submissions(user_id);
create index if not exists care_reminders_due_idx on public.care_reminders(status, due_at);
create index if not exists treecoin_mint_requests_status_idx on public.treecoin_mint_requests(status);
create index if not exists treecoin_mint_requests_user_id_idx on public.treecoin_mint_requests(user_id);

alter table public.profiles enable row level security;
alter table public.trees enable row level security;
alter table public.proof_submissions enable row level security;
alter table public.treecoin_ledger enable row level security;
alter table public.treecoin_mint_requests enable row level security;
alter table public.admin_reviews enable row level security;
alter table public.care_reminders enable row level security;
alter table public.notification_outbox enable row level security;

create policy "profiles are self readable"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are self writable"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles are self updatable"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "users manage their trees"
  on public.trees for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users manage their proof submissions" on public.proof_submissions;

create policy "users read their proof submissions"
  on public.proof_submissions for select
  using (auth.uid() = user_id);

create policy "users create their proof submissions"
  on public.proof_submissions for insert
  with check (auth.uid() = user_id);

create policy "admins read proof submissions"
  on public.proof_submissions for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin', 'reviewer')
    )
  );

create policy "users read their ledger"
  on public.treecoin_ledger for select
  using (auth.uid() = user_id);

create policy "users read their mint requests"
  on public.treecoin_mint_requests for select
  using (auth.uid() = user_id);

create policy "users register recipient addresses"
  on public.treecoin_mint_requests for update
  using (auth.uid() = user_id and status in ('recipient_needed', 'failed'))
  with check (auth.uid() = user_id and status in ('queued', 'recipient_needed'));

create policy "users read their reminders"
  on public.care_reminders for select
  using (auth.uid() = user_id);

create policy "users update their reminders"
  on public.care_reminders for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users read their notification outbox"
  on public.notification_outbox for select
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('tree-proof-media', 'tree-proof-media', false)
on conflict (id) do nothing;

create policy "authenticated users upload proof media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'tree-proof-media');

create policy "authenticated users read proof media"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'tree-proof-media');
