import DefaultLayout from '@/layouts/DefaultLayout'
import { PageContent } from '@/models/PageContent'
import UserCreateMethod from '@/sections/Sections/User/Create/Method'
import authOptions from '@/services/GetAuth/options'
import GetEntryPageContent from '@/services/GetEntryPageContent'
import { redirectPermanent } from '@/utils/redirect'
import withSsr from '@/utils/withSsr'
import { NextPage } from 'next'
import { getServerSession } from 'next-auth'

type PageProps = {
  pageContent: PageContent
}

const Page: NextPage<PageProps> = ({ pageContent }) => {
  return (
    <DefaultLayout seo={pageContent.seo} hero={pageContent.hero}>
      <UserCreateMethod />
    </DefaultLayout>
  )
}

export const getServerSideProps = withSsr(async ({ resolvedUrl, req, res }) => {
  const pageContent = await GetEntryPageContent(resolvedUrl)

  const session = await getServerSession(req, res, authOptions)
  if (session) return redirectPermanent('/perfil-do-usuario')

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
