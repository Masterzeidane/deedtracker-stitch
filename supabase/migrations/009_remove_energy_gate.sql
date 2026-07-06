-- ============================================================
-- DeedTracker — Energy no longer gates worship
-- Migration: 009_remove_energy_gate.sql
--
-- The energy system could REFUSE to log an act of worship ("Not enough
-- energy") and depended on a cron (restore_energy) that was never scheduled.
-- Gating worship behind a game meter contradicts the product's purpose.
--
-- This recreates complete_deed WITHOUT the energy check and WITHOUT draining
-- energy. Everything else (SEC-61 identity guard, XP/coins/streak/branch/
-- achievements/feed) is unchanged. The energy column/UI are left intact
-- (no redesign); energy simply no longer blocks or is consumed. Full removal
-- of the concept is a Phase 2 product decision, not this cleanup.
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

  -- (energy gate removed — worship is never blocked)

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

  -- Award XP + coins. Energy is no longer drained.
  update public.profiles
  set xp     = v_new_xp,
      level  = v_new_level,
      rank   = v_new_rank,
      coins  = coins + v_deed.coin_reward
  where user_id = p_user_id;

  update public.branch_progress
  set xp = xp + v_deed.xp_reward,
      level = public.get_level_from_xp(xp + v_deed.xp_reward),
      completed_deeds = completed_deeds + 1
  where user_id = p_user_id and branch = v_deed.branch
  returning xp, level into v_branch_xp, v_branch_level;

  insert into public.deed_completions (user_id, deed_id, xp_earned, coins_earned, energy_spent, streak_count)
  values (p_user_id, p_deed_id, v_deed.xp_reward, v_deed.coin_reward, 0, v_streak_count)
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
