import { redirect } from 'next/navigation'
import { DashboardView } from '@/components/dashboard/DashboardView'
import {
  getCurrentUser,
  getDailyDeeds,
  getChallenges,
  getAchievements,
  getWeeklyActivity,
} from '@/lib/queries'

export default async function DashboardPage() {
  const [user, deeds, challenges, achievements, activity] = await Promise.all([
    getCurrentUser(),
    getDailyDeeds(),
    getChallenges(),
    getAchievements(),
    getWeeklyActivity(),
  ])

  if (!user) redirect('/auth/login')

  return (
    <DashboardView
      user={user}
      deeds={deeds}
      challenges={challenges}
      achievements={achievements}
      activity={activity}
    />
  )
}
