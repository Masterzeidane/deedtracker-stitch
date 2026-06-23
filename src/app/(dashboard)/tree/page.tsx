import { redirect } from 'next/navigation'
import { TreeView } from '@/components/tree/TreeView'
import { getCurrentUser } from '@/lib/queries'

export default async function TreePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/auth/login')

  return <TreeView user={user} />
}
