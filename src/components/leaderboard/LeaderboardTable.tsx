'use client'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import type { LeaderboardEntry } from '@/types'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
}

const rankMedals: Record<number, { bg: string; text: string; label: string }> = {
  1: { bg: 'rgba(255,215,0,0.15)', text: '#FFD700', label: '🥇' },
  2: { bg: 'rgba(192,192,192,0.15)', text: '#C0C0C0', label: '🥈' },
  3: { bg: 'rgba(205,127,50,0.15)', text: '#CD7F32', label: '🥉' },
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  return (
    <div className="space-y-2">
      {entries.map((entry, i) => {
        const medal = rankMedals[entry.rank]
        const isTop3 = entry.rank <= 3

        return (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
            style={{
              background: entry.isCurrentUser
                ? 'rgba(78,222,163,0.08)'
                : isTop3
                ? medal.bg
                : 'rgba(255,255,255,0.03)',
              border: entry.isCurrentUser
                ? '1px solid rgba(78,222,163,0.3)'
                : isTop3
                ? `1px solid ${medal.text}30`
                : '1px solid rgba(255,255,255,0.05)',
            }}
          >
            {/* Rank */}
            <div
              className="w-8 text-center font-bold text-sm flex-shrink-0"
              style={{
                fontFamily: 'var(--font-sora), sans-serif',
                color: isTop3 ? medal.text : '#86948a',
              }}
            >
              {isTop3 ? medal.label : `#${entry.rank}`}
            </div>

            {/* Avatar */}
            <img
              src={entry.avatar}
              alt={entry.name}
              className="w-9 h-9 rounded-full flex-shrink-0"
              style={{
                border: entry.isCurrentUser ? '2px solid #4edea3' : isTop3 ? `2px solid ${medal.text}` : '2px solid rgba(255,255,255,0.1)',
              }}
            />

            {/* Name & rank */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-sm font-semibold text-[#dae2fd] truncate"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  {entry.name}
                  {entry.isCurrentUser && <span className="text-[#4edea3] ml-1">(you)</span>}
                </span>
              </div>
              <div
                className="text-[10px] text-[#bbcabf] truncate"
                style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
              >
                {entry.userRank} · Lv.{entry.level}
              </div>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <div
                  className="text-sm font-bold"
                  style={{ color: '#4edea3', fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {entry.xp.toLocaleString()}
                </div>
                <div className="text-[10px] text-[#86948a]">XP</div>
              </div>
              <div className="flex items-center gap-1 text-xs" style={{ color: '#ffb95f', fontFamily: 'var(--font-jetbrains), monospace' }}>
                <Flame size={12} />
                {entry.streak}d
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
