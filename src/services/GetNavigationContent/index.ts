import { NavigationContent } from '@/models/NavigationContent'

export default function GetNavigationContent(
  data: any,
): NavigationContent | undefined {
  try {
    const properties = (data?.nodes?.[0]?.properties || []) as any[]

    if (properties.length === 0) throw new Error()

    return {
      headers: getHeaders(properties),
      footers: getFooters(properties),
      hideRestrictArea: getHideRestrictArea(properties),
    }
  } catch (error) {
    return undefined
  }
}

function getPropertyByAlias(properties: any[], alias: string): any | undefined {
  const property = properties.find((item) => item?.value?.alias === alias)
  if (property) {
    return property?.value
  }
  return undefined
}

function getHeaders(properties: any[]): NavigationContent['headers'] {
  const headers = getPropertyByAlias(properties, 'headers')
  const flavor = headers?.blocks?.[0]?.contentAlias

  const navigation = (getPropertyByAlias(
    headers?.blocks?.[0]?.contentProperties,
    'navigation',
  )?.links || []) as any[]
  const buttonHeader = getPropertyByAlias(
    headers?.blocks?.[0]?.contentProperties,
    'buttonHeader',
  )?.blocks?.[0]

  const navigationLeft = (getPropertyByAlias(
    headers?.blocks?.[0]?.contentProperties,
    'navigationLeft',
  )?.links || []) as any[]
  const navigationRight = (getPropertyByAlias(
    headers?.blocks?.[0]?.contentProperties,
    'navigationLeft',
  )?.links || []) as any[]

  return {
    flavor,
    navigation: navigation.map((item) => ({
      label: item?.name || '',
      url: item?.url || '',
    })),
    navigationLeft: navigationLeft.map((item) => ({
      label: item?.name || '',
      url: item?.url || '',
    })),
    navigationRight: navigationRight.map((item) => ({
      label: item?.name || '',
      url: item?.url || '',
    })),
    buttonHeader: buttonHeader
      ? {
          label: buttonHeader?.contentProperties?.[0]?.value?.value || '',
          url:
            buttonHeader?.contentProperties?.[1]?.value?.links?.[0]?.url || '',
        }
      : undefined,
  }
}

function getFooters(properties: any[]): NavigationContent['footers'] {
  const footers = (getPropertyByAlias(properties, 'footers')?.blocks?.[0]
    ?.contentProperties || []) as any[]
  const flavor = getPropertyByAlias(properties, 'footers')?.blocks?.[0]
    ?.contentAlias
  const navigationFooter = (getPropertyByAlias(footers, 'navigationFooter')
    ?.blocks || []) as any[]
  const awareness = getPropertyByAlias(footers, 'awareness')
  const copyrightText = getPropertyByAlias(footers, 'copyrightText')
  const heinekenLogo = getPropertyByAlias(footers, 'heinekenLogo')
  const contactInfo = getPropertyByAlias(footers, 'contactInfo')
  const logoFooter = getPropertyByAlias(footers, 'logoFooter')
  const altText = getPropertyByAlias(footers, 'altText')
  const aditionalLink = getPropertyByAlias(footers, 'aditionalLink')

  return {
    // navigationFooter,
    flavor,
    navigationFooter: navigationFooter.map((item) => {
      const titleFooter =
        getPropertyByAlias(item?.contentProperties, 'titleFooter')?.value || ''
      const linkFooter = (getPropertyByAlias(
        item?.contentProperties,
        'linkFooter',
      )?.links || []) as any[]
      return {
        title: titleFooter,
        links: linkFooter.map((link) => ({
          label: link?.name || '',
          url: link?.url || '',
        })),
      }
    }),
    aditionalLink: aditionalLink?.links?.[0],
    awareness: awareness?.value || '',
    copyrightText: copyrightText?.value || '',
    heinekenLogo: {
      id: heinekenLogo?.mediaItems?.[0]?.id || 0,
      url: heinekenLogo?.mediaItems?.[0]?.url || '',
    },
    contactInfo: contactInfo?.sourceValue || '',
    logoFooter: {
      id: logoFooter?.mediaItems?.[0]?.id || 0,
      url: logoFooter?.mediaItems?.[0]?.url || '',
    },
    altText: altText?.value || '',
  }
}

function getHideRestrictArea(
  properties: any[],
): NavigationContent['hideRestrictArea'] {
  const hideRestrictArea = getPropertyByAlias(properties, 'hideRestrictArea')

  return !!hideRestrictArea?.value
}
