import { gql } from 'graphql-request'
import GQLClient from '../GQLClient'

export default async function GetProductList(
  productsId: number[],
): Promise<any[]> {
  try {
    const data = await GQLClient.request<any>(
      gql`
        query ($productsId: [Int]!) {
          products: contentAll(where: { id: { in: $productsId } }) {
            nodes {
              id
              name
              properties {
                alias
                value {
                  ... on BasicPropertyValue {
                    value
                  }
                  ... on BasicRichText {
                    sourceValue
                  }
                  ... on BasicMediaPicker {
                    mediaItems {
                      id
                      url
                    }
                  }
                }
              }
            }
          }
        }
      `,
      { productsId },
    )

    return data?.products?.nodes || []
  } catch (error) {
    return []
  }
}
