import { SESSION_OPTIONS } from '@/configs/session'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiHandler } from 'next'

export default function withApiRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute((req, res) => {
    if (req.method === 'OPTIONS') {
      return res.status(200).send('')
    }
    return handler(req, res)
  }, SESSION_OPTIONS)
}
