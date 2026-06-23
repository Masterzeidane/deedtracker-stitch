import { ChallengesView } from '@/components/challenges/ChallengesView'
import { getChallenges } from '@/lib/queries'

export default async function ChallengesPage() {
  const challenges = await getChallenges()
  return <ChallengesView challenges={challenges} />
}
