'use client'
import { motion } from 'framer-motion'
import type { Branch, BranchData } from '@/types'
import { getBranchLabel } from '@/lib/utils'

interface TreeNodeProps {
  branch: Branch
  data: BranchData
  active?: boolean
  onClick?: () => void
  x: number
  y: number
}

export function TreeNode({ branch, data, active = false, onClick, x, y }: TreeNodeProps) {
  const isUnlocked = data.completedDeeds > 0
  const color = isUnlocked ? data.color : '#3c4a42'
  const percent = Math.min((data.xp / data.maxXp) * 100, 100)

  return (
    <motion.g
      style={{ cursor: 'pointer' }}
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.08 }}
    >
      {/* Glow circle (for active/unlocked) */}
      {isUnlocked && (
        <circle cx={x} cy={y} r={38} fill={`${data.color}08`} />
      )}

      {/* Progress ring */}
      <circle cx={x} cy={y} r={32} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
      <motion.circle
        cx={x}
        cy={y}
        r={32}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${2 * Math.PI * 32}`}
        initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
        animate={{ strokeDashoffset: 2 * Math.PI * 32 * (1 - percent / 100) }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        transform={`rotate(-90 ${x} ${y})`}
        style={{ filter: isUnlocked ? `drop-shadow(0 0 6px ${color})` : 'none' }}
      />

      {/* Main circle */}
      <circle
        cx={x}
        cy={y}
        r={26}
        fill={isUnlocked ? `${data.color}15` : '#131b2e'}
        stroke={active ? color : 'rgba(255,255,255,0.1)'}
        strokeWidth={active ? 2 : 1}
        style={{ filter: active ? `drop-shadow(0 0 12px ${color})` : 'none' }}
      />

      {/* Icon text */}
      <text
        x={x}
        y={y + 6}
        textAnchor="middle"
        fontSize={isUnlocked ? 20 : 16}
        style={{ filter: isUnlocked ? 'none' : 'grayscale(100%)' }}
      >
        {data.icon}
      </text>

      {/* Level badge */}
      <circle cx={x + 20} cy={y + 20} r={11} fill="#0b1326" stroke={color} strokeWidth={1.5} />
      <text
        x={x + 20}
        y={y + 24}
        textAnchor="middle"
        fontSize={9}
        fontWeight="bold"
        fill={color}
        fontFamily="var(--font-jetbrains), monospace"
      >
        {data.level}
      </text>

      {/* Branch name label */}
      <text
        x={x}
        y={y + 52}
        textAnchor="middle"
        fontSize={11}
        fontWeight={600}
        fill={isUnlocked ? '#dae2fd' : '#86948a'}
        fontFamily="var(--font-sora), sans-serif"
      >
        {getBranchLabel(branch)}
      </text>
      <text
        x={x}
        y={y + 65}
        textAnchor="middle"
        fontSize={9}
        fill="#86948a"
        fontFamily="var(--font-jetbrains), monospace"
      >
        {data.completedDeeds} deeds
      </text>
    </motion.g>
  )
}
