import GetEntryPageContent from '@/services/GetEntryPageContent'
import GetSiteSetup from '@/services/GetSiteSetup'
import withApiRoute from '@/utils/withApiRoute'
import { NextApiRequest, NextApiResponse } from 'next'

export default withApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const resolvedUrl = (req.url || '').replace('/api/content', '') || '/'
    const siteSetup = await GetSiteSetup()
    const pageContent = await GetEntryPageContent(resolvedUrl)

    return res.status(200).json({
      ...siteSetup,
      ...pageContent,
    })
  },
)
