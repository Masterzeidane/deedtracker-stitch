import { QuestsView } from '@/components/quests/QuestsView'
import { getDailyDeeds } from '@/lib/queries'

export default async function QuestsPage() {
  const deeds = await getDailyDeeds()

  return <QuestsView deeds={deeds} />
}
