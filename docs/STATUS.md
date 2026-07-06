# DeedTracker — Definitive Status Report (Source of Truth)

**As of:** production commit `837865e` on `main` · live at https://deedtracker-stitch.vercel.app · Supabase `dhwxxcvolwdzkzggjzup` (migrations `001`–`009`). Reflects the current deployed state, not earlier ones.

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
| Transactional email delivery | Partial | code correct, but production SMTP/redirect-allowlist not confirmed on Supabase Auth | Confirm/reset emails may not arrive | Critical |

### Core loop / deeds
| Feature | Status | Why | User impact | Priority |
|---|---|---|---|---|
| Daily deed list (`getDailyDeeds`) | Complete | live, 29 seeded deeds | Sees today's deeds | Critical |
| Deed completion (XP/coins/streak/branch/achievement/feed) | Complete | `complete_deed` RPC, live-verified | Core action works | Critical |
| Quests filter tabs | Complete | client filter | Usable | Low |
| Energy meter (stat card + gauge) | Fake | mechanic neutralized in `009`; always 100/100, drives nothing | Shows a meaningless meter | High |
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
| Challenges — progress tracking | Partial | `current_progress` never auto-advances; "Completed" unreachable | Join implies tracking that never happens | High |
| Landing / Pricing | Complete | static marketing | Fine | Low |

### Settings & chrome
| Feature | Status | Why | User impact | Priority |
|---|---|---|---|---|
| Notification toggles | Fake | persist to `preferences` but no notification system exists | Promises alerts that never come | High |
| Privacy toggles | Fake | persist but no effect; contradicted by world-readable RLS | Misrepresents privacy — trust risk | Critical |
| Delete account | Missing | button removed; no flow | No data-deletion path | Medium |
| Navbar search box | Fake | non-functional input on every screen | Looks broken | High |
| Navbar notification badge "3" | Fake | hardcoded number | Looks fake | Medium |

### Security & data integrity
| Feature | Status | Why | User impact | Priority |
|---|---|---|---|---|
| XP/coin/streak/leaderboard tamper protection | Complete | column grants + RLS, live-verified (42501 blocked) | Cheating blocked | Critical |
| RPC impersonation guard (SEC-61) | Complete | `Forbidden` guard, verified | No cross-user writes | Critical |
| Leaked-password protection | Missing | Supabase Auth toggle disabled | Weak passwords allowed | Medium |

---

## The Roadmap (shortest realistic path to launch)

### PHASE 1 — Must Fix Before Launch
*Only what makes the product look broken, misleading, or untrustworthy. Clearing these = launch-ready.*
1. **Privacy toggles (Fake)** — remove or make real; they falsely imply privacy the RLS doesn't enforce. *Trust/legal risk.*
2. **Transactional email delivery (Partial)** — configure Supabase Auth SMTP + redirect allow-list so confirm/reset emails actually send. *Otherwise auth is effectively broken.*
3. **Navbar search box (Fake)** — remove; non-functional control on every screen.
4. **Energy meter (Fake)** — remove/hide; it displays a dead mechanic.
5. **Challenge progress (Partial)** — hide the progress bar/Completed tab (or wire it); joining currently implies tracking that never happens.
6. **Notification toggles (Fake)** — hide until notifications exist; they promise alerts that never arrive.
7. **Navbar notification badge "3" (Fake)** — remove the hardcoded count.
8. **Delete-account (Missing)** — provide a data-deletion path (trust/compliance).
9. **Leaked-password protection (Missing)** — enable the Supabase Auth setting.

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

**Bottom line:** the app is a **secure, live, functional MVP**. The only things standing between today and *launch-ready* are the **Phase 1** items — all of which are removals/hides/config, not new features. Phases 2 and 3 are post-launch. This is the shortest realistic path.
