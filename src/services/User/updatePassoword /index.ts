import RestClient from '@/services/RestClient'
import { CreateUpdatePasswordPayload } from './schema'

export default async function updatePassword({
  id,
  password,
  token,
  recaptchaToken,
}: CreateUpdatePasswordPayload & { token: string; id: string }): Promise<any> {
  try {
    const response = await RestClient.put<any>(
      `/restrict-area/api/v1/UpdateUserPassword/${id}`,
      { password, token },
      {
        headers: {
          ApiKey: process.env.API_KEY_UMBRACO,
          recaptchaToken,
        },
      },
    )
    return response
  } catch (error: any) {
    throw error?.response?.data
  }
}
