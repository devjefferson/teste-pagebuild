import {
  PageContent,
  PageContentHero,
  PageContentHeroHeadline,
  PageContentHeroImage,
  PageContentHeroProduct,
  PageContentSectionProductCardGrid,
} from '@/models/PageContent'
import { gql } from 'graphql-request'
import GQLClient from '../GQLClient'

export async function GetProductsPageContent(
  route: string,
): Promise<PageContent | null> {
  try {
    const data = await GQLClient.request<any>(
      gql`
        query ($route: String!) {
          page: contentByAbsoluteRoute(route: $route) {
            name
            children {
              name
              id
              url
              children {
                id
                properties {
                  value {
                    alias
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
                  }
                }
              }
            }
            properties {
              value {
                alias
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
      hero: getHeroPageProducts(properties),
      sections: await getSections(children),
    }
  } catch (error) {
    return null
  }
}

export async function GetProductPageContent(
  route: string,
): Promise<PageContent | null> {
  try {
    const data = await GQLClient.request<any>(
      gql`
        query ($route: String!) {
          page: contentByAbsoluteRoute(route: $route) {
            url
            children {
              name
              properties {
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
                      url
                      id
                    }
                  }
                }
              }
            }
            properties {
              value {
                alias
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
          }
        }
      `,
      { route },
    )

    if (!data?.page) throw new Error()

    const properties = (data?.page?.properties || []) as any[]

    return {
      seo: getSeo(properties),
      hero: getHeroPageProduct(data?.page),
      sections: [],
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

function getHeroPageProducts(properties: any[]): PageContent['hero'] | null {
  const hero = getPropertyValueByAlias(properties, 'hero')?.blocks?.[0]

  const contentAlias = String(hero?.contentAlias || '')
  const contentProperties = (hero?.contentProperties || []) as any[]

  return getHeroByType(contentProperties, contentAlias)
}

function getHeroPageProduct(page: any): PageContent['hero'] | null {
  const product = page?.children?.[0]
  const properties = (product?.properties || []) as any[]
  const title = getPropertyValueByAlias(properties, 'skuName')?.value
  const subtitle = getPropertyValueByAlias(
    properties,
    'skuDescription',
  )?.sourceValue
  const image = getPropertyValueByAlias(properties, 'image')?.mediaItems?.[0]
    ?.url
  const altText = getPropertyValueByAlias(properties, 'altText')?.value

  return {
    type: 'heroProduct',
    config: {
      subtitle: subtitle || '',
      title: title || null,
      breadcrumb: [
        { id: 'breadcrumb-home', label: 'Home', url: '/' },
        { id: 'breadcrumb-products', label: 'Produtos', url: '/produtos' },
        {
          id: 'breadcrumb-product-item',
          label: product?.name || '',
          url: page?.url || '',
        },
      ],
      image: image
        ? {
            url: image,
            alt: altText,
          }
        : null,
    } as PageContentHeroProduct,
  }
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

async function getSections(children: any[]): Promise<PageContent['sections']> {
  return [
    {
      type: 'productCardGrid',
      config: {
        title: null,
        products: children.map((item, index) => {
          const product = item?.children?.[0]
          const productProperties = (item?.children?.[0]?.properties ||
            []) as any[]
          const id = product?.id
          const title = getPropertyValueByAlias(
            productProperties,
            'skuName',
          )?.value
          const image = getPropertyValueByAlias(productProperties, 'image')
            ?.mediaItems?.[0]?.url
          const altText = getPropertyValueByAlias(
            productProperties,
            'altText',
          )?.value

          return {
            id: id || index,
            title: title || '',
            action: {
              url: item?.url || '',
            },
            media: {
              url: image || '',
              alt: altText || '',
            },
          }
        }),
      } as PageContentSectionProductCardGrid,
    },
  ]
}
