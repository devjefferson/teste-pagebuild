import GetSiteMap from '@/services/GetSitemapRobottxt/sitemap'
import withApiRoute from '@/utils/withApiRoute'
import { NextApiRequest, NextApiResponse } from 'next'

export default withApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const data = await GetSiteMap()
    res.setHeader('Content-Type', 'text/xml')
    const dataSiteMap = `
    <xml version="1.0" encoding="UTF-8">
     ${data?.siteMapContent.map(
       (site) => ` <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
     <loc>${site.loc}</loc>
     <changefreq>${site.changeFreq}</changefreq>
     <lastmod>${site.lastmod}</lastmod>
     <priority>${site.priority}</priority>
     </url>
   </urlset>`,
     )}
    </xml>
    `
    res.write(dataSiteMap.replaceAll('</urlset>,', '</urlset>'))
    return res.end()
  },
)
