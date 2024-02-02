import RestClient from '../RestClient'
import { CreateLoginData } from './schema'

export default async function createLogin(
  payload: CreateLoginData & { xeerpaToken?: string },
) {
  try {
    const { data } = await RestClient.post<any>(
      `/restrict-area/api/v1/SignIn`,
      {
        email: payload.email,
        password: payload.password,
      },
      {
        headers: {
          ApiKey: process.env.API_KEY_UMBRACO,
          recaptchaToken: payload.recaptchaToken,
          xeerpaToken: payload.xeerpaToken || '',
        },
      },
    )

    return data
  } catch (error: any) {
    throw error?.response?.data
  }
}
