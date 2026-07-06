-- ============================================================
-- DeedTracker — Community Likes backend
-- Migration: 007_post_likes.sql
--
-- Makes the existing (previously non-functional) feed "like" button real.
-- Not a new feature — wires up UI that already shipped.
-- ============================================================

create table public.post_likes (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  feed_event_id uuid not null references public.feed_events(id) on delete cascade,
  created_at    timestamptz not null default now(),
  unique (user_id, feed_event_id)
);

create index idx_post_likes_event on public.post_likes(feed_event_id);
create index idx_post_likes_user  on public.post_likes(user_id);

alter table public.post_likes enable row level security;

-- Counts are visible to any authenticated user (feed is authenticated-only)
create policy "Post likes viewable by authenticated"
  on public.post_likes for select
  using (auth.role() = 'authenticated');

-- Users may only like/unlike as themselves
create policy "Users can like"
  on public.post_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike"
  on public.post_likes for delete
  using (auth.uid() = user_id);
