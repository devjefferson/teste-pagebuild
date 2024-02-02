import RestClient from '@/services/RestClient'
import { CreateNewPasswordPayload } from './schema'

export default async function createNewPassword({
  id,
  password,
  token,
  recaptchaToken,
}: CreateNewPasswordPayload & { token: string; id: string }): Promise<any> {
  try {
    const response = await RestClient.post<any>(
      `/restrict-area/api/v1/RedefinePassword/${id}`,
      { Password: password, Token: token },
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
