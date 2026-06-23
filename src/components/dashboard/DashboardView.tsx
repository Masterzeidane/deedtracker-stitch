'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Flame, Star, Coins, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { StatCard } from '@/components/ui/StatCard'
import { XPBar } from '@/components/ui/XPBar'
import { DeedCard } from '@/components/deeds/DeedCard'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'
import { AchievementBadge } from '@/components/achievements/AchievementBadge'
import { ActivityChart } from '@/components/dashboard/ActivityChart'
import { BranchProgress } from '@/components/dashboard/BranchProgress'
import { completeDeed } from '@/lib/actions'
import type { User, Deed, Challenge, Achievement, ActivityDay } from '@/types'
import { formatXP, formatCoins } from '@/lib/utils'

interface DashboardViewProps {
  user: User
  deeds: Deed[]
  challenges: Challenge[]
  achievements: Achievement[]
  activity: ActivityDay[]
}

export function DashboardView({ user, deeds, challenges, achievements, activity }: DashboardViewProps) {
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const todayDeeds = deeds.slice(0, 5)
  const activeChalls = challenges.filter(c => c.joined).slice(0, 2)
  const recentAchs = achievements.filter(a => a.earned).slice(0, 3)

  function handleComplete(id: string) {
    setError('')
    setPendingId(id)
    startTransition(async () => {
      const result = await completeDeed(id)
      setPendingId(null)
      if (result?.error) setError(result.error)
      else router.refresh()
    })
  }

  return (
    <div className="space-y-6">
      <Navbar title="Dashboard" />

      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl"
        style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div>
          <h2
            className="text-2xl font-bold text-[#dae2fd] mb-1"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            As-salamu alaykum, {user.name.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-[#bbcabf]">
            You have a <span className="text-[#ffb95f] font-semibold">{user.streak}-day streak</span>. Keep it going!
          </p>
        </div>
        <div className="flex-shrink-0 w-full sm:w-64">
          <XPBar current={user.xp} max={user.maxXp} level={user.level} />
        </div>
      </motion.div>

      {error && (
        <div className="px-3 py-2 rounded-lg text-sm text-[#ffb3af]" style={{ background: 'rgba(252,124,120,0.1)', border: '1px solid rgba(252,124,120,0.2)' }}>
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Star size={20} />} label="Total XP" value={formatXP(user.xp)} color="#4edea3" />
        <StatCard icon={<Coins size={20} />} label="Coins" value={formatCoins(user.coins)} color="#ffb95f" />
        <StatCard icon={<Zap size={20} />} label="Energy" value={`${user.energy.current}/${user.energy.max}`} color="#60a5fa" />
        <StatCard icon={<Flame size={20} />} label="Streak" value={`${user.streak} days`} color="#ffb95f" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityChart data={activity} />
        <BranchProgress branches={user.branches} />
      </div>

      {/* Today's Deeds + Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-sm font-semibold text-[#dae2fd]"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Today&apos;s Deeds
            </h3>
            <a href="/quests" className="text-xs text-[#4edea3] hover:underline">View all</a>
          </div>
          <div className="space-y-2">
            {todayDeeds.map(deed => (
              <DeedCard
                key={deed.id}
                deed={deed}
                onComplete={handleComplete}
                disabled={isPending && pendingId === deed.id}
              />
            ))}
            {todayDeeds.length === 0 && (
              <div className="text-center py-8 text-[#86948a] text-sm">No deeds available.</div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3
              className="text-sm font-semibold text-[#dae2fd]"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Active Challenges
            </h3>
            <a href="/challenges" className="text-xs text-[#4edea3] hover:underline">View all</a>
          </div>
          <div className="space-y-2">
            {activeChalls.map(ch => <ChallengeCard key={ch.id} challenge={ch} />)}
            {activeChalls.length === 0 && (
              <div className="text-center py-8 text-[#86948a] text-sm">No active challenges.</div>
            )}
          </div>

          {/* Recent Achievements */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3
                className="text-sm font-semibold text-[#dae2fd]"
                style={{ fontFamily: 'var(--font-sora), sans-serif' }}
              >
                Recent Achievements
              </h3>
              <a href="/achievements" className="text-xs text-[#4edea3] hover:underline">View all</a>
            </div>
            <div className="flex gap-4">
              {recentAchs.map(a => <AchievementBadge key={a.id} achievement={a} size="sm" />)}
              {recentAchs.length === 0 && (
                <div className="text-[#86948a] text-sm">No achievements yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
