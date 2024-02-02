import { TContentPagePayload } from '@/models/PageContent'
import ContentPageNews from './ContentPageNews'

type PageContentProps = {
  content?: TContentPagePayload
}

export default function PageContents({ content }: PageContentProps) {
  return <PageContent content={content} />
}

function PageContent({ content }: PageContentProps) {
  switch (content?.type) {
    case 'capturePage': {
      return <ContentPageNews data={content.data} />
    }

    default: {
      return <></>
    }
  }
}
