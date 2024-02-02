import { z as zod } from 'zod'
import { validatePhone } from 'validations-br'
import { differenceInYears } from 'date-fns'
// import { differenceInYears } from 'date-fns'

const createUserSchema = zod.object({
  email: zod
    .string({ required_error: 'O campo e-mail é obrigatório.' })
    .email('Informe um e-mail válido!'),
  password: zod
    .string()
    .optional()
    .transform((v = '') => v)
    .refine((v) => !!v, 'O campo senha é obrigatório.')
    .refine((v) => {
      const pattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/
      return pattern.test(v)
    }, 'Precisa conter no mínimo 8 caracteres, caixa-alta, caixa-baixa, número e um caractere especial'),
  passwordConfirmation: zod
    .string()
    .optional()
    .transform((v = '') => v)
    .refine((v) => !!v, 'O campo confirmar senha é obrigatório.'),
  firstName: zod
    .string()
    .optional()
    .refine((v) => !!v, 'O campo nome é obrigatório.'),
  surName: zod
    .string()
    .optional()
    .refine((v) => !!v, 'O campo sobrenome é obrigatório.'),
  phone: zod
    .string()
    .optional()
    // .transform((v = '') => v.replace(/[^0-9]/g, ''))
    .refine(
      (v) => !!v && v.replaceAll('-', '').length === 11,
      'O campo celular é obrigatório.',
    )
    .refine((v) => validatePhone(v || ''), 'Celular inválido.'),
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
  privacyConsent: zod
    .string()
    .optional()
    .refine((v) => !!v, 'O campo manter minhas informações é obrigatório.'),
  mediaConsent: zod
    .string()
    .optional()
    .refine((v) => !!v, 'O campo regulamento é obrigatório.'),
  recaptchaToken: zod.string().optional(),
  roles: zod.string().array(),
  utmSource: zod
    .string()
    .optional()
    .transform((v) => v || ''),
  utmMedium: zod
    .string()
    .optional()
    .transform((v) => v || ''),
  utmCampaign: zod
    .string()
    .optional()
    .transform((v) => v || ''),
  utmTerm: zod
    .string()
    .optional()
    .transform((v) => v || ''),
  utmContent: zod
    .string()
    .optional()
    .transform((v) => v || ''),
  xeerpaId: zod
    .string()
    .optional()
    .transform((v) => v || ''),
  xeerpaToken: zod
    .string()
    .optional()
    .transform((v) => v || ''),
})

export type CreateUserPayload = zod.infer<typeof createUserSchema>

export default createUserSchema
