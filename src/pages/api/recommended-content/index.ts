import withApiRoute from '@/utils/withApiRoute'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

export default withApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
      const { auth } = req.session
      const { data: content } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_XEERPA}/widgets/summary?id=${auth?.id}&token=${auth?.token}&lang=pt`,
      )

      return res.status(200).json(content)
    }
    return res.status(404).send(`Method "${req.method}" not found!`)
  },
)
