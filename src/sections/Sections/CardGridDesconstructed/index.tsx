import { PageContentSectionCardGridDesconstructed } from '@/models/PageContent'
import { CardGrid as DonutCardGrid } from '@squadfy/uai-design-system'
import NextLink from 'next/link'

type Props = {
  data: PageContentSectionCardGridDesconstructed
}

export default function CardGridDesconstructed({ data }: Props) {
  return (
    <DonutCardGrid
      className="overflow-x-hidden"
      columns={data.columns || undefined}
      title={data.title || ''}
      cards={data.cards.map((item, index) => ({
        id: index.toString(),
        overline: item.overline || '',
        title: item.title || '',
        description: item.description || '',
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
        media: item.media
          ? {
              src: item.media.url,
              alt: item.media.alt,
            }
          : undefined,
      }))}
    />
  )
}
