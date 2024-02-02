import { UFormSettings } from './UForm'

/* eslint-disable no-use-before-define */
export type PageContentSeo = {
  title: string
  description: string
  keywords: string
}

export type PageContentHero<
  T = PageContentHeroHeadline | PageContentHeroImage | PageContentHeroProduct,
> = {
  type: string
  config: T
}

export type PageContentHeroHeadline = {
  overline: string | null
  title: string | null
  description: string | null
}

export type PageContentHeroImage = {
  overline: string | null
  title: string | null
  description: string | null
  image: {
    url: string
    alt: string
  } | null
  action: {
    label: string
    url: string
  } | null
}

export type PageContentHeroProduct = {
  title: string | null
  subtitle: string | null
  image: {
    url: string
    alt: string
  } | null
  breadcrumb: {
    id: string
    label: string
    url: string
  }[]
}

export type PageContentSection<
  T =
    | PageContentSectionContentImage
    | PageContentSectionContentVideo
    | PageContentSectionSectionForm
    | PageContentSectionContentText
    | PageContentSectionCardStackButton
    | PageContentSectionSocialLinks
    | PageContentSectionFAQ
    | PageContentSectionMediaEmbed
    | PageContentSectionSocialShare
    | PageContentSectionCardStack
    | PageContentSectionCardGridDesconstructed
    | PageContentSectionCarouselCardsLine
    | PageContentSectionMediaCarousel
    | PageContentSectionProductCarousel
    | PageContentSectionProductCardGrid
    | PageContentSectionLegalInformationList
    | PageContentSectionLegalInformationItem
    | PageContentSectionIframe
    | PageContentSectionNutritionalInformation
    | PageContentSectionWidgetCapture
    | PageContentSectionRecommendedContent,
> = {
  type: string
  config: T
}

export type PageContentSectionContentImage = {
  overline: string | null
  title: string | null
  description: string | null
  position: 'start' | 'end' | null
  primaryAction: {
    label: string
    url: string
  } | null
  secondaryAction: {
    label: string
    url: string
  } | null
  media: {
    url: string
    alt: string
  } | null
}

export type PageContentSectionContentVideo = {
  overline: string | null
  title: string | null
  description: string | null
  position: 'start' | 'end' | null
  primaryAction: {
    label: string
    url: string
  } | null
  secondaryAction: {
    label: string
    url: string
  } | null
  url: string | null
}

export type PageContentSectionSectionForm = {
  title: string | null
  description: string | null
  enableSocialLogin: string | null
  successMessage: string | null
  errorMessage: string | null
  form: UFormSettings | null
}

export type PageContentSectionContentText = {
  overline: string | null
  title: string | null
  description: string | null
  action: {
    label: string
    url: string
  } | null
  media: {
    url: string
    alt: string
  } | null
}

export type PageContentSectionCardStackButton = {
  index?: number
  title: string | null
  description: string | null
  cards: {
    overline: string | null
    title: string | null
    description: string | null
    action: {
      label: string
      url: string
    } | null
    media: {
      url: string
      alt: string
    } | null
    form: UFormSettings | null
  }[]
}

export type PageContentSectionSocialLinks = {
  title: string | null
}

export type PageContentSectionFAQ = {
  title: string | null
  description: string | null
  message: {
    label: string
    link: {
      label: string
      url: string
    }
  } | null
  list: {
    title: string | null
    description: string | null
  }[]
}

export type PageContentSectionMediaEmbed = {
  type: 'IGTV' | 'Imagem' | 'Playlist' | 'Podcast' | 'Vídeo'
  overline: string | null
  caption: string | null
  urlEmbed: string | null
  media: {
    url: string
    alt: string
  } | null
  description: string | null
}

export type PageContentSectionSocialShare = {
  title: string | null
}

export type PageContentSectionCardStack = {
  title: string | null
  description: string | null
  cards: {
    overline: string | null
    title: string | null
    description: string | null
    action: {
      label: string
      url: string
    } | null
    media: {
      url: string
      alt: string
    } | null
  }[]
}

export type PageContentSectionCardGridDesconstructed = {
  title: string | null
  description: string | null
  columns: number | null
  cards: {
    overline: string | null
    title: string | null
    description: string | null
    action: {
      label: string
      url: string
    } | null
    media: {
      url: string
      alt: string
    } | null
  }[]
}

export type PageContentSectionCarouselCardsLine = {
  title: string | null
  description: string | null
  columns: number | null
  cards: {
    overline: string | null
    title: string | null
    description: string | null
    action: {
      label: string
      url: string
    } | null
    media: {
      url: string
      alt: string
    } | null
  }[]
}

export type PageContentSectionMediaCarousel = {
  title: string | null
  description: string | null
  slides: {
    overline: string | null
    subtitle: string | null
    media: {
      url: string
      alt: string
    } | null
  }[]
  autoplay: boolean
  infiniteScroll: boolean
}

export type PageContentSectionProductCarousel = {
  products: {
    id: number
    overline: string | null
    title: string | null
    description: string | null
    media: {
      url: string
      alt: string
    } | null
    actionPrimary: {
      label: string
      url: string
    } | null
    actionSecondary: {
      label: string
      url: string
    } | null
  }[]
}

export type PageContentSectionProductCardGrid = {
  title: string | null
  products: {
    id: number
    title: string
    media: {
      url: string
      alt: string
    }
    action: {
      url: string
    }
  }[]
}

export type PageContentSectionLegalInformationList = {
  list: {
    id: number
    title: string
    description: string
    action: {
      url: string
    }
  }[]
}

export type PageContentSectionLegalInformationItem = {
  menu: {
    id: number
    action: {
      label: string
      url: string
    }
  }[]
  title: string
  description: string
  updatedAt: string
  action: {
    url: string
  }
}

export type PageContentSectionIframe = {
  title: string | null
  description: string | null
  iframe: string | null
  height: 'Cheia' | '2/3' | '1/2' | '1/3' | 'Filete'
  width: 'Largo' | 'Médio' | 'Estreito'
}

export type PageContentSectionNutritionalInformation = {
  titleMain: string | null
  volume: string | null
  ingredients: string | null
  allergens: string | null
  values: {
    icon: {
      url: string
      alt: string
    } | null
    title: string | null
    description: string | null
    additionalInfo: string | null
  }[]
  showAboutContent: boolean
  position: 'start' | 'end' | null
  aboutOverline: string | null
  aboutTitle: string | null
  aboutDescription: string | null
  media: {
    url: string
    alt: string
  } | null
}

export type PageContentSectionWidgetCapture = {
  overline: string | null
  title: string | null
  description: string | null
  sourceTitle: string | null
  successMessage: string | null
  socialLoginOptions: string[] | any
  errorMessage: string | null
  urlSuccessMessage: {
    url: string
    label: string
  } | null
  media: {
    url: string
    alt: string
  } | null
  form: UFormSettings | null
}

export type PageContentSectionRecommendedContent = {
  title: string | null
}

export type TContentPageData = {
  description?: string
  alttext?: string
  image?: { id?: number; url?: string }[]
  title?: string
}

export type TContentPagePayloadData = {
  alias: string
  sourceValue?: string
  value?: string
  mediaItems?: { id?: number; url?: string }[]
}

export type TContentPagePayload = {
  data: TContentPagePayloadData[]
  type: string
}

export type PageContent = {
  seo: PageContentSeo
  hero: PageContentHero | null
  sections: PageContentSection[]
  contentPage?: TContentPagePayload
}
