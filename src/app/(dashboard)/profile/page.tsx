'use client'
import { motion } from 'framer-motion'
import { MapPin, Calendar, Flame, Star, Coins, Trophy } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { XPBar } from '@/components/ui/XPBar'
import { AchievementBadge } from '@/components/achievements/AchievementBadge'
import { BranchProgress } from '@/components/dashboard/BranchProgress'
import { currentUser, achievements } from '@/lib/data'
import { formatXP, formatCoins } from '@/lib/utils'

export default function ProfilePage() {
  const user = currentUser
  const earnedAchs = achievements.filter(a => a.earned).slice(0, 6)

  return (
    <div className="space-y-6">
      <Navbar title="Profile" />

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #131b2e, #222a3d)' }}
      >
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #4edea3, transparent 60%)' }}
        />
        <div className="relative p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-2xl"
              style={{ border: '3px solid #4edea3', boxShadow: '0 0 20px rgba(78,222,163,0.3)' }}
            />
            <div
              className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: '#4edea3', color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }}
            >
              Lv.{user.level}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1
                  className="text-2xl font-bold text-[#dae2fd]"
                  style={{ fontFamily: 'var(--font-sora), sans-serif' }}
                >
                  {user.name}
                </h1>
                <div
                  className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(78,222,163,0.15)', color: '#4edea3', border: '1px solid rgba(78,222,163,0.3)' }}
                >
                  <Trophy size={10} />
                  {user.rank}
                </div>
              </div>
              <button
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ background: '#4edea3', color: '#003824', fontFamily: 'var(--font-sora), sans-serif' }}
              >
                Edit Profile
              </button>
            </div>
            <p className="text-sm text-[#bbcabf] mt-2 max-w-md">{user.bio}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-[#86948a]">
              <span className="flex items-center gap-1"><MapPin size={11} /> {user.location}</span>
              <span className="flex items-center gap-1"><Calendar size={11} /> Joined {user.joinDate}</span>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="px-6 pb-5">
          <XPBar current={user.xp} max={user.maxXp} level={user.level} />
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total XP', value: formatXP(user.xp), icon: Star, color: '#4edea3' },
          { label: 'Coins', value: formatCoins(user.coins), icon: Coins, color: '#ffb95f' },
          { label: 'Streak', value: `${user.streak}d`, icon: Flame, color: '#ffb95f' },
          { label: 'Achievements', value: String(user.achievements.length), icon: Trophy, color: '#c084fc' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="p-4 rounded-xl text-center"
            style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Icon size={20} className="mx-auto mb-2" style={{ color }} />
            <div className="text-lg font-bold" style={{ color, fontFamily: 'var(--font-sora), sans-serif' }}>{value}</div>
            <div className="text-xs text-[#86948a] mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BranchProgress />

        {/* Achievements showcase */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'rgba(23,31,51,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <h3
            className="text-sm font-semibold text-[#dae2fd] mb-4"
            style={{ fontFamily: 'var(--font-sora), sans-serif' }}
          >
            Achievement Showcase
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {earnedAchs.map(a => <AchievementBadge key={a.id} achievement={a} size="sm" />)}
          </div>
        </div>
      </div>
    </div>
  )
}
