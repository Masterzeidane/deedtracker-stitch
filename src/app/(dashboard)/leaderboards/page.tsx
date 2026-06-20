'use client'
import { Navbar } from '@/components/layout/Navbar'
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable'
import { leaderboard, currentUser } from '@/lib/data'

export default function LeaderboardsPage() {
  const me = leaderboard.find(e => e.isCurrentUser)

  return (
    <div className="space-y-6">
      <Navbar title="Leaderboards" />

      {/* Current user rank card */}
      {me && (
        <div
          className="p-4 rounded-xl flex items-center gap-4"
          style={{ background: 'rgba(78,222,163,0.08)', border: '1px solid rgba(78,222,163,0.2)' }}
        >
          <div
            className="text-2xl font-bold w-12 text-center"
            style={{ fontFamily: 'var(--font-sora), sans-serif', color: '#4edea3' }}
          >
            #{me.rank}
          </div>
          <img src={me.avatar} alt={me.name} className="w-12 h-12 rounded-full" />
          <div>
            <div className="font-semibold text-[#dae2fd]" style={{ fontFamily: 'var(--font-sora), sans-serif' }}>{me.name}</div>
            <div className="text-xs text-[#bbcabf]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
              {me.xp.toLocaleString()} XP · Level {me.level} · {me.streak}d streak
            </div>
          </div>
          <div className="ml-auto text-xs text-[#86948a]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
            {leaderboard.length - me.rank} ahead of you
          </div>
        </div>
      )}

      <div
        className="rounded-xl p-5"
        style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3
          className="text-sm font-semibold text-[#dae2fd] mb-4"
          style={{ fontFamily: 'var(--font-sora), sans-serif' }}
        >
          Global Rankings
        </h3>
        <LeaderboardTable entries={leaderboard} />
      </div>
    </div>
  )
}
