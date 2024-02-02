import 'next-auth'

declare module 'next-auth' {
  export type User = {
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
  export type Session = {
    user?: User
  }
}
