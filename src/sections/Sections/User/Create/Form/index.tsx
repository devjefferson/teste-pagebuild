import createUserSchema, {
  CreateUserPayload,
} from '@/services/User/createUser/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Grid,
  InputCheckbox,
  InputMask,
  InputText,
  Link,
  Paragraph,
} from '@squadfy/uai-design-system'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useMessage from '@/hooks/useMessage'
import axios from 'axios'
import { useReCaptcha } from '@/hooks/useReCaptcha'
import { useCallback, useEffect } from 'react'

type UserQueryProps = {
  user?: {
    fullName?: string
    email?: string
    roles?: string
    token?: string
    xeerpaId?: string
  }
}

export default function UserCreateForm({ user }: UserQueryProps) {
  const { success, error } = useMessage()
  const { reload } = useReCaptcha()

  const form = useForm<CreateUserPayload>({
    resolver: zodResolver(
      createUserSchema
        .omit(
          user?.roles?.includes('Social Login')
            ? { password: true, passwordConfirmation: true }
            : {},
        )
        .refine(
          (fields: any) => fields.password === fields.passwordConfirmation,
          {
            message: 'As senhas são diferentes.',
            path: ['passwordConfirmation'],
          },
        ),
    ),
    defaultValues: {
      roles: user?.roles ? ['Padrão', user?.roles] : ['Padrão'],
      recaptchaToken: '',
      firstName: user?.fullName?.split(' ')[0] || '',
      surName: user?.fullName?.split(' ')[1] || '',
      email: user?.email || '',
    },
  })

  const reloadRecaptch = useCallback(() => {
    reload((token) => {
      form.setValue('recaptchaToken', token)
    }, 'formCreateUser')
  }, [form, reload])

  useEffect(() => {
    reloadRecaptch()
  }, [reloadRecaptch])

  const handleSubmit: SubmitHandler<CreateUserPayload> = async (data) => {
    reloadRecaptch()

    try {
      const response = await axios.post('/api/auth/create-user', {
        ...data,
        xeerpaToken: user?.token,
        xeerpaId: user?.xeerpaId,
      })

      if (response?.status !== 200) throw response

      success(`Cadastro realizado com sucesso!`)
      setTimeout(function () {
        window.location.href = `/login`
      }, 2000)
    } catch (e: any) {
      error(e.response.data.error.title)
    }
  }

  return (
    <section className="container py-giant lg:py-xgiant">
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Grid columns="12" className="gap-medium">
          <Grid.Item
            span={{ xs: '12', lg: '6' }}
            className="flex flex-col gap-xlarge"
          >
            <Paragraph size="large" colorMode="main">
              Dados de acesso
            </Paragraph>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="E-mail *"
                  placeholder="E-mail"
                  autoCapitalize="off"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  type="password"
                  label="Senha *"
                  disabled={!!user?.roles?.includes('Social Login')}
                  placeholder="senha forte"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                  helperText="Precisa conter no mínimo 8 caracteres, caixa-alta, caixa-baixa, número e um caractere especial."
                />
              )}
            />
            <Controller
              control={form.control}
              name="passwordConfirmation"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  type="password"
                  disabled={!!user?.roles?.includes('Social Login')}
                  label="Confirmar Senha *"
                  placeholder="repetir senha forte"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </Grid.Item>
          <Grid.Item
            span={{ xs: '12', lg: '6' }}
            className="flex flex-col gap-xlarge"
          >
            <Paragraph size="large" colorMode="main">
              Dados pessoais
            </Paragraph>
            <Controller
              control={form.control}
              name="firstName"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="Nome *"
                  placeholder="seu nome"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="surName"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="Sobrenome *"
                  placeholder="seu sobrenome"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <InputMask
                  inputRef={field.ref}
                  label="Celular *"
                  placeholder="(00) 00000-0000"
                  mask="99-99999-9999"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="birthdate"
              render={({ field, fieldState }) => (
                <InputMask
                  inputRef={field.ref}
                  label="Data de nascimento *"
                  helperText="Menores de 18 anos não poderão participar"
                  placeholder="00/00/0000"
                  mask="99/99/9999"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="privacyConsent"
              render={({ field, fieldState }) => (
                <InputCheckbox
                  ref={field.ref}
                  description={{
                    children: (
                      <>
                        {
                          'Autorizo a HEINEKEN Brasil a armazenar e utilizar minhas informações para analisar meus comportamento e interesses, melhorando a experiência com suas marcas para oferecer comunicações personalizadas. Eu posso cancelar minha inscrição a qualquer momento. Veja mais informações nos '
                        }
                        <Link
                          href="/informacoes-legais/termos-de-uso/"
                          target="_blank"
                        >
                          Termos de uso
                        </Link>
                        {' e '}
                        <Link
                          href="/informacoes-legais/politica-de-privacidade/"
                          target="_blank"
                        >
                          Politica de privacidade
                        </Link>
                      </>
                    ),
                  }}
                  onChange={(e) => field.onChange(e.target.checked ? 'on' : '')}
                  errorText={fieldState.error?.message}
                  name={field.name}
                />
              )}
            />

            <Controller
              control={form.control}
              name="mediaConsent"
              render={({ field, fieldState }) => (
                <InputCheckbox
                  ref={field.ref}
                  description={{
                    children: (
                      <>
                        {
                          'Autorizo a HEINEKEN Brasil a me enviar notícias, promoções e ofertas sobre suas marcas e eventos, baseados nas minhas preferências e comportamentos, através de mídia online, e-mail ou telefone. Eu posso cancelar minha inscrição a qualquer momento. Veja mais informações nos'
                        }
                        <Link
                          href="/informacoes-legais/termos-de-uso/"
                          target="_blank"
                        >
                          Termos de uso
                        </Link>
                        {' e '}
                        <Link
                          href="/informacoes-legais/politica-de-privacidade/"
                          target="_blank"
                        >
                          Politica de privacidade
                        </Link>
                      </>
                    ),
                  }}
                  onChange={(e) => field.onChange(e.target.checked ? 'on' : '')}
                  errorText={fieldState.error?.message}
                  name={field.name}
                />
              )}
            />
          </Grid.Item>
        </Grid>
        <Button
          className="w-full mt-xlarge"
          endIcon="MdOutlineKeyboardArrowRight"
          type="submit"
        >
          Cadastrar
        </Button>
      </form>
    </section>
  )
}
