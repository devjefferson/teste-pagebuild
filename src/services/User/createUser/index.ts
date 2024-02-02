import RestClient from '@/services/RestClient'

export default async function createUser({
  recaptchaToken,
  ...data
}: any): Promise<any> {
  try {
    const response = await RestClient.post<any>(
      `/restrict-area/api/v1/SignUp`,
      data,
      {
        headers: {
          ApiKey: process.env.API_KEY_UMBRACO,
          recaptchaToken,
          xeerpaToken: data.xeerpaToken,
        },
      },
    )

    return response
  } catch (error: any) {
    throw error?.response?.data
  }
}
