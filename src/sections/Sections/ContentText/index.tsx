import { PageContentSectionContentText } from '@/models/PageContent'
import { htmlToText } from '@/utils/htmlToText'
import { ContentText as DonutContentText } from '@squadfy/uai-design-system'
import NextLink from 'next/link'

type Props = {
  data: PageContentSectionContentText
}

export default function ContentText({ data }: Props) {
  return (
    <DonutContentText
      className="overflow-x-hidden"
      variant={data.media ? 'brand' : 'default'}
      overline={htmlToText(data.overline) || ''}
      title={htmlToText(data.title) || ''}
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
      action={
        data.action
          ? {
              asChild: true,
              children: (
                <NextLink href={data.action?.url || '/'}>
                  {data.action.label || ''}
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
