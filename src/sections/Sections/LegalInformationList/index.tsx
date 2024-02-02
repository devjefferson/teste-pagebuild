import { PageContentSectionLegalInformationList } from '@/models/PageContent'
import { CardGrid as DonutCardGrid } from '@squadfy/uai-design-system'
import NextLink from 'next/link'

type Props = {
  data: PageContentSectionLegalInformationList
}

export default function LegalInformationList({ data }: Props) {
  return (
    <DonutCardGrid
      className="overflow-x-hidden"
      cards={data.list.map((item) => ({
        id: String(item.id),
        title: item.title || '',
        description: item.description || '',
        action: item.action
          ? {
              asChild: true,
              children: (
                <NextLink href={item.action?.url || '/'}>Acessar</NextLink>
              ),
            }
          : undefined,
      }))}
    />
  )
}
