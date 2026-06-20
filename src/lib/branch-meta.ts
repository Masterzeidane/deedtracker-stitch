import type { Branch } from '@/types'

export const BRANCH_META: Record<Branch, { color: string; icon: string; description: string; totalDeeds: number }> = {
  worship:    { color: '#4edea3', icon: '🌿', description: 'Vitality and growth through daily devotion', totalDeeds: 9 },
  knowledge:  { color: '#60a5fa', icon: '📘', description: 'Clarity and depth through learning', totalDeeds: 5 },
  discipline: { color: '#ffb95f', icon: '🔥', description: 'Heat, refinement, and fire through practice', totalDeeds: 6 },
  character:  { color: '#c084fc', icon: '💜', description: 'Nobility and internal strength', totalDeeds: 4 },
  charity:    { color: '#ffb3af', icon: '🌸', description: 'Compassion and heart-centered action', totalDeeds: 5 },
}
