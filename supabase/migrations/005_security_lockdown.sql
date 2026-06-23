-- ============================================================
-- DeedTracker — Security Hardening, Part 2: grants, column locks,
-- RLS policy lockdown, view fixes
-- Migration: 005_security_lockdown.sql
--
-- Makes progression server-authoritative. Clients may NOT directly write
-- xp/coins/level/rank/streak/branch progress/completions/achievements/
-- challenge participation/feed events. All such writes flow only through
-- SECURITY DEFINER functions (which run as the table owner and bypass RLS)
-- and the signup trigger.
--
-- RLS stays ENABLED but NOT FORCED on purpose: forcing RLS would also
-- subject the table owner (and thus the definer functions) to RLS and
-- break the server-authoritative write path.
-- ============================================================

-- 1) Lock down EXECUTE on internal / definer functions
revoke execute on function public.complete_deed(uuid, uuid)      from anon;
revoke execute on function public.join_challenge(uuid, uuid)     from anon;
revoke execute on function public.check_achievements(uuid)       from anon, authenticated;
revoke execute on function public.get_dashboard_stats(uuid)      from anon, authenticated;
revoke execute on function public.restore_energy()               from anon, authenticated;
revoke execute on function public.handle_new_user()              from anon, authenticated, public;

-- 2) Pin search_path on helper functions (advisor WARN)
alter function public.get_rank_from_level(integer) set search_path = public;
alter function public.get_level_from_xp(integer)   set search_path = public;
alter function public.xp_for_level(integer)        set search_path = public;
alter function public.xp_for_next_level(integer)   set search_path = public;
alter function public.handle_updated_at()          set search_path = public;

-- 3) PROFILES — self-edit of profile text only; progression columns locked
drop policy if exists "Users can update own profile" on public.profiles;
revoke insert, update, delete on public.profiles from anon, authenticated;
grant  update (name, bio, location, avatar_url) on public.profiles to authenticated;

create policy "Users can update own profile text"
  on public.profiles for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4) Remove ALL direct client writes to progression tables
drop policy if exists "Users can update own branch progress" on public.branch_progress;
revoke insert, update, delete on public.branch_progress from anon, authenticated;

drop policy if exists "Users can insert own completions" on public.deed_completions;
revoke insert, update, delete on public.deed_completions from anon, authenticated;

drop policy if exists "Users can join challenges" on public.challenge_participants;
drop policy if exists "Users can update own participation" on public.challenge_participants;
revoke insert, update, delete on public.challenge_participants from anon, authenticated;

drop policy if exists "Service role can insert unlocks" on public.achievement_unlocks;
revoke insert, update, delete on public.achievement_unlocks from anon, authenticated;

drop policy if exists "Users can insert own feed events" on public.feed_events;
revoke insert, update, delete on public.feed_events from anon, authenticated;

revoke insert, update, delete on public.xp_transactions from anon, authenticated;
revoke insert, update, delete on public.streak_history  from anon, authenticated;
revoke insert, update, delete on public.deeds           from anon, authenticated;
revoke insert, update, delete on public.challenges      from anon, authenticated;
revoke insert, update, delete on public.achievements    from anon, authenticated;

-- 5) Resolve SECURITY DEFINER view advisor ERROR
alter view public.leaderboard      set (security_invoker = true);
alter view public.weekly_activity  set (security_invoker = true);
