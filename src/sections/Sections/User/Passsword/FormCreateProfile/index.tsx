import useMessage from '@/hooks/useMessage'
import { useReCaptcha } from '@/hooks/useReCaptcha'
import createUpdatePasswordSchema from '@/services/User/createNewPassoword/schema'
import { CreateUpdatePasswordPayload } from '@/services/User/updatePassoword /schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, InputText } from '@squadfy/uai-design-system'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

export default function UserPasswordCreateProfile() {
  const { data } = useSession()
  const { success, error } = useMessage()
  const { reload } = useReCaptcha()

  const form = useForm<CreateUpdatePasswordPayload>({
    resolver: zodResolver(createUpdatePasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirmation: '',
      recaptchaToken: '',
    },
  })

  const reloadRecaptch = useCallback(() => {
    reload((token) => {
      form.setValue('recaptchaToken', token)
    }, 'formUpdatePassword')
  }, [form, reload])

  useEffect(() => {
    reloadRecaptch()
  }, [reloadRecaptch])

  const handleSubmit: SubmitHandler<CreateUpdatePasswordPayload> = async (
    dataForm,
  ) => {
    reloadRecaptch()
    try {
      const response = await axios.post('/api/auth/update-password', {
        ...dataForm,
        id: data?.user?.id,
      })

      if (response?.status !== 200) throw response

      success(`Senha atualizada com sucesso!`)

      setTimeout(function () {
        window.location.href = `/perfil-do-usuario`
      }, 2000)
    } catch (e: any) {
      error(e.response.data.error.detail)
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
