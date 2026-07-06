-- ============================================================
-- DeedTracker — Settings persistence
-- Migration: 008_profile_preferences.sql
--
-- Stores the notification/privacy toggles that were previously local-only
-- (non-persisted) React state. Adds a preferences JSON column and lets the
-- owner update it via the column-level grant established in 005.
-- ============================================================

alter table public.profiles
  add column if not exists preferences jsonb not null default '{}'::jsonb;

-- Extend the owner-writable column set (005 restricted profiles UPDATE to
-- name/bio/location/avatar_url) to include preferences.
grant update (name, bio, location, avatar_url, preferences)
  on public.profiles to authenticated;
