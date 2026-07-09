'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { DeedCard } from '@/components/deeds/DeedCard'
import { completeDeed } from '@/lib/actions'
import type { Branch, Deed } from '@/types'
import { getBranchLabel } from '@/lib/utils'

const FILTERS: Array<'all' | Branch> = ['all', 'worship', 'knowledge', 'discipline', 'character', 'charity']

const BRANCH_COLORS: Record<string, string> = {
  worship: '#4edea3', knowledge: '#60a5fa', discipline: '#ffb95f', character: '#c084fc', charity: '#ffb3af',
}

interface QuestsViewProps {
  deeds: Deed[]
}

export function QuestsView({ deeds }: QuestsViewProps) {
  const [filter, setFilter] = useState<'all' | Branch>('all')
  const [error, setError] = useState('')
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleComplete(id: string) {
    setError('')
    setPendingId(id)
    startTransition(async () => {
      const result = await completeDeed(id)
      setPendingId(null)
      if (result?.error) {
        setError(result.error)
      } else {
        router.refresh()
      }
    })
  }

  const filtered = filter === 'all' ? deeds : deeds.filter(d => d.branch === filter)
  const pending = filtered.filter(d => !d.completed)
  const completed = filtered.filter(d => d.completed)

  return (
    <div className="space-y-6">
      <Navbar title="Daily Quests" />

      {error && (
        <div className="px-3 py-2 rounded-lg text-sm text-[#ffb3af]" style={{ background: 'rgba(252,124,120,0.1)', border: '1px solid rgba(252,124,120,0.2)' }}>
          {error}
        </div>
      )}

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
                    color: '#003824',
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
              <DeedCard
                deed={deed}
                onComplete={handleComplete}
                disabled={isPending && pendingId === deed.id}
              />
            </motion.div>
          ))}
          {pending.length === 0 && (
            <div className="col-span-2 text-center py-12 text-[#86948a]" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
              No pending deeds. Well done.
            </div>
          )}
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
