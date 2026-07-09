'use client'
import { Bell, Star, Coins, ChevronDown } from 'lucide-react'
import { ProgressionPill } from '@/components/ui/ProgressionPill'
import { useProfileHeader } from '@/components/layout/ProfileContext'

interface NavbarProps {
  title?: string
}

export function Navbar({ title }: NavbarProps) {
  const profile = useProfileHeader()
  const user = {
    name: profile.name,
    xp: profile.xp,
    coins: profile.coins,
    avatar: profile.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.name)}`,
  }

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center gap-4 px-5"
      style={{
        left: '260px',
        height: '64px',
        background: 'rgba(11,19,38,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Page title (hidden on mobile where hamburger appears) */}
      {title && (
        <h1
          className="hidden md:block text-lg font-semibold text-[#dae2fd] mr-2 whitespace-nowrap"
          style={{ fontFamily: "'Sora', sans-serif" }}
        >
          {title}
        </h1>
      )}

      {/* Right side items */}
      <div className="flex items-center gap-2 ml-auto">
        {/* XP pill */}
        <ProgressionPill
          icon={<Star size={13} />}
          value={user.xp}
          label="XP"
          color="#4edea3"
        />

        {/* Coins pill */}
        <ProgressionPill
          icon={
            <span className="font-bold text-xs leading-none">₵</span>
          }
          value={user.coins}
          label="Coins"
          color="#ffb95f"
        />

        {/* Notification bell */}
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-white/8"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          aria-label="Notifications"
        >
          <Bell size={16} className="text-[#dae2fd]" />
        </button>

        {/* User avatar */}
        <button
          className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors duration-200 hover:bg-white/8"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          aria-label="User menu"
        >
          <img
            src={user.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[rgba(78,222,163,0.4)]"
          />
          <ChevronDown size={13} className="text-[#bbcabf]" />
        </button>
      </div>
    </header>
  )
}
