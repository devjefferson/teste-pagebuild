import { Loading } from '@/components/Loading'
import DefaultLayout from '@/layouts/DefaultLayout'
import { PageContent } from '@/models/PageContent'
import UserProfile from '@/sections/Sections/User/Profile'
import authOptions from '@/services/GetAuth/options'
import GetEntryPageContent from '@/services/GetEntryPageContent'
import withSsr from '@/utils/withSsr'
import { NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { useSession } from 'next-auth/react'

type PageProps = {
  pageContent: PageContent
  session: any
}

const Page: NextPage<PageProps> = ({ pageContent }) => {
  const { data, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Loading />
      </div>
    )
  }
  return (
    <DefaultLayout seo={pageContent?.seo} hero={pageContent?.hero}>
      <UserProfile data={data || {}} />
    </DefaultLayout>
  )
}

export const getServerSideProps = withSsr(async (ctx) => {
  const pageContent = await GetEntryPageContent(ctx.resolvedUrl)

  const session = await getServerSession(ctx.req, ctx.res, authOptions)

  if (!session) {
    return {
      props: {},
      redirect: '/login',
    }
  }

  // if (!pageContent) {
  //   return { notFound: true }
  // }

  return {
    props: {
      pageContent,
    },
  }
})

export default Page
