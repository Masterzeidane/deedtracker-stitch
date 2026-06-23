# DeedTracker — Database Deployment Report

**Date:** 2026-06-23
**Performed by:** Database deployment (migrations 001–003 + seed)
**Scope:** Database deployment readiness only. No frontend code modified. No redesign.

---

## 1. Target backend (verified)

| Field | Value |
|---|---|
| Intended project (confirmed by user) | **`dhwxxcvolwdzkzggjzup`** — "deedtracker-stitch" |
| Project URL | `https://dhwxxcvolwdzkzggjzup.supabase.co` |
| Region | `ap-southeast-2` |
| Postgres | 17.6.1.127 (engine 17) |
| Status | `ACTIVE_HEALTHY` |

> ⚠️ **URL/link discrepancy resolved:** the request's visible URL was `mmcwvkebudvzfeomkwjo` but its hyperlink pointed to `dhwxxcvolwdzkzggjzup`. User confirmed **`dhwxxcvolwdzkzggjzup`** as the target. The other project (`mmcwvkebudvzfeomkwjo`) was **not** modified (it held an unrelated `deeds` table with 2 rows and would have conflicted with migration 001).

**Pre-existing objects on target (left untouched):** `public.users`, `public.items` (unrelated starter tables), and **1 existing `auth.users` record** (see §6 follow-ups).

---

## 2. Migrations applied

Applied via Supabase migration runner and recorded in the migrations table:

| Version | Name | Result |
|---|---|---|
| `20260623175552` | `001_initial_schema` | ✅ success |
| `20260623175620` | `002_rls_policies` | ✅ success |
| `20260623175702` | `003_functions` | ✅ success |

---

## 3. Schema verification

### Tables — 11/11 ✅
`profiles`, `branch_progress`, `deeds`, `deed_completions`, `challenges`, `challenge_participants`, `achievements`, `achievement_unlocks`, `xp_transactions`, `streak_history`, `feed_events`

### Views — 2/2 ✅
`leaderboard`, `weekly_activity`

### Functions — 11/11 ✅
`handle_updated_at`, `handle_new_user`, `get_rank_from_level`, `get_level_from_xp`, `xp_for_level`, `xp_for_next_level`, `complete_deed`, `check_achievements`, `join_challenge`, `get_dashboard_stats`, `restore_energy`

### Triggers — 3/3 ✅
- `set_updated_at` on `public.profiles`
- `set_updated_at` on `public.branch_progress`
- `on_auth_user_created` on `auth.users` → `handle_new_user()`

### Row Level Security ✅
- RLS **enabled on all 11** application tables.
- **18 policies** present (matches migration 002): profiles ×2, branch_progress ×2, deeds ×1, deed_completions ×2, challenges ×1, challenge_participants ×3, achievements ×1, achievement_unlocks ×2, xp_transactions ×1, streak_history ×1, feed_events ×2.

### Requested object checklist
| Object | Present |
|---|---|
| `profiles` | ✅ |
| `branch_progress` | ✅ |
| `deed_completions` | ✅ |
| `challenges` | ✅ |
| `achievements` | ✅ |
| `leaderboard` view | ✅ |
| `complete_deed` RPC | ✅ |
| `join_challenge` RPC | ✅ |

---

## 4. Seed data verification ✅

| Catalog | Rows |
|---|---|
| `deeds` | **29** |
| `challenges` | **7** |
| `achievements` | **20** |

User-activity tables (`profiles`, `deed_completions`, etc.) are intentionally empty — they populate on signup/usage.

---

## 5. Security advisor results (post-deploy)

Ran the Supabase security linter. Findings (these reflect the **migration code as written**, deployed faithfully):

### ERROR (2)
- `security_definer_view`: views **`leaderboard`** and **`weekly_activity`** are SECURITY DEFINER (default for views owned by the migration role). They enforce the creator's RLS, not the querying user's. *Impact here is low* — both read from world-readable tables (`profiles`, `deeds`, completions are aggregated) — but the linter flags it as an ERROR to review. Remediation: recreate with `security_invoker = true`.

### WARN — SECURITY DEFINER RPCs callable by `anon` and `authenticated` (6 functions)
`complete_deed`, `join_challenge`, `check_achievements`, `get_dashboard_stats`, `handle_new_user`, `restore_energy` are all executable via `/rest/v1/rpc/...`.
- **This confirms the previously reported SEC-61 impersonation finding.** `complete_deed`/`join_challenge` accept a caller-supplied `p_user_id` and run as definer (bypassing RLS) → a logged-in user can act on **any** user's account. `check_achievements`, `restore_energy`, and `handle_new_user` should not be directly callable at all.

### WARN — `function_search_path_mutable` (5 functions)
`handle_updated_at`, `get_rank_from_level`, `get_level_from_xp`, `xp_for_level`, `xp_for_next_level` lack a fixed `search_path` (the business functions in 003 already set it). Low severity; recommended to pin.

### WARN — Auth
`auth_leaked_password_protection` disabled (HaveIBeenPwned check off). Recommend enabling in Auth settings.

### INFO (2)
`rls_enabled_no_policy` on **`public.users`** and **`public.items`** — pre-existing non-DeedTracker tables, not introduced by this deployment.

---

## 6. Follow-ups required before production

| # | Item | Severity | Owner |
|---|------|----------|-------|
| 1 | **Wire app env vars** to this project: `NEXT_PUBLIC_SUPABASE_URL=https://dhwxxcvolwdzkzggjzup.supabase.co` + this project's anon/publishable key + `NEXT_PUBLIC_SITE_URL`. (No `.env` is configured today — the app cannot connect until set.) | **Blocker** | Deploy/Eng |
| 2 | **Apply the security hardening migration** (SEC-61): guard `complete_deed`/`join_challenge` against `p_user_id <> auth.uid()`, lock down economy-column writes, and restrict EXECUTE on internal definer functions. *Proposed earlier; awaiting approval — not part of this deployment task.* | **Blocker** | Eng + review |
| 3 | **Orphan auth user:** 1 pre-existing `auth.users` row has **no `profiles` row** (the `on_auth_user_created` trigger only fires on new signups). That user would hit a null-profile state on login. Backfill a profile + 5 branch_progress rows, or delete the test user. | Medium | Eng |
| 4 | `security_definer_view` ERRORs on `leaderboard`/`weekly_activity` — recreate with `security_invoker=true`. | Medium | Eng |
| 5 | Pin `search_path` on the 5 helper functions; enable leaked-password protection. | Low | Eng |
| 6 | Schedule `restore_energy()` (cron/edge function) so the daily energy loop works. | Medium | Eng |

---

## 7. Deployment readiness verdict

**Database schema deployment: ✅ SUCCESSFUL and fully verified.** All requested tables, views, functions, triggers, RLS policies, and seed data are present on `dhwxxcvolwdzkzggjzup`.

**Production readiness: ⛔ NOT YET** — gated on follow-ups #1 (env wiring) and #2 (SEC-61 security hardening), both blockers. The security advisor independently confirms the impersonation vector previously identified; per the standing instruction that security takes priority, the security migration should be applied and re-verified (SEC-56→61) before launch.

**No frontend code was modified. No security migration was written in this task** (deployment-readiness scope only). The security fix remains proposed and awaiting approval.
