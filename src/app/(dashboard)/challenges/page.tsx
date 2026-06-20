'use client'
import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { ChallengeCard } from '@/components/challenges/ChallengeCard'
import { challenges } from '@/lib/data'

export default function ChallengesPage() {
  const [tab, setTab] = useState<'active' | 'available' | 'completed'>('active')

  const active = challenges.filter(c => c.joined && c.current < c.goal)
  const available = challenges.filter(c => !c.joined)
  const completed = challenges.filter(c => c.joined && c.current >= c.goal)

  const lists: Record<string, typeof challenges> = { active, available, completed }

  return (
    <div className="space-y-6">
      <Navbar title="Challenges" />

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {(['active', 'available', 'completed'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-200"
            style={
              tab === t
                ? { background: '#4edea3', color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }
                : { color: '#bbcabf', fontFamily: 'var(--font-sora), sans-serif' }
            }
          >
            {t} ({lists[t].length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lists[tab].map(ch => (
          <ChallengeCard key={ch.id} challenge={ch} />
        ))}
        {lists[tab].length === 0 && (
          <div className="col-span-2 text-center py-16 text-[#86948a]" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>
            No {tab} challenges right now.
          </div>
        )}
      </div>
    </div>
  )
}
