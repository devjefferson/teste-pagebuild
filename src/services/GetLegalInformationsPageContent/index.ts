import {
  PageContent,
  PageContentHero,
  PageContentHeroHeadline,
  PageContentHeroImage,
  PageContentSectionLegalInformationItem,
  PageContentSectionLegalInformationList,
} from '@/models/PageContent'
import { gql } from 'graphql-request'
import GQLClient from '../GQLClient'

export async function GetLegalInformationsPageContent(
  route: string,
): Promise<PageContent | null> {
  try {
    const data = await GQLClient.request<any>(
      gql`
        query ($route: String!) {
          page: contentByAbsoluteRoute(route: $route) {
            properties {
              alias
              value {
                ... on BasicPropertyValue {
                  value
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
                      }
                    }
                  }
                }
              }
            }
            children {
              url
              properties {
                alias
                value {
                  ... on BasicPropertyValue {
                    value
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
    const children = (data?.page?.children || []) as any[]

    return {
      seo: getSeo(properties),
      hero: getHero(properties),
      sections: [
        {
          type: 'legalInformationList',
          config: {
            list: children.map((item, index) => {
              const legalProperties = (item?.properties || []) as any[]
              const title = getPropertyValueByAlias(
                legalProperties,
                'title',
              )?.value
              const description = getPropertyValueByAlias(
                legalProperties,
                'shortDescription',
              )?.value
              return {
                id: index,
                title: title || '',
                description: description || '',
                action: {
                  url: item?.url || '',
                },
              }
            }),
          } as PageContentSectionLegalInformationList,
        },
      ],
    }
  } catch (error) {
    return null
  }
}

export async function GetLegalInformationPageContent(
  route: string,
): Promise<PageContent | null> {
  try {
    const data = await GQLClient.request<any>(
      gql`
        query ($route: String!) {
          page: contentByAbsoluteRoute(route: $route) {
            url
            updateDate
            properties {
              alias
              value {
                ... on BasicPropertyValue {
                  value
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
              }
            }
          }
          menu: contentByAbsoluteRoute(route: "/informacoes-legais") {
            children {
              url
              properties {
                alias
                value {
                  ... on BasicPropertyValue {
                    value
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
    const menu = (data?.menu?.children || []) as any[]

    return {
      seo: getSeo(properties),
      hero: getHero(properties),
      sections: [
        {
          type: 'legalInformationItem',
          config: {
            menu: menu.map((item, index) => {
              const menuProperties = (item?.properties || []) as any[]
              const title = getPropertyValueByAlias(
                menuProperties,
                'title',
              )?.value
              return {
                id: index,
                action: {
                  label: title || '',
                  url: item?.url || '',
                },
              }
            }),
            action: {
              url: data?.page?.url || '',
            },
            title: getPropertyValueByAlias(properties, 'title')?.value || '',
            updatedAt: data?.page?.updateDate || '',
            description:
              getPropertyValueByAlias(properties, 'text')?.sourceValue || '',
          } as PageContentSectionLegalInformationItem,
        },
      ],
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
