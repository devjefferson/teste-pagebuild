import { z as zod } from 'zod'

const createNewPasswordSchema = zod
  .object({
    password: zod
      .string({ required_error: 'O campo senha é obrigatório.' })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/,
        'Precisa conter no mínimo 8 caracteres, caixa-alta, caixa-baixa, número e um caractere especial',
      )
      .refine((v) => !!v, 'O campo senha é obrigatório.'),
    passwordConfirmation: zod
      .string()
      .optional()
      .refine((v) => !!v, 'O campo confirmar senha é obrigatório.'),
    recaptchaToken: zod.string().optional(),
  })
  .refine((fields) => fields.password === fields.passwordConfirmation, {
    message: 'As senhas são diferentes.',
    path: ['passwordConfirmation'],
  })

export type CreateNewPasswordPayload = zod.infer<typeof createNewPasswordSchema>

export default createNewPasswordSchema
