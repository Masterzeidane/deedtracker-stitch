'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { AchievementBadge } from '@/components/achievements/AchievementBadge'
import type { Achievement } from '@/types'

interface AchievementsViewProps {
  achievements: Achievement[]
}

export function AchievementsView({ achievements }: AchievementsViewProps) {
  const [filter, setFilter] = useState<'all' | 'earned' | 'locked'>('all')

  const earned = achievements.filter(a => a.earned)
  const filtered = filter === 'all' ? achievements : filter === 'earned' ? earned : achievements.filter(a => !a.earned)
  const total = achievements.length || 1

  return (
    <div className="space-y-6">
      <Navbar title="Achievements" />

      {/* Progress summary */}
      <div
        className="p-5 rounded-xl"
        style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#dae2fd]" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
            Progress
          </h3>
          <span className="text-sm font-bold text-[#4edea3]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
            {earned.length}/{achievements.length}
          </span>
        </div>
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #4edea3, #10b981)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(earned.length / total) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-[#86948a] mt-2">{achievements.length - earned.length} achievements remaining</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['all', 'earned', 'locked'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
            style={
              filter === f
                ? { background: '#4edea3', color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }
                : { color: '#bbcabf', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
        {filtered.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
          >
            <AchievementBadge achievement={ach} size="md" />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-[#86948a] text-sm">No achievements to show.</div>
        )}
      </div>
    </div>
  )
}
