'use client'
import { motion } from 'framer-motion'
import { Flame, Star, Coins, Zap, CheckCircle2, Circle } from 'lucide-react'
import type { Deed } from '@/types'
import { getBranchColor, getBranchLabel, getDifficultyColor } from '@/lib/utils'

interface DeedCardProps {
  deed: Deed
  onComplete?: (id: string) => void
  disabled?: boolean
}

export function DeedCard({ deed, onComplete, disabled }: DeedCardProps) {
  const branchColor = getBranchColor(deed.branch)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="relative rounded-xl overflow-hidden group transition-all duration-300"
      style={{
        background: 'rgba(23, 31, 51, 0.85)',
        border: `1px solid rgba(255,255,255,0.07)`,
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 30px ${branchColor}10` }}
      />

      {/* Branch color left tab */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: `linear-gradient(180deg, ${branchColor}, ${branchColor}66)` }}
      />

      <div className="pl-5 pr-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  color: branchColor,
                  background: `${branchColor}18`,
                  border: `1px solid ${branchColor}30`,
                  fontFamily: 'var(--font-sora), sans-serif',
                }}
              >
                {getBranchLabel(deed.branch)}
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  color: getDifficultyColor(deed.difficulty),
                  background: `${getDifficultyColor(deed.difficulty)}15`,
                  fontFamily: 'var(--font-jetbrains), monospace',
                }}
              >
                {deed.difficulty}
              </span>
              {deed.streak > 0 && (
                <span className="flex items-center gap-1 text-[10px] text-[#ffb95f]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
                  <Flame size={10} />
                  {deed.streak}d
                </span>
              )}
            </div>
            <h3
              className="text-sm font-semibold text-[#dae2fd] truncate"
              style={{
                fontFamily: 'var(--font-sora), sans-serif',
                textDecoration: deed.completed ? 'line-through' : 'none',
                opacity: deed.completed ? 0.5 : 1,
              }}
            >
              {deed.title}
            </h3>
            <p className="text-xs text-[#86948a] mt-0.5 line-clamp-1">{deed.description}</p>
          </div>

          {/* Complete button */}
          <button
            onClick={() => onComplete?.(deed.id)}
            disabled={disabled || deed.completed || !onComplete}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-50"
            style={{
              background: deed.completed ? `${branchColor}20` : 'transparent',
              border: `2px solid ${deed.completed ? branchColor : 'rgba(255,255,255,0.15)'}`,
            }}
          >
            {deed.completed
              ? <CheckCircle2 size={16} style={{ color: branchColor }} />
              : <Circle size={16} className="text-[#86948a]" />
            }
          </button>
        </div>

        {/* Footer row: rewards + energy */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 text-xs" style={{ color: '#4edea3', fontFamily: 'var(--font-jetbrains), monospace' }}>
            <Star size={10} />
            +{deed.xpReward} XP
          </div>
          <div className="flex items-center gap-1 text-xs" style={{ color: '#ffb95f', fontFamily: 'var(--font-jetbrains), monospace' }}>
            <Coins size={10} />
            +{deed.coinReward}
          </div>
          {deed.energyCost > 0 && (
            <div className="flex items-center gap-1 text-xs text-[#60a5fa]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
              <Zap size={10} />
              -{deed.energyCost}
            </div>
          )}
          <div className="ml-auto text-[10px] text-[#86948a]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
            ~{deed.estimatedMinutes}min
          </div>
        </div>
      </div>
    </motion.div>
  )
}
