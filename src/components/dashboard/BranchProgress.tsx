'use client'
import { motion } from 'framer-motion'
import type { Branch, BranchData } from '@/types'
import { getBranchLabel } from '@/lib/utils'

const BRANCH_ORDER: Branch[] = ['worship', 'knowledge', 'discipline', 'character', 'charity']

interface BranchProgressProps {
  branches: Record<Branch, BranchData>
}

export function BranchProgress({ branches }: BranchProgressProps) {

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: 'rgba(23, 31, 51, 0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <h3
        className="text-sm font-semibold text-[#dae2fd] mb-4"
        style={{ fontFamily: 'var(--font-sora), sans-serif' }}
      >
        Branch Progress
      </h3>
      <div className="space-y-4">
        {BRANCH_ORDER.map((branch, i) => {
          const data = branches[branch]
          const percent = Math.min((data.xp / data.maxXp) * 100, 100)
          return (
            <div key={branch}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{data.icon}</span>
                  <span
                    className="text-xs font-medium text-[#dae2fd]"
                    style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                  >
                    {getBranchLabel(branch)}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full"
                    style={{
                      color: data.color,
                      background: `${data.color}15`,
                      fontFamily: 'var(--font-jetbrains), monospace',
                    }}
                  >
                    Lv.{data.level}
                  </span>
                </div>
                <span
                  className="text-[10px] text-[#86948a]"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {data.xp.toLocaleString()}/{data.maxXp.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${data.color}88, ${data.color})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, ease: 'easeOut', delay: i * 0.1 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
