import RestClient from '@/services/RestClient'

export type CreateCompleteRegisterPayload = {
  userId: string
  code: string
}

export default async function createCompleteRegister({
  userId,
  code,
}: CreateCompleteRegisterPayload): Promise<any> {
  try {
    const response = await RestClient.post<any>(
      `/restrict-area/api/v1/CompleteRegister/${userId}`,
      { code, id: userId },
      {
        headers: {
          ApiKey: process.env.API_KEY_UMBRACO,
        },
      },
    )
    return response
  } catch (error: any) {
    throw error?.response?.data
  }
}
