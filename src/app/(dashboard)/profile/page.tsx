import { redirect } from 'next/navigation'
import { ProfileView } from '@/components/profile/ProfileView'
import { getCurrentUser, getAchievements } from '@/lib/queries'

export default async function ProfilePage() {
  const [user, achievements] = await Promise.all([getCurrentUser(), getAchievements()])
  if (!user) redirect('/auth/login')

  return <ProfileView user={user} achievements={achievements} />
}
