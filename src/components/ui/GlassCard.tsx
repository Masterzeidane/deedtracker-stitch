'use client'
import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'dim'
  hover?: boolean
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-300',
          variant === 'default' && 'bg-white/5 backdrop-blur-xl border border-white/10',
          variant === 'elevated' && 'bg-[#222a3d]/90 backdrop-blur-2xl border border-white/12',
          variant === 'dim' && 'bg-[#131b2e]/80 backdrop-blur-lg border border-white/8',
          hover && 'hover:border-white/20 hover:bg-white/8 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
GlassCard.displayName = 'GlassCard'
export { GlassCard }
