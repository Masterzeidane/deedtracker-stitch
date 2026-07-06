# DeedTracker — Product Vision & Roadmap

> Strategy document. No implementation details — this is the "why" and the "where to."
> Core value proposition: **helping Muslims stay consistent in worship and self-improvement.**

---

## 1. Core Identity

**DeedTracker is a living mirror of your spiritual consistency — the place a Muslim returns to each day to tend the state of their soul through steadfast worship.**

A companion and a mirror, **not** a tracker and **not** a game. Three words define it: **consistency (istiqamah), reflection (muhasabah), growth.** The tree is its soul; the daily loop is its heartbeat; **mercy** is its tone.

What makes it fundamentally different:
- **Habitica** — secular RPG-ification; DeedTracker is worship-first, the game never overrides the ibadah.
- **Duolingo** — borrow the daily-loop discipline; reject the guilt (replace shame with tawbah).
- **Forest** — its tree is a punishment timer; ours is a cumulative state of the soul that wilts but never dies.
- **Generic trackers** — checkboxes with no telos; ours has a why (closeness to Allah), an emotional center (tree), and Islamic framing.
- **Muslim Pro** — point-in-time utility; ours is a journey of consistency that can absorb prayer-time anchors and wrap them in growth + accountability.

Wedge: *others record what you did or hand you a utility; DeedTracker reflects who you are becoming and walks with you — mercifully — toward consistency.*

---

## 2. Islamic Mechanics

Mechanics must **embody** Islamic concepts, not skin generic gamification with Arabic words.

| Concept | Mechanic |
|---|---|
| **Niyyah** | The day begins by setting intention (also the missing daily open-trigger). |
| **Istiqamah** | Value = showing up daily, not volume. Small-and-consistent must beat big-and-sporadic. |
| **Tawbah** | Missing a day triggers mercy + invitation to return; returning is celebrated, never punished. |
| **Sadaqah Jariyah** | The meaning of coins: deeds/coins that keep giving (real charity; fruit for others). |
| **Ukhuwwah / Accountability** | Small private circles & 1:1 partners sharing commitment-kept, not scores. |
| **Ihsan** | Quality over quantity; presence/reflection prompts, not just checkboxes. |
| **Growth in worship** | Fard = roots/trunk (foundation); sunnah/nawafil = blossoms built on top. |

**Existing mechanics verdict:**
- **Energy system → REMOVE.** It gates worship behind a game meter (can refuse to log Tahajjud). No Islamic basis; contradicts the mission. *(Phase 1 neutralized the gate; full removal is a product decision.)*
- **Global XP leaderboard → REMOVE/REPLACE.** Public ranking of ibadah invites riyā'. Replace with private accountability; at most anonymous collective stats.
- **Streak resets → CHANGE.** Keep the motivation, remove all-or-nothing punishment. Add grace, roots-based resilience, and tawbah-return.

Also reconsider game-y naming ("XP", "Coins").

---

## 3. Tree System — Philosophy (psychology, not graphics)

The tree is **your soul made visible** — a mirror of your relationship with Allah, cultivated by consistent worship. Because it represents *you*, neglecting it feels like neglecting yourself. That is the entire engine.

- **Why care?** It's *theirs* and it's *them* (endowment + identity). It externalizes an invisible inner state.
- **Why return?** Living things need daily tending; its state reflects *recent* consistency and gently pulls you back. Pull = care and hope, never fear.
- **Reflect worship?** Fard = roots/trunk (stability, depth); sunnah/nawafil = leaves/blossoms/fruit; ihsan affects root depth.
- **Reflect consistency?** Responds to rhythm, not totals. Sustained consistency → deep roots → resilience (wilts slower when you slip).
- **React to neglect?** Wilts gently and gradually; **never dies.** Visible but merciful; mirrors that iman rises and falls.
- **React to recovery?** Revives readily and the return is celebrated — deep roots (past consistency) mean faster revival. History is never erased.

Guardrail: the tree trades in **care and hope**, never anxiety or guilt. Make it the home screen.

---

## 4. Onboarding (highest-leverage gap — currently absent)

Ideal flow (2–3 min, warm/merciful tone):
1. **Purpose in one line** — "This isn't a habit tracker. It's a companion to help you stay consistent with Allah."
2. **Be understood** — a few gentle questions (where in your journey / what's hardest). No judgment.
3. **Set your niyyah** — choose 1–3 meaningful intentions, not twenty.
4. **Commit** — a deliberate "I commit, with Allah's help" moment; pick a gentle horizon (e.g., 7 days).
5. **Plant your tree** — introduce it as the mirror of the soul; starts as a seed.
6. **First win in-session** — log one deed now → see the tree respond. Never end onboarding without a completed action + visible reaction.
7. **Wire the daily anchor** — set location + prayer method, opt into gentle prayer-time nudges (install the return trigger while motivation is highest).
8. **Set the return expectation** — "Come back tomorrow to tend your tree."

Non-negotiable steps: **commitment (4)** and **first win + tree reaction (6)**.

---

## 5. Retention (no addiction tactics)

Reject: guilt notifications, infinite feeds, FOMO, variable-reward loops, shame. Build on five intrinsic pillars:
- **Prayer-time anchors** — the five prayers are already the daily rhythm; anchoring gentle nudges to salah is the biggest retention unlock and native to Muslim life.
- **Accountability** — a circle that notices (gently, privately).
- **Reflection (muhasabah)** — a short daily/weekly self-accounting.
- **Progress** — tree + consistency score make growth visible over months.
- **Purpose** — continuously reconnect actions to the why.

- **Why return tomorrow?** Next prayer anchor; tree needs tending; today's niyyah unfulfilled; your circle.
- **Why next week?** Weekly muhasabah; visibly deeper roots; circle's weekly rhythm.
- **Why in a year?** It's bound to something that never expires (lifelong consistency); the tree is a multi-year record too meaningful to abandon. Year-1 job: be trusted, not exciting.

---

## 6. Community (Islamic-aligned)

| Mechanic | Verdict |
|---|---|
| Public leaderboards | **Remove** for worship (riyā' risk). Only safe form: anonymous collective ("the ummah logged X today"). |
| Private circles (3–10) | **Core.** Share commitments & encouragement, not scores. |
| 1:1 accountability partners | **Highest value.** Mutual, consensual, private. |
| Group challenges | **Good if cooperative**, not competitive. |

Riyā' risks: public display of individual worship, vanity badges, auto-broadcasting deeds (the current auto-feed model). Mitigations: private by default; share commitment/encouragement not amounts; anonymous/aggregate collective stats; framing around support, not being seen.

---

## 7. Roadmap

**Phase 1 — MVP Completion (make it coherent & honest).** *(Cleanup substantially done: energy no longer gates worship, likes/settings persistence fixed, auth routes completed, infra naming cleaned.)* Remaining: dashboard action-first; tree visibly reacts; streak → mercy model; decide coin placeholder. Impact: credibility.

**Phase 2 — Retention Foundations.** Onboarding (intention→commitment→first win→plant tree); prayer-time anchors + gentle reminders; daily niyyah + muhasabah; Tree Redesign as emotional center. Risks: reminder tone, prayer-time accuracy. Impact: the retention curve.

**Phase 3 — Community & Accountability.** 1:1 partners; small private circles; cooperative goals; remove public leaderboard/auto-feed; anonymous ummah stats. Risks: riyā', privacy, moderation. Impact: durable retention + organic invite growth.

**Phase 4 — Long-Term Growth & Meaning.** Sadaqah Jariyah coin sink (real charity); tasteful non-riyā' shareable moments; content depth (du'ā, reflections, Ramadan mode); long-horizon tree. Risk: never charge for access to worship — premium = convenience/cosmetics/charity-matching only. Impact: growth + lifelong stickiness + mission-aligned revenue.

Sequencing principle: each phase makes existing systems do more before adding new ones (consistency over complexity).

---

## 8. North Star

**Sustained Weekly Consistency** — the number of users who, week over week, keep their committed worship intentions (e.g., active on their core deeds ≥5 of 7 days), retained as a cohort over months. In-app reflection = a **consistency score**.

Why not the alternatives: DAU/WAU measure attendance, not benefit, and reward manipulative re-engagement; completed-deeds rewards volume over ihsan and is gameable; plain retention doesn't capture *what* is retained. Sustained Weekly Consistency is the only metric that **cannot be juiced without delivering the mission** — if it rises, more Muslims are more consistent in worship for longer.

The test for every decision: *does this increase the number of Muslims who stay consistent in worship over months and years?*
