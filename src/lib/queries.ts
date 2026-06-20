/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import type { Branch } from '@/types'
import { BRANCH_META } from '@/lib/branch-meta'

function xpForNextLevel(level: number): number {
  return 250 * level * level
}

// ============================================================
// PROFILE
// ============================================================
export async function getProfile() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}

// ============================================================
// BRANCH PROGRESS
// ============================================================
export async function getBranchProgress() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('branch_progress')
    .select('*')
    .eq('user_id', user.id)

  return (data ?? []).map((b: any) => ({
    ...b,
    ...BRANCH_META[b.branch as Branch],
    maxXp: xpForNextLevel(b.level),
  }))
}

// ============================================================
// DEEDS — today's deeds with completion status
// ============================================================
export async function getDailyDeeds() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const today = new Date().toISOString().split('T')[0]

  const [{ data: deeds }, { data: completions }] = await Promise.all([
    supabase.from('deeds').select('*').eq('is_active', true).order('branch'),
    supabase.from('deed_completions')
      .select('deed_id')
      .eq('user_id', user.id)
      .gte('completed_at', `${today}T00:00:00`)
      .lt('completed_at', `${today}T23:59:59`),
  ])

  const completedIds = new Set((completions ?? []).map((c: any) => c.deed_id))

  return (deeds ?? []).map((d: any) => ({ ...d, completed: completedIds.has(d.id) }))
}

// ============================================================
// CHALLENGES + participation
// ============================================================
export async function getChallenges() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const [{ data: challenges }, { data: participation }] = await Promise.all([
    supabase.from('challenges').select('*').eq('is_active', true).order('end_date'),
    supabase.from('challenge_participants').select('*').eq('user_id', user.id),
  ])

  const participationMap = new Map((participation ?? []).map((p: any) => [p.challenge_id, p]))

  return (challenges ?? []).map((c: any) => ({
    ...c,
    joined: participationMap.has(c.id),
    current: (participationMap.get(c.id) as any)?.current_progress ?? 0,
  }))
}

// ============================================================
// ACHIEVEMENTS + unlock status
// ============================================================
export async function getAchievements() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const [{ data: achievements }, { data: unlocks }] = await Promise.all([
    supabase.from('achievements').select('*').order('rarity'),
    supabase.from('achievement_unlocks').select('*').eq('user_id', user.id),
  ])

  const unlockedMap = new Map((unlocks ?? []).map((u: any) => [u.achievement_id, u]))

  return (achievements ?? []).map((a: any) => ({
    ...a,
    earned: unlockedMap.has(a.id),
    earnedDate: (unlockedMap.get(a.id) as any)?.earned_at,
  }))
}

// ============================================================
// LEADERBOARD
// ============================================================
export async function getLeaderboard(limit = 20) {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('leaderboard')
    .select('*')
    .limit(limit)

  return (data ?? []).map((e: any) => ({
    ...e,
    isCurrentUser: e.user_id === user?.id,
    avatar: e.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${e.name}`,
  }))
}

// ============================================================
// COMMUNITY FEED
// ============================================================
export async function getFeed(limit = 20) {
  const supabase = await createClient() as any

  const { data } = await supabase
    .from('feed_events')
    .select(`*, profiles!inner(name, avatar_url, rank)`)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data ?? []
}

// ============================================================
// WEEKLY ACTIVITY (for chart)
// ============================================================
export async function getWeeklyActivity() {
  const supabase = await createClient() as any
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('weekly_activity')
    .select('*')
    .eq('user_id', user.id)

  return data ?? []
}
