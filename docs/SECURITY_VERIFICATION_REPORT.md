# DeedTracker — Security Hardening Verification Report

**Project:** `dhwxxcvolwdzkzggjzup` (deedtracker-stitch) · Postgres 17 · region ap-southeast-2
**Date:** 2026-06-23
**Migrations applied:** `004_security_hardening`, `005_security_lockdown`, `006_function_execute_grants`
**Method:** Live verification against the project. Two throwaway users (User A / User B) were created via `auth.users` (exercising the signup trigger), tested under simulated JWT context (`request.jwt.claims.sub` = the user, role `authenticated`), then deleted. Final state confirmed pristine (0 profiles / 0 completions / 0 feed events; catalogs intact).

> Transport note: the MCP SQL proxy intermittently reset on large **response** payloads. Write paths were therefore executed via `DO` blocks (no result set) and verified with separate small reads. Only confirmed results are reported below.

---

## A. Migration summary

| Migration | What it does |
|---|---|
| **004_security_hardening** | Recreates `complete_deed` & `join_challenge` with an identity guard: `if p_user_id <> auth.uid() then return Forbidden`. Fixes **SEC-61**. |
| **005_security_lockdown** | Revokes client `INSERT/UPDATE/DELETE` on all progression tables; drops client write RLS policies; restricts `profiles` writes to column-level `UPDATE(name,bio,location,avatar_url)` only; pins `search_path` on helper functions; sets `security_invoker=true` on the `leaderboard` & `weekly_activity` views. |
| **006_function_execute_grants** | Revokes `EXECUTE` from **PUBLIC** on the definer functions (the default PUBLIC grant made the earlier anon/authenticated revokes ineffective); re-grants `complete_deed`/`join_challenge` to `authenticated` only and `restore_energy` to `service_role`. |

**Design note — RLS enabled, not FORCED (intentional):** progression writes flow through `SECURITY DEFINER` functions that run as the table owner and bypass RLS. Forcing RLS would subject the owner to RLS and break that server-authoritative path. Clients are blocked via removed policies + revoked grants instead.

---

## B. Security advisor — before vs after

| Finding | Before | After |
|---|---|---|
| `security_definer_view` (leaderboard, weekly_activity) | **ERROR ×2** | ✅ Cleared (security_invoker) |
| SECURITY DEFINER funcs executable by **anon** (complete_deed, join_challenge, check_achievements, get_dashboard_stats, restore_energy, handle_new_user) | **WARN ×6** | ✅ Cleared (anon can execute none) |
| SECURITY DEFINER funcs executable by **authenticated** | WARN ×6 | ⚠️ **2 remain — intentional**: `complete_deed`, `join_challenge` (the app's write API, now guarded by SEC-61 check). Internal funcs no longer authenticated-executable. |
| `function_search_path_mutable` (5 helpers) | **WARN ×5** | ✅ Cleared |
| `rls_enabled_no_policy` (public.users, public.items) | INFO ×2 | ◻ Unchanged — pre-existing non-app tables, out of scope |
| `auth_leaked_password_protection` | WARN | ◻ Unchanged — Auth dashboard toggle (not a DB migration) |

Net: **all ERRORs resolved; all anon-executable definer functions closed; only intentional/expected items remain.**

---

## C. Functional verification (requested items 1–10)

Legend: **DB** = database result · **Sec** = security result · **UI** = expected app behavior · **Status**.

### 1. Legitimate user can complete their own deed
- **DB:** `complete_deed(A, MorningDhikr)` as A → `success:true`; 1 `deed_completions` row created.
- **Sec:** Allowed only because `p_user_id = auth.uid()`. Cross-user call returned `Forbidden` (see §D).
- **UI:** Deed moves to "Completed", energy gauge drops, dashboard stats update on refresh.
- **Status:** ✅ PASS

### 2. XP awarded correctly
- **DB:** `profiles.xp` 0 → **200** (100 Morning Dhikr + 100 "First Light" achievement bonus). `worship` branch xp = 100.
- **Sec:** XP written only by the definer function; direct client XP writes are revoked.
- **UI:** Total XP card shows 200; XP bar advances.
- **Status:** ✅ PASS

### 3. Coins awarded correctly
- **DB:** `profiles.coins` 0 → **15** (Morning Dhikr coin_reward).
- **Sec:** Coins server-authoritative; client writes revoked.
- **UI:** Coins card shows 15.
- **Status:** ✅ PASS

### 4. Energy reduced correctly
- **DB:** `profiles.energy` 100 → **95** (energy_cost 5).
- **Sec:** Energy server-authoritative.
- **UI:** Energy gauge shows 95/100.
- **Status:** ✅ PASS

### 5. Streak updates correctly
- **DB:** `profiles.streak` 0 → **1**, `last_active` = today (first activity → streak initialized).
- **Sec:** Streak server-authoritative.
- **UI:** Streak card "1 day"; welcome header reflects streak.
- **Status:** ✅ PASS

### 6. `deed_completions` row created
- **DB:** count = **1** for User A (correct deed_id, xp_earned=100, coins_earned=15, energy_spent=5, streak_count=1).
- **Sec:** Created by definer function only; direct client INSERT is blocked (policy dropped + grant revoked).
- **UI:** Completion reflected in "Today's Deeds" and weekly chart.
- **Status:** ✅ PASS

### 7. `xp_transactions` row created
- **DB:** count = **2** (deed 100 + achievement 100); `SUM(amount) = 200 = profiles.xp` (ledger integrity invariant holds).
- **Sec:** Ledger is read-only to clients.
- **UI:** Not directly shown; underpins XP totals.
- **Status:** ✅ PASS

### 8. `feed_events` row created
- **DB:** count = **2** (`deed_complete` + `achievement`).
- **Sec:** Created by definer functions only; client INSERT blocked (anti-spoofing).
- **UI:** Community feed shows the deed completion (and achievement) entries.
- **Status:** ✅ PASS

### 9. `join_challenge` works for the authenticated user
- **DB:** `join_challenge(A, 30-Day Fajr Streak)` → 1 `challenge_participants` row (current_progress 0), `challenges.participant_count` 0 → **1**, 1 `challenge_join` feed event.
- **Sec:** Guarded by `p_user_id = auth.uid()`; direct client INSERT/UPDATE on participation blocked.
- **UI:** Challenge moves to "Active" with "Joined" state.
- **Status:** ✅ PASS

### 10. Profile editing still works after lockdown
- **DB:** As `authenticated` (jwt = A), `update profiles set name/bio/location` → succeeded; values persisted (`name='Sec Test A Edited'`, `bio='hardened'`, `location='QA City'`).
- **Sec:** Allowed via column-level `UPDATE(name,bio,location,avatar_url)` grant + RLS own-row check. Progression columns (xp/coins/level/rank/streak/energy) are **not** in the grant and cannot be updated.
- **UI:** Settings "Save Changes" persists; profile hero + sidebar reflect new values.
- **Status:** ✅ PASS

**Backward compatibility:** the app's three write paths — `completeDeed` (rpc), `joinChallenge` (rpc), `updateProfile` (name/bio/location) — all verified working unchanged. No frontend code was modified.

---

## D. SEC-61 impersonation — primary security result

- **Test:** As User A (jwt sub = A), call `complete_deed(p_user_id = User B, …)`.
- **Result:** `{ "success": false, "error": "Forbidden" }` — **no rows written for User B.** ✅ **BLOCKED**
- Same guard verified present on `join_challenge`.
- **Before:** the function trusted `p_user_id` and was anon/authenticated callable → any user could write to any account. **After:** impersonation rejected at the guard, and `anon` can no longer execute the function at all.

---

## E. Additional security guarantees (enforced by 005/006; structurally verified)

The following were closed by the lockdown migration (policies removed + grants revoked, confirmed via catalog: `authenticated` has **no** INSERT/UPDATE/DELETE on the six progression tables, and `profiles` write is column-restricted):

| Attack | Control | Result |
|---|---|---|
| User A grants self XP / coins | `profiles` write limited to name/bio/location/avatar_url (column grant) | Blocked |
| User A modifies streak / level / rank / energy | same | Blocked |
| User A modifies tree progression | `branch_progress` client writes revoked; no policy | Blocked |
| User A modifies challenge progress | `challenge_participants` client INSERT/UPDATE revoked; no policy | Blocked |
| User A unlocks achievements directly | `achievement_unlocks` client INSERT revoked; no policy | Blocked |
| User A inserts completions (XP farming) | `deed_completions` client INSERT revoked; no policy | Blocked |
| User A spoofs feed events | `feed_events` client INSERT revoked; no policy | Blocked |
| User A alters leaderboard position | derived from `profiles.xp`, which is not client-writable | Blocked |
| Cross-user private reads | RLS `SELECT` restricted to `auth.uid()` on completions/xp_transactions/unlocks/participation/streak_history | Blocked |
| Duplicate joins / unlocks / same-day completions | unique constraints + in-function guards (unchanged) | Blocked |

> By design, `profiles` and `branch_progress` remain world-readable `SELECT` (leaderboard/community) — XP, coins, rank, name, bio, location are public. Confirm this is acceptable; it is not treated as private data.

---

## F. Remaining risks / follow-ups (non-blocking)

1. **Auth leaked-password protection disabled** — enable in Supabase Auth settings (dashboard toggle; not a DB migration).
2. **`public.users` / `public.items`** have RLS enabled but no policies (pre-existing starter tables, unrelated to DeedTracker) — drop them or add policies.
3. **App env wiring still required** — `NEXT_PUBLIC_SUPABASE_URL=https://dhwxxcvolwdzkzggjzup.supabase.co` + anon key + `NEXT_PUBLIC_SITE_URL`.
4. **Defense-in-depth (optional):** `authenticated` still holds `TRUNCATE/REFERENCES/TRIGGER` on tables (Supabase default; not reachable via the REST API). Can be revoked for strictness.
5. **Orphan auth user** from before deployment still has no profile row (signup trigger only fires on new users) — backfill or remove.

---

## G. Rollback instructions

These migrations are additive/permission changes; to revert to the pre-hardening state:

1. **Restore original functions** (remove the identity guard) by re-running the `complete_deed` and `join_challenge` bodies from `003_functions.sql`.
2. **Restore policies/grants:**
   ```sql
   -- profiles: revert to full-row self update
   drop policy if exists "Users can update own profile text" on public.profiles;
   create policy "Users can update own profile" on public.profiles for update using (auth.uid() = user_id);
   grant update on public.profiles to authenticated;
   -- re-grant table DML used by the old policies
   grant insert on public.deed_completions to authenticated;
   grant insert, update on public.challenge_participants to authenticated;
   grant insert on public.achievement_unlocks to authenticated;
   grant insert on public.feed_events to authenticated;
   grant update on public.branch_progress to authenticated;
   -- recreate the original permissive write policies (see 002_rls_policies.sql)
   -- re-grant function execute to public if desired
   grant execute on function public.complete_deed(uuid,uuid) to public;
   grant execute on function public.join_challenge(uuid,uuid) to public;
   ```
3. **Views:** `alter view public.leaderboard set (security_invoker = false);` (and `weekly_activity`) to restore prior behavior.

> ⚠️ Rolling back re-opens SEC-61 and client-side progression tampering. Not recommended.

---

## H. Verdict

**Security hardening: ✅ COMPLETE and verified.** SEC-61 is fixed (impersonation returns `Forbidden`; anon cannot call the RPCs), progression is server-authoritative, advisor ERRORs are cleared, and all 10 functional validations pass with full backward compatibility. Remaining items in §F are non-blocking and mostly outside the database (env wiring, auth toggle).
