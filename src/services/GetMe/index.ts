import { User } from 'next-auth'
import RestClient from '../RestClient'

export default async function getMe(token: string): Promise<User | undefined> {
  try {
    const response = await RestClient.get<any>(`/restrict-area/api/v1/me`, {
      headers: {
        ApiKey: process.env.API_KEY_UMBRACO,
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) {
      const user = response.data
      return {
        ...user,
        token,
      }
    }
  } catch (error) {
    return undefined
  }
}
