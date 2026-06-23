import { CommunityView } from '@/components/community/CommunityView'
import { getFeed, getLeaderboard } from '@/lib/queries'

export default async function CommunityPage() {
  const [posts, leaderboard] = await Promise.all([getFeed(), getLeaderboard()])
  return <CommunityView posts={posts} featured={leaderboard.slice(0, 8)} />
}
