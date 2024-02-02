import { jwtDecode } from 'jwt-decode'
import RestClient from '../RestClient'

export type TUser = {
  imagePath: string
  email: string | null
  firstName: string
  surName: string
  birthdate: string
  gender?: string
  phone: string
  profession: string | null
  address: string | null
  addressNumber: string | null
  addressDistrict: string | null
  addressComplement: string | null
  addressState: string | null
  addressCity: string | null
  zipCode: string | null
  id: string
  token: string
}

export default async function userData(token: string) {
  const { nameid }: { nameid: string } = jwtDecode(token)
  const form = await RestClient.get<any>(
    `/restrict-area/api/v1/GetUserProfile/${nameid}`,
    {
      headers: {
        ApiKey: process.env.API_KEY_UMBRACO,
      },
    },
  )

  return { ...form.data, id: nameid, token }
}
