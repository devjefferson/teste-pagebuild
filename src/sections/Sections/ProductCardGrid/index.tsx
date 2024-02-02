import { PageContentSectionProductCardGrid } from '@/models/PageContent'
import { useApp } from '@/providers/App'
import { ProductCardGrid as DonutProductCardGrid } from '@squadfy/uai-design-system'

type Props = {
  data: PageContentSectionProductCardGrid
}

export default function ProductCardGrid({ data }: Props) {
  const {
    siteSetup: { brand },
  } = useApp()

  if (!brand) return null

  return (
    <DonutProductCardGrid
      columns={3}
      title={data.title || ''}
      items={data.products.map((item) => ({
        id: String(item.id),
        action: {
          href: item.action.url,
        },
        colorMode: 'main',
        media: {
          alt: item.media.alt,
          src: item.media.url,
        },
        title: item.title,
      }))}
    />
  )
}
