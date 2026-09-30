-- Forum: questions, answers, upvotes, reports and moderators.
-- Run once in Supabase: SQL Editor > New query > paste > Run. Safe to run again.

-- ---------- Tables ----------
create table if not exists public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_name text not null default '',
  title text not null check (char_length(title) between 8 and 200),
  body text not null default '' check (char_length(body) <= 5000),
  tag text not null default 'general' check (char_length(tag) <= 40),
  qkey text unique check (qkey is null or qkey ~ '^q:[a-z0-9]{1,16}$'), -- set for threads about a practice-bank question
  accepted_answer uuid,
  hidden boolean not null default false,
  answer_count integer not null default 0,
  score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity timestamptz not null default now()
);
create index if not exists forum_posts_activity_idx on public.forum_posts (last_activity desc);
create index if not exists forum_posts_user_idx on public.forum_posts (user_id);

create table if not exists public.forum_answers (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  author_name text not null default '',
  body text not null check (char_length(body) between 2 and 5000),
  hidden boolean not null default false,
  score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists forum_answers_post_idx on public.forum_answers (post_id, created_at);
create index if not exists forum_answers_created_idx on public.forum_answers (created_at desc);

create table if not exists public.forum_votes (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'answer')),
  target_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (user_id, target_type, target_id)
);

create table if not exists public.forum_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  target_type text not null check (target_type in ('post', 'answer')),
  target_id uuid not null,
  post_id uuid not null references public.forum_posts(id) on delete cascade,
  reason text not null default '' check (char_length(reason) <= 500),
  resolved boolean not null default false,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

-- Moderators. Add one with:
--   insert into public.forum_admins (user_id) select id from auth.users where email = 'someone@example.com';
create table if not exists public.forum_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_forum_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.forum_admins where user_id = auth.uid())
$$;

-- ---------- Triggers: names, protected columns, counters, rate limits ----------
create or replace function public.forum_before_write() returns trigger
language plpgsql security definer set search_path = public as $$
declare recent integer;
begin
  if tg_op = 'INSERT' then
    -- Name comes from the profile, so nobody can post as someone else.
    select coalesce(nullif(trim(display_name), ''), 'Member') into new.author_name from public.profiles where id = new.user_id;
    if new.author_name is null then new.author_name := 'Member'; end if;
    new.created_at := now(); new.updated_at := now(); new.hidden := false; new.score := 0;
    if tg_table_name = 'forum_posts' then
      new.answer_count := 0; new.accepted_answer := null; new.last_activity := now();
      if new.qkey is not null then
        new.author_name := 'Practice question';
        select count(*) into recent from public.forum_posts where user_id = new.user_id and qkey is not null and created_at > now() - interval '1 hour';
        if recent >= 40 then raise exception 'Too many new threads in the last hour. Try again later.'; end if;
      else
        select count(*) into recent from public.forum_posts where user_id = new.user_id and qkey is null and created_at > now() - interval '1 hour';
        if recent >= 10 then raise exception 'You have asked a lot of questions in the last hour. Try again later.'; end if;
      end if;
    else
      select count(*) into recent from public.forum_answers where user_id = new.user_id and created_at > now() - interval '1 hour';
      if recent >= 30 then raise exception 'You have posted a lot of answers in the last hour. Try again later.'; end if;
    end if;
    return new;
  end if;

  -- UPDATE: counters and authorship can't be changed by hand; only moderators hide or unhide.
  new.id := old.id; new.user_id := old.user_id; new.author_name := old.author_name; new.created_at := old.created_at;
  if current_setting('forum.internal', true) is distinct from 'on' then
    new.score := old.score;
    if tg_table_name = 'forum_posts' then
      new.answer_count := old.answer_count; new.last_activity := old.last_activity; new.qkey := old.qkey;
      if new.accepted_answer is distinct from old.accepted_answer and new.accepted_answer is not null
         and not exists (select 1 from public.forum_answers a where a.id = new.accepted_answer and a.post_id = new.id) then
        raise exception 'That answer is not on this question.';
      end if;
    else
      new.post_id := old.post_id;
    end if;
    if new.hidden is distinct from old.hidden and not public.is_forum_admin() then
      raise exception 'Only moderators can hide or unhide posts.';
    end if;
    if tg_table_name = 'forum_posts' then
      if new.title is distinct from old.title or new.body is distinct from old.body or new.tag is distinct from old.tag then new.updated_at := now(); end if;
    elsif new.body is distinct from old.body then new.updated_at := now();
    end if;
  end if;
  return new;
end $$;

drop trigger if exists forum_posts_before on public.forum_posts;
create trigger forum_posts_before before insert or update on public.forum_posts
  for each row execute function public.forum_before_write();
drop trigger if exists forum_answers_before on public.forum_answers;
create trigger forum_answers_before before insert or update on public.forum_answers
  for each row execute function public.forum_before_write();

-- Keep answer counts and "last activity" in step with answers.
create or replace function public.forum_after_answer() returns trigger
language plpgsql security definer set search_path = public as $$
declare pid uuid := coalesce(new.post_id, old.post_id);
begin
  perform set_config('forum.internal', 'on', true);
  update public.forum_posts p set
    answer_count = (select count(*) from public.forum_answers a where a.post_id = pid and not a.hidden),
    last_activity = case when tg_op = 'INSERT' then now() else p.last_activity end,
    accepted_answer = case when tg_op = 'DELETE' and p.accepted_answer = old.id then null else p.accepted_answer end
  where p.id = pid;
  perform set_config('forum.internal', 'off', true);
  if tg_op = 'DELETE' then
    delete from public.forum_votes where target_type = 'answer' and target_id = old.id;
    delete from public.forum_reports where target_type = 'answer' and target_id = old.id;
  end if;
  return null;
end $$;
drop trigger if exists forum_answers_after on public.forum_answers;
create trigger forum_answers_after after insert or delete or update of hidden on public.forum_answers
  for each row execute function public.forum_after_answer();

-- Upvotes: one per person per item, not on your own posts; scores kept in step.
create or replace function public.forum_vote_check() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.target_type = 'post' then
    if not exists (select 1 from public.forum_posts where id = new.target_id and not hidden) then raise exception 'Question not found.'; end if;
    if exists (select 1 from public.forum_posts where id = new.target_id and user_id = new.user_id and qkey is null) then raise exception 'You cannot upvote your own question.'; end if;
  else
    if not exists (select 1 from public.forum_answers where id = new.target_id and not hidden) then raise exception 'Answer not found.'; end if;
    if exists (select 1 from public.forum_answers where id = new.target_id and user_id = new.user_id) then raise exception 'You cannot upvote your own answer.'; end if;
  end if;
  new.created_at := now();
  return new;
end $$;
drop trigger if exists forum_votes_before on public.forum_votes;
create trigger forum_votes_before before insert on public.forum_votes
  for each row execute function public.forum_vote_check();

create or replace function public.forum_after_vote() returns trigger
language plpgsql security definer set search_path = public as $$
declare t text := coalesce(new.target_type, old.target_type); tid uuid := coalesce(new.target_id, old.target_id);
begin
  perform set_config('forum.internal', 'on', true);
  if t = 'post' then
    update public.forum_posts set score = (select count(*) from public.forum_votes where target_type = 'post' and target_id = tid) where id = tid;
  else
    update public.forum_answers set score = (select count(*) from public.forum_votes where target_type = 'answer' and target_id = tid) where id = tid;
  end if;
  perform set_config('forum.internal', 'off', true);
  return null;
end $$;
drop trigger if exists forum_votes_after on public.forum_votes;
create trigger forum_votes_after after insert or delete on public.forum_votes
  for each row execute function public.forum_after_vote();

create or replace function public.forum_after_post_delete() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  delete from public.forum_votes where target_type = 'post' and target_id = old.id;
  return null;
end $$;
drop trigger if exists forum_posts_after_delete on public.forum_posts;
create trigger forum_posts_after_delete after delete on public.forum_posts
  for each row execute function public.forum_after_post_delete();

-- ---------- Row level security ----------
alter table public.forum_posts enable row level security;
alter table public.forum_answers enable row level security;
alter table public.forum_votes enable row level security;
alter table public.forum_reports enable row level security;
alter table public.forum_admins enable row level security;

-- Questions: every signed-in person reads visible ones; you edit and delete your own (not practice-bank threads).
drop policy if exists "read posts" on public.forum_posts;
create policy "read posts" on public.forum_posts for select to authenticated
  using (not hidden or user_id = auth.uid() or public.is_forum_admin());
drop policy if exists "add posts" on public.forum_posts;
create policy "add posts" on public.forum_posts for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists "edit posts" on public.forum_posts;
create policy "edit posts" on public.forum_posts for update to authenticated
  using ((user_id = auth.uid() and qkey is null) or public.is_forum_admin())
  with check ((user_id = auth.uid() and qkey is null) or public.is_forum_admin());
drop policy if exists "delete posts" on public.forum_posts;
create policy "delete posts" on public.forum_posts for delete to authenticated
  using ((user_id = auth.uid() and qkey is null
          and not exists (select 1 from public.forum_answers a where a.post_id = forum_posts.id and a.user_id <> auth.uid()))
         or public.is_forum_admin());

-- The asker may mark an accepted answer on a practice-bank thread too, so allow that one column separately.
create or replace function public.forum_accept(p_post uuid, p_answer uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.forum_posts where id = p_post and user_id = auth.uid() and qkey is null) then
    raise exception 'Only the person who asked can accept an answer.';
  end if;
  if p_answer is not null and not exists (select 1 from public.forum_answers where id = p_answer and post_id = p_post) then
    raise exception 'That answer is not on this question.';
  end if;
  perform set_config('forum.internal', 'on', true);
  update public.forum_posts set accepted_answer = p_answer where id = p_post;
  perform set_config('forum.internal', 'off', true);
end $$;
revoke all on function public.forum_accept(uuid, uuid) from public, anon;
grant execute on function public.forum_accept(uuid, uuid) to authenticated;

-- Answers: read visible ones on visible questions; add to visible questions; edit and delete your own.
drop policy if exists "read answers" on public.forum_answers;
create policy "read answers" on public.forum_answers for select to authenticated
  using ((not hidden or user_id = auth.uid() or public.is_forum_admin())
    and exists (select 1 from public.forum_posts p where p.id = post_id and (not p.hidden or p.user_id = auth.uid() or public.is_forum_admin())));
drop policy if exists "add answers" on public.forum_answers;
create policy "add answers" on public.forum_answers for insert to authenticated
  with check (user_id = auth.uid() and exists (select 1 from public.forum_posts p where p.id = post_id and not p.hidden));
drop policy if exists "edit answers" on public.forum_answers;
create policy "edit answers" on public.forum_answers for update to authenticated
  using (user_id = auth.uid() or public.is_forum_admin())
  with check (user_id = auth.uid() or public.is_forum_admin());
drop policy if exists "delete answers" on public.forum_answers;
create policy "delete answers" on public.forum_answers for delete to authenticated
  using (user_id = auth.uid() or public.is_forum_admin());

-- Votes: you see and change only your own.
drop policy if exists "own votes" on public.forum_votes;
create policy "own votes" on public.forum_votes for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Reports: anyone signed in can report; only moderators read and resolve them.
drop policy if exists "add reports" on public.forum_reports;
create policy "add reports" on public.forum_reports for insert to authenticated
  with check (user_id = auth.uid());
drop policy if exists "mods read reports" on public.forum_reports;
create policy "mods read reports" on public.forum_reports for select to authenticated
  using (public.is_forum_admin());
drop policy if exists "mods resolve reports" on public.forum_reports;
create policy "mods resolve reports" on public.forum_reports for update to authenticated
  using (public.is_forum_admin()) with check (public.is_forum_admin());

-- Moderators: you can only see whether you yourself are one.
drop policy if exists "see self" on public.forum_admins;
create policy "see self" on public.forum_admins for select to authenticated
  using (user_id = auth.uid());

-- Nobody signed out can touch the forum.
revoke all on public.forum_posts, public.forum_answers, public.forum_votes, public.forum_reports, public.forum_admins from anon;
