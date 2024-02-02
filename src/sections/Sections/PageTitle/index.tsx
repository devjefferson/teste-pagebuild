'use client'
import classMerge from '@/utils/classMerge'
import { Headline } from '@squadfy/uai-design-system'

type PageTitleProps = {
  title?: string
  description?: string
  overline?: string
}

export default function PageTitle({
  title,
  overline,
  description,
}: PageTitleProps) {
  return (
    <Headline
      className={classMerge(['overflow-hidden', 'bg-background-brand'])}
      title={
        title
          ? {
              children: title,
              colorMode: 'contrast',
            }
          : undefined
      }
      description={
        description
          ? {
              colorMode: 'contrast',
              children: description,
            }
          : undefined
      }
      variant="default"
      overline={
        overline
          ? {
              children: overline,
              colorMode: 'contrast',
            }
          : undefined
      }
    />
  )
}
