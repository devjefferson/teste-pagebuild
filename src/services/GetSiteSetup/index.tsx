import { gql } from 'graphql-request'
import GetAgeGateContent from '../GetAgeGateContent'
import GetBrandContent from '../GetBrandContent'
import GetNavigationContent from '../GetNavigationContent'
import GQLClient from '../GQLClient'

export default async function GetSiteSetup() {
  try {
    const data = await GQLClient.request<any>(
      gql`
        query {
          brand: contentAtRoot(
            where: { contentType: { alias: { eq: "marca" } } }
          ) {
            nodes {
              id
              name
              properties {
                value {
                  ... on BasicPropertyValue {
                    value
                    alias
                  }
                  ... on BasicRichText {
                    sourceValue
                    alias
                  }
                  ... on BasicBlockListModel {
                    alias
                    blocks {
                      contentProperties {
                        value {
                          ... on BasicMediaPicker {
                            alias
                            mediaItems {
                              id
                              url
                            }
                          }
                          ... on BasicPropertyValue {
                            alias
                            value
                          }
                          ... on BasicMultiUrlPicker {
                            alias
                            links {
                              name
                              target
                              type
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                  ... on BasicMediaPicker {
                    alias
                    mediaItems {
                      id
                      url
                    }
                  }
                }
              }
            }
          }
          navigation: contentAtRoot(
            where: { contentType: { alias: { eq: "navigationSite" } } }
          ) {
            nodes {
              id
              name
              properties {
                value {
                  ... on BasicPropertyValue {
                    value
                    alias
                  }
                  ... on BasicBlockListModel {
                    alias
                    blocks {
                      contentAlias
                      contentProperties {
                        value {
                          ... on BasicMultiUrlPicker {
                            alias
                            links {
                              name
                              target
                              type
                              url
                            }
                          }
                          ... on BasicBlockListModel {
                            alias
                            blocks {
                              contentProperties {
                                value {
                                  ... on BasicPropertyValue {
                                    value
                                    alias
                                  }
                                  ... on BasicMultiUrlPicker {
                                    alias
                                    links {
                                      name
                                      target
                                      type
                                      url
                                    }
                                  }
                                }
                              }
                            }
                          }
                          ... on BasicPropertyValue {
                            value
                            alias
                          }
                          ... on BasicMediaPicker {
                            alias
                            mediaItems {
                              id
                              url
                            }
                          }
                          ... on BasicRichText {
                            sourceValue
                            alias
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          ageGate: contentByAbsoluteRoute(route: "/agegate") {
            properties {
              value {
                ... on BasicPropertyValue {
                  alias
                  value
                }
                ... on BasicRichText {
                  alias
                  sourceValue
                }
                ... on BasicMediaPicker {
                  alias
                  mediaItems {
                    id
                    url
                  }
                }
              }
            }
          }
        }
      `,
      {},
    )

    const [brand, navigation, ageGate] = [
      GetBrandContent(data?.brand),
      GetNavigationContent(data?.navigation),
      GetAgeGateContent(data?.ageGate),
    ]

    return {
      brand,
      navigation,
      ageGate,
    }
  } catch (error) {
    return {
      brand: undefined,
      navigation: undefined,
      ageGate: undefined,
    }
  }
}
