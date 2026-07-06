export type Branch = 'worship' | 'knowledge' | 'discipline' | 'character' | 'charity'

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'legendary'

export type Rank =
  | 'Seeker'
  | 'Apprentice'
  | 'Devotee'
  | 'Adept'
  | 'Master'
  | 'Sage'
  | 'Elder'
  | 'Legend'
  | 'Legacy Maker'

export interface BranchData {
  level: number
  xp: number
  maxXp: number
  color: string
  completedDeeds: number
  totalDeeds: number
  description: string
  icon: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  xp: number
  level: number
  maxXp: number
  coins: number
  energy: { current: number; max: number }
  streak: number
  rank: Rank
  joinDate: string
  branches: Record<Branch, BranchData>
  achievements: string[]
  bio: string
  location: string
  preferences?: Record<string, unknown>
}

export interface Deed {
  id: string
  title: string
  description: string
  branch: Branch
  xpReward: number
  coinReward: number
  energyCost: number
  difficulty: Difficulty
  completed: boolean
  streak: number
  dueDate?: string
  estimatedMinutes: number
}

export interface Challenge {
  id: string
  title: string
  description: string
  branch: Branch
  participants: number
  goal: number
  current: number
  xpReward: number
  coinReward: number
  endDate: string
  joined: boolean
  rarity: Rarity
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
  rarity: Rarity
  branch?: Branch
  xpReward: number
}

export interface LeaderboardEntry {
  rank: number
  userId: string
  name: string
  avatar: string
  xp: number
  level: number
  streak: number
  userRank: Rank
  isCurrentUser: boolean
}

export interface Quest {
  id: string
  title: string
  description: string
  branch: Branch
  xpReward: number
  coinReward: number
  energyCost: number
  difficulty: Difficulty
  completed: boolean
  streak: number
}

export interface ActivityDay {
  day: string
  worship: number
  knowledge: number
  discipline: number
  character: number
  charity: number
  total: number
}

export interface CommunityPost {
  id: string
  userId: string
  userName: string
  userAvatar: string
  userRank: Rank
  deed: string
  branch: Branch
  xpEarned: number
  timestamp: string
  likes: number
  liked: boolean
}
