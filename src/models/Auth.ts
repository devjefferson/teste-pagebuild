export type SocialNetwork = 'FB' | 'GO' | 'TW' | 'TH'

export type AuthSection = {
  id: string
  token: string
  it: string
  user: {
    name: string
    email: string
    birthday: string
  }
  socialNetwork: SocialNetwork
}
