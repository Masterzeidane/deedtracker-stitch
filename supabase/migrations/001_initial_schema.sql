-- ============================================================
-- DeedTracker — Initial Schema
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null unique references auth.users(id) on delete cascade,
  name          text not null default 'Seeker',
  avatar_url    text,
  bio           text default '',
  location      text default '',
  xp            integer not null default 0,
  level         integer not null default 1,
  coins         integer not null default 0,
  energy        integer not null default 100,
  max_energy    integer not null default 100,
  rank          text not null default 'Seeker',
  streak        integer not null default 0,
  longest_streak integer not null default 0,
  last_active   date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- BRANCH PROGRESS
-- ============================================================
create table public.branch_progress (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  branch        text not null check (branch in ('worship','knowledge','discipline','character','charity')),
  xp            integer not null default 0,
  level         integer not null default 1,
  completed_deeds integer not null default 0,
  updated_at    timestamptz not null default now(),
  unique (user_id, branch)
);

-- ============================================================
-- DEEDS (catalog)
-- ============================================================
create table public.deeds (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  description     text not null default '',
  branch          text not null check (branch in ('worship','knowledge','discipline','character','charity')),
  xp_reward       integer not null default 100,
  coin_reward     integer not null default 15,
  energy_cost     integer not null default 5,
  difficulty      text not null default 'medium' check (difficulty in ('easy','medium','hard','legendary')),
  estimated_minutes integer not null default 15,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- DEED COMPLETIONS
-- ============================================================
create table public.deed_completions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  deed_id       uuid not null references public.deeds(id) on delete cascade,
  xp_earned     integer not null,
  coins_earned  integer not null,
  energy_spent  integer not null default 0,
  streak_count  integer not null default 1,
  completed_at  timestamptz not null default now()
);

-- ============================================================
-- CHALLENGES (catalog)
-- ============================================================
create table public.challenges (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  description   text not null default '',
  branch        text not null check (branch in ('worship','knowledge','discipline','character','charity')),
  goal          integer not null default 30,
  xp_reward     integer not null default 3000,
  coin_reward   integer not null default 500,
  end_date      timestamptz not null,
  rarity        text not null default 'common' check (rarity in ('common','rare','epic','legendary')),
  participant_count integer not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- CHALLENGE PARTICIPATION
-- ============================================================
create table public.challenge_participants (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  challenge_id    uuid not null references public.challenges(id) on delete cascade,
  current_progress integer not null default 0,
  completed       boolean not null default false,
  joined_at       timestamptz not null default now(),
  completed_at    timestamptz,
  unique (user_id, challenge_id)
);

-- ============================================================
-- ACHIEVEMENTS (catalog)
-- ============================================================
create table public.achievements (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  description     text not null default '',
  icon            text not null default '⭐',
  rarity          text not null default 'common' check (rarity in ('common','rare','epic','legendary')),
  branch          text check (branch in ('worship','knowledge','discipline','character','charity')),
  xp_reward       integer not null default 100,
  criteria_type   text not null,
  criteria_value  integer not null default 1,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- ACHIEVEMENT UNLOCKS
-- ============================================================
create table public.achievement_unlocks (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  achievement_id  uuid not null references public.achievements(id) on delete cascade,
  earned_at       timestamptz not null default now(),
  unique (user_id, achievement_id)
);

-- ============================================================
-- XP TRANSACTIONS
-- ============================================================
create table public.xp_transactions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  amount        integer not null,
  source_type   text not null check (source_type in ('deed','challenge','achievement','bonus')),
  source_id     uuid,
  branch        text check (branch in ('worship','knowledge','discipline','character','charity')),
  created_at    timestamptz not null default now()
);

-- ============================================================
-- STREAK RECORDS
-- ============================================================
create table public.streak_history (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  streak_length integer not null,
  started_at    date not null,
  ended_at      date,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- COMMUNITY FEED (denormalized for performance)
-- ============================================================
create table public.feed_events (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  event_type    text not null check (event_type in ('deed_complete','achievement','challenge_join','level_up')),
  deed_title    text,
  branch        text check (branch in ('worship','knowledge','discipline','character','charity')),
  xp_earned     integer,
  achievement_title text,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_profiles_user_id on public.profiles(user_id);
create index idx_profiles_xp on public.profiles(xp desc);
create index idx_branch_progress_user_id on public.branch_progress(user_id);
create index idx_deed_completions_user_id on public.deed_completions(user_id);
create index idx_deed_completions_completed_at on public.deed_completions(completed_at desc);
create index idx_challenge_participants_user_id on public.challenge_participants(user_id);
create index idx_achievement_unlocks_user_id on public.achievement_unlocks(user_id);
create index idx_xp_transactions_user_id on public.xp_transactions(user_id);
create index idx_feed_events_created_at on public.feed_events(created_at desc);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.branch_progress
  for each row execute function public.handle_updated_at();

-- ============================================================
-- Auto-create profile + branch_progress on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );

  insert into public.branch_progress (user_id, branch)
  values
    (new.id, 'worship'),
    (new.id, 'knowledge'),
    (new.id, 'discipline'),
    (new.id, 'character'),
    (new.id, 'charity');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
