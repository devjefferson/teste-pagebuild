import { PageContentSectionSocialLinks } from '@/models/PageContent'
import { useApp } from '@/providers/App'
import { SocialLinks as DonutSocialLinks } from '@squadfy/uai-design-system'

type Props = {
  data: PageContentSectionSocialLinks
}

export default function SocialLinks({ data }: Props) {
  const {
    siteSetup: { brand },
  } = useApp()

  if (!brand) return null

  return (
    <DonutSocialLinks
      className="overflow-x-hidden"
      title={data.title || ''}
      socialMedia={brand.socialMedia.map((item) => ({
        href: item.url,
        social: item.type,
      }))}
    />
  )
}
