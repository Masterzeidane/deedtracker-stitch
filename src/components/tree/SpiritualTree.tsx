'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { TreeNode } from './TreeNode'
import type { Branch, User } from '@/types'

interface SpiritualTreeProps {
  user: User
}

const BRANCH_POSITIONS: Record<Branch, { x: number; y: number }> = {
  worship:    { x: 300, y: 80 },
  knowledge:  { x: 130, y: 190 },
  discipline: { x: 470, y: 190 },
  character:  { x: 160, y: 360 },
  charity:    { x: 440, y: 360 },
}

const CENTER = { x: 300, y: 270 }

export function SpiritualTree({ user }: SpiritualTreeProps) {
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null)

  const branches = Object.entries(user.branches) as [Branch, typeof user.branches[Branch]][]

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 600 480" className="w-full max-w-2xl mx-auto" style={{ overflow: 'visible' }}>
        {/* Connecting lines from center to each branch */}
        {branches.map(([branch]) => {
          const pos = BRANCH_POSITIONS[branch]
          const color = user.branches[branch].completedDeeds > 0 ? user.branches[branch].color : '#3c4a42'
          return (
            <motion.line
              key={branch}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={pos.x}
              y2={pos.y}
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="4 4"
              opacity={0.4}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          )
        })}

        {/* Central root node */}
        <motion.g
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <circle cx={CENTER.x} cy={CENTER.y} r={36} fill="rgba(78,222,163,0.08)" stroke="rgba(78,222,163,0.2)" strokeWidth={2} />
          <circle cx={CENTER.x} cy={CENTER.y} r={28} fill="#131b2e" stroke="rgba(78,222,163,0.4)" strokeWidth={1.5} />
          <text x={CENTER.x} y={CENTER.y + 8} textAnchor="middle" fontSize={24}>🌱</text>
          <text x={CENTER.x} y={CENTER.y + 55} textAnchor="middle" fontSize={12} fontWeight={700} fill="#4edea3" fontFamily="var(--font-sora), sans-serif">
            Spirit
          </text>
        </motion.g>

        {/* Branch nodes */}
        {branches.map(([branch, data]) => (
          <TreeNode
            key={branch}
            branch={branch}
            data={data}
            active={activeBranch === branch}
            onClick={() => setActiveBranch(activeBranch === branch ? null : branch)}
            x={BRANCH_POSITIONS[branch].x}
            y={BRANCH_POSITIONS[branch].y}
          />
        ))}
      </svg>

      {/* Selected branch details */}
      {activeBranch && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl"
          style={{
            background: `${user.branches[activeBranch].color}12`,
            border: `1px solid ${user.branches[activeBranch].color}30`,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{user.branches[activeBranch].icon}</span>
            <div>
              <h3 className="font-bold text-[#dae2fd]" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
                {activeBranch.charAt(0).toUpperCase() + activeBranch.slice(1)} Branch
              </h3>
              <p className="text-xs text-[#bbcabf]">{user.branches[activeBranch].description}</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-lg font-bold" style={{ color: user.branches[activeBranch].color, fontFamily: 'var(--font-sora), sans-serif' }}>
                Level {user.branches[activeBranch].level}
              </div>
              <div className="text-xs text-[#86948a]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
                {user.branches[activeBranch].xp.toLocaleString()} / {user.branches[activeBranch].maxXp.toLocaleString()} XP
              </div>
            </div>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(user.branches[activeBranch].xp / user.branches[activeBranch].maxXp) * 100}%`,
                background: user.branches[activeBranch].color,
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
