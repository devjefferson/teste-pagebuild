import { BrandContent } from '@/models/BrandContent'

export default function GetBrandContent(data: any): BrandContent | undefined {
  try {
    const properties = (data?.nodes?.[0]?.properties || []) as any[]

    if (properties.length === 0) throw new Error()

    return {
      brandName: getBrandName(properties),
      logo: getLogo(properties),
      favicon: getFavicon(properties),
      socialMedia: getSocialMedia(properties),
      titleSocialLinks: getTitleSocialLinks(properties),
      mainImage: getMainImage(properties),
      altText: getAltText(properties),
      PIIDataSubmissionScheduling: getPIIDataSubmissionScheduling(properties),
      successMessageContact: getSuccessMessageContact(properties),
      errorMessageContact: getErrorMessageContact(properties),
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

function getBrandName(properties: any[]): BrandContent['brandName'] {
  const brandName = getPropertyByAlias(properties, 'brandName')

  if (!brandName) throw new Error('brandName not found.')

  return brandName?.value || ''
}

function getLogo(properties: any[]): BrandContent['logo'] {
  const logos = (getPropertyByAlias(properties, 'logo')?.blocks || []) as any[]

  if (logos.length === 0) throw new Error('logo not found.')

  const getLogoByType = (type: string, color: string): any => {
    const logo = logos.find((itemLogo) => {
      const itemLogoType = itemLogo?.contentProperties?.[1]?.value?.value || ''
      const itemLogoColor = itemLogo?.contentProperties?.[2]?.value?.value || ''
      return itemLogoType === type && itemLogoColor === color
    })?.contentProperties?.[0]?.value?.mediaItems?.[0]

    return {
      id: logo?.id || 0,
      url: logo?.url || '',
    }
  }

  return {
    colorfulLogo: getLogoByType('Logotipo', 'Colorido'),
    monochromeLogo: getLogoByType('Logotipo', 'Monocromático'),
    colorfulSymbol: getLogoByType('Símbolo', 'Colorido'),
    monochromeSymbol: getLogoByType('Símbolo', 'Monocromático'),
  }
}

function getFavicon(properties: any[]): BrandContent['favicon'] {
  const favicon = getPropertyByAlias(properties, 'favicon')?.mediaItems?.[0]

  return {
    id: favicon?.id || 0,
    url: favicon?.url || '',
  }
}

function getSocialMedia(properties: any[]): BrandContent['socialMedia'] {
  const socialMedias = (getPropertyByAlias(properties, 'socialMedia')?.blocks ||
    []) as any[]

  return socialMedias.map((item) => ({
    type: String(
      item?.contentProperties?.[0]?.value?.value || '',
    ).toLowerCase(),
    url: item?.contentProperties?.[1]?.value?.links?.[0]?.url || '',
  })) as BrandContent['socialMedia']
}

function getTitleSocialLinks(
  properties: any[],
): BrandContent['titleSocialLinks'] {
  const titleSocialLinks = getPropertyByAlias(properties, 'titleSocialLinks')

  return titleSocialLinks?.value || ''
}

function getMainImage(properties: any[]): BrandContent['mainImage'] {
  const mainImage = getPropertyByAlias(properties, 'mainImage')?.mediaItems?.[0]

  return {
    id: mainImage?.id || 0,
    url: mainImage?.url || '',
  }
}

function getAltText(properties: any[]): BrandContent['altText'] {
  const altText = getPropertyByAlias(properties, 'altText')

  return altText?.value || ''
}

function getPIIDataSubmissionScheduling(
  properties: any[],
): BrandContent['PIIDataSubmissionScheduling'] {
  const pii = getPropertyByAlias(properties, 'PIIDataSubmissionScheduling')

  return !!pii?.value
}

function getSuccessMessageContact(
  properties: any[],
): BrandContent['successMessageContact'] {
  const successMessageContact = getPropertyByAlias(
    properties,
    'successMessageContact',
  )

  return successMessageContact?.sourceValue || ''
}

function getErrorMessageContact(
  properties: any[],
): BrandContent['errorMessageContact'] {
  const errorMessageContact = getPropertyByAlias(
    properties,
    'errorMessageContact',
  )

  return errorMessageContact?.sourceValue || ''
}
