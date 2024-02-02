import { PageContentSectionFAQ } from '@/models/PageContent'
import { Faq as DonutFaq } from '@squadfy/uai-design-system'

type Props = {
  data: PageContentSectionFAQ
}

export default function Faq({ data }: Props) {
  return (
    <DonutFaq
      className="overflow-x-hidden"
      title={data.title || ''}
      description={data.description || ''}
      faqs={data.list.map((itemFaq, index) => ({
        id: index.toString(),
        title: itemFaq.title || '',
        description: {
          asChild: true,
          children: (
            <div
              dangerouslySetInnerHTML={{
                __html: itemFaq.description || '',
              }}
            />
          ),
        },
      }))}
      message={
        data.message
          ? {
              description: data.message.label || '',
              link: {
                href: data.message.link.url,
                children: data.message.link.label,
              },
            }
          : undefined
      }
    />
  )
}
