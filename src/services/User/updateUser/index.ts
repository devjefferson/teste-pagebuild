import RestClient from '@/services/RestClient'
import { UpdateUserPayload } from './schema'

export default async function updateUser({
  recaptchaToken,
  ...data
}: UpdateUserPayload & {
  id: string
  image?: string
  imageName?: string
}): Promise<any> {
  try {
    const response = await RestClient.put<any>(
      `/restrict-area/api/v1/UpdateUser/${data.id}`,
      {
        ...data,
        firstName: data.name,
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

export async function updateUserImage({
  id,
  UserImage,
  recaptchaToken,
}: {
  recaptchaToken: string
  id: string
  UserImage: string
}): Promise<any> {
  try {
    const response = await RestClient.put<any>(
      `/restrict-area/api/v1/UpdateUserImage/${id}`,
      {
        UserImage,
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
