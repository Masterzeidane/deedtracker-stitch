import { Sidebar } from '@/components/layout/Sidebar'
import { ProfileHeaderProvider } from '@/components/layout/ProfileContext'
import { getProfile, getBranchProgress } from '@/lib/queries'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Attempt real auth; fall through silently when Supabase not configured
  let profile = null
  let branches = null
  try {
    profile = await getProfile()
    branches = await getBranchProgress()
  } catch {
    // Supabase not configured — Sidebar falls back to mock data
  }

  const header = profile
    ? { name: profile.name, xp: profile.xp, coins: profile.coins, avatar: profile.avatar_url ?? null }
    : null

  return (
    <ProfileHeaderProvider value={header}>
      <div className="min-h-screen bg-[#0b1326]">
        <Sidebar profile={profile} branches={branches} />
        <div className="md:pl-[260px] min-h-screen flex flex-col">
          <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
            {children}
          </main>
        </div>
      </div>
    </ProfileHeaderProvider>
  )
}
