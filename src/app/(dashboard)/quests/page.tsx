import { QuestsView } from '@/components/quests/QuestsView'
import { getDailyDeeds, getCurrentUser } from '@/lib/queries'

export default async function QuestsPage() {
  const [deeds, user] = await Promise.all([getDailyDeeds(), getCurrentUser()])
  const energy = user?.energy ?? { current: 0, max: 100 }

  return <QuestsView deeds={deeds} energy={energy} />
}
