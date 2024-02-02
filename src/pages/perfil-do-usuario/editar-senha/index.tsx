import DefaultLayout from '@/layouts/DefaultLayout'
import { PageContent } from '@/models/PageContent'
import UserPasswordCreateProfile from '@/sections/Sections/User/Passsword/FormCreateProfile'
import authOptions from '@/services/GetAuth/options'
// import GetEntryPageContent from '@/services/GetEntryPageContent'
import { redirectPermanent } from '@/utils/redirect'
import withSsr from '@/utils/withSsr'
// import { useSession } from 'next-auth/react'
import { NextPage } from 'next'
import { getServerSession } from 'next-auth'

type PageProps = {
  pageContent: PageContent
}

const Page: NextPage<PageProps> = ({ pageContent }) => {
  return (
    <DefaultLayout seo={pageContent?.seo} hero={pageContent?.hero}>
      <UserPasswordCreateProfile />
    </DefaultLayout>
  )
}

export const getServerSideProps = withSsr(async ({ resolvedUrl, req, res }) => {
  // const pageContent = await GetEntryPageContent(resolvedUrl)

  const session = await getServerSession(req, res, authOptions)
  if (!session) return redirectPermanent('/login')

  // if (!pageContent) {
  //   return { notFound: true }
  // }

  return {
    props: {
      // pageContent,
    },
  }
})

export default Page
