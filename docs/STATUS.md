# DeedTracker — Definitive Status Report (Source of Truth)

**As of:** `main` · live at https://deedtracker-stitch.vercel.app · Supabase `dhwxxcvolwdzkzggjzup` (migrations `001`–`009`). Reflects the current deployed state. Phase 1 #1–#4 addressed: privacy toggles removed (`7d37662`), email delivery verified via Supabase Auth config (no code change), Navbar search box removed (`7dc2393`), Energy meter UI removed, Challenge progress UI removed (join-only), Notifications section removed from Settings, Navbar notification badge removed. Leaked-password protection reclassified Blocked (Free plan) and moved out of Phase 1 (Pro-only feature; see Known Limitations).

**Legend:** Complete = works end-to-end on live data · Partial = works but a key sub-behavior is absent · Broken = present but errors · Fake = UI present, no real backing/effect · Missing = not present.

---

## Feature Classification

### Authentication & session
| Feature | Status | Why | User impact | Priority |
|---|---|---|---|---|
| Sign up (+ profile/branch trigger) | Complete | `handle_new_user` creates profile + 5 branches; `/auth/confirm` exists | Can register | Critical |
| Sign in / Sign out | Complete | `signIn`/`signOut` actions + session cookies | Can access account | Critical |
| Password reset → update-password | Complete | routed via `/auth/callback` → `/auth/update-password` | Can recover account | High |
| Route protection / session persistence | Complete | middleware verified (307 redirects, no 500s) | Protected areas gated | Critical |
| Transactional email delivery | Complete | code correct; Supabase Auth verified — Confirm email ON, custom SMTP enabled, Site URL + redirect URLs allow-listed, `NEXT_PUBLIC_SITE_URL` set | Confirm/reset emails deliver | Critical |

### Core loop / deeds
| Feature | Status | Why | User impact | Priority |
|---|---|---|---|---|
| Daily deed list (`getDailyDeeds`) | Complete | live, 29 seeded deeds | Sees today's deeds | Critical |
| Deed completion (XP/coins/streak/branch/achievement/feed) | Complete | `complete_deed` RPC, live-verified | Core action works | Critical |
| Quests filter tabs | Complete | client filter | Usable | Low |
| Energy meter (stat card + gauge) | Removed | UI removed (dashboard card, quests section, sidebar gauge, per-deed cost, EnergyGauge component); DB columns/`restore_energy()` left intact per Phase 2 decision | Resolved | — |
| Per-deed streak flame | Missing | never tracked in DB (always 0, hidden) | Minor | Low |

### Progression
| Feature | Status | Why | User impact | Priority |
|---|---|---|---|---|
| XP earn/accumulate/persist | Complete | ledger integrity holds | Progress accrues | Critical |
| Coins earn/accumulate/persist | Complete | awarded per deed | Balance grows | High |
| Coin sink (spending) | Missing | nothing to spend coins on | Reward feels pointless | Medium |
| Streak increment/reset/persist | Complete | works as coded; full reset on 1 miss | Harsh but functional | Medium |
| Achievements unlock/display/persist | Complete | `check_achievements` engine | Rewards milestones | High |
| Leaderboard (global XP) | Complete | live `security_invoker` view | Ranking visible | Medium |

### Screens
| Feature | Status | Why | User impact | Priority |
|---|---|---|---|---|
| Dashboard (stats/chart/branches/deeds/challenges/achievements) | Complete | live data (energy card excepted) | Central hub works | Critical |
| Profile (view) | Complete | live `getCurrentUser` | Sees own data | High |
| Profile edit (name/bio/location) | Complete | `updateProfile`, column-scoped | Can edit identity | Medium |
| Avatar change/upload | Missing | dicebear/URL only; button removed | Can't set photo | Low |
| Tree visualization | Partial | renders live branch data but static — no growth/wilt/reaction | Core promise under-delivered | High |
| Community feed | Complete | live `feed_events` | Sees activity | Medium |
| Community likes | Complete | `post_likes` + toggle wired (`007`) | Can like | Low |
| Featured seekers | Complete | leaderboard slice | Informational | Low |
| Accountability (circles/partners) | Missing | not built | No social obligation | Medium |
| Challenges — join + persist | Complete | `join_challenge` | Can join | Medium |
| Challenges — progress tracking | Deferred | progress bar + "Completed" tab removed for launch; challenges are join-only (Available/Joined). Auto-advance is a Phase 2 item; DB/RPCs unchanged | Resolved (no longer misleading) | — |
| Landing / Pricing | Complete | static marketing | Fine | Low |

### Settings & chrome
| Feature | Status | Why | User impact | Priority |
|---|---|---|---|---|
| Notification toggles | Removed | UI section deleted (were Fake — persisted to `preferences` but no notification system exists); `updatePreferences()`, the `preferences` column, and `User.preferences` type/mapping left intact per Phase 2 decision | Resolved | — |
| Privacy toggles | Removed | deleted in commit `7d37662` (were Fake — persisted but never enforced); no longer in the UI | Resolved | — |
| Delete account | Missing | button removed; no flow | No data-deletion path | Medium |
| Navbar search box | Fake | non-functional input on every screen | Looks broken | High |
| Navbar notification badge "3" | Removed | hardcoded count deleted (was Fake — no notification system, no unread source); bell icon kept as neutral chrome | Resolved | — |

### Security & data integrity
| Feature | Status | Why | User impact | Priority |
|---|---|---|---|---|
| XP/coin/streak/leaderboard tamper protection | Complete | column grants + RLS, live-verified (42501 blocked) | Cheating blocked | Critical |
| RPC impersonation guard (SEC-61) | Complete | `Forbidden` guard, verified | No cross-user writes | Critical |
| Leaked-password protection | Blocked (Free plan) | Supabase HaveIBeenPwned check is a Pro-plan feature ($25/mo); project is on Free and will not upgrade for launch | Weak/breached passwords accepted at signup/reset | Medium |

---

## The Roadmap (shortest realistic path to launch)

### PHASE 1 — Must Fix Before Launch
*Only what makes the product look broken, misleading, or untrustworthy. Clearing these = launch-ready.*
1. ✅ **DONE** — **Privacy toggles (Fake)** removed in `7d37662`; no longer imply privacy the RLS doesn't enforce.
2. ✅ **DONE** — **Transactional email delivery** verified via Supabase Auth (Confirm email ON, custom SMTP, Site URL + redirect URLs allow-listed, `NEXT_PUBLIC_SITE_URL` set). No code change required.
3. ✅ **DONE** — **Navbar search box (Fake)** removed in `7dc2393` (non-functional input; no replacement).
4. ✅ **DONE** — **Energy meter (Fake)** UI removed (dashboard card, quests section, sidebar gauge, per-deed cost, EnergyGauge component). DB columns + `restore_energy()` intentionally left intact (Phase 2 decision).
5. ✅ **DONE** — **Challenge progress (Partial)** UI removed for launch: progress bar + "Completed" tab gone; challenges are join-only (Available/Joined). Auto-advance deferred to Phase 2; DB/RPCs unchanged.
6. ✅ **DONE** — **Notification toggles (Fake)** removed from Settings (persisted to `preferences` but no notification system exists). `updatePreferences()`, the `preferences` column, and `User.preferences` type/mapping intentionally left intact (Phase 2 decision).
7. ✅ **DONE** — **Navbar notification badge "3" (Fake)** removed (hardcoded count, no notification system / unread source). Bell icon kept as neutral chrome.
8. **Delete-account (Missing)** — provide a data-deletion path (trust/compliance).

> **Moved out of Phase 1 — Leaked-password protection (Blocked, Free plan).** Supabase's HaveIBeenPwned check is a Pro-plan feature ($25/mo). The project is on Free and is not upgrading for launch, so this cannot be completed under current constraints and no longer gates launch. The security gap is real but invisible to users; it is tracked under **Known Limitations** below with a clear unblock path (upgrade to Pro, then flip one Auth toggle — no code change).

### PHASE 2 — Retention Improvements
*Only items that materially increase daily/weekly return.*
1. **Onboarding (Missing)** — intention-setting + a first in-session win.
2. **Daily reminders** — make the (Phase-1-removed) notification preferences drive an actual return trigger.
3. **Streak mercy model** — soften the all-or-nothing reset to reduce churn after a slip.
4. **Tree growth/wilt states (Partial→reactive)** — make the tree visibly change with consistency.
5. **Challenge progress auto-advance (Partial→Complete)** — give challenges a real weekly arc.
6. **Coin sink (Missing)** — give earned coins a purpose so the daily reward means something.

### PHASE 3 — Differentiation Improvements
*Only items that make DeedTracker meaningfully different from a generic habit tracker.*
1. **Tree as the emotional/visual center** — elevate the one unique asset from a widget to the core.
2. **Accountability circles / partners (Missing)** — private social obligation solo trackers lack.
3. **Prayer-time anchors** — an Islamic-native daily rhythm no generic tracker has.
4. **Reflection (muhasabah) + intention (niyyah) rituals** — depth beyond checkboxes.
5. **Rework the leaderboard toward private/anonymous** — values-aligned (riyā') differentiation.

---

## Known Limitations (accepted, not launch blockers)

- **Leaked-password protection — Blocked (Free plan).** Supabase Auth's breached-password check (HaveIBeenPwned k-anonymity lookup at signup/reset/update) requires the **Pro plan ($25/mo)**; the project is on Free and is not upgrading for launch. Result: weak or previously-breached passwords are accepted. This is a backend gap invisible to users and cannot be fixed without upgrading. **Unblock path:** upgrade to Pro → Authentication → Password settings → enable "Leaked password protection" (config-only, no code change). Verified disabled in the security advisor on `dhwxxcvolwdzkzggjzup` (`auth_leaked_password_protection`, WARN).

---

**Bottom line:** the app is a **secure, live, functional MVP**. The only things standing between today and *launch-ready* are the **Phase 1** items — all of which are removals/hides/config, not new features. Phases 2 and 3 are post-launch. This is the shortest realistic path.
