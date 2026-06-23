'use client'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { SpiritualTree } from '@/components/tree/SpiritualTree'
import { XPBar } from '@/components/ui/XPBar'
import { getBranchLabel } from '@/lib/utils'
import type { Branch, User } from '@/types'

const BRANCHES: Branch[] = ['worship', 'knowledge', 'discipline', 'character', 'charity']

interface TreeViewProps {
  user: User
}

export function TreeView({ user }: TreeViewProps) {
  return (
    <div className="space-y-6">
      <Navbar title="Spiritual Tree" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Tree visualization */}
        <div
          className="xl:col-span-2 rounded-xl p-6"
          style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h2
            className="text-lg font-bold text-[#dae2fd] mb-1"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Your Spiritual Tree
          </h2>
          <p className="text-xs text-[#bbcabf] mb-6">Tap a branch node to explore its progress</p>
          <SpiritualTree user={user} />
        </div>

        {/* Branch list */}
        <div className="space-y-3">
          {BRANCHES.map((branch, i) => {
            const data = user.branches[branch]
            return (
              <motion.div
                key={branch}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-xl"
                style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl">{data.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-semibold text-[#dae2fd]"
                        style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                      >
                        {getBranchLabel(branch)}
                      </span>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          color: data.color,
                          background: `${data.color}18`,
                          fontFamily: 'var(--font-jetbrains), monospace',
                        }}
                      >
                        Lv.{data.level}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#86948a] mt-0.5">{data.description}</p>
                  </div>
                </div>
                <XPBar current={data.xp} max={data.maxXp} level={data.level} color={data.color} />
                <div
                  className="mt-2 text-[10px] text-[#86948a]"
                  style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {data.completedDeeds}/{data.totalDeeds} deeds completed
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
