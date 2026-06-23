-- ============================================================
-- DeedTracker — Security Hardening, Part 1: RPC identity guards
-- Migration: 004_security_hardening.sql
--
-- Fixes SEC-61 (RPC impersonation): complete_deed / join_challenge are
-- SECURITY DEFINER and previously trusted a caller-supplied p_user_id.
-- They now reject any call where p_user_id <> auth.uid(). Bodies are
-- otherwise identical to 003_functions.sql.
-- (Grants, column locks, RLS policy changes and view fixes are in 005.)
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
  -- SEC-61: callers may only act on their own account
  if p_user_id is null or auth.uid() is null or p_user_id <> auth.uid() then
    return jsonb_build_object('success', false, 'error', 'Forbidden');
  end if;

  select * into v_deed from public.deeds where id = p_deed_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Deed not found');
  end if;

  select * into v_profile from public.profiles where user_id = p_user_id;
  if not found then
    return jsonb_build_object('success', false, 'error', 'Profile not found');
  end if;

  if v_profile.energy < v_deed.energy_cost then
    return jsonb_build_object('success', false, 'error', 'Not enough energy');
  end if;

  if exists (
    select 1 from public.deed_completions
    where user_id = p_user_id
      and deed_id = p_deed_id
      and completed_at::date = v_today
  ) then
    return jsonb_build_object('success', false, 'error', 'Already completed today');
  end if;

  if v_profile.last_active = v_today - 1 then
    update public.profiles
    set streak = streak + 1,
        longest_streak = greatest(longest_streak, streak + 1),
        last_active = v_today
    where user_id = p_user_id
    returning streak into v_streak_count;
  elsif v_profile.last_active < v_today - 1 or v_profile.last_active is null then
    update public.profiles
    set streak = 1, last_active = v_today
    where user_id = p_user_id;
    v_streak_count := 1;
  else
    v_streak_count := v_profile.streak;
  end if;

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

  update public.branch_progress
  set xp = xp + v_deed.xp_reward,
      level = public.get_level_from_xp(xp + v_deed.xp_reward),
      completed_deeds = completed_deeds + 1
  where user_id = p_user_id and branch = v_deed.branch
  returning xp, level into v_branch_xp, v_branch_level;

  insert into public.deed_completions (user_id, deed_id, xp_earned, coins_earned, energy_spent, streak_count)
  values (p_user_id, p_deed_id, v_deed.xp_reward, v_deed.coin_reward, v_deed.energy_cost, v_streak_count)
  returning id into v_completion_id;

  insert into public.xp_transactions (user_id, amount, source_type, source_id, branch)
  values (p_user_id, v_deed.xp_reward, 'deed', p_deed_id, v_deed.branch);

  insert into public.feed_events (user_id, event_type, deed_title, branch, xp_earned)
  values (p_user_id, 'deed_complete', v_deed.title, v_deed.branch, v_deed.xp_reward);

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

create or replace function public.join_challenge(
  p_user_id     uuid,
  p_challenge_id uuid
)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  -- SEC-61: callers may only act on their own account
  if p_user_id is null or auth.uid() is null or p_user_id <> auth.uid() then
    return jsonb_build_object('success', false, 'error', 'Forbidden');
  end if;

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
