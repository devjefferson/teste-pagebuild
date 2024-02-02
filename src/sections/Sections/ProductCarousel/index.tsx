import { PageContentSectionProductCarousel } from '@/models/PageContent'
import { ProductCarousel as DonutProductCarousel } from '@squadfy/uai-design-system'

type Props = {
  data: PageContentSectionProductCarousel
}

export default function ProductCarousel({ data }: Props) {
  return (
    <DonutProductCarousel
      className="overflow-x-hidden"
      slides={data.products.map((item) => ({
        id: item.id.toString(),
        title: item.title || '',
        overline: item.overline || '',
        description: item.description
          ? {
              asChild: true,
              children: (
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.description || '',
                  }}
                />
              ),
            }
          : undefined,
        media: item.media
          ? {
              alt: item.media.alt || '',
              src: item.media.url || '',
            }
          : undefined,
        actions:
          item.actionPrimary || item.actionSecondary
            ? {
                primary: item.actionPrimary
                  ? {
                      children: item.actionPrimary.label,
                      onClick: () => {},
                    }
                  : undefined,
                secondary: item.actionSecondary
                  ? {
                      children: item.actionSecondary.label,
                      onClick: () => {},
                    }
                  : undefined,
              }
            : undefined,
      }))}
    />
  )
}
