import { PageContentSectionContentVideo } from '@/models/PageContent'
import { ContentVideo as DonutContentVideo } from '@squadfy/uai-design-system'
import NextLink from 'next/link'

type Props = {
  data: PageContentSectionContentVideo
}

export default function ContentVideo({ data }: Props) {
  return (
    <DonutContentVideo
      className="overflow-x-hidden"
      overline={data.overline || ''}
      title={data.title || ''}
      mediaAlign={data.position || undefined}
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
      primaryAction={
        data.primaryAction
          ? {
              asChild: true,
              children: (
                <NextLink href={data.primaryAction?.url || '/'}>
                  {data.primaryAction.label || ''}
                </NextLink>
              ),
            }
          : undefined
      }
      secondaryAction={
        data.secondaryAction
          ? {
              asChild: true,
              children: (
                <NextLink href={data.secondaryAction?.url || '/'}>
                  {data.secondaryAction.label || ''}
                </NextLink>
              ),
            }
          : undefined
      }
      media={
        data.url
          ? {
              src: data.url,
            }
          : undefined
      }
    />
  )
}
