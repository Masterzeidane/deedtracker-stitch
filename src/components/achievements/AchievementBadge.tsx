'use client'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import type { Achievement } from '@/types'
import { getRarityColor, getBranchColor } from '@/lib/utils'

interface AchievementBadgeProps {
  achievement: Achievement
  size?: 'sm' | 'md' | 'lg'
}

const rarityGradients = {
  common: 'linear-gradient(135deg, #8B6914, #cd7f32, #8B6914)',
  rare: 'linear-gradient(135deg, #708090, #c0c0c0, #708090)',
  epic: 'linear-gradient(135deg, #B8860B, #ffd700, #B8860B)',
  legendary: 'linear-gradient(135deg, #9EA0A3, #e5e4e2, #9EA0A3)',
}

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const rarityColor = getRarityColor(achievement.rarity)
  const branchColor = achievement.branch ? getBranchColor(achievement.branch) : undefined
  const gradient = rarityGradients[achievement.rarity]

  const sizes = {
    sm: { outer: 'w-16 h-16', icon: 'text-2xl', font: 'text-[10px]' },
    md: { outer: 'w-24 h-24', icon: 'text-4xl', font: 'text-xs' },
    lg: { outer: 'w-32 h-32', icon: 'text-5xl', font: 'text-sm' },
  }
  const s = sizes[size]

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative flex flex-col items-center gap-2 cursor-default`}
    >
      {/* Badge shape */}
      <div
        className={`relative ${s.outer} flex items-center justify-center`}
        style={{
          background: achievement.earned
            ? `radial-gradient(circle at center, ${branchColor ? branchColor + '20' : 'rgba(78,222,163,0.15)'}, transparent)`
            : 'rgba(255,255,255,0.03)',
        }}
      >
        {/* Hexagon-style badge border */}
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: achievement.earned ? gradient : 'linear-gradient(135deg, #3c4a42, #2d3449)',
            padding: '2px',
          }}
        >
          <div
            className="w-full h-full rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: achievement.earned ? '#131b2e' : '#0b1326',
            }}
          >
            {/* Branch color overlay */}
            {achievement.earned && branchColor && (
              <div
                className="absolute inset-0 opacity-10"
                style={{ background: `radial-gradient(circle, ${branchColor}, transparent)` }}
              />
            )}

            {achievement.earned ? (
              <span className={s.icon}>{achievement.icon}</span>
            ) : (
              <div className="flex flex-col items-center gap-1 opacity-30">
                <span className={s.icon}>{achievement.icon}</span>
                <Lock size={14} className="text-[#86948a]" />
              </div>
            )}
          </div>
        </div>

        {/* Glow for earned legendary/epic */}
        {achievement.earned && (achievement.rarity === 'legendary' || achievement.rarity === 'epic') && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ boxShadow: `0 0 20px ${rarityColor}40` }}
          />
        )}
      </div>

      {/* Title */}
      <div className="text-center">
        <p
          className={`${s.font} font-semibold text-[#dae2fd] leading-tight`}
          style={{ fontFamily: 'var(--font-sora), sans-serif' }}
        >
          {achievement.title}
        </p>
        {size !== 'sm' && (
          <p
            className="text-[10px] text-[#86948a] mt-0.5 capitalize"
            style={{ color: rarityColor }}
          >
            {achievement.rarity}
          </p>
        )}
      </div>
    </motion.div>
  )
}
