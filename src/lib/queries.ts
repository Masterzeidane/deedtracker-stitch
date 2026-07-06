/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server'
import type {
  Branch,
  BranchData,
  Difficulty,
  Rarity,
  Rank,
  User,
  Deed,
  Challenge,
  Achievement,
  LeaderboardEntry,
  ActivityDay,
  CommunityPost,
} from '@/types'
import { BRANCH_META } from '@/lib/branch-meta'

const BRANCH_ORDER: Branch[] = ['worship', 'knowledge', 'discipline', 'character', 'charity']

function xpForNextLevel(level: number): number {
  return 250 * level * level
}

function dicebear(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`
}

// Assemble a full Branch map (always all 5 branches) from branch_progress rows.
function mapBranches(rows: any[]): Record<Branch, BranchData> {
  const byBranch = new Map<string, any>((rows ?? []).map((r) => [r.branch, r]))
  const result = {} as Record<Branch, BranchData>
  for (const branch of BRANCH_ORDER) {
    const row = byBranch.get(branch)
    const meta = BRANCH_META[branch]
    const level = row?.level ?? 1
    const xp = row?.xp ?? 0
    result[branch] = {
      level,
      xp,
      maxXp: xpForNextLevel(level),
      color: meta.color,
      icon: meta.icon,
      description: meta.description,
      completedDeeds: row?.completed_deeds ?? 0,
      totalDeeds: meta.totalDeeds,
    }
  }
  return result
}

// ============================================================
// PROFILE (raw row — used by the dashboard layout / Sidebar)
// ============================================================
export async function getProfile() {
  const supabase = (await createClient()) as any
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data
}

// ============================================================
// BRANCH PROGRESS (merged with branch metadata)
// ============================================================
export async function getBranchProgress(): Promise<BranchData[]> {
  const supabase = (await createClient()) as any
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('branch_progress')
    .select('*')
    .eq('user_id', user.id)

  const map = mapBranches(data ?? [])
  return BRANCH_ORDER.map((b) => map[b])
}

// ============================================================
// CURRENT USER — full `User` shape (profile + branches + unlocks)
// ============================================================
export async function getCurrentUser(): Promise<User | null> {
  const supabase = (await createClient()) as any
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: profile }, { data: branchRows }, { data: unlocks }] = await Promise.all([
    supabase.from('profiles').select('*').eq('user_id', user.id).single(),
    supabase.from('branch_progress').select('*').eq('user_id', user.id),
    supabase.from('achievement_unlocks').select('achievement_id').eq('user_id', user.id),
  ])

  if (!profile) return null

  return {
    id: profile.user_id,
    name: profile.name,
    email: user.email ?? '',
    avatar: profile.avatar_url ?? dicebear(profile.name ?? 'Seeker'),
    xp: profile.xp,
    level: profile.level,
    maxXp: xpForNextLevel(profile.level),
    coins: profile.coins,
    energy: { current: profile.energy, max: profile.max_energy },
    streak: profile.streak,
    rank: profile.rank as Rank,
    joinDate: (profile.created_at ?? '').split('T')[0],
    branches: mapBranches(branchRows ?? []),
    achievements: (unlocks ?? []).map((u: any) => u.achievement_id as string),
    bio: profile.bio ?? '',
    location: profile.location ?? '',
    preferences: profile.preferences ?? {},
  }
}

// ============================================================
// DEEDS — today's deeds with completion status (typed `Deed[]`)
// ============================================================
export async function getDailyDeeds(): Promise<Deed[]> {
  const supabase = (await createClient()) as any
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const today = new Date().toISOString().split('T')[0]

  const [{ data: deeds }, { data: completions }] = await Promise.all([
    supabase.from('deeds').select('*').eq('is_active', true).order('branch'),
    supabase
      .from('deed_completions')
      .select('deed_id')
      .eq('user_id', user.id)
      .gte('completed_at', `${today}T00:00:00`)
      .lt('completed_at', `${today}T23:59:59`),
  ])

  const completedIds = new Set((completions ?? []).map((c: any) => c.deed_id))

  return (deeds ?? []).map(
    (d: any): Deed => ({
      id: d.id,
      title: d.title,
      description: d.description,
      branch: d.branch as Branch,
      xpReward: d.xp_reward,
      coinReward: d.coin_reward,
      energyCost: d.energy_cost,
      difficulty: d.difficulty as Difficulty,
      estimatedMinutes: d.estimated_minutes,
      completed: completedIds.has(d.id),
      streak: 0,
    })
  )
}

// ============================================================
// CHALLENGES + participation (typed `Challenge[]`)
// ============================================================
export async function getChallenges(): Promise<Challenge[]> {
  const supabase = (await createClient()) as any
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const [{ data: challenges }, { data: participation }] = await Promise.all([
    supabase.from('challenges').select('*').eq('is_active', true).order('end_date'),
    supabase.from('challenge_participants').select('*').eq('user_id', user.id),
  ])

  const participationMap = new Map((participation ?? []).map((p: any) => [p.challenge_id, p]))

  return (challenges ?? []).map(
    (c: any): Challenge => ({
      id: c.id,
      title: c.title,
      description: c.description,
      branch: c.branch as Branch,
      participants: c.participant_count,
      goal: c.goal,
      current: (participationMap.get(c.id) as any)?.current_progress ?? 0,
      xpReward: c.xp_reward,
      coinReward: c.coin_reward,
      endDate: c.end_date,
      joined: participationMap.has(c.id),
      rarity: c.rarity as Rarity,
    })
  )
}

// ============================================================
// ACHIEVEMENTS + unlock status (typed `Achievement[]`)
// ============================================================
export async function getAchievements(): Promise<Achievement[]> {
  const supabase = (await createClient()) as any
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const [{ data: achievements }, { data: unlocks }] = await Promise.all([
    supabase.from('achievements').select('*').order('rarity'),
    supabase.from('achievement_unlocks').select('*').eq('user_id', user.id),
  ])

  const unlockedMap = new Map((unlocks ?? []).map((u: any) => [u.achievement_id, u]))

  return (achievements ?? []).map(
    (a: any): Achievement => ({
      id: a.id,
      title: a.title,
      description: a.description,
      icon: a.icon,
      earned: unlockedMap.has(a.id),
      earnedDate: (unlockedMap.get(a.id) as any)?.earned_at,
      rarity: a.rarity as Rarity,
      branch: (a.branch ?? undefined) as Branch | undefined,
      xpReward: a.xp_reward,
    })
  )
}

// ============================================================
// LEADERBOARD (typed `LeaderboardEntry[]`)
// ============================================================
export async function getLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const supabase = (await createClient()) as any
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data } = await supabase.from('leaderboard').select('*').limit(limit)

  return (data ?? []).map(
    (e: any): LeaderboardEntry => ({
      rank: e.rank,
      userId: e.user_id,
      name: e.name,
      avatar: e.avatar_url ?? dicebear(e.name ?? 'Seeker'),
      xp: e.xp,
      level: e.level,
      streak: e.streak,
      userRank: e.user_rank as Rank,
      isCurrentUser: e.user_id === user?.id,
    })
  )
}

// ============================================================
// COMMUNITY FEED (typed `CommunityPost[]`)
// NOTE: likes are not modelled in the schema yet — defaulted.
// ============================================================
export async function getFeed(limit = 20): Promise<CommunityPost[]> {
  const supabase = (await createClient()) as any
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data } = await supabase
    .from('feed_events')
    .select(`*, profiles!inner(name, avatar_url, rank), post_likes(count)`)
    .order('created_at', { ascending: false })
    .limit(limit)

  let likedSet = new Set<string>()
  if (user) {
    const { data: myLikes } = await supabase
      .from('post_likes')
      .select('feed_event_id')
      .eq('user_id', user.id)
    likedSet = new Set((myLikes ?? []).map((l: any) => l.feed_event_id as string))
  }

  return (data ?? []).map(
    (f: any): CommunityPost => ({
      id: f.id,
      userId: f.user_id,
      userName: f.profiles?.name ?? 'Seeker',
      userAvatar: f.profiles?.avatar_url ?? dicebear(f.profiles?.name ?? 'Seeker'),
      userRank: (f.profiles?.rank ?? 'Seeker') as Rank,
      deed: f.deed_title ?? f.achievement_title ?? 'an activity',
      branch: (f.branch ?? 'worship') as Branch,
      xpEarned: f.xp_earned ?? 0,
      timestamp: f.created_at,
      likes: f.post_likes?.[0]?.count ?? 0,
      liked: likedSet.has(f.id),
    })
  )
}

// ============================================================
// WEEKLY ACTIVITY — pivoted to wide `ActivityDay[]` (last 7 days)
// ============================================================
export async function getWeeklyActivity(): Promise<ActivityDay[]> {
  const supabase = (await createClient()) as any
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase.from('weekly_activity').select('*').eq('user_id', user.id)

  const rows = data ?? []
  const days: ActivityDay[] = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().split('T')[0]
    const entry: ActivityDay = {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      worship: 0,
      knowledge: 0,
      discipline: 0,
      character: 0,
      charity: 0,
      total: 0,
    }
    for (const r of rows) {
      const rKey = new Date(r.day).toISOString().split('T')[0]
      if (rKey === key && r.branch in entry) {
        const count = Number(r.deed_count) || 0
        ;(entry as any)[r.branch] += count
        entry.total += count
      }
    }
    days.push(entry)
  }

  return days
}
