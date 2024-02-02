import {
  PageContent,
  PageContentHero,
  PageContentHeroHeadline,
  PageContentHeroImage,
  PageContentSection,
  PageContentSectionCardGridDesconstructed,
  PageContentSectionCardStack,
  PageContentSectionCardStackButton,
  PageContentSectionCarouselCardsLine,
  PageContentSectionContentImage,
  PageContentSectionContentText,
  PageContentSectionContentVideo,
  PageContentSectionFAQ,
  PageContentSectionIframe,
  PageContentSectionMediaCarousel,
  PageContentSectionMediaEmbed,
  PageContentSectionNutritionalInformation,
  PageContentSectionProductCarousel,
  PageContentSectionRecommendedContent,
  PageContentSectionSectionForm,
  PageContentSectionSocialLinks,
  PageContentSectionSocialShare,
  PageContentSectionWidgetCapture,
} from '@/models/PageContent'
import { gql } from 'graphql-request'
import GetProductList from '../GetProductList'
import GQLClient from '../GQLClient'
import { GetUFormContent } from '../UFormContent'

export default async function GetEntryPageContent(
  route: string,
): Promise<PageContent | null> {
  try {
    const data = await GQLClient.request<any>(
      gql`
        query ($route: String!) {
          page: contentByAbsoluteRoute(route: $route) {
            contentId: key
            contentType {
              alias
            }
            properties {
              value {
                alias
                ... on BasicRichText {
                  sourceValue
                }
                ... on BasicPropertyValue {
                  value
                }
                ... on BasicMediaPicker {
                  mediaItems {
                    id
                    url
                  }
                }
                ... on BasicBlockListModel {
                  blocks {
                    contentAlias
                    contentProperties {
                      alias
                      value {
                        ... on BasicPropertyValue {
                          value
                        }
                        ... on BasicRichText {
                          sourceValue
                        }
                        ... on BasicMediaPicker {
                          mediaItems {
                            id
                            url
                          }
                        }
                        ... on BasicBlockListModel {
                          blocks {
                            contentAlias
                            contentProperties {
                              alias
                              value {
                                ... on BasicPropertyValue {
                                  value
                                }
                                ... on BasicMultiUrlPicker {
                                  links {
                                    name
                                    target
                                    type
                                    url
                                  }
                                }
                                ... on BasicMediaPicker {
                                  mediaItems {
                                    id
                                    url
                                  }
                                }
                                ... on BasicRichText {
                                  sourceValue
                                }
                                ... on BasicBlockListModel {
                                  blocks {
                                    contentAlias
                                    contentProperties {
                                      alias
                                      value {
                                        ... on BasicPropertyValue {
                                          value
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                        ... on BasicContentPicker {
                          contentList {
                            id
                            name
                            urlSegment
                            url
                            absoluteUrl
                            key
                          }
                        }
                        ... on BasicMultiUrlPicker {
                          links {
                            name
                            target
                            type
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      { route },
    )

    if (!data?.page) throw new Error()

    const properties = (data?.page?.properties || []) as any[]

    return {
      seo: getSeo(properties),
      hero: getHero(properties),
      contentPage: getContentPage(data?.page),
      sections: await getSections(properties, data?.page?.contentId),
    }
  } catch (error) {
    return null
  }
}

function getPropertyValueByAlias(properties: any[], alias: string) {
  const property = properties.find((item) =>
    [item?.value?.alias, item?.alias].includes(alias),
  )
  if (property) {
    return property?.value
  }
  return null
}

function getContentPage(page: any) {
  const arrayDataPage = ['description', 'alttext', 'image', 'title']
  const data = arrayDataPage.reduce((acc: any, item) => {
    page.properties.map(
      (propertie: any) =>
        propertie.value.alias === item && acc.push(propertie.value),
    )
    return acc
  }, [])

  return { data, type: page.contentType.alias }
}

function getSeo(properties: any[]): PageContent['seo'] {
  return {
    title: getPropertyValueByAlias(properties, 'metaTitle')?.value || '',
    description:
      getPropertyValueByAlias(properties, 'metaDescription')?.value || '',
    keywords:
      getPropertyValueByAlias(properties, 'keywordsSeo')?.value?.current || '',
  }
}

function getHero(properties: any[]): PageContent['hero'] | null {
  const hero = getPropertyValueByAlias(properties, 'hero')?.blocks?.[0]

  const contentAlias = String(hero?.contentAlias || '')
  const contentProperties = (hero?.contentProperties || []) as any[]

  return getHeroByType(contentProperties, contentAlias)
}

function getHeroByType(properties: any[], type: string): PageContent['hero'] {
  switch (type) {
    case 'heroImage': {
      const overline = getPropertyValueByAlias(properties, 'overline')?.value
      const title = getPropertyValueByAlias(properties, 'title')?.value
      const description = getPropertyValueByAlias(
        properties,
        'description',
      )?.sourceValue
      const image = getPropertyValueByAlias(properties, 'image')
        ?.mediaItems?.[0]?.url
      const altText = getPropertyValueByAlias(properties, 'altText')?.value
      const buttonHeroImage = getPropertyValueByAlias(
        properties,
        'buttonHeroImage',
      )?.blocks?.[0]

      const response = {
        type,
        config: {
          overline: overline || null,
          title: title || null,
          description: description || null,
          image: null,
          action: null,
        },
      } as PageContentHero<PageContentHeroImage>

      if (image) {
        response.config.image = {
          url: image || '',
          alt: altText || '',
        }
      }

      if (buttonHeroImage) {
        response.config.action = {
          label:
            getPropertyValueByAlias(
              buttonHeroImage?.contentProperties || [],
              'label',
            )?.value || '',
          url:
            getPropertyValueByAlias(
              buttonHeroImage?.contentProperties || [],
              'buttonLink',
            )?.links?.[0]?.url || '',
        }
      }

      return response
    }
    case 'headline': {
      return {
        type,
        config: {
          overline:
            getPropertyValueByAlias(properties, 'overline')?.value || null,
          title: getPropertyValueByAlias(properties, 'title')?.value || null,
          description:
            getPropertyValueByAlias(properties, 'description')?.sourceValue ||
            null,
        },
      } as PageContentHero<PageContentHeroHeadline>
    }
    default: {
      return null
    }
  }
}

async function getSections(
  properties: any[],
  contentId = '',
): Promise<PageContent['sections']> {
  const sections = (getPropertyValueByAlias(properties, 'sections')?.blocks ||
    []) as any[]

  const response = await Promise.all(
    sections.map((item) => getSectionsByType(item, contentId)),
  )

  return response
}

async function getSectionsByType(
  section: any,
  contentId = '',
): Promise<PageContentSection> {
  const type = section?.contentAlias || ''
  switch (type) {
    case 'contentImage': {
      const contentImage = section?.contentProperties
      const overline = getPropertyValueByAlias(contentImage, 'overline')?.value
      const title = getPropertyValueByAlias(contentImage, 'title')?.value
      const description = getPropertyValueByAlias(
        contentImage,
        'description',
      )?.sourceValue
      const position = getPropertyValueByAlias(contentImage, 'position')?.value
      const image = getPropertyValueByAlias(contentImage, 'image')
        ?.mediaItems?.[0]?.url
      const altText = getPropertyValueByAlias(contentImage, 'altText')?.value
      const buttonContentImagePrimary = getPropertyValueByAlias(
        contentImage,
        'buttonContentImage',
      )?.blocks?.[0]
      const buttonContentImageSecondary = getPropertyValueByAlias(
        contentImage,
        'buttonContentImage',
      )?.blocks?.[1]

      const response = {
        type,
        config: {
          overline: overline || null,
          title: title || null,
          description: description || null,
          position: ['start', 'end'].includes(position) ? position : null,
          primaryAction: null,
          secondaryAction: null,
          media: null,
        } as PageContentSectionContentImage,
      }

      if (image) {
        response.config.media = {
          url: image || '',
          alt: altText || '',
        }
      }

      if (buttonContentImagePrimary) {
        response.config.primaryAction = {
          label:
            getPropertyValueByAlias(
              buttonContentImagePrimary?.contentProperties || [],
              'label',
            )?.value || '',
          url:
            getPropertyValueByAlias(
              buttonContentImagePrimary?.contentProperties || [],
              'buttonLink',
            )?.links?.[0]?.url || '',
        }
      }

      if (buttonContentImageSecondary) {
        response.config.secondaryAction = {
          label:
            getPropertyValueByAlias(
              buttonContentImageSecondary?.contentProperties || [],
              'label',
            )?.value || '',
          url:
            getPropertyValueByAlias(
              buttonContentImageSecondary?.contentProperties || [],
              'buttonLink',
            )?.links?.[0]?.url || '',
        }
      }

      return response
    }
    case 'contentText': {
      const contentText = section?.contentProperties
      const overline = getPropertyValueByAlias(contentText, 'overline')?.value
      const title = getPropertyValueByAlias(contentText, 'title')?.value
      const description = getPropertyValueByAlias(
        contentText,
        'description',
      )?.sourceValue
      const image = getPropertyValueByAlias(contentText, 'image')
        ?.mediaItems?.[0]?.url
      const altText = getPropertyValueByAlias(contentText, 'altText')?.value
      const buttonContentText = getPropertyValueByAlias(
        contentText,
        'buttonContentText',
      )?.blocks?.[0]

      const response = {
        type,
        config: {
          overline: overline || null,
          title: title || null,
          description: description || null,
          action: null,
          media: null,
        } as PageContentSectionContentText,
      }

      if (image) {
        response.config.media = {
          url: image || '',
          alt: altText || '',
        }
      }

      if (buttonContentText) {
        response.config.action = {
          label:
            getPropertyValueByAlias(
              buttonContentText?.contentProperties || [],
              'label',
            )?.value || '',
          url:
            getPropertyValueByAlias(
              buttonContentText?.contentProperties || [],
              'buttonLink',
            )?.links?.[0]?.url || '',
        }
      }

      return response
    }
    case 'cardStackButton': {
      const cardStackButton = section?.contentProperties
      const title = getPropertyValueByAlias(cardStackButton, 'title')?.value
      const description = getPropertyValueByAlias(
        cardStackButton,
        'description',
      )?.sourceValue
      const lineCards = (getPropertyValueByAlias(cardStackButton, 'lineCards')
        ?.blocks || []) as any[]

      const cards: PageContentSectionCardStackButton['cards'] =
        await Promise.all(
          lineCards.map(async (item) => {
            const cardOverline = getPropertyValueByAlias(
              item?.contentProperties,
              'overlineCard',
            )?.value
            const cardTitle = getPropertyValueByAlias(
              item?.contentProperties,
              'titleCard',
            )?.value
            const cardDescription = getPropertyValueByAlias(
              item?.contentProperties,
              'descriptionCard',
            )?.value
            const cardImage = getPropertyValueByAlias(
              item?.contentProperties,
              'imageCard',
            )?.mediaItems?.[0]?.url
            const cardAltText = getPropertyValueByAlias(
              item?.contentProperties,
              'altText',
            )?.value
            const cardAction = getPropertyValueByAlias(
              item?.contentProperties,
              'actionCard',
            )?.links?.[0]
            const actionContactForm = !!getPropertyValueByAlias(
              item?.contentProperties,
              'actionContactForm',
            )?.value
            const contactForm = getPropertyValueByAlias(
              item?.contentProperties,
              'contactForm',
            )?.blocks?.[0]?.contentProperties?.[0]?.value?.value

            const response: any = {
              overline: cardOverline || null,
              title: cardTitle || null,
              description: cardDescription || null,
              action: cardAction
                ? {
                    label: cardAction?.name || '',
                    url: cardAction?.url || '',
                  }
                : null,
              media: cardImage
                ? {
                    url: cardImage || '',
                    alt: cardAltText || '',
                  }
                : null,
              form: null,
            }

            if (actionContactForm && contactForm) {
              response.form = await GetUFormContent(
                contactForm,
                contentId,
                getPropertyValueByAlias(item?.contentProperties, 'contactForm')
                  ?.blocks?.[0]?.contentAlias,
              )
            }

            return response
          }),
        )

      return {
        type,
        config: {
          title: title || null,
          description: description || null,
          cards,
        } as PageContentSectionCardStackButton,
      }
    }
    case 'socialLinks': {
      const socialLinks = section?.contentProperties
      const title = getPropertyValueByAlias(socialLinks, 'title')?.value
      return {
        type,
        config: {
          title: title || null,
        } as PageContentSectionSocialLinks,
      }
    }
    case 'faq': {
      const faq = section?.contentProperties
      const title = getPropertyValueByAlias(faq, 'title')?.value
      const description = getPropertyValueByAlias(faq, 'description')?.value
      const list = (getPropertyValueByAlias(faq, 'faqList')?.blocks ||
        []) as any[]
      const message = getPropertyValueByAlias(faq, 'message')?.value
      const messageLinkLabel = getPropertyValueByAlias(faq, 'messageLink')
        ?.links?.[0]?.name
      const messageLinkUrl = getPropertyValueByAlias(faq, 'messageLink')
        ?.links?.[0]?.url

      const response = {
        type,
        config: {
          title: title || null,
          description: description || null,
          message: null,
          list: list.map((item) => {
            const listItemTitle = getPropertyValueByAlias(
              item?.contentProperties,
              'title',
            )?.value
            const listItemDescription = getPropertyValueByAlias(
              item?.contentProperties,
              'description',
            )?.sourceValue
            return {
              title: listItemTitle || '',
              description: listItemDescription || '',
            }
          }),
        } as PageContentSectionFAQ,
      }

      if (messageLinkUrl) {
        response.config.message = {
          label: message || '',
          link: {
            label: messageLinkLabel || '',
            url: messageLinkUrl || '',
          },
        }
      }

      return response
    }
    case 'socialShare': {
      const socialShare = section?.contentProperties
      const title = getPropertyValueByAlias(socialShare, 'title')?.value
      return {
        type,
        config: {
          title: title || null,
        } as PageContentSectionSocialShare,
      }
    }
    case 'cardStack': {
      const cardStack = section?.contentProperties
      const title = getPropertyValueByAlias(cardStack, 'title')?.value
      const description = getPropertyValueByAlias(
        cardStack,
        'description',
      )?.value
      const cards = (getPropertyValueByAlias(cardStack, 'lineCards')?.blocks ||
        []) as any[]
      // const title = getPropertyValueByAlias(socialShare, 'title')?.value
      return {
        type,
        config: {
          title: title || null,
          description: description || null,
          cards: cards.map((item) => {
            const cardOverline = getPropertyValueByAlias(
              item?.contentProperties,
              'overlineCard',
            )?.value
            const cardTitle = getPropertyValueByAlias(
              item?.contentProperties,
              'titleCard',
            )?.value
            const cardDescription = getPropertyValueByAlias(
              item?.contentProperties,
              'descriptionCard',
            )?.value
            const cardImage = getPropertyValueByAlias(
              item?.contentProperties,
              'imageCard',
            )?.mediaItems?.[0]?.url
            const cardAltText = getPropertyValueByAlias(
              item?.contentProperties,
              'altText',
            )?.value
            const cardAction = getPropertyValueByAlias(
              item?.contentProperties,
              'actionCard',
            )?.links?.[0]

            return {
              overline: cardOverline || null,
              title: cardTitle || null,
              description: cardDescription || null,
              action: cardAction
                ? {
                    label: cardAction?.name || '',
                    url: cardAction?.url || '',
                  }
                : null,
              media: cardImage
                ? {
                    url: cardImage || '',
                    alt: cardAltText || '',
                  }
                : null,
            }
          }),
        } as PageContentSectionCardStack,
      }
    }
    case 'cardGridDesconstructed': {
      const cardGridDesconstructed = section?.contentProperties
      const title = getPropertyValueByAlias(
        cardGridDesconstructed,
        'title',
      )?.value
      const description = getPropertyValueByAlias(
        cardGridDesconstructed,
        'description',
      )?.value
      const colNumber = Number(
        getPropertyValueByAlias(cardGridDesconstructed, 'colNumber')?.value ||
          '3',
      )
      const cards = (getPropertyValueByAlias(
        cardGridDesconstructed,
        'lineCards',
      )?.blocks || []) as any[]
      return {
        type,
        config: {
          title: title || null,
          description: description || null,
          columns: colNumber || null,
          cards: cards.map((item) => {
            const cardOverline = getPropertyValueByAlias(
              item?.contentProperties,
              'overlineCard',
            )?.value
            const cardTitle = getPropertyValueByAlias(
              item?.contentProperties,
              'titleCard',
            )?.value
            const cardDescription = getPropertyValueByAlias(
              item?.contentProperties,
              'descriptionCard',
            )?.value
            const cardImage = getPropertyValueByAlias(
              item?.contentProperties,
              'imageCard',
            )?.mediaItems?.[0]?.url
            const cardAltText = getPropertyValueByAlias(
              item?.contentProperties,
              'altText',
            )?.value
            const cardAction = getPropertyValueByAlias(
              item?.contentProperties,
              'actionCard',
            )?.links?.[0]

            return {
              overline: cardOverline || null,
              title: cardTitle || null,
              description: cardDescription || null,
              action: cardAction
                ? {
                    label: cardAction?.name || '',
                    url: cardAction?.url || '',
                  }
                : null,
              media: cardImage
                ? {
                    url: cardImage || '',
                    alt: cardAltText || '',
                  }
                : null,
            }
          }),
        } as PageContentSectionCardGridDesconstructed,
      }
    }
    case 'productCarousel': {
      const productCarousel = section?.contentProperties
      const products = (getPropertyValueByAlias(productCarousel, 'products')
        ?.contentList || []) as any[]
      const list = await GetProductList(products.map((item) => item.id))

      return {
        type,
        config: {
          products: list.map((item, index) => {
            const skuName = getPropertyValueByAlias(
              item?.properties,
              'skuName',
            )?.value
            const skuDescription = getPropertyValueByAlias(
              item?.properties,
              'skuDescription',
            )?.sourceValue
            const image = getPropertyValueByAlias(item?.properties, 'image')
              ?.mediaItems?.[0]?.url
            const altText = getPropertyValueByAlias(
              item?.properties,
              'altText',
            )?.value
            return {
              id: item?.id || index,
              overline: 'Nossa cerveja',
              title: skuName || null,
              description: skuDescription || null,
              media: image
                ? {
                    url: image,
                    alt: altText,
                  }
                : null,
              actionPrimary: null,
              actionSecondary: null,
            }
          }),
        } as PageContentSectionProductCarousel,
      }
    }
    case 'carouselCardsLine': {
      const carouselCardsLine = section?.contentProperties
      const title = getPropertyValueByAlias(carouselCardsLine, 'title')?.value
      const description = getPropertyValueByAlias(
        carouselCardsLine,
        'description',
      )?.sourceValue
      const colNumber = Number(
        getPropertyValueByAlias(carouselCardsLine, 'colNumber')?.value || '3',
      )
      const cards = (getPropertyValueByAlias(carouselCardsLine, 'cards')
        ?.blocks || []) as any[]
      return {
        type,
        config: {
          title: title || null,
          description: description || null,
          columns: colNumber || null,
          cards: cards.map((item) => {
            const cardOverline = getPropertyValueByAlias(
              item?.contentProperties,
              'overlineCard',
            )?.value
            const cardTitle = getPropertyValueByAlias(
              item?.contentProperties,
              'titleCard',
            )?.value
            const cardDescription = getPropertyValueByAlias(
              item?.contentProperties,
              'descriptionCard',
            )?.value
            const cardImage = getPropertyValueByAlias(
              item?.contentProperties,
              'imageCard',
            )?.mediaItems?.[0]?.url
            const cardAltText = getPropertyValueByAlias(
              item?.contentProperties,
              'altText',
            )?.value
            const cardAction = getPropertyValueByAlias(
              item?.contentProperties,
              'actionCard',
            )?.links?.[0]

            return {
              overline: cardOverline || null,
              title: cardTitle || null,
              description: cardDescription || null,
              action: cardAction
                ? {
                    label: cardAction?.name || '',
                    url: cardAction?.url || '',
                  }
                : null,
              media: cardImage
                ? {
                    url: cardImage || '',
                    alt: cardAltText || '',
                  }
                : null,
            }
          }),
        } as PageContentSectionCarouselCardsLine,
      }
    }
    case 'mediaCarousel': {
      const mediaCarousel = section?.contentProperties
      const title = getPropertyValueByAlias(mediaCarousel, 'title')?.value
      const description = getPropertyValueByAlias(
        mediaCarousel,
        'description',
      )?.sourceValue
      const autoplay = !!getPropertyValueByAlias(mediaCarousel, 'autoplay')
        ?.value
      const infiniteScroll = !!getPropertyValueByAlias(
        mediaCarousel,
        'infiniteScroll',
      )?.value
      const slides = (getPropertyValueByAlias(mediaCarousel, 'slides')
        ?.blocks || []) as any[]

      return {
        type,
        config: {
          title: title || null,
          description: description || null,
          autoplay,
          infiniteScroll,
          slides: slides.map((item, index) => {
            const slideOverline = getPropertyValueByAlias(
              item?.contentProperties,
              'overline',
            )?.value
            const slideSubtitle = getPropertyValueByAlias(
              item?.contentProperties,
              'subtitle',
            )?.value
            const slideImage = getPropertyValueByAlias(
              item?.contentProperties,
              'image',
            )?.mediaItems?.[0]?.url
            const slideAltText = getPropertyValueByAlias(
              item?.contentProperties,
              'altText',
            )?.value

            return {
              overline: slideOverline || null,
              subtitle: slideSubtitle || null,
              media: slideImage
                ? {
                    url: slideImage,
                    alt: slideAltText,
                  }
                : null,
            }
          }),
        } as PageContentSectionMediaCarousel,
      }
    }
    case 'contentVideo': {
      const contentVideo = section?.contentProperties
      const overline = getPropertyValueByAlias(contentVideo, 'overline')?.value
      const title = getPropertyValueByAlias(contentVideo, 'title')?.value
      const description = getPropertyValueByAlias(
        contentVideo,
        'description',
      )?.sourceValue
      const position = getPropertyValueByAlias(contentVideo, 'position')?.value
      const url = getPropertyValueByAlias(contentVideo, 'uRLEmbed')?.value
      const buttonContentVideoPrimary = getPropertyValueByAlias(
        contentVideo,
        'buttonContentVideo',
      )?.blocks?.[0]
      const buttonContentVideoSecondary = getPropertyValueByAlias(
        contentVideo,
        'buttonContentVideo',
      )?.blocks?.[1]

      const response = {
        type,
        config: {
          overline: overline || null,
          title: title || null,
          description: description || null,
          position: ['start', 'end'].includes(position) ? position : null,
          primaryAction: null,
          secondaryAction: null,
          url: url || null,
        } as PageContentSectionContentVideo,
      }

      if (buttonContentVideoPrimary) {
        response.config.primaryAction = {
          label:
            getPropertyValueByAlias(
              buttonContentVideoPrimary?.contentProperties || [],
              'label',
            )?.value || '',
          url:
            getPropertyValueByAlias(
              buttonContentVideoPrimary?.contentProperties || [],
              'buttonLink',
            )?.links?.[0]?.url || '',
        }
      }

      if (buttonContentVideoSecondary) {
        response.config.secondaryAction = {
          label:
            getPropertyValueByAlias(
              buttonContentVideoSecondary?.contentProperties || [],
              'label',
            )?.value || '',
          url:
            getPropertyValueByAlias(
              buttonContentVideoSecondary?.contentProperties || [],
              'buttonLink',
            )?.links?.[0]?.url || '',
        }
      }

      return response
    }
    case 'sectionForm': {
      const sectionForm = section?.contentProperties
      const title = getPropertyValueByAlias(sectionForm, 'title')?.value
      const description = getPropertyValueByAlias(
        sectionForm,
        'description',
      )?.value
      const enableSocialLogin = !!getPropertyValueByAlias(
        sectionForm,
        'enableSocialLogin',
      )?.value
      const successMessage = getPropertyValueByAlias(
        sectionForm,
        'successMessage',
      )?.sourceValue
      const errorMessage = getPropertyValueByAlias(
        sectionForm,
        'errorMessage',
      )?.sourceValue
      const formId = getPropertyValueByAlias(
        getPropertyValueByAlias(sectionForm, 'captureType')?.blocks?.[0]
          ?.contentProperties || [],
        'uForms',
      )?.value

      const form = await GetUFormContent(
        formId,
        contentId,
        getPropertyValueByAlias(sectionForm, 'captureType')?.blocks?.[0]
          ?.contentAlias,
      )

      return {
        type,
        config: {
          title: title || null,
          description: description || null,
          enableSocialLogin: enableSocialLogin || null,
          successMessage: successMessage || null,
          errorMessage: errorMessage || null,
          form,
        } as PageContentSectionSectionForm,
      }
    }
    case 'iframe': {
      const iframe = section?.contentProperties
      const title = getPropertyValueByAlias(iframe, 'title')?.value
      const description = getPropertyValueByAlias(iframe, 'description')?.value
      const iframeText = getPropertyValueByAlias(iframe, 'iframeText')?.value
      const height = getPropertyValueByAlias(iframe, 'height')?.value
      const width = getPropertyValueByAlias(iframe, 'width')?.value

      return {
        type,
        config: {
          title: title || '',
          description: description || '',
          iframe: iframeText || '',
          height: height || 'Cheia',
          width: width || 'Largo',
        } as PageContentSectionIframe,
      }
    }
    case 'mediaEmbed': {
      const mediaEmbed = section?.contentProperties
      const mediaType = getPropertyValueByAlias(mediaEmbed, 'mediaType')?.value
      const overline = getPropertyValueByAlias(mediaEmbed, 'overline')?.value
      const caption = getPropertyValueByAlias(mediaEmbed, 'caption')?.value
      const urlEmbed = getPropertyValueByAlias(mediaEmbed, 'urlEmbed')?.value
      const image = getPropertyValueByAlias(mediaEmbed, 'image')
        ?.mediaItems?.[0]?.url
      const altText = getPropertyValueByAlias(mediaEmbed, 'altText')?.value
      const description = getPropertyValueByAlias(
        mediaEmbed,
        'description',
      )?.value

      return {
        type,
        config: {
          type: mediaType || 'Playlist',
          overline: overline || null,
          caption: caption || null,
          urlEmbed: urlEmbed || null,
          media: image
            ? {
                url: image || '',
                alt: altText || '',
              }
            : null,
          description: description || null,
        } as PageContentSectionMediaEmbed,
      }
    }
    case 'nutritionalInformation': {
      const nutritionalInformation = section?.contentProperties
      const titleMain = getPropertyValueByAlias(
        nutritionalInformation,
        'titleMain',
      )?.value
      const volume = getPropertyValueByAlias(
        nutritionalInformation,
        'volume',
      )?.value
      const ingredients = getPropertyValueByAlias(
        nutritionalInformation,
        'ingredients',
      )?.sourceValue
      const allergens = getPropertyValueByAlias(
        nutritionalInformation,
        'alergenics',
      )?.sourceValue
      const values = (getPropertyValueByAlias(nutritionalInformation, 'values')
        ?.blocks || []) as any[]
      const showAboutContent = getPropertyValueByAlias(
        nutritionalInformation,
        'showAboutContent',
      )?.value
      const position = getPropertyValueByAlias(
        nutritionalInformation,
        'position',
      )?.value
      const aboutOverline = getPropertyValueByAlias(
        nutritionalInformation,
        'aboutOverline',
      )?.value
      const aboutTitle = getPropertyValueByAlias(
        nutritionalInformation,
        'aboutTitle',
      )?.value
      const aboutDescription = getPropertyValueByAlias(
        nutritionalInformation,
        'aboutDescription',
      )?.sourceValue
      const aboutImage = getPropertyValueByAlias(
        nutritionalInformation,
        'aboutImage',
      )?.mediaItems[0]?.url
      const aboutAltText = getPropertyValueByAlias(
        nutritionalInformation,
        'aboutAltText',
      )?.value

      return {
        type,
        config: {
          titleMain: titleMain || null,
          volume: volume || null,
          ingredients: ingredients || null,
          allergens: allergens || null,
          showAboutContent: !!showAboutContent,
          position: position || 'start',
          aboutOverline: aboutOverline || null,
          aboutTitle: aboutTitle || null,
          aboutDescription: aboutDescription || null,
          media: aboutImage
            ? {
                url: aboutImage || '',
                alt: aboutAltText || '',
              }
            : null,
          values: values.map((value) => {
            const title = getPropertyValueByAlias(
              value.contentProperties,
              'title',
            )?.value
            const description = getPropertyValueByAlias(
              value.contentProperties,
              'description',
            )?.sourceValue
            const additionalInfo = getPropertyValueByAlias(
              value.contentProperties,
              'aditionalInfo',
            )?.value
            const icon = getPropertyValueByAlias(
              value.contentProperties,
              'icon',
            )?.mediaItems[0]?.url
            const altText = getPropertyValueByAlias(
              value.contentProperties,
              'altText',
            )?.value

            return {
              title: title || null,
              description: description || null,
              additionalInfo: additionalInfo || null,
              icon: icon
                ? {
                    url: icon || '',
                    alt: altText || '',
                  }
                : null,
            }
          }),
        } as PageContentSectionNutritionalInformation,
      }
    }
    case 'widgetCapture': {
      const widgetCapture = section?.contentProperties
      const overline = getPropertyValueByAlias(widgetCapture, 'overline')?.value
      const socialLoginOptions = getPropertyValueByAlias(
        widgetCapture,
        'socialLoginOptions',
      )?.value

      const title = getPropertyValueByAlias(widgetCapture, 'title')?.value
      const description = getPropertyValueByAlias(
        widgetCapture,
        'description',
      )?.sourceValue
      const sourceTitle = getPropertyValueByAlias(
        widgetCapture,
        'sourceTitle',
      )?.value
      const successMessage = getPropertyValueByAlias(
        widgetCapture,
        'successMessage',
      )?.sourceValue
      const errorMessage = getPropertyValueByAlias(
        widgetCapture,
        'errorMessage',
      )?.sourceValue
      const urlSuccessMessage = getPropertyValueByAlias(
        widgetCapture,
        'urlSuccessMessage',
      )?.links?.[0]
      const image = getPropertyValueByAlias(widgetCapture, 'image')
        ?.mediaItems?.[0]?.url
      const altText = getPropertyValueByAlias(widgetCapture, 'altText')?.value

      const formId = getPropertyValueByAlias(widgetCapture, 'captureType')
        ?.blocks?.[0]?.contentProperties?.[0]?.value?.value

      const form = await GetUFormContent(
        formId,
        contentId,
        getPropertyValueByAlias(widgetCapture, 'captureType')?.blocks?.[0]
          ?.contentAlias,
      )

      return {
        type,
        config: {
          overline: overline || null,
          title: title || null,
          socialLoginOptions: socialLoginOptions || [],
          description: description || null,
          sourceTitle: sourceTitle || null,
          successMessage: successMessage || null,
          errorMessage: errorMessage || null,
          urlSuccessMessage: urlSuccessMessage
            ? {
                url: urlSuccessMessage?.url || '',
                label: urlSuccessMessage?.name || '',
              }
            : null,
          media: image
            ? {
                url: image,
                alt: altText,
              }
            : null,
          form,
        } as PageContentSectionWidgetCapture,
      }
    }

    case 'socialLoginRecommender': {
      const recommendedContent = section?.contentProperties
      const title = getPropertyValueByAlias(recommendedContent, 'title')?.value

      return {
        type,
        config: {
          title: title || null,
        } as PageContentSectionRecommendedContent,
      }
    }

    default: {
      return {
        type,
        config: {} as any,
      }
    }
  }
}
