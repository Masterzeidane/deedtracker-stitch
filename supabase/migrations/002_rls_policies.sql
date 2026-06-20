-- ============================================================
-- DeedTracker — Row Level Security
-- Migration: 002_rls_policies.sql
-- ============================================================

alter table public.profiles enable row level security;
alter table public.branch_progress enable row level security;
alter table public.deeds enable row level security;
alter table public.deed_completions enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_participants enable row level security;
alter table public.achievements enable row level security;
alter table public.achievement_unlocks enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.streak_history enable row level security;
alter table public.feed_events enable row level security;

-- ============================================================
-- PROFILES
-- ============================================================
-- Anyone can read profiles (for leaderboard / community)
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

-- Only the owner can update their profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- ============================================================
-- BRANCH PROGRESS
-- ============================================================
create policy "Branch progress viewable by everyone"
  on public.branch_progress for select using (true);

create policy "Users can update own branch progress"
  on public.branch_progress for update
  using (auth.uid() = user_id);

-- ============================================================
-- DEEDS (catalog — read-only for users)
-- ============================================================
create policy "Deeds are viewable by authenticated users"
  on public.deeds for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- DEED COMPLETIONS
-- ============================================================
create policy "Users can view own completions"
  on public.deed_completions for select
  using (auth.uid() = user_id);

create policy "Users can insert own completions"
  on public.deed_completions for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- CHALLENGES (catalog — read-only for users)
-- ============================================================
create policy "Challenges are viewable by authenticated users"
  on public.challenges for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- CHALLENGE PARTICIPATION
-- ============================================================
create policy "Users can view own participation"
  on public.challenge_participants for select
  using (auth.uid() = user_id);

create policy "Users can join challenges"
  on public.challenge_participants for insert
  with check (auth.uid() = user_id);

create policy "Users can update own participation"
  on public.challenge_participants for update
  using (auth.uid() = user_id);

-- ============================================================
-- ACHIEVEMENTS (catalog — read-only)
-- ============================================================
create policy "Achievements viewable by authenticated users"
  on public.achievements for select
  using (auth.role() = 'authenticated');

-- ============================================================
-- ACHIEVEMENT UNLOCKS
-- ============================================================
create policy "Users can view own unlocks"
  on public.achievement_unlocks for select
  using (auth.uid() = user_id);

-- Unlocks are inserted by server-side functions (security definer)
create policy "Service role can insert unlocks"
  on public.achievement_unlocks for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- XP TRANSACTIONS
-- ============================================================
create policy "Users can view own XP transactions"
  on public.xp_transactions for select
  using (auth.uid() = user_id);

-- ============================================================
-- STREAK HISTORY
-- ============================================================
create policy "Users can view own streaks"
  on public.streak_history for select
  using (auth.uid() = user_id);

-- ============================================================
-- FEED EVENTS
-- ============================================================
create policy "Feed events viewable by authenticated users"
  on public.feed_events for select
  using (auth.role() = 'authenticated');

create policy "Users can insert own feed events"
  on public.feed_events for insert
  with check (auth.uid() = user_id);
