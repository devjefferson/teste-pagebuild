import useMessage from '@/hooks/useMessage'
import { useReCaptcha } from '@/hooks/useReCaptcha'
import createNewPasswordSchema, {
  CreateNewPasswordPayload,
} from '@/services/User/createNewPassoword/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, InputText } from '@squadfy/uai-design-system'
import axios from 'axios'
import { useCallback, useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type UserPasswordFormCreateProps = {
  id: string
  token: string
}

export default function UserPasswordCreate({
  token,
  id,
}: UserPasswordFormCreateProps) {
  const { success, error } = useMessage()
  const { reload } = useReCaptcha()

  const form = useForm<CreateNewPasswordPayload>({
    resolver: zodResolver(createNewPasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
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

  const handleSubmit: SubmitHandler<CreateNewPasswordPayload> = async (
    data,
  ) => {
    reloadRecaptch()

    try {
      const response = await axios.post('/api/auth/create-new-password', {
        ...data,
        token,
        id,
      })

      if (response?.status !== 200) throw response

      success(`Senha cadastrada com sucesso!`)

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
          name="password"
          render={({ field, fieldState }) => (
            <InputText
              ref={field.ref}
              label="Nova senha *"
              placeholder="senha forte"
              type="password"
              helperText="Precisa conter no mínimo 8 caracteres, caixa-alta, caixa-baixa, número e um caractere especial"
              errorText={fieldState.error?.message}
              value={field.value}
              name={field.name}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="passwordConfirmation"
          render={({ field, fieldState }) => (
            <InputText
              ref={field.ref}
              label="confirmar senha *"
              placeholder="repetir senha forte"
              type="password"
              errorText={fieldState.error?.message}
              value={field.value}
              name={field.name}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        />
        <Button
          colorMode="main"
          size="medium"
          endIcon="MdChevronRight"
          variant="primary"
          className="uppercase"
          type="submit"
        >
          Alterar
        </Button>
      </form>
    </section>
  )
}
