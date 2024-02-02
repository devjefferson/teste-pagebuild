export type XeerpaRecommendedContentAreaSlide = {
  id: string
  link: string
  capaId: string
  info: string
  imageTexts: {
    bottom: string
  }
  type: string
  image: string
}

export type XeerpaRecommendedContentArea = {
  id: string
  slides: XeerpaRecommendedContentAreaSlide[]
  reason: string
}

export type XeerpaRecommendedContent = {
  areas: XeerpaRecommendedContentArea[]
  texts: {
    initial: string
    mainTitle: string
    buttonText: string
    activitiesText: string
    personalText: string
  }
  statusCode: number
  statusMessage: string
}
