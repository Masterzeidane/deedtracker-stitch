# DeedTracker — Production Verification & QA Checklist

**Purpose:** Launch-day manual verification that the application runs correctly on live Supabase data.
**Scope:** Authentication, gamification (deeds/XP/coins/streaks), challenges, achievements, leaderboard, profile, tree, community feed, data integrity, RLS/security, performance, and a full end-to-end smoke test.
**Build under test:** branch `claude/beautiful-knuth-bezths` (mock data removed; app runs entirely on Supabase).

---

## How to use this document

- Execute test cases **in order within each section**; some depend on state created by earlier cases.
- Mark each case **Pass** ☐ / **Fail** ☐ and record anomalies in **Notes**.
- A section is **green** only when every case passes.

### Legend
- **UI** = what the user sees in the browser.
- **DB** = what to confirm in Supabase (Table Editor or SQL Editor).
- ☐ = unchecked checkbox (tick on completion).

### Environment prerequisites (verify before starting)
| # | Item | Confirmed |
|---|------|-----------|
| E1 | `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in the deployment environment | ☐ |
| E2 | `NEXT_PUBLIC_SITE_URL` set (used by signup/reset email redirects) | ☐ |
| E3 | Migrations `001_initial_schema.sql`, `002_rls_policies.sql`, `003_functions.sql` applied | ☐ |
| E4 | `seed.sql` loaded (≈29 deeds, 7 challenges, 20 achievements present) | ☐ |
| E5 | Supabase Auth email provider configured (confirmations on/off documented) | ☐ |
| E6 | Energy-restore mechanism (`restore_energy()`) scheduled or documented as manual | ☐ |
| E7 | Two clean test accounts available/creatable: **User A** and **User B** | ☐ |
| E8 | Access to Supabase SQL Editor for DB assertions | ☐ |

### Reference: key DB effects of completing a deed (`complete_deed` RPC)
On a successful completion the function writes, in one transaction:
- `profiles`: `xp += xp_reward`, recomputed `level`/`rank`, `coins += coin_reward`, `energy -= energy_cost`, streak/`last_active` updated.
- `branch_progress` (matching branch): `xp += xp_reward`, recomputed `level`, `completed_deeds += 1`.
- `deed_completions`: one new row.
- `xp_transactions`: one row `source_type = 'deed'`.
- `feed_events`: one row `event_type = 'deed_complete'`.
- Then `check_achievements()` may add `achievement_unlocks` + `xp_transactions(source_type='achievement')` + `feed_events(event_type='achievement')`.

### Reference: formulas
- **Level from XP:** `level = max(1, floor(1 + sqrt(xp / 250)))` → thresholds: L1 = 0, L2 = 250, L3 = 1000, L4 = 2250, L5 = 4000 XP …
- **Rank from level:** Seeker (<3), Apprentice (≥3), Devotee (≥7), Adept (≥12), Master (≥18), Sage (≥25), Elder (≥30), Legend (≥40), Legacy Maker (≥50).
- **First achievement:** "First Light" unlocks at `total_deeds ≥ 1` (awards +100 XP).

---

# 1. Authentication

### AUTH-01 — User Sign Up
- **Feature:** Authentication / account creation
- **Preconditions:** Logged out. Email not previously registered.
- **Steps:**
  1. Navigate to `/auth/signup`.
  2. Enter a valid name, unique email, and a valid password.
  3. Submit the form.
- **Expected UI:** Submit button shows a loading state; on success either a "Check your email to confirm…" message (if confirmations on) or redirect toward `/dashboard` (if off). No error banner.
- **Expected DB:** New row in `auth.users`. Trigger `handle_new_user` creates **1** `profiles` row (`name` set, `xp=0`, `level=1`, `coins=0`, `energy=100`, `rank='Seeker'`, `streak=0`) and **5** `branch_progress` rows (worship/knowledge/discipline/character/charity, each `xp=0`, `level=1`).
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Record whether email confirmation is required in this environment._

### AUTH-02 — User Sign In
- **Feature:** Authentication / login
- **Preconditions:** A confirmed account exists; logged out.
- **Steps:**
  1. Navigate to `/auth/login`.
  2. Enter correct email + password.
  3. Submit.
- **Expected UI:** Loading state, then redirect to `/dashboard`. Sidebar shows the user's name and rank.
- **Expected DB:** New session issued (`auth.sessions`); auth cookies set in the browser. No data rows mutated.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### AUTH-03 — User Sign Out
- **Feature:** Authentication / logout
- **Preconditions:** Logged in, on any dashboard page.
- **Steps:**
  1. Click **Sign Out** in the sidebar.
- **Expected UI:** Redirect to `/` (landing). Visiting `/dashboard` afterward redirects to `/auth/login`.
- **Expected DB:** Session invalidated; auth cookies cleared.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### AUTH-04 — Invalid Login Handling
- **Feature:** Authentication / error handling
- **Preconditions:** Logged out.
- **Steps:**
  1. Go to `/auth/login`.
  2. Enter a valid email with the **wrong** password (and separately, a non-existent email).
  3. Submit.
- **Expected UI:** Inline error banner (e.g., "Invalid login credentials"). Remains on `/auth/login`. No redirect.
- **Expected DB:** No new session; no rows changed.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### AUTH-05 — Duplicate Email Handling
- **Feature:** Authentication / signup validation
- **Preconditions:** Email already registered.
- **Steps:**
  1. Go to `/auth/signup`.
  2. Enter the already-registered email with a name/password.
  3. Submit.
- **Expected UI:** Error message indicating the email cannot be used / already registered (no crash, stays on page).
- **Expected DB:** **No** new `auth.users` row; **no** new `profiles`/`branch_progress` rows created.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Confirm a duplicate signup does not create orphan profile rows._

### AUTH-06 — Session Persistence After Refresh
- **Feature:** Authentication / session
- **Preconditions:** Logged in on `/dashboard`.
- **Steps:**
  1. Press browser refresh (F5).
- **Expected UI:** Remains authenticated on `/dashboard`; no redirect to login; data reloads.
- **Expected DB:** Same session reused; no new rows.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### AUTH-07 — Session Persistence After Browser Restart
- **Feature:** Authentication / persistent session
- **Preconditions:** Logged in.
- **Steps:**
  1. Fully close the browser (not just the tab).
  2. Reopen and navigate to `/dashboard`.
- **Expected UI:** Still authenticated (within token validity); dashboard loads without login. If token expired, graceful redirect to `/auth/login`.
- **Expected DB:** Session/refresh token still valid.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Document token lifetime behavior observed._

### AUTH-08 — Protected Route Access Control
- **Feature:** Middleware route protection
- **Preconditions:** Logged out.
- **Steps:**
  1. Directly visit each: `/dashboard`, `/quests`, `/tree`, `/challenges`, `/community`, `/leaderboards`, `/achievements`, `/profile`, `/settings`.
  2. Then log in and confirm that visiting `/auth/login` while authenticated redirects away.
- **Expected UI:** Each protected route (logged out) redirects to `/auth/login?redirectTo=<path>`. After login, `/auth/login` and `/auth/signup` redirect to `/dashboard`.
- **Expected DB:** No data access for unauthenticated requests.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

---

# 2. Dashboard

### DASH-09 — Dashboard Initial Load
- **Feature:** Dashboard render
- **Preconditions:** Logged in.
- **Steps:**
  1. Navigate to `/dashboard`.
- **Expected UI:** Welcome header with first name + streak; 4 stat cards (Total XP, Coins, Energy, Streak); Weekly Activity chart; Branch Progress (5 branches); Today's Deeds list; Active Challenges; Recent Achievements. Empty sub-sections show graceful empty-state text rather than errors.
- **Expected DB:** Read-only; no writes. Values sourced from `profiles`, `branch_progress`, `deeds`+`deed_completions`, `challenges`+`challenge_participants`, `achievements`+`achievement_unlocks`, `weekly_activity` view.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### DASH-10 — Dashboard Data Accuracy
- **Feature:** Dashboard ↔ DB consistency
- **Preconditions:** Logged in; note current DB values.
- **Steps:**
  1. In Supabase, read the user's `profiles` row (`xp`, `coins`, `energy`, `max_energy`, `streak`).
  2. Compare against the dashboard stat cards.
  3. Compare Branch Progress bars vs `branch_progress` rows (`xp`, `level`).
- **Expected UI:** Total XP (formatted, e.g. "1.2K") = `profiles.xp`; Coins = `profiles.coins`; Energy = `energy/max_energy`; Streak = `profiles.streak`. Each branch level/xp matches its row.
- **Expected DB:** No change (read-only verification).
- **Result:** Pass ☐  Fail ☐
- **Notes:** _XP/Coins are abbreviated in UI (K/M); verify rounding is acceptable._

### DASH-11 — Dashboard Refresh Behavior
- **Feature:** Server-render freshness / revalidation
- **Preconditions:** Logged in on `/dashboard`.
- **Steps:**
  1. Manually change the user's `coins` in Supabase (e.g., +50).
  2. Reload `/dashboard`.
- **Expected UI:** Updated coin value appears after reload (page is server-rendered/dynamic). No stale cache.
- **Expected DB:** Reflects the manual edit.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Revert the manual edit afterward._

---

# 3. Deeds

### DEED-12 — Complete First Deed
- **Feature:** Deed completion (core loop)
- **Preconditions:** Logged in as a user with `energy ≥ deed.energy_cost` and the deed not completed today.
- **Steps:**
  1. Go to `/quests`.
  2. Pick a pending deed (note its XP/coin/energy values).
  3. Click the completion circle.
- **Expected UI:** Button disables during the action; on success the deed moves to **Completed** (struck-through), energy gauge drops, no error banner.
- **Expected DB:** `deed_completions` +1 row (correct `user_id`, `deed_id`, `xp_earned`, `coins_earned`, `energy_spent`); `profiles.xp`/`coins` increased, `energy` decreased; `branch_progress` (deed's branch) `completed_deeds +1`, `xp` increased; `xp_transactions` +1 (`deed`); `feed_events` +1 (`deed_complete`).
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### DEED-13 — Complete Multiple Deeds
- **Feature:** Sequential completions
- **Preconditions:** Logged in; multiple pending deeds; sufficient energy.
- **Steps:**
  1. On `/quests`, complete 3 different deeds in a row.
- **Expected UI:** Each moves to Completed; pending count decreases by 3; energy reflects cumulative cost.
- **Expected DB:** Exactly **3** new `deed_completions`; `profiles.xp`/`coins` equal the sum of the three rewards (plus any achievement bonuses); 3 `deed`-type `xp_transactions`; 3 `deed_complete` `feed_events`.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _If an achievement unlocks mid-sequence, account for its bonus XP/extra rows._

### DEED-14 — Prevent Duplicate Completion Exploits
- **Feature:** Idempotency / anti-cheat
- **Preconditions:** A deed already completed today.
- **Steps:**
  1. Attempt to complete the **same** deed again in the same UTC day (UI button should be disabled — also attempt via repeated rapid clicks / direct RPC call `complete_deed(user, deed)`).
- **Expected UI:** Completed deeds are non-interactive; no second completion occurs. If forced via RPC, an error object `{ success:false, error:"Already completed today" }` is returned.
- **Expected DB:** **No** additional `deed_completions` for that deed/day; `xp`/`coins`/`energy` unchanged by the second attempt.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Day boundary is based on `completed_at::date` vs `current_date`; record the timezone used by the DB._

### DEED-15 — Verify Deed History Creation
- **Feature:** Completion history
- **Preconditions:** At least one completion exists.
- **Steps:**
  1. In Supabase, query `deed_completions` for the user ordered by `completed_at desc`.
- **Expected UI:** N/A (data check); weekly chart reflects recent completions.
- **Expected DB:** One row per completion with accurate `xp_earned`, `coins_earned`, `energy_spent`, `streak_count`, and a sensible `completed_at` timestamp.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### DEED-16 — Verify Dashboard Updates After Completion
- **Feature:** UI reflects writes
- **Preconditions:** Logged in on `/dashboard`.
- **Steps:**
  1. Note current XP/coins/energy.
  2. Complete a deed (from `/quests` or dashboard "Today's Deeds").
  3. Return to / refresh `/dashboard`.
- **Expected UI:** XP, coins, energy, and (if applicable) streak update to new values; the completed deed shows as done in "Today's Deeds"; weekly chart count for today increments.
- **Expected DB:** Matches DEED-12 effects.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

---

# 4. XP System

### XP-17 — XP Awarded Correctly
- **Feature:** XP reward accuracy
- **Preconditions:** Known starting `profiles.xp`.
- **Steps:**
  1. Note `xp_before`.
  2. Complete one deed with a known `xp_reward`.
  3. Read `xp_after`.
- **Expected UI:** Total XP card increases by the deed's reward (plus any achievement bonus).
- **Expected DB:** `xp_after = xp_before + xp_reward (+ achievement bonus if unlocked)`; matching `xp_transactions` rows sum to the delta.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### XP-18 — XP Accumulates Correctly
- **Feature:** Cumulative XP
- **Preconditions:** Several completions over the session.
- **Steps:**
  1. Sum the `amount` of all `xp_transactions` for the user.
- **Expected UI:** Total XP card equals that sum.
- **Expected DB:** `profiles.xp` == `SUM(xp_transactions.amount)` for the user.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _This is a strong integrity invariant; flag any drift._

### XP-19 — XP Persists After Refresh
- **Feature:** Persistence
- **Preconditions:** XP just changed.
- **Steps:**
  1. Refresh `/dashboard`.
- **Expected UI:** XP value unchanged from pre-refresh (no reset, no double count).
- **Expected DB:** Unchanged by the refresh.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### XP-20 — XP Persists After Re-login
- **Feature:** Persistence across sessions
- **Preconditions:** Known XP value.
- **Steps:**
  1. Sign out, sign back in.
  2. Check Total XP.
- **Expected UI:** Identical XP to before sign-out.
- **Expected DB:** `profiles.xp` unchanged.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

---

# 5. Coin System

### COIN-21 — Coins Awarded Correctly
- **Feature:** Coin reward accuracy
- **Preconditions:** Known starting `coins`.
- **Steps:**
  1. Note `coins_before`.
  2. Complete a deed with known `coin_reward`.
- **Expected UI:** Coins card increases by `coin_reward`.
- **Expected DB:** `coins_after = coins_before + coin_reward`; `deed_completions.coins_earned` matches.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Achievements award XP only (no coins) per current functions._

### COIN-22 — Coins Accumulate Correctly
- **Feature:** Cumulative coins
- **Preconditions:** Multiple completions.
- **Steps:**
  1. Sum `coins_earned` across the user's `deed_completions`.
- **Expected UI:** Coins card equals that sum (assuming no spending feature exists).
- **Expected DB:** `profiles.coins` == `SUM(deed_completions.coins_earned)`.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _No coin-spend feature currently; balance should be monotonic._

### COIN-23 — Coin Balance Persists
- **Feature:** Persistence
- **Preconditions:** Known balance.
- **Steps:**
  1. Refresh, then sign out/in.
- **Expected UI:** Coin value identical at each step.
- **Expected DB:** `profiles.coins` unchanged.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

---

# 6. Streak System

### STRK-24 — First Streak Creation
- **Feature:** Streak initialization
- **Preconditions:** New user with `streak=0`, `last_active=null`.
- **Steps:**
  1. Complete any deed today.
- **Expected UI:** Streak card shows **1 day**; welcome header reflects 1-day streak.
- **Expected DB:** `profiles.streak=1`, `last_active=current_date`; completion's `streak_count=1`.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### STRK-25 — Consecutive Day Increment
- **Feature:** Streak continuation
- **Preconditions:** User completed a deed "yesterday" (`last_active = current_date - 1`).
- **Steps:**
  1. Simulate by setting `last_active` to yesterday and `streak` to N (document this test setup).
  2. Complete a deed today.
- **Expected UI:** Streak card = **N+1**.
- **Expected DB:** `streak = N+1`, `longest_streak = max(longest_streak, N+1)`, `last_active = current_date`.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Requires controlled `last_active` manipulation; record exact values used._

### STRK-26 — Missed Day Reset
- **Feature:** Streak reset on gap
- **Preconditions:** `last_active < current_date - 1` (gap of ≥1 full day).
- **Steps:**
  1. Set `last_active` to 3 days ago, `streak` to some N.
  2. Complete a deed today.
- **Expected UI:** Streak card resets to **1 day**.
- **Expected DB:** `streak = 1`, `last_active = current_date`; `longest_streak` retains prior max.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### STRK-27 — Streak Persistence
- **Feature:** Persistence
- **Preconditions:** Known streak value.
- **Steps:**
  1. Refresh and re-login.
- **Expected UI:** Streak unchanged.
- **Expected DB:** `profiles.streak`/`last_active` unchanged by read.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Same-day repeat completion must NOT change streak (verify second deed today leaves streak unchanged)._

---

# 7. Challenges

### CHAL-28 — Join Challenge
- **Feature:** Challenge join
- **Preconditions:** Logged in; a challenge the user hasn't joined.
- **Steps:**
  1. Go to `/challenges`, **Available** tab.
  2. Click **Join** on a challenge.
- **Expected UI:** Button becomes "Joined"/disabled; challenge appears under **Active**; participant count reflects the join after refresh.
- **Expected DB:** `challenge_participants` +1 row (`user_id`, `challenge_id`, `current_progress=0`, `completed=false`); `challenges.participant_count +1`; `feed_events` +1 (`challenge_join`).
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### CHAL-29 — Challenge Participation Persistence
- **Feature:** Persistence
- **Preconditions:** A joined challenge.
- **Steps:**
  1. Refresh `/challenges`; then sign out/in and revisit.
- **Expected UI:** Challenge remains in **Active** with "Joined" state.
- **Expected DB:** `challenge_participants` row still present.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### CHAL-30 — Challenge Progress Updates
- **Feature:** Progress tracking
- **Preconditions:** A joined challenge with `goal > 0`.
- **Steps:**
  1. In Supabase, set `current_progress` to a partial value (e.g., goal/2).
  2. Refresh `/challenges`.
  3. Set `current_progress = goal`.
  4. Refresh again.
- **Expected UI:** Progress bar reflects partial value; at `current_progress ≥ goal` the challenge moves to the **Completed** tab.
- **Expected DB:** `current_progress` matches the set values.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _No automatic progress increment from deed completion currently exists — progress is updated manually/externally. Flag if auto-increment is expected for launch._

---

# 8. Achievements

### ACH-31 — First Achievement Unlock
- **Feature:** Achievement engine
- **Preconditions:** Brand-new user with **0** completions.
- **Steps:**
  1. Complete the very first deed.
  2. Open `/achievements`.
- **Expected UI:** "First Light" shows as **earned** (badge lit); progress counter increments (e.g., 1/20).
- **Expected DB:** `achievement_unlocks` +1 (First Light); `profiles.xp += 100` (bonus); `xp_transactions` +1 (`achievement`); `feed_events` +1 (`achievement`).
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### ACH-32 — Multiple Achievement Unlocks
- **Feature:** Multiple criteria
- **Preconditions:** Ability to push stats past several thresholds (e.g., `total_xp ≥ 10000` → "XP Hunter").
- **Steps:**
  1. Drive XP/deeds high enough to satisfy ≥2 criteria (via legitimate completions, or controlled `profiles`/completion edits — document method).
  2. Trigger `check_achievements` (occurs automatically on next deed completion).
- **Expected UI:** All newly-qualified achievements show earned; counter reflects total.
- **Expected DB:** One `achievement_unlocks` row per newly satisfied achievement; corresponding `achievement` `xp_transactions` and `feed_events`.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### ACH-33 — Duplicate Achievement Prevention
- **Feature:** Idempotency
- **Preconditions:** An achievement already earned.
- **Steps:**
  1. Complete more deeds so `check_achievements` runs again.
- **Expected UI:** No duplicate badge; counter does not exceed total achievements.
- **Expected DB:** `achievement_unlocks` has **exactly one** row per `(user_id, achievement_id)` (enforced by unique constraint); no repeated bonus XP.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### ACH-34 — Achievement Persistence
- **Feature:** Persistence
- **Preconditions:** ≥1 earned achievement.
- **Steps:**
  1. Refresh and re-login; revisit `/achievements` and `/profile` showcase.
- **Expected UI:** Earned achievements remain lit; showcase on profile matches.
- **Expected DB:** `achievement_unlocks` rows unchanged.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

---

# 9. Leaderboard

### LEAD-35 — Leaderboard Initial Load
- **Feature:** Leaderboard render
- **Preconditions:** ≥1 profile exists.
- **Steps:**
  1. Visit `/leaderboards`.
- **Expected UI:** "Your rank" card (if current user present) + global rankings list sorted by XP descending; current user highlighted with "(you)".
- **Expected DB:** Read-only from `leaderboard` view (derived from `profiles` ordered by `xp desc`).
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### LEAD-36 — XP-Based Rank Update
- **Feature:** Rank recomputation
- **Preconditions:** User not at rank #1.
- **Steps:**
  1. Note current rank.
  2. Increase the user's XP above the next person (via legitimate completions or controlled edit).
  3. Reload `/leaderboards`.
- **Expected UI:** User's position rises accordingly; "ahead of you" count decreases.
- **Expected DB:** `leaderboard` view reorders (no stored rank to mutate; `row_number()` recomputed at query time).
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### LEAD-37 — Rank Persistence After Refresh
- **Feature:** Stability
- **Preconditions:** Known ranking.
- **Steps:**
  1. Refresh `/leaderboards` multiple times.
- **Expected UI:** Same ordering each time (assuming no XP changes).
- **Expected DB:** Deterministic ordering for equal inputs.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Note tie-breaking behavior when two users share identical XP._

### LEAD-38 — Rank Accuracy Against Database Values
- **Feature:** UI ↔ DB consistency
- **Preconditions:** Several profiles with distinct XP.
- **Steps:**
  1. Run `SELECT name, xp FROM profiles ORDER BY xp DESC;`.
  2. Compare top N to the leaderboard UI order and XP values.
- **Expected UI:** Exact order + XP match the query; rank numbers sequential from 1.
- **Expected DB:** N/A (verification).
- **Result:** Pass ☐  Fail ☐
- **Notes:**

---

# 10. Profile

### PROF-39 — Update Profile Information
- **Feature:** Profile edit form
- **Preconditions:** Logged in; on `/settings`.
- **Steps:**
  1. Change Display Name, Location, and Bio.
  2. (Email field should be read-only/disabled.)
- **Expected UI:** Fields accept input; Email cannot be edited.
- **Expected DB:** No write until saved.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### PROF-40 — Save Profile Changes
- **Feature:** `updateProfile` action
- **Preconditions:** Edited fields in PROF-39.
- **Steps:**
  1. Click **Save Changes**.
- **Expected UI:** Button shows "Saving…"; success message "Profile saved."; values persist on the page.
- **Expected DB:** `profiles` row updated: `name`, `bio`, `location` reflect new values; `updated_at` advanced by trigger.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Email is intentionally not updated by this action; confirm it remains unchanged._

### PROF-41 — Profile Persistence After Refresh
- **Feature:** Persistence
- **Preconditions:** Saved changes.
- **Steps:**
  1. Refresh `/settings` and `/profile`.
- **Expected UI:** New name/bio/location shown in settings form, profile hero, and sidebar.
- **Expected DB:** Values unchanged after read.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### PROF-42 — Profile Persistence After Re-login
- **Feature:** Persistence across sessions
- **Preconditions:** Saved changes.
- **Steps:**
  1. Sign out, sign back in, view `/profile`.
- **Expected UI:** Updated values persist.
- **Expected DB:** Unchanged.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

---

# 11. Tree Progression

### TREE-43 — Initial Tree State
- **Feature:** Spiritual tree render
- **Preconditions:** New user (all branches L1, 0 XP).
- **Steps:**
  1. Visit `/tree`.
- **Expected UI:** Central root node + 5 branch nodes; each branch in the side list shows Lv.1, 0 XP, `0/<total>` deeds; connecting lines dimmed for branches with 0 completed deeds.
- **Expected DB:** 5 `branch_progress` rows at defaults.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### TREE-44 — XP Progress Updates
- **Feature:** Branch XP reflection
- **Preconditions:** Logged in.
- **Steps:**
  1. Note a branch's XP (e.g., Worship).
  2. Complete a deed in that branch.
  3. Reload `/tree`.
- **Expected UI:** That branch's XP bar advances; `completed_deeds` count increments; connecting line becomes colored once `completed_deeds > 0`.
- **Expected DB:** Matching `branch_progress` row `xp`/`completed_deeds` increased.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### TREE-45 — Tree Growth Stage Changes
- **Feature:** Branch level-up
- **Preconditions:** A branch near a level threshold.
- **Steps:**
  1. Complete deeds in one branch until its `xp` crosses a level threshold (L2 at 250 branch XP).
  2. Reload `/tree`.
- **Expected UI:** Branch level badge increases (Lv.1 → Lv.2…); the node visual reflects higher level/progress.
- **Expected DB:** `branch_progress.level` recomputed via `get_level_from_xp`.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Tree node visuals are level-driven; confirm node renders the new level._

### TREE-46 — Tree Persistence
- **Feature:** Persistence
- **Preconditions:** Branch progress changed.
- **Steps:**
  1. Refresh and re-login; revisit `/tree`.
- **Expected UI:** Branch levels/XP/deed counts persist.
- **Expected DB:** `branch_progress` unchanged by read.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

---

# 12. Community Feed

### FEED-47 — Deed Completion Event Creation
- **Feature:** Feed write on deed complete
- **Preconditions:** Logged in.
- **Steps:**
  1. Complete a deed.
  2. Visit `/community`.
- **Expected UI:** A new feed entry "completed <deed title>" with branch tag + XP appears near the top, attributed to the user.
- **Expected DB:** `feed_events` +1 row `event_type='deed_complete'`, `deed_title` set, `branch` set, `xp_earned` set.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### FEED-48 — Challenge Join Event Creation
- **Feature:** Feed write on join
- **Preconditions:** An unjoined challenge.
- **Steps:**
  1. Join a challenge.
  2. Visit `/community`.
- **Expected UI:** A feed entry corresponding to the join appears (rendered via the generic feed template).
- **Expected DB:** `feed_events` +1 row `event_type='challenge_join'`.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _`challenge_join` rows carry no `deed_title`/`branch`; verify the UI renders them acceptably (the view falls back to a default label/branch). Record any odd presentation._

### FEED-49 — Achievement Unlock Event Creation
- **Feature:** Feed write on unlock
- **Preconditions:** An about-to-unlock achievement.
- **Steps:**
  1. Trigger an achievement unlock (e.g., first deed → First Light).
  2. Visit `/community`.
- **Expected UI:** A feed entry referencing the achievement appears.
- **Expected DB:** `feed_events` +1 row `event_type='achievement'`, `achievement_title` set, `xp_earned` set.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Achievement events have null `branch`; the view defaults branch — confirm display is sensible._

### FEED-50 — Feed Persistence
- **Feature:** Persistence
- **Preconditions:** Events exist.
- **Steps:**
  1. Refresh `/community`; sign out/in and revisit.
- **Expected UI:** Existing events remain visible.
- **Expected DB:** `feed_events` rows unchanged.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### FEED-51 — Feed Ordering Accuracy
- **Feature:** Ordering
- **Preconditions:** ≥3 events at different times.
- **Steps:**
  1. Compare feed order to `SELECT * FROM feed_events ORDER BY created_at DESC LIMIT 20;`.
- **Expected UI:** Newest first; order matches the query.
- **Expected DB:** N/A (verification).
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Likes are not modeled; the heart shows 0 and is non-interactive by design — confirm it does not error._

---

# 13. Data Integrity

### DATA-52 — Verify No Duplicate Records
- **Feature:** Uniqueness constraints
- **Preconditions:** Active test account with activity.
- **Steps:**
  1. `SELECT user_id, branch, count(*) FROM branch_progress GROUP BY 1,2 HAVING count(*)>1;`
  2. `SELECT user_id, achievement_id, count(*) FROM achievement_unlocks GROUP BY 1,2 HAVING count(*)>1;`
  3. `SELECT user_id, challenge_id, count(*) FROM challenge_participants GROUP BY 1,2 HAVING count(*)>1;`
  4. `SELECT user_id, deed_id, completed_at::date, count(*) FROM deed_completions GROUP BY 1,2,3 HAVING count(*)>1;`
- **Expected UI:** N/A.
- **Expected DB:** All four queries return **0 rows**.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### DATA-53 — Verify Correct User Ownership
- **Feature:** Ownership integrity
- **Preconditions:** Activity from User A.
- **Steps:**
  1. Confirm all of User A's `deed_completions`, `xp_transactions`, `achievement_unlocks`, `challenge_participants`, `feed_events`, `branch_progress` carry `user_id = A`.
- **Expected UI:** N/A.
- **Expected DB:** No rows for A attributed to another `user_id`.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### DATA-54 — Verify Foreign Key Relationships
- **Feature:** Referential integrity
- **Preconditions:** Activity exists.
- **Steps:**
  1. Confirm every `deed_completions.deed_id` exists in `deeds`; every `challenge_participants.challenge_id` in `challenges`; every `achievement_unlocks.achievement_id` in `achievements`; every `*.user_id` in `auth.users`.
  2. (Optional) Delete a test `auth.users` row in a scratch environment and confirm cascading deletes.
- **Expected UI:** N/A.
- **Expected DB:** No orphaned rows; cascades behave per `on delete cascade`.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Do cascade-deletion test only in a disposable environment._

### DATA-55 — Verify Timestamp Accuracy
- **Feature:** Timestamps
- **Preconditions:** Recent activity.
- **Steps:**
  1. Inspect `created_at`/`completed_at`/`earned_at`/`updated_at` on rows just created.
- **Expected UI:** Community "time ago" labels are plausible relative to now.
- **Expected DB:** Timestamps are recent, in UTC, and `updated_at` ≥ `created_at`.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Document DB timezone; the "already completed today" check is date-based and timezone-sensitive._

---

# 14. Security / RLS Validation

> Setup for this section: have **User A** and **User B** as separate authenticated sessions (two browsers/profiles). Capture each user's UUID. "Attempt" means trying the action from User A's authenticated client (e.g., supabase-js calls in the browser console) against User B's data.

### SEC-56 — User A Cannot View User B Private Data
- **Feature:** RLS read scoping
- **Preconditions:** Both users have data.
- **Steps:**
  1. As User A, query `deed_completions`, `xp_transactions`, `achievement_unlocks`, `challenge_participants`, `streak_history` filtered to User B's id.
- **Expected UI:** N/A.
- **Expected DB / API:** Zero rows returned for User B's private tables (RLS `using auth.uid() = user_id`).
- **Result:** Pass ☐  Fail ☐
- **Notes:** _By design, `profiles` and `branch_progress` are world-readable (leaderboard/community). So XP, coins, rank, bio, location ARE publicly visible — confirm this is acceptable for launch (not treated as "private")._

### SEC-57 — User A Cannot Edit User B Profile
- **Feature:** RLS update scoping (profiles)
- **Preconditions:** Both authenticated.
- **Steps:**
  1. As User A, attempt `update profiles set name='hacked' where user_id = <B>`.
- **Expected UI:** N/A.
- **Expected DB:** Update affects **0 rows**; User B's profile unchanged (policy `using auth.uid() = user_id`).
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### SEC-58 — User A Cannot Modify User B XP
- **Feature:** RLS update scoping (XP)
- **Preconditions:** Both authenticated.
- **Steps:**
  1. As User A, attempt `update profiles set xp = xp + 100000 where user_id = <B>`.
- **Expected UI:** N/A.
- **Expected DB:** 0 rows affected; User B's `xp` unchanged.
- **Result:** Pass ☐  Fail ☐
- **Notes:** ⚠️ _Known risk to verify separately: the profiles UPDATE policy scopes by row only (no column restriction / no WITH CHECK). A user CAN directly modify their **own** `xp`/`coins`/`rank` from the client. Test this self-edit and record whether client-side stat tampering is possible — relevant to anti-cheat posture._

### SEC-59 — User A Cannot Modify User B Coins
- **Feature:** RLS update scoping (coins)
- **Preconditions:** Both authenticated.
- **Steps:**
  1. As User A, attempt `update profiles set coins = 999999 where user_id = <B>`.
- **Expected UI:** N/A.
- **Expected DB:** 0 rows affected; User B `coins` unchanged.
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Same self-edit caveat as SEC-58._

### SEC-60 — User A Cannot Modify User B Achievements
- **Feature:** RLS insert scoping (achievement_unlocks)
- **Preconditions:** Both authenticated.
- **Steps:**
  1. As User A, attempt `insert into achievement_unlocks (user_id, achievement_id) values (<B>, <some>)`.
- **Expected UI:** N/A.
- **Expected DB:** Insert **rejected** (policy `with check auth.uid() = user_id`); no row created for User B.
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### SEC-61 — User A Cannot Complete Deeds For User B
- **Feature:** Anti-impersonation on completion
- **Preconditions:** Both authenticated.
- **Steps:**
  1. As User A, attempt a direct insert `insert into deed_completions (user_id, ...) values (<B>, ...)`.
  2. **Also** as User A, call the RPC directly: `rpc('complete_deed', { p_user_id: <B>, p_deed_id: <deed> })`.
- **Expected UI:** N/A.
- **Expected DB:** Direct insert rejected by RLS (`with check auth.uid() = user_id`) → no row for User B.
- **Result:** Pass ☐  Fail ☐
- **Notes:** ⚠️ **Critical to verify:** `complete_deed` (and `join_challenge`) are `security definer` and act on the **passed** `p_user_id`. If the RPC call in step 2 succeeds in writing a completion/XP for User B, this is a **security failure** (privilege escalation / impersonation) and must be escalated before launch. Record the exact RPC result.

---

# 15. Performance

> Measure with browser DevTools (Network + Lighthouse) on a representative production deployment and network profile. Record numbers; thresholds below are launch targets, adjust per SLA.

### PERF-62 — Dashboard Load Performance
- **Feature:** `/dashboard` performance
- **Preconditions:** Logged-in user with realistic data.
- **Steps:**
  1. Cold-load `/dashboard`; record TTFB, full load, and Largest Contentful Paint.
- **Expected UI:** Interactive promptly; no layout thrash; chart renders without long blocking.
- **Expected DB:** Six parallel queries (profile, deeds, challenges, achievements, weekly activity, branches) complete efficiently.
- **Target:** TTFB < 800 ms; LCP < 2.5 s on broadband. **Actual:** ______
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Dashboard ships the largest JS (chart lib). Note bundle size from build (~255 kB First Load JS)._

### PERF-63 — Profile Load Performance
- **Feature:** `/profile` performance
- **Steps:** Cold-load `/profile`; record metrics.
- **Expected UI:** Renders hero, stats, branches, showcase quickly.
- **Expected DB:** `getCurrentUser` + `getAchievements` complete efficiently.
- **Target:** LCP < 2.0 s. **Actual:** ______
- **Result:** Pass ☐  Fail ☐
- **Notes:**

### PERF-64 — Leaderboard Load Performance
- **Feature:** `/leaderboards` performance
- **Steps:** Cold-load `/leaderboards` (limit 20); record metrics. Re-test with a larger profile count if possible.
- **Expected UI:** List renders quickly.
- **Expected DB:** `leaderboard` view query (ordered by xp, limit 20) is fast; verify index on `profiles(xp desc)` is used.
- **Target:** Query < 200 ms; LCP < 2.0 s. **Actual:** ______
- **Result:** Pass ☐  Fail ☐
- **Notes:** _Evaluate scaling behavior as profile rows grow._

### PERF-65 — Challenge Page Load Performance
- **Feature:** `/challenges` performance
- **Steps:** Cold-load `/challenges`; record metrics.
- **Expected UI:** Tabs + cards render quickly.
- **Expected DB:** `challenges` + `challenge_participants` queries efficient.
- **Target:** LCP < 2.0 s. **Actual:** ______
- **Result:** Pass ☐  Fail ☐
- **Notes:**

---

# 16. End-to-End Production Smoke Test

**Objective:** A brand-new user completes the full golden path. Run on the production deployment with a fresh email. Keep a Supabase SQL Editor tab open to assert DB state at each stage.

**Test ID:** E2E-SMOKE-01
**Tester:** ____________  **Date:** ____________  **Environment/URL:** ____________
**New user email:** ____________  **User UUID (capture after signup):** ____________

| Stage | Action (exact steps) | Expected UI | Expected DB | Pass/Fail |
|------|----------------------|-------------|-------------|-----------|
| 1. Sign Up | Go to `/auth/signup`; enter name "QA Tester", fresh email, valid password; submit. | Loading → confirmation message or redirect toward dashboard; no error. | `auth.users` +1; `profiles` +1 (xp=0, level=1, coins=0, energy=100, rank='Seeker', streak=0); `branch_progress` +5 (all L1/0xp). | ☐ |
| 2. Create Profile | (If email confirmation required, confirm via email link first.) Sign in at `/auth/login`. Visit `/profile`. | Redirect to `/dashboard`; sidebar shows "QA Tester" + "Seeker"; profile hero shows Lv.1, 0 XP, joined date = today. | Session created; profile row readable; no mutations. | ☐ |
| 3. Complete First Deed | Go to `/quests`; complete **Morning Dhikr** (Worship: +100 XP, +15 coins, −5 energy). | Deed moves to Completed; energy 100 → 95; no error. | `deed_completions` +1; `profiles.energy=95`; `xp_transactions` +1 (deed,100); `feed_events` +1 (deed_complete); branch_progress worship completed_deeds=1, xp=100. | ☐ |
| 4. Gain XP | Observe `/dashboard` Total XP after completion + refresh. | Total XP = **200** (100 deed + 100 First Light bonus); level remains 1. | `profiles.xp=200`; two `xp_transactions` (deed 100, achievement 100); `SUM(xp_transactions)=200`. | ☐ |
| 5. Gain Coins | Observe Coins card. | Coins = **15**. | `profiles.coins=15`; `deed_completions.coins_earned=15`. | ☐ |
| 6. Unlock Achievement | Visit `/achievements`. | "First Light" earned; counter 1/20. | `achievement_unlocks` +1 (First Light); `feed_events` includes one `achievement` row. | ☐ |
| 7. Join Challenge | Go to `/challenges` → Available → Join "30-Day Fajr Streak". | Button → Joined; appears under Active. | `challenge_participants` +1 (current_progress=0); `challenges.participant_count +1`; `feed_events` +1 (challenge_join). | ☐ |
| 8. Appear On Leaderboard | Visit `/leaderboards`. | User appears in rankings highlighted "(you)" with 200 XP, Level 1. | `leaderboard` view returns the user with xp=200 at the correct sorted position. | ☐ |
| 9. Update Profile | Go to `/settings`; change Bio to "QA run" and Location to "Test City"; Save. | "Saving…" → "Profile saved."; values persist; sidebar/profile reflect them. | `profiles.bio='QA run'`, `location='Test City'`, `updated_at` advanced; email unchanged. | ☐ |
| 10. Create Community Activity | Visit `/community`. | Feed shows this user's deed-complete (and achievement) entries near top with correct branch/XP. | `feed_events` for this user include deed_complete + achievement + challenge_join rows; order newest-first. | ☐ |
| 11. Sign Out | Click Sign Out. | Redirect to `/`; `/dashboard` now redirects to `/auth/login`. | Session invalidated; data rows unchanged. | ☐ |
| 12. Sign Back In | Sign in again; visit `/dashboard`, `/profile`, `/achievements`, `/challenges`. | All prior state intact: 200 XP, 15 coins, streak 1, First Light earned, Fajr challenge joined, bio/location persisted. | No values reset; all rows from stages 3–9 still present and consistent. | ☐ |

### E2E expected DB state summary (after stage 12)
- `profiles`: xp=200, level=1, rank='Seeker', coins=15, energy=95, streak=1, bio/location updated.
- `branch_progress`: worship xp=100/completed_deeds=1; other four at defaults.
- `deed_completions`: 1 row.
- `xp_transactions`: 2 rows (deed 100, achievement 100).
- `achievement_unlocks`: 1 row (First Light).
- `challenge_participants`: 1 row.
- `feed_events`: 3 rows (deed_complete, achievement, challenge_join).
- No duplicate rows in any table; all rows owned by this user's UUID.

### Success criteria for production readiness
The build is **launch-ready** only when **all** of the following hold:
1. **Auth:** Signup/login/logout, invalid + duplicate handling, session persistence (refresh + restart), and protected-route redirects all pass (AUTH-01…08).
2. **Core loop:** Deed completion writes correctly, is idempotent per day (no duplicate exploit), and the dashboard reflects updates (DEED-12…16).
3. **Economy & progression:** XP and coins are awarded, accumulate, and persist exactly (`profiles.xp == SUM(xp_transactions.amount)`); streaks initialize/increment/reset correctly (XP-17…20, COIN-21…23, STRK-24…27).
4. **Engagement systems:** Challenges join/persist; achievements unlock without duplicates; leaderboard matches DB ordering; tree reflects branch progress (CHAL, ACH, LEAD, TREE sections).
5. **Profile:** Edits save and persist across refresh and re-login (PROF-39…42).
6. **Feed:** deed/challenge/achievement events are created, persisted, and ordered correctly (FEED-47…51).
7. **Data integrity:** Zero duplicate/orphan rows; correct ownership; valid FKs; sane timestamps (DATA-52…55).
8. **Security (blocking):** No cross-user reads of private tables, no cross-user writes to profile/XP/coins/achievements/completions; **and the `complete_deed`/`join_challenge` RPCs must not allow acting on another user's `p_user_id`** (SEC-56…61). Any cross-user write capability is a **launch blocker**.
9. **Performance:** All page targets met (or formally accepted) (PERF-62…65).
10. **E2E smoke (E2E-SMOKE-01):** All 12 stages pass with the expected DB summary above.

### Pre-launch risk register (verify & sign off)
| Risk | Test(s) | Severity | Status |
|------|---------|----------|--------|
| RPC `p_user_id` trust (impersonation via `complete_deed`/`join_challenge`) | SEC-61 | **Critical (blocker if exploitable)** | ☐ |
| Client can edit own `xp`/`coins`/`rank` (row-only RLS, no column guard) | SEC-58/59 | High (anti-cheat) | ☐ |
| Profile fields publicly readable by design (xp/coins/bio/location) | SEC-56 | Medium (confirm intended) | ☐ |
| Challenge progress has no auto-increment from deeds | CHAL-30 | Medium (feature gap) | ☐ |
| Community likes non-functional (no schema) | FEED-51 | Low | ☐ |
| Settings notifications/privacy toggles not persisted | (Settings) | Low | ☐ |
| Orphaned auth routes `/auth/confirm`, `/auth/update-password` missing | AUTH-01/reset flow | Medium (broken email links) | ☐ |
| Energy restore depends on scheduled `restore_energy()` | E6 / STRK | Medium (loop stalls if unscheduled) | ☐ |

---

**Sign-off**

| Role | Name | Date | Result (Go / No-Go) |
|------|------|------|---------------------|
| QA Lead |  |  |  |
| Engineering |  |  |  |
| Product |  |  |  |
