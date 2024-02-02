import { updateUserImage } from '@/services/User/updateUser'
import withApiRoute from '@/utils/withApiRoute'
import { NextApiRequest, NextApiResponse } from 'next'

export default withApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const { data } = await updateUserImage({
        id: req.body.id,
        UserImage: req.body.image,
        recaptchaToken: req.body.recaptchaToken,
      })

      return res.json(data)
    } catch (error: any) {
      return res.status(400).json({
        error,
      })
    }
  },
)
