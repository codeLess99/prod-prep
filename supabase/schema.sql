-- Run this once in Supabase: SQL Editor > New query > paste > Run. Safe to run again.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  start_date date not null default current_date,
  checklist jsonb not null default '{}'::jsonb,
  daily jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists daily jsonb not null default '{}'::jsonb;

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  week smallint not null check (week between 1 and 6),
  tracker text not null,           -- e.g. 'w2.design'
  kind text not null,              -- product | feature | journey | metric | case | story | deepdive | mock | company | hours
  title text not null,
  minutes integer check (minutes is null or minutes between 0 and 1440),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists entries_user_idx on public.entries (user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.entries enable row level security;

-- Each person can only see and change their own rows.
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own entries" on public.entries;
create policy "own entries" on public.entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- OPTIONAL: only let people with a specific email domain save anything.
-- Replace example.edu with your domain, then run these two statements.
-- drop policy "own entries" on public.entries;
-- create policy "own entries" on public.entries
--   for all using (auth.uid() = user_id)
--   with check (auth.uid() = user_id and (auth.jwt() ->> 'email') like '%@example.edu');
