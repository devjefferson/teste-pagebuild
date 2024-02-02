import withApiRoute from '@/utils/withApiRoute'
import { NextApiRequest, NextApiResponse } from 'next'

const SITE_URL = 'https://www.kaiser.com.br'

export default withApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Content-Type', 'text/plain')
    const robots = `User-agent: *
  Sitemap: ${SITE_URL}/sitemap.xml
  Allow: /`

    res.write(robots)
    return res.end()
  },
)
