'use client'
import { motion } from 'framer-motion'
import { Users, Star, Coins, Clock } from 'lucide-react'
import type { Challenge } from '@/types'
import { getBranchColor, getBranchLabel, countdown, getRarityColor } from '@/lib/utils'

interface ChallengeCardProps {
  challenge: Challenge
  onJoin?: (id: string) => void
}

export function ChallengeCard({ challenge, onJoin }: ChallengeCardProps) {
  const branchColor = getBranchColor(challenge.branch)
  const percent = Math.min((challenge.current / challenge.goal) * 100, 100)
  const rarityColor = getRarityColor(challenge.rarity)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="relative rounded-xl overflow-hidden group"
      style={{
        background: 'rgba(23, 31, 51, 0.85)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Branch color left tab */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ background: `linear-gradient(180deg, ${branchColor}, ${branchColor}55)` }}
      />

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 30px ${branchColor}0c` }}
      />

      <div className="pl-5 pr-4 py-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ color: branchColor, background: `${branchColor}18`, border: `1px solid ${branchColor}30` }}
              >
                {getBranchLabel(challenge.branch)}
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full capitalize"
                style={{ color: rarityColor, background: `${rarityColor}18` }}
              >
                {challenge.rarity}
              </span>
            </div>
            <h3
              className="text-sm font-semibold text-[#dae2fd] mb-1"
              style={{ fontFamily: 'var(--font-sora), sans-serif' }}
            >
              {challenge.title}
            </h3>
            <p className="text-xs text-[#86948a] line-clamp-2">{challenge.description}</p>
          </div>
        </div>

        {/* Progress bar */}
        {challenge.joined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1.5" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
              <span className="text-[#bbcabf]">Progress</span>
              <span style={{ color: branchColor }}>{challenge.current}/{challenge.goal}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${branchColor}80, ${branchColor})` }}
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-[#bbcabf]">
              <Users size={10} />
              <span style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>{challenge.participants.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#4edea3', fontFamily: 'var(--font-jetbrains), monospace' }}>
              <Star size={10} />
              {challenge.xpReward.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs" style={{ color: '#ffb95f', fontFamily: 'var(--font-jetbrains), monospace' }}>
              <Coins size={10} />
              {challenge.coinReward}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] text-[#86948a]">
              <Clock size={9} />
              {countdown(challenge.endDate)}
            </div>
            <button
              onClick={() => onJoin?.(challenge.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={
                challenge.joined
                  ? { color: '#86948a', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
                  : { color: '#003824', background: branchColor, border: `1px solid ${branchColor}` }
              }
            >
              {challenge.joined ? 'Joined' : 'Join'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
