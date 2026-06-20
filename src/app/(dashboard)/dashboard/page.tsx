'use client'
import { Flame, Star, Coins, Zap, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { StatCard } from '@/components/ui/StatCard'
import { XPBar } from '@/components/ui/XPBar'
import { DeedCard } from '@/components/deeds/DeedCard'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'
import { AchievementBadge } from '@/components/achievements/AchievementBadge'
import { ActivityChart } from '@/components/dashboard/ActivityChart'
import { BranchProgress } from '@/components/dashboard/BranchProgress'
import { currentUser, deeds, challenges, achievements } from '@/lib/data'
import { formatXP, formatCoins } from '@/lib/utils'

export default function DashboardPage() {
  const user = currentUser
  const todayDeeds = deeds.slice(0, 5)
  const activeChalls = challenges.filter(c => c.joined).slice(0, 2)
  const recentAchs = achievements.filter(a => a.earned).slice(0, 3)

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

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Star size={20} />} label="Total XP" value={formatXP(user.xp)} change={8} changeLabel="this week" color="#4edea3" />
        <StatCard icon={<Coins size={20} />} label="Coins" value={formatCoins(user.coins)} change={12} changeLabel="this week" color="#ffb95f" />
        <StatCard icon={<Zap size={20} />} label="Energy" value={`${user.energy.current}/${user.energy.max}`} color="#60a5fa" />
        <StatCard icon={<Flame size={20} />} label="Streak" value={`${user.streak} days`} change={3} changeLabel="vs last week" color="#ffb95f" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityChart />
        <BranchProgress />
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
            {todayDeeds.map(deed => <DeedCard key={deed.id} deed={deed} />)}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
