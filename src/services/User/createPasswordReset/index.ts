import { CreatePasswordResetPayload } from './schema'
import RestClient from '@/services/RestClient'

export default async function createPasswordReset({
  email,
  recaptchaToken,
}: CreatePasswordResetPayload): Promise<any> {
  try {
    const response = await RestClient.post<any>(
      `/restrict-area/api/v1/ForgotPassword`,
      {
        email,
      },
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
