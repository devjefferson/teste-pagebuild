import DefaultLayout from '@/layouts/DefaultLayout'
import { PageContent } from '@/models/PageContent'
import PageContents from '@/sections/ContentPage'
import Sections from '@/sections/Sections'
import GetEntryPageContent from '@/services/GetEntryPageContent'
import withSsr from '@/utils/withSsr'
import { NextPage } from 'next'

type PageProps = {
  pageContent: PageContent
}

const Page: NextPage<PageProps> = ({ pageContent }) => {
  return (
    <DefaultLayout seo={pageContent.seo} hero={pageContent.hero}>
      <PageContents content={pageContent.contentPage} />
      <Sections items={pageContent.sections} />
    </DefaultLayout>
  )
}

export const getServerSideProps = withSsr(async ({ resolvedUrl }) => {
  const pageContent = await GetEntryPageContent(resolvedUrl)

  if (!pageContent) {
    return { notFound: true }
  }

  return {
    props: {
      pageContent,
    },
  }
})

export default Page
