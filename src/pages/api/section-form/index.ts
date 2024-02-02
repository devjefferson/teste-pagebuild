import withApiRoute from '@/utils/withApiRoute'
import { NextApiRequest, NextApiResponse } from 'next'
import { UFormSubmitType } from '@/components/UForm'
import RestClient from '@/services/RestClient'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}

export default withApiRoute(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
      const { contentId, fields, formId, sectionOrder }: UFormSubmitType =
        req.body

      try {
        const response = await RestClient.post(
          `forms/api/entries/${formId}?date=${new Date().toISOString()}`,
          {
            values: fields,
            contentId,
            sectionOrder,
          },
          {
            headers: {
              'Api-Key': process.env.API_KEY_UMBRACO_FORM,
            },
          },
        )

        return res.status(201).json(response.data)
      } catch (err: any) {
        return (
          res
            .status(err?.response?.status || 400)
            // .send(err?.response?.statusText || 'Bad Request')
            .json(err?.response?.data || {})
        )
      }
    }
    return res.status(404).send(`Method "${req.method}" not found!`)
  },
)
