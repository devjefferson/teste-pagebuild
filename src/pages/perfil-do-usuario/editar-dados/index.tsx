import { Loading } from '@/components/Loading'
import DefaultLayout from '@/layouts/DefaultLayout'
import { PageContent } from '@/models/PageContent'
import UserUpdateForm from '@/sections/Sections/User/Update/Form'
import GetEntryPageContent from '@/services/GetEntryPageContent'
import withSsr from '@/utils/withSsr'
import { NextPage } from 'next'
import { useSession } from 'next-auth/react'

type PageProps = {
  pageContent: PageContent
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
      <UserUpdateForm user={data?.user!} />
    </DefaultLayout>
  )
}

export const getServerSideProps = withSsr(async ({ resolvedUrl, req, res }) => {
  const pageContent = await GetEntryPageContent(resolvedUrl)

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
