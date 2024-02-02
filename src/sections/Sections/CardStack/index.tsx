import { PageContentSectionCardStack } from '@/models/PageContent'
import { useEffect, useState } from 'react'
import { CardStack as DonutCardStack } from '@squadfy/uai-design-system'
import NextLink from 'next/link'

type Props = {
  data: PageContentSectionCardStack
}

export default function CardStack({ data }: Props) {
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
      columns={4}
      delay={3000}
      description={data.description || ''}
      mobileOrientation="horizontal"
      title={data.title || ''}
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
