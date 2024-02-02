type NavigationContentImage = {
  id: number
  url: string
}

type NavigationContentLink = {
  label: string
  url: string
}

type AditionalLink = {
  name: string
  url: string
}

type NavigationContentColumnLink = {
  title: string
  links: NavigationContentLink[]
}

export type NavigationContent = {
  headers: {
    flavor: 'headerDefault' | 'headerSocials' | 'headerSeparated'
    navigation: NavigationContentLink[]
    navigationLeft: NavigationContentLink[]
    navigationRight: NavigationContentLink[]
    buttonHeader?: NavigationContentLink
  }
  footers: {
    flavor: 'footerSimple' | 'footer'
    navigationFooter: NavigationContentColumnLink[]
    awareness: string
    copyrightText: string
    heinekenLogo: NavigationContentImage
    contactInfo: string
    logoFooter: NavigationContentImage
    aditionalLink: AditionalLink
    altText: string
  }
  hideRestrictArea: boolean
}
