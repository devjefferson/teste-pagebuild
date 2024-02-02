import withApiRoute from '@/utils/withApiRoute'
import { NextApiRequest, NextApiResponse } from 'next'

export default withApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const { status } = req.body
      req.session.destroy()
      req.session.ageGate = status
      await req.session.save()
      return res.status(201).send('')
    }
    return res.status(404).send(`Method "${req.method}" not found!`)
  },
)
