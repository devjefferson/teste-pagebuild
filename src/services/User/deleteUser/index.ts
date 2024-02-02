import RestClient from '@/services/RestClient'

export type DeleteRegisterPayload = {
  userId: string
  recaptchaToken: string
}

export default async function deleteRegister({
  userId,
  recaptchaToken,
}: DeleteRegisterPayload): Promise<any> {
  try {
    const response = await RestClient.delete<any>(
      `/restrict-area/api/v1/RemoveAccount/${userId}`,
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
