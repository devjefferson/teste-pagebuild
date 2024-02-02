import { gql } from 'graphql-request'
import GQLClient from '../GQLClient'

export type TGetSiteMap = {
  loc: string
  lastmod: string
  changeFreq: string
  priority: string
}

type TReq = {
  siteMapContent: TGetSiteMap[]
}

export default async function GetSiteMap(): Promise<TReq | null> {
  try {
    const data = await GQLClient.request<any>(
      gql`
        query {
          siteMapContent {
            loc
            lastmod
            changeFreq
            priority
          }
        }
      `,
    )

    if (!data?.siteMapContent) throw new Error()

    return data
  } catch (error) {
    return null
  }
}
