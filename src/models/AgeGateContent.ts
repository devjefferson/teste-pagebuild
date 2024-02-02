type AgeGateContentImage = {
  id: number
  url: string
}

export type AgeGateContent = {
  title: string
  description: string
  image: AgeGateContentImage
  altText: string
  deniedAccessTitle: string
  deniedAccessDescription: string
  deniedAccessImage: AgeGateContentImage
  deniedAccessAltText: string
}
