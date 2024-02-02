import { AgeGateContent } from '@/models/AgeGateContent'

export default function GetAgeGateContent(
  data: any,
): AgeGateContent | undefined {
  try {
    const properties = (data?.properties || []) as any[]

    if (properties.length === 0) throw new Error()

    return {
      title: getTitle(properties),
      description: getDescription(properties),
      image: getImage(properties),
      altText: getAltText(properties),
      deniedAccessTitle: getDeniedAccessTitle(properties),
      deniedAccessDescription: getDeniedAccessDescription(properties),
      deniedAccessImage: getDeniedAccessImage(properties),
      deniedAccessAltText: getDeniedAccessAltText(properties),
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

function getTitle(properties: any[]): AgeGateContent['title'] {
  const title = getPropertyByAlias(properties, 'title')

  return title?.value || ''
}

function getDescription(properties: any[]): AgeGateContent['description'] {
  const description = getPropertyByAlias(properties, 'description')

  return description?.sourceValue || ''
}

function getImage(properties: any[]): AgeGateContent['image'] {
  const image = getPropertyByAlias(properties, 'image')?.mediaItems?.[0]

  return {
    id: image?.id || 0,
    url: image?.url || '',
  }
}

function getAltText(properties: any[]): AgeGateContent['altText'] {
  const altText = getPropertyByAlias(properties, 'altText')

  return altText?.value || ''
}

function getDeniedAccessTitle(
  properties: any[],
): AgeGateContent['deniedAccessTitle'] {
  const deniedAccessTitle = getPropertyByAlias(properties, 'deniedAccessTitle')

  return deniedAccessTitle?.value || ''
}

function getDeniedAccessDescription(
  properties: any[],
): AgeGateContent['deniedAccessDescription'] {
  const deniedAccessDescription = getPropertyByAlias(
    properties,
    'deniedAccessDescription',
  )

  return deniedAccessDescription?.sourceValue || ''
}

function getDeniedAccessImage(
  properties: any[],
): AgeGateContent['deniedAccessImage'] {
  const deniedAccessImage = getPropertyByAlias(properties, 'deniedAccessImage')
    ?.mediaItems?.[0]

  return {
    id: deniedAccessImage?.id || 0,
    url: deniedAccessImage?.url || '',
  }
}

function getDeniedAccessAltText(
  properties: any[],
): AgeGateContent['deniedAccessAltText'] {
  const deniedAccessAltText = getPropertyByAlias(
    properties,
    'deniedAccessAltText',
  )

  return deniedAccessAltText?.value || ''
}
