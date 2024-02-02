type BrandContentImage = {
  id: number
  url: string
}

type BrandContentSocial = {
  type:
    | 'facebook'
    | 'instagram'
    | 'share-variant'
    | 'twitter'
    | 'whatsApp'
    | 'youtube'
  url: string
}

export type BrandContent = {
  brandName: string
  logo: {
    colorfulLogo: BrandContentImage
    monochromeLogo: BrandContentImage
    colorfulSymbol: BrandContentImage
    monochromeSymbol: BrandContentImage
  }
  favicon: BrandContentImage
  socialMedia: BrandContentSocial[]
  titleSocialLinks: string
  mainImage: BrandContentImage
  altText: BrandContentImage
  PIIDataSubmissionScheduling: boolean
  successMessageContact: string
  errorMessageContact: string
}
