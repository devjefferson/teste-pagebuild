import axios from 'axios'

const RestClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_UMBRACO}/umbraco`,
})

export default RestClient
