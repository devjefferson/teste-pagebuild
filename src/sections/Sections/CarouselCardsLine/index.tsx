import { PageContentSectionCarouselCardsLine } from '@/models/PageContent'
import { CardStack as DonutCardStack } from '@squadfy/uai-design-system'
import { useEffect, useState } from 'react'
import NextLink from 'next/link'

type Props = {
  data: PageContentSectionCarouselCardsLine
}

export default function CarouselCardsLine({ data }: Props) {
  const [isSSR, setIsSSR] = useState(true)

  useEffect(() => {
    setIsSSR(false)
  }, [])

  if (isSSR) {
    return null
  }
  return (
    <DonutCardStack
      className="overflow-x-hidden"
      delay={3000}
      columns={data.columns || undefined}
      title={data.title || ''}
      description={
        data.description
          ? {
              asChild: true,
              children: (
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.description || '',
                  }}
                />
              ),
            }
          : undefined
      }
      mobileOrientation="horizontal"
      cards={data.cards.map((item, index) => ({
        id: index.toString(),
        overline: item.overline || '',
        title: item.title || '',
        description: item.description || '',
        media: item.media
          ? {
              alt: item.media.alt,
              aspectRatio: '16/9',
              src: item.media.url,
            }
          : undefined,
        action: item.action
          ? {
              asChild: true,
              children: (
                <NextLink href={item.action?.url || '/'}>
                  {item.action.label || ''}
                </NextLink>
              ),
            }
          : undefined,
      }))}
    />
  )
}
