import { AuthSection } from '@/models/Auth'
import withApiRoute from '@/utils/withApiRoute'
import { NextApiRequest, NextApiResponse } from 'next'

export default withApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const authSection = req.body as AuthSection
      req.session.auth = authSection
      await req.session.save()
      return res.status(201).json(authSection)
    }
    return res.status(404).send(`Method "${req.method}" not found!`)
  },
)
