import { Sidebar } from '@/components/layout/Sidebar'
import { createClient } from '@/lib/supabase/server'
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

  return (
    <div className="min-h-screen bg-[#0b1326]">
      <Sidebar profile={profile} branches={branches} />
      <div className="md:pl-[260px] min-h-screen flex flex-col">
        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}
