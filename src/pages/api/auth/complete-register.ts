import createCompleteRegister from '@/services/User/completeRegister'
import withApiRoute from '@/utils/withApiRoute'
import { NextApiRequest, NextApiResponse } from 'next'

export default withApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { data } = await createCompleteRegister(req.body)

      return res.json(data)
    } catch (error: any) {
      return res.status(400).json({
        error,
      })
    }
  },
)
