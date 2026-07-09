'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, TreePine, Scroll, Trophy,
  Users, BarChart3, Medal, User, Settings, LogOut,
} from 'lucide-react'
import { signOut } from '@/lib/actions'

const NAV_LINKS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Spiritual Tree', icon: TreePine, href: '/tree' },
  { label: 'Daily Quests', icon: Scroll, href: '/quests' },
  { label: 'Challenges', icon: Trophy, href: '/challenges' },
  { label: 'Community', icon: Users, href: '/community' },
  { label: 'Leaderboards', icon: BarChart3, href: '/leaderboards' },
  { label: 'Achievements', icon: Medal, href: '/achievements' },
  { label: 'Profile', icon: User, href: '/profile' },
]

interface SidebarProps {
  profile?: { name: string; rank: string; avatar_url?: string | null } | null
  branches?: unknown[] | null
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()

  const name = profile?.name ?? 'Seeker'
  const rank = profile?.rank ?? 'Seeker'
  const avatar = profile?.avatar_url ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col fixed left-0 top-0 h-screen z-40"
        style={{ width: '260px', background: '#131b2e', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #4edea3, #10b981)', color: '#0b1326', fontFamily: "'Sora', sans-serif" }}
          >D</div>
          <span className="text-lg font-bold text-[#dae2fd]" style={{ fontFamily: "'Sora', sans-serif" }}>DeedTracker</span>
        </div>

        {/* User mini-profile */}
        <div className="flex items-center gap-3 px-4 py-4 mx-3 mt-3 rounded-xl bg-white/5 border border-white/[0.08]">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-[#4edea3]"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#dae2fd] truncate" style={{ fontFamily: "'Sora', sans-serif" }}>{name}</p>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'rgba(78,222,163,0.15)', color: '#4edea3', border: '1px solid rgba(78,222,163,0.3)' }}
            >{rank}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_LINKS.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href || pathname?.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
                style={{
                  color: isActive ? '#4edea3' : '#bbcabf',
                  background: isActive ? 'rgba(78,222,163,0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid #4edea3' : '2px solid transparent',
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <Icon size={18} style={{ color: isActive ? '#4edea3' : '#bbcabf' }} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-5 space-y-2 border-t border-white/5 pt-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
            style={{
              color: pathname === '/settings' ? '#4edea3' : '#bbcabf',
              background: pathname === '/settings' ? 'rgba(78,222,163,0.08)' : 'transparent',
              borderLeft: pathname === '/settings' ? '2px solid #4edea3' : '2px solid transparent',
              fontFamily: "'Sora', sans-serif",
            }}
          >
            <Settings size={18} />
            Settings
          </Link>

          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full text-left transition-all hover:text-[#ffb3af]"
              style={{ color: '#86948a', fontFamily: "'Sora', sans-serif" }}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
