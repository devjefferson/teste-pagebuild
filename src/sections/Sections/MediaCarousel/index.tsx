import { PageContentSectionMediaCarousel } from '@/models/PageContent'
import { ImageStack as DonutImageStack } from '@squadfy/uai-design-system'

type Props = {
  data: PageContentSectionMediaCarousel
}

export default function MediaCarousel({ data }: Props) {
  return (
    <DonutImageStack
      className="overflow-x-hidden"
      columns={1}
      delay={data.autoplay ? 3000 : undefined}
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
      infiniteScroll={!!data.infiniteScroll}
      medias={data.slides.map((item, index) => ({
        id: index.toString(),
        alt: item.media?.alt || '',
        src: item.media?.url || '',
        aspectRatio: '16/9',
      }))}
    />
  )
}
