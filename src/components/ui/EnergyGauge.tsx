'use client'
import { Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface EnergyGaugeProps {
  current: number
  max: number
  showLabel?: boolean
  compact?: boolean
}

export function EnergyGauge({ current, max, showLabel = true, compact = false }: EnergyGaugeProps) {
  const percent = Math.min((current / max) * 100, 100)
  const isLow = current / max < 0.2

  return (
    <div className={`w-full ${compact ? 'flex items-center gap-2' : ''}`}>
      {showLabel && (
        <div className={`flex items-center justify-between ${compact ? '' : 'mb-1.5'}`}>
          <div className="flex items-center gap-1.5">
            <Zap
              className={`${isLow ? 'animate-pulse text-[#ffb95f]' : 'text-[#60a5fa]'}`}
              size={compact ? 12 : 14}
            />
            {!compact && (
              <span className="text-xs text-[#bbcabf]">Energy</span>
            )}
          </div>
          <span
            className={`text-xs ${isLow ? 'text-[#ffb95f]' : 'text-[#dae2fd]'}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {current}/{max}
          </span>
        </div>
      )}

      <div
        className={`relative rounded-full bg-white/10 overflow-hidden ${compact ? 'flex-1' : 'w-full'}`}
        style={{ height: compact ? '6px' : '8px' }}
      >
        <motion.div
          className={`h-full rounded-full ${isLow ? 'animate-pulse' : ''}`}
          style={{
            background: isLow
              ? 'linear-gradient(90deg, #ffb95f, #f59e0b)'
              : 'linear-gradient(90deg, #60a5fa, #3b82f6)',
            boxShadow: isLow
              ? '0 0 8px 1px rgba(255,185,95,0.5)'
              : '0 0 8px 1px rgba(96,165,250,0.5)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}
