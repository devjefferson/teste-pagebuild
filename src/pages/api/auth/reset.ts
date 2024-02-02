import createPasswordReset from '@/services/User/createPasswordReset'
import withApiRoute from '@/utils/withApiRoute'
import { NextApiRequest, NextApiResponse } from 'next'

export default withApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { data } = await createPasswordReset(req.body)
      return res.json(data)
    } catch (error: any) {
      return res.status(400).json({
        error,
      })
    }
  },
)
