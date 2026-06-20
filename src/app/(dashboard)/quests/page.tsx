'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { DeedCard } from '@/components/deeds/DeedCard'
import { EnergyGauge } from '@/components/ui/EnergyGauge'
import { deeds, currentUser } from '@/lib/data'
import type { Branch } from '@/types'
import { getBranchLabel } from '@/lib/utils'

const FILTERS: Array<'all' | Branch> = ['all', 'worship', 'knowledge', 'discipline', 'character', 'charity']

export default function QuestsPage() {
  const [filter, setFilter] = useState<'all' | Branch>('all')
  const user = currentUser

  const filtered = filter === 'all' ? deeds : deeds.filter(d => d.branch === filter)
  const pending = filtered.filter(d => !d.completed)
  const completed = filtered.filter(d => d.completed)

  const BRANCH_COLORS: Record<string, string> = {
    worship: '#4edea3', knowledge: '#60a5fa', discipline: '#ffb95f', character: '#c084fc', charity: '#ffb3af',
  }

  return (
    <div className="space-y-6">
      <Navbar title="Daily Quests" />

      {/* Energy bar */}
      <div
        className="p-4 rounded-xl"
        style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[#dae2fd]" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
            Daily Energy
          </h3>
          <span className="text-xs text-[#86948a]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
            Resets at midnight
          </span>
        </div>
        <EnergyGauge current={user.energy.current} max={user.energy.max} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 capitalize"
            style={
              filter === f
                ? {
                    color: f === 'all' ? '#003824' : '#003824',
                    background: f === 'all' ? '#4edea3' : BRANCH_COLORS[f] ?? '#4edea3',
                    fontFamily: 'var(--font-sora), sans-serif',
                  }
                : {
                    color: '#bbcabf',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontFamily: 'var(--font-sora), sans-serif',
                  }
            }
          >
            {f === 'all' ? 'All' : getBranchLabel(f)}
          </button>
        ))}
      </div>

      {/* Pending deeds */}
      <div>
        <h3
          className="text-sm font-semibold text-[#dae2fd] mb-3"
          style={{ fontFamily: 'var(--font-sora), sans-serif' }}
        >
          Pending ({pending.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pending.map((deed, i) => (
            <motion.div key={deed.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <DeedCard deed={deed} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h3
            className="text-sm font-semibold text-[#86948a] mb-3"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Completed ({completed.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-60">
            {completed.map(deed => <DeedCard key={deed.id} deed={deed} />)}
          </div>
        </div>
      )}
    </div>
  )
}
