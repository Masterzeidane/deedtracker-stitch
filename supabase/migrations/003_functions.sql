-- ============================================================
-- DeedTracker — Business Logic Functions
-- Migration: 003_functions.sql
-- ============================================================

-- ============================================================
-- Helper: compute rank from level
-- ============================================================
create or replace function public.get_rank_from_level(p_level integer)
returns text language sql immutable as $$
  select case
    when p_level >= 50 then 'Legacy Maker'
    when p_level >= 40 then 'Legend'
    when p_level >= 30 then 'Elder'
    when p_level >= 25 then 'Sage'
    when p_level >= 18 then 'Master'
    when p_level >= 12 then 'Adept'
    when p_level >= 7  then 'Devotee'
    when p_level >= 3  then 'Apprentice'
    else 'Seeker'
  end;
$$;

-- ============================================================
-- Helper: compute level from total XP
-- Curve: each level requires level*500 XP
-- Level 1: 0-500, Level 2: 500-1500, etc.
-- ============================================================
create or replace function public.get_level_from_xp(p_xp integer)
returns integer language sql immutable as $$
  select greatest(1, floor(1 + sqrt(p_xp::float / 250))::integer);
$$;

-- ============================================================
-- Helper: XP needed to reach a level
-- ============================================================
create or replace function public.xp_for_level(p_level integer)
returns integer language sql immutable as $$
  select (250 * (p_level - 1) * (p_level - 1))::integer;
$$;

-- ============================================================
-- Helper: XP needed for next level
-- ============================================================
create or replace function public.xp_for_next_level(p_level integer)
returns integer language sql immutable as $$
  select public.xp_for_level(p_level + 1);
$$;

-- ============================================================
-- COMPLETE DEED
-- Awards XP, coins, updates branch, updates streak,
-- checks achievements, writes feed event.
-- ============================================================
create or replace function public.complete_deed(
  p_user_id   uuid,
  p_deed_id   uuid
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_deed          record;
  v_profile       record;
  v_branch_xp     integer;
  v_branch_level  integer;
  v_new_xp        integer;
  v_new_level     integer;
  v_new_rank      text;
  v_today         date := current_date;
  v_streak_count  integer;
  v_completion_id uuid;
  v_leveled_up    boolean := false;
begin
  -- Load deed
  select * into v_deed from public.deeds where id = p_deed_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Deed not found');
  end if;

  -- Load profile
  select * into v_profile from public.profiles where user_id = p_user_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Profile not found');
  end if;

  -- Check energy
  if v_profile.energy < v_deed.energy_cost then
    return jsonb_build_object('success', false, 'error', 'Not enough energy');
  end if;

  -- Check: already completed today?
  if exists (
    select 1 from public.deed_completions
    where user_id = p_user_id
      and deed_id = p_deed_id
      and completed_at::date = v_today
  ) then
    return jsonb_build_object('success', false, 'error', 'Already completed today');
  end if;

  -- Update streak
  if v_profile.last_active = v_today - 1 then
    -- Continuing streak
    update public.profiles
    set streak = streak + 1,
        longest_streak = greatest(longest_streak, streak + 1),
        last_active = v_today
    where user_id = p_user_id
    returning streak into v_streak_count;
  elsif v_profile.last_active < v_today - 1 or v_profile.last_active is null then
    -- Broken streak — reset
    update public.profiles
    set streak = 1, last_active = v_today
    where user_id = p_user_id;
    v_streak_count := 1;
  else
    -- Same day, don't change streak
    v_streak_count := v_profile.streak;
  end if;

  -- Award XP + coins, drain energy
  v_new_xp := v_profile.xp + v_deed.xp_reward;
  v_new_level := public.get_level_from_xp(v_new_xp);
  v_new_rank := public.get_rank_from_level(v_new_level);
  v_leveled_up := v_new_level > v_profile.level;

  update public.profiles
  set xp     = v_new_xp,
      level  = v_new_level,
      rank   = v_new_rank,
      coins  = coins + v_deed.coin_reward,
      energy = greatest(0, energy - v_deed.energy_cost)
  where user_id = p_user_id;

  -- Update branch XP
  update public.branch_progress
  set xp = xp + v_deed.xp_reward,
      level = public.get_level_from_xp(xp + v_deed.xp_reward),
      completed_deeds = completed_deeds + 1
  where user_id = p_user_id and branch = v_deed.branch
  returning xp, level into v_branch_xp, v_branch_level;

  -- Record completion
  insert into public.deed_completions (user_id, deed_id, xp_earned, coins_earned, energy_spent, streak_count)
  values (p_user_id, p_deed_id, v_deed.xp_reward, v_deed.coin_reward, v_deed.energy_cost, v_streak_count)
  returning id into v_completion_id;

  -- Record XP transaction
  insert into public.xp_transactions (user_id, amount, source_type, source_id, branch)
  values (p_user_id, v_deed.xp_reward, 'deed', p_deed_id, v_deed.branch);

  -- Feed event
  insert into public.feed_events (user_id, event_type, deed_title, branch, xp_earned)
  values (p_user_id, 'deed_complete', v_deed.title, v_deed.branch, v_deed.xp_reward);

  -- Check & unlock achievements
  perform public.check_achievements(p_user_id);

  return jsonb_build_object(
    'success', true,
    'xp_earned', v_deed.xp_reward,
    'coins_earned', v_deed.coin_reward,
    'new_xp', v_new_xp,
    'new_level', v_new_level,
    'new_rank', v_new_rank,
    'leveled_up', v_leveled_up,
    'streak', v_streak_count,
    'completion_id', v_completion_id
  );
end;
$$;

-- ============================================================
-- CHECK & UNLOCK ACHIEVEMENTS
-- ============================================================
create or replace function public.check_achievements(p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_ach       record;
  v_profile   record;
  v_branch    record;
  v_stat      integer;
  v_unlocked  boolean;
begin
  select * into v_profile from public.profiles where user_id = p_user_id;

  for v_ach in select * from public.achievements loop
    -- Skip if already unlocked
    if exists (select 1 from public.achievement_unlocks where user_id = p_user_id and achievement_id = v_ach.id) then
      continue;
    end if;

    v_unlocked := false;

    case v_ach.criteria_type
      when 'total_xp' then
        v_unlocked := v_profile.xp >= v_ach.criteria_value;
      when 'total_deeds' then
        select count(*) into v_stat from public.deed_completions where user_id = p_user_id;
        v_unlocked := v_stat >= v_ach.criteria_value;
      when 'streak' then
        v_unlocked := v_profile.streak >= v_ach.criteria_value;
      when 'longest_streak' then
        v_unlocked := v_profile.longest_streak >= v_ach.criteria_value;
      when 'level' then
        v_unlocked := v_profile.level >= v_ach.criteria_value;
      when 'branch_deeds' then
        select completed_deeds into v_stat from public.branch_progress
        where user_id = p_user_id and branch = v_ach.branch;
        v_unlocked := coalesce(v_stat, 0) >= v_ach.criteria_value;
      when 'branch_level' then
        select level into v_stat from public.branch_progress
        where user_id = p_user_id and branch = v_ach.branch;
        v_unlocked := coalesce(v_stat, 1) >= v_ach.criteria_value;
      else null;
    end case;

    if v_unlocked then
      insert into public.achievement_unlocks (user_id, achievement_id)
      values (p_user_id, v_ach.id)
      on conflict do nothing;

      -- Award XP for achievement
      update public.profiles
      set xp = xp + v_ach.xp_reward,
          level = public.get_level_from_xp(xp + v_ach.xp_reward),
          rank = public.get_rank_from_level(public.get_level_from_xp(xp + v_ach.xp_reward))
      where user_id = p_user_id;

      insert into public.xp_transactions (user_id, amount, source_type, source_id)
      values (p_user_id, v_ach.xp_reward, 'achievement', v_ach.id);

      insert into public.feed_events (user_id, event_type, achievement_title, xp_earned)
      values (p_user_id, 'achievement', v_ach.title, v_ach.xp_reward);
    end if;
  end loop;
end;
$$;

-- ============================================================
-- JOIN CHALLENGE
-- ============================================================
create or replace function public.join_challenge(
  p_user_id     uuid,
  p_challenge_id uuid
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.challenge_participants
    where user_id = p_user_id and challenge_id = p_challenge_id
  ) then
    return jsonb_build_object('success', false, 'error', 'Already joined');
  end if;

  insert into public.challenge_participants (user_id, challenge_id)
  values (p_user_id, p_challenge_id);

  update public.challenges
  set participant_count = participant_count + 1
  where id = p_challenge_id;

  insert into public.feed_events (user_id, event_type, xp_earned)
  values (p_user_id, 'challenge_join', 0);

  return jsonb_build_object('success', true);
end;
$$;

-- ============================================================
-- LEADERBOARD VIEW
-- ============================================================
create or replace view public.leaderboard as
select
  row_number() over (order by p.xp desc)::integer as rank,
  p.user_id,
  p.name,
  p.avatar_url,
  p.xp,
  p.level,
  p.streak,
  p.rank as user_rank
from public.profiles p
order by p.xp desc;

-- ============================================================
-- WEEKLY ACTIVITY VIEW
-- ============================================================
create or replace view public.weekly_activity as
select
  dc.user_id,
  date_trunc('day', dc.completed_at) as day,
  d.branch,
  count(*) as deed_count,
  sum(dc.xp_earned) as xp_total
from public.deed_completions dc
join public.deeds d on d.id = dc.deed_id
where dc.completed_at >= now() - interval '7 days'
group by dc.user_id, date_trunc('day', dc.completed_at), d.branch;

-- ============================================================
-- DASHBOARD STATS function
-- ============================================================
create or replace function public.get_dashboard_stats(p_user_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_profile   record;
  v_branches  jsonb;
  v_week      jsonb;
  v_ach_count integer;
  v_deed_count integer;
begin
  select * into v_profile from public.profiles where user_id = p_user_id;

  select json_agg(b) into v_branches
  from (
    select branch, xp, level, completed_deeds
    from public.branch_progress
    where user_id = p_user_id
    order by branch
  ) b;

  select count(*) into v_ach_count
  from public.achievement_unlocks where user_id = p_user_id;

  select count(*) into v_deed_count
  from public.deed_completions where user_id = p_user_id;

  select json_agg(w) into v_week
  from (
    select day, branch, deed_count, xp_total
    from public.weekly_activity
    where user_id = p_user_id
  ) w;

  return jsonb_build_object(
    'profile', to_jsonb(v_profile),
    'branches', coalesce(v_branches, '[]'::jsonb),
    'weekly_activity', coalesce(v_week, '[]'::jsonb),
    'achievement_count', v_ach_count,
    'total_deeds', v_deed_count
  );
end;
$$;

-- ============================================================
-- RESTORE DAILY ENERGY (call via cron or edge function)
-- ============================================================
create or replace function public.restore_energy()
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.profiles
  set energy = max_energy;
end;
$$;
