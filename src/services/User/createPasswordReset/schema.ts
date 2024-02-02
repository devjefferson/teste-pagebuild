import { z as zod } from 'zod'

const createPasswordResetSchema = zod.object({
  email: zod
    .string()
    .email('Informe um e-mail válido!')
    .optional()
    .refine((v) => !!v, 'O campo e-mail é obrigatório.'),
  recaptchaToken: zod.string().optional(),
})

export type CreatePasswordResetPayload = zod.infer<
  typeof createPasswordResetSchema
>

export default createPasswordResetSchema
