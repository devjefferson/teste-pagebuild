import DefaultLayout from '@/layouts/DefaultLayout'
import { PageContent } from '@/models/PageContent'
import UserCreateForm from '@/sections/Sections/User/Create/Form'
import GetEntryPageContent from '@/services/GetEntryPageContent'
import withSsr from '@/utils/withSsr'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

type PageProps = {
  pageContent: PageContent
}

const Page: NextPage<PageProps> = ({ pageContent }) => {
  const { query } = useRouter()
  return (
    <DefaultLayout seo={pageContent.seo} hero={pageContent.hero}>
      <UserCreateForm user={query} />
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
