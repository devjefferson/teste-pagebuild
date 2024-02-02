import useMessage from '@/hooks/useMessage'
import createPasswordResetSchema, {
  CreatePasswordResetPayload,
} from '@/services/User/createPasswordReset/schema'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, InputText } from '@squadfy/uai-design-system'
import axios from 'axios'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useReCaptcha } from '@/hooks/useReCaptcha'
import { useCallback, useEffect } from 'react'

export default function UserPasswordFormReset() {
  const { success, error } = useMessage()
  const { reload } = useReCaptcha()

  const form = useForm<CreatePasswordResetPayload>({
    resolver: zodResolver(createPasswordResetSchema),
    defaultValues: {
      recaptchaToken: '',
    },
  })

  const reloadRecaptch = useCallback(() => {
    reload((token) => {
      form.setValue('recaptchaToken', token)
    }, 'formReset')
  }, [form, reload])

  useEffect(() => {
    reloadRecaptch()
  }, [reloadRecaptch])

  const handleSubmit: SubmitHandler<CreatePasswordResetPayload> = async (
    data,
  ) => {
    reloadRecaptch()
    try {
      const response = await axios.post('/api/auth/reset', data)

      if (response?.status !== 200) throw response

      success(
        `O E-mail de redefinição de senha foi enviado para "${data.email}"`,
      )

      setTimeout(function () {
        window.location.href = `/login`
      }, 2000)
    } catch (e: any) {
      error(e.response.data.error.title)
    }
  }

  return (
    <section className="py-xxlarge md:py-xgiant container">
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full md:max-w-[660px] flex flex-col gap-xlarge"
      >
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <InputText
              {...field}
              ref={field.ref}
              label="E-mail *"
              placeholder="E-mail"
              type="email"
              autoCapitalize="off"
              errorText={fieldState.error?.message}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />

        <Button
          colorMode="main"
          size="medium"
          endIcon="MdChevronRight"
          variant="secondary"
          className="uppercase"
          type="submit"
        >
          Enviar
        </Button>
      </form>
    </section>
  )
}
