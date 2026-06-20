'use client'
import { Search, Bell, Star, Coins, ChevronDown } from 'lucide-react'
import { ProgressionPill } from '@/components/ui/ProgressionPill'

interface NavbarProps {
  title?: string
}

// Fallback user
const FALLBACK_USER = {
  name: 'Seeker',
  xp: 4200,
  coins: 380,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DeedTracker',
}

export function Navbar({ title }: NavbarProps) {
  let user = FALLBACK_USER
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const data = require('@/lib/data')
    if (data?.currentUser) user = data.currentUser
  } catch {}

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

      {/* Search bar */}
      <div className="flex-1 max-w-md">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Search size={15} className="text-[#bbcabf] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search deeds, quests..."
            className="flex-1 bg-transparent outline-none text-sm text-[#dae2fd] placeholder:text-[#bbcabf]/60"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          />
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-2 ml-auto">
        {/* XP pill */}
        <ProgressionPill
          icon={<Star size={13} />}
          value={user.xp ?? 4200}
          label="XP"
          color="#4edea3"
        />

        {/* Coins pill */}
        <ProgressionPill
          icon={
            <span className="font-bold text-xs leading-none">₵</span>
          }
          value={user.coins ?? 380}
          label="Coins"
          color="#ffb95f"
        />

        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-white/8"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          aria-label="Notifications"
        >
          <Bell size={16} className="text-[#dae2fd]" />
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{
              background: '#ef4444',
              color: '#fff',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            3
          </span>
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
