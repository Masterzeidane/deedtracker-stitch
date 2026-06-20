'use client'
import { motion } from 'framer-motion'

interface XPBarProps {
  currentXP?: number
  maxXP?: number
  current?: number
  max?: number
  level: number
  showLabel?: boolean
  color?: string
}

export function XPBar({ currentXP, maxXP, current, max, level, showLabel = true, color = '#4edea3' }: XPBarProps) {
  const xpCurrent = current ?? currentXP ?? 0
  const xpMax = max ?? maxXP ?? 1
  const percent = Math.min((xpCurrent / xpMax) * 100, 100)

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                color: '#0b1326',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              LVL {level}
            </span>
          </div>
          <span
            className="text-xs text-[#bbcabf]"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {xpCurrent.toLocaleString()} / {xpMax.toLocaleString()} XP
          </span>
        </div>
      )}

      <div className="relative h-3 rounded-full bg-white/10 overflow-hidden">
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            className="absolute top-0 bottom-0 w-px bg-white/20 z-10"
            style={{ left: `${mark}%` }}
          />
        ))}
        <motion.div
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 12px 2px ${color}55`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}
