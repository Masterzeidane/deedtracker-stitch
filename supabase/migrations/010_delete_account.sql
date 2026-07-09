-- ============================================================
-- DeedTracker — Self-serve account deletion
-- Migration: 010_delete_account.sql
--
-- Phase 1 #8: gives users a real, irreversible data-deletion path.
--
-- Design (see STATUS Phase 1 #8):
--   * SECURITY DEFINER so it can touch the auth schema.
--   * NO user_id parameter — the target row is derived from the
--     verified session via auth.uid(), so there is nothing for a
--     caller to redirect at another account (stronger than the
--     SEC-61 p_user_id guard in complete_deed / join_challenge).
--   * Deleting the auth.users row cascades to every user-owned table
--     (profiles, branch_progress, deed_completions,
--     challenge_participants, achievement_unlocks, xp_transactions,
--     streak_history, feed_events, post_likes) via ON DELETE CASCADE,
--     so one delete = complete erasure with no orphans.
--   * EXECUTE granted to `authenticated` only. Supabase's default
--     privileges auto-grant EXECUTE on new public functions directly
--     to anon/authenticated, so revoking from PUBLIC is not enough —
--     anon is revoked explicitly as well.
-- ============================================================

create or replace function public.delete_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Callers may only ever delete themselves. There is no parameter to
  -- name another account; the target is the verified session identity.
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_account() from public;
revoke execute on function public.delete_account() from anon;
grant  execute on function public.delete_account() to authenticated;
