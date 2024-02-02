import DefaultLayout from '@/layouts/DefaultLayout'
import { PageContent } from '@/models/PageContent'
import UserPasswordCreate from '@/sections/Sections/User/Passsword/FormCreate'
import GetEntryPageContent from '@/services/GetEntryPageContent'
import withSsr from '@/utils/withSsr'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

type PageProps = {
  pageContent: PageContent
}

const Page: NextPage<PageProps> = ({ pageContent }) => {
  const { query } = useRouter()
  const token = (query?.code || '') as string
  const id = (query?.id || '') as string

  return (
    <DefaultLayout seo={pageContent.seo} hero={pageContent.hero}>
      <UserPasswordCreate token={token} id={id} />
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
