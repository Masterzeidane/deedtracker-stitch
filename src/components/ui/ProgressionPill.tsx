'use client'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ProgressionPillProps {
  icon: ReactNode
  value: string | number
  label: string
  color?: string
  shimmer?: boolean
  className?: string
}

export function ProgressionPill({
  icon,
  value,
  label,
  color = '#4edea3',
  shimmer = false,
  className,
}: ProgressionPillProps) {
  return (
    <div
      className={cn(
        'relative flex items-center gap-2 px-3 py-1.5 rounded-full overflow-hidden',
        'bg-white/5 border border-white/10 backdrop-blur-md',
        'transition-all duration-200 hover:border-white/20',
        className
      )}
    >
      {/* Shimmer overlay */}
      {shimmer && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite linear',
          }}
        />
      )}

      <span style={{ color }}>{icon}</span>

      <div className="flex flex-col leading-none">
        <span
          className="text-sm font-semibold text-[#dae2fd]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        <span className="text-[10px] text-[#bbcabf] mt-0.5">{label}</span>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
