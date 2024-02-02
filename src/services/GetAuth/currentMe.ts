import { getServerSession } from 'next-auth'
import authOptions from './options'

export default async function getCurrentUser() {
  const session = await getServerSession(authOptions)

  return session?.user
}
