import { GraphQLClient } from 'graphql-request'

const GQLClient = new GraphQLClient(
  `${process.env.NEXT_PUBLIC_API_UMBRACO}/headless`,
  {
    headers: {
      apikey: process.env.API_KEY_UMBRACO || '',
    },
  },
)

export default GQLClient
