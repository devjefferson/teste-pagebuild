import DefaultLayout from '@/layouts/DefaultLayout'
import { PageContent } from '@/models/PageContent'
import Sections from '@/sections/Sections'
import { GetProductsPageContent } from '@/services/GetProductsPageContent'
import { GetServerSideProps, NextPage } from 'next'

type PageProps = {
  pageContent: PageContent
}

const Page: NextPage<PageProps> = ({ pageContent }) => {
  return (
    <DefaultLayout seo={pageContent.seo} hero={pageContent.hero}>
      <Sections items={pageContent.sections} />
    </DefaultLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  resolvedUrl,
}) => {
  const pageContent = await GetProductsPageContent(resolvedUrl)

  if (!pageContent) {
    return { notFound: true }
  }

  return {
    props: {
      pageContent,
    },
  }
}

export default Page
