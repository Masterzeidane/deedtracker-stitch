import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Branch, Rank } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBranchColor(branch: Branch): string {
  const colors: Record<Branch, string> = {
    worship: '#4edea3',
    knowledge: '#60a5fa',
    discipline: '#ffb95f',
    character: '#c084fc',
    charity: '#ffb3af',
  }
  return colors[branch]
}

export function getBranchGlow(branch: Branch): string {
  const glows: Record<Branch, string> = {
    worship: 'rgba(78,222,163,0.3)',
    knowledge: 'rgba(96,165,250,0.3)',
    discipline: 'rgba(255,185,95,0.3)',
    character: 'rgba(192,132,252,0.3)',
    charity: 'rgba(255,179,175,0.3)',
  }
  return glows[branch]
}

export function getBranchLabel(branch: Branch): string {
  const labels: Record<Branch, string> = {
    worship: 'Worship',
    knowledge: 'Knowledge',
    discipline: 'Discipline',
    character: 'Character',
    charity: 'Charity',
  }
  return labels[branch]
}

export function getBranchBg(branch: Branch): string {
  const bgs: Record<Branch, string> = {
    worship: 'rgba(78,222,163,0.1)',
    knowledge: 'rgba(96,165,250,0.1)',
    discipline: 'rgba(255,185,95,0.1)',
    character: 'rgba(192,132,252,0.1)',
    charity: 'rgba(255,179,175,0.1)',
  }
  return bgs[branch]
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`
  return xp.toString()
}

export function formatCoins(coins: number): string {
  if (coins >= 1000) return `${(coins / 1000).toFixed(1)}K`
  return coins.toString()
}

export function getRankFromLevel(level: number): Rank {
  if (level >= 50) return 'Legacy Maker'
  if (level >= 40) return 'Legend'
  if (level >= 30) return 'Elder'
  if (level >= 25) return 'Sage'
  if (level >= 18) return 'Master'
  if (level >= 12) return 'Adept'
  if (level >= 7) return 'Devotee'
  if (level >= 3) return 'Apprentice'
  return 'Seeker'
}

export function getDifficultyColor(difficulty: string): string {
  const map: Record<string, string> = {
    easy: '#4edea3',
    medium: '#ffb95f',
    hard: '#fc7c78',
    legendary: '#c084fc',
  }
  return map[difficulty] ?? '#86948a'
}

export function getRarityColor(rarity: string): string {
  const map: Record<string, string> = {
    common: '#cd7f32',
    rare: '#c0c0c0',
    epic: '#ffd700',
    legendary: '#e5e4e2',
  }
  return map[rarity] ?? '#86948a'
}

export function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function countdown(endDate: string): string {
  const end = new Date(endDate)
  const now = new Date()
  const diff = end.getTime() - now.getTime()
  if (diff <= 0) return 'Ended'
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  if (days > 0) return `${days}d ${hours}h left`
  const mins = Math.floor((diff % 3600000) / 60000)
  return `${hours}h ${mins}m left`
}
