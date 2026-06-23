import { AchievementsView } from '@/components/achievements/AchievementsView'
import { getAchievements } from '@/lib/queries'

export default async function AchievementsPage() {
  const achievements = await getAchievements()
  return <AchievementsView achievements={achievements} />
}
