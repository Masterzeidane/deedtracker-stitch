import { redirect } from 'next/navigation'
import { SettingsView } from '@/components/settings/SettingsView'
import { getCurrentUser } from '@/lib/queries'

export default async function SettingsPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  return <SettingsView user={user} />
}
