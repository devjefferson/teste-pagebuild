import { PageContentSectionContentImage } from '@/models/PageContent'
import { htmlToText } from '@/utils/htmlToText'
import { ContentImage as DonutContentImage } from '@squadfy/uai-design-system'
import NextLink from 'next/link'

type Props = {
  data: PageContentSectionContentImage
}

export default function ContentImage({ data }: Props) {
  return (
    <DonutContentImage
      className="overflow-x-hidden "
      overline={htmlToText(data.overline)}
      title={{
        children: htmlToText(data.title),
      }}
      imageAlign={data.position || undefined}
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
              className: 'flex flex-1 justify-center',
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
        data.media
          ? {
              src: data.media.url,
              alt: data.media.alt,
            }
          : undefined
      }
    />
  )
}
