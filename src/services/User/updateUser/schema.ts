import { z as zod } from 'zod'
// import getGenderList from '../../gender/getGenderList'
import { validatePhone } from 'validations-br'
import { differenceInYears } from 'date-fns'

const updateUserSchema = zod.object({
  name: zod.string().optional(),
  // .refine((v) => !!v, 'O campo nome é obrigatório.'),
  surName: zod
    .string()
    .optional()
    .refine((v) => !!v, 'O campo sobrenome é obrigatório.'),
  birthdate: zod
    .string()
    .optional()
    .refine(
      (v = '') => v.length === 10,
      'O campo data nascimento é obrigatório.',
    )
    .refine((v = '') => {
      try {
        const date = v.split('/')

        const years = differenceInYears(
          new Date(),
          new Date(`${date[2]}-${date[1]}-${date[0]}`),
        )
        return years >= 18
      } catch (error) {
        return false
      }
    }, 'Você precisa ter 18 ou mais anos.'),
  gender: zod.string().optional(),
  phone: zod
    .string()
    .optional()
    .transform((v = '') => v.replace(/[^0-9]/g, ''))
    .refine((v) => !!v && v.length === 11, 'O campo celular é obrigatório.')
    .refine((v) => validatePhone(v || ''), 'Celular inválido.'),
  profession: zod.string().optional(),
  address: zod.string().optional(),
  addressNumber: zod.string().optional(),
  addressDistrict: zod.string().optional(),
  addressComplement: zod.string().optional(),
  addressState: zod.string().optional(),
  addressCity: zod.string().optional(),
  zipCode: zod.string().optional(),
  recaptchaToken: zod.string().optional(),
  utmSource: zod.string().optional(),
  utmMedium: zod.string().optional(),
  utmCampaign: zod.string().optional(),
  utmTerm: zod.string().optional(),
  utmContent: zod.string().optional(),
  xeerpaId: zod.string().optional(),
  xeerpaToken: zod.string().optional(),
})

export type UpdateUserPayload = zod.infer<typeof updateUserSchema>

export default updateUserSchema
