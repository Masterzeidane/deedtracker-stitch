-- ============================================================
-- DeedTracker — Security Hardening, Part 3: function EXECUTE grants
-- Migration: 006_function_execute_grants.sql
--
-- Postgres grants EXECUTE on functions to PUBLIC by default, so revoking
-- from anon/authenticated alone is ineffective. Revoke from PUBLIC, then
-- grant back only where required:
--   * complete_deed / join_challenge  -> authenticated only (guarded by
--     the SEC-61 identity check); anon loses access.
--   * check_achievements / get_dashboard_stats -> no client access
--     (check_achievements is still callable internally by complete_deed,
--      which runs as the owner and is unaffected by these grants).
--   * restore_energy -> service_role only (intended for cron/edge jobs).
-- ============================================================

revoke execute on function public.complete_deed(uuid, uuid)  from public;
revoke execute on function public.join_challenge(uuid, uuid) from public;
revoke execute on function public.check_achievements(uuid)   from public;
revoke execute on function public.get_dashboard_stats(uuid)  from public;
revoke execute on function public.restore_energy()           from public;

grant execute on function public.complete_deed(uuid, uuid)  to authenticated;
grant execute on function public.join_challenge(uuid, uuid) to authenticated;
grant execute on function public.restore_energy()           to service_role;
