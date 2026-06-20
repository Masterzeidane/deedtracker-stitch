'use client'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  color?: string
  className?: string
}

export function StatCard({
  icon,
  label,
  value,
  change,
  changeLabel,
  color = '#4edea3',
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0

  return (
    <motion.div
      className={cn(
        'relative rounded-xl p-4 overflow-hidden',
        'bg-white/5 backdrop-blur-xl border border-white/10',
        'transition-all duration-300',
        className
      )}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 24px 4px ${color}22`,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Icon circle */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center mb-3"
        style={{ background: `${color}22`, border: `1px solid ${color}44` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>

      {/* Value */}
      <div
        className="text-2xl font-bold text-[#dae2fd] mb-0.5"
        style={{ fontFamily: "'Sora', sans-serif" }}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      {/* Label */}
      <div className="text-sm text-[#bbcabf] mb-2">{label}</div>

      {/* Change indicator */}
      {change !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-medium`}
          style={{ color: isPositive ? '#4edea3' : '#ffb3af' }}
        >
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {isPositive ? '+' : ''}{change}%
          </span>
          {changeLabel && (
            <span className="text-[#bbcabf] font-normal ml-1">{changeLabel}</span>
          )}
        </div>
      )}
    </motion.div>
  )
}
