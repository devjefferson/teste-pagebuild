import { CreateLoginData, createLoginSchema } from '@/services/GetAuth/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'

import {
  Button,
  Divider,
  Grid,
  InputText,
  Link,
  SocialLoginButton,
} from '@squadfy/uai-design-system'

import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import useXeerpaLogin from '@/hooks/useXeerpaLogin'
import { SocialNetwork } from '@/models/Auth'
import useMessage from '@/hooks/useMessage'
import { useCallback, useEffect } from 'react'
import { useReCaptcha } from '@/hooks/useReCaptcha'

export default function UserLoginForm() {
  const { success, error } = useMessage()
  const { reload } = useReCaptcha()
  const xeerpa = useXeerpaLogin()
  const form = useForm<CreateLoginData>({
    resolver: zodResolver(createLoginSchema),
    defaultValues: {
      email: '',
      password: '',
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

  const handleSubmitXeerpa = async (params: SocialNetwork) => {
    reloadRecaptch()

    try {
      const xeerpaToken = await xeerpa.requestBySocialNetwork(params)

      const response = await signIn('xeerpa-login', {
        xeerpaToken: xeerpaToken?.it,
        email: xeerpaToken?.user.email,
        recaptchaToken: form.getValues('recaptchaToken'),
        redirect: false,
      })

      if (response?.error) throw new Error(response.error)

      success('Login realizado com sucesso!')
      setTimeout(function () {
        window.location.href = '/perfil-do-usuario'
      }, 2000)
    } catch (e) {
      error(
        'Ocorreu um erro ao realizar o login. Verifique os dados e tente novamente!',
      )
    }
  }

  const handleSubmit: SubmitHandler<CreateLoginData> = async (data) => {
    reloadRecaptch()
    try {
      const response = await signIn('credentials', {
        ...data,
        redirect: false,
      })

      if (response?.error) throw new Error(response.error)

      success('Login realizado com sucesso!')

      setTimeout(function () {
        window.location.href = '/perfil-do-usuario'
      }, 2000)
    } catch (e) {
      error(
        'Ocorreu um erro ao realizar o login. Verifique os dados e tente novamente!',
      )
    }
  }

  return (
    <section className="container py-xxlarge md:py-xgiant">
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-full lg:max-w-[648px] flex flex-col gap-xlarge"
      >
        <div className="flex gap-medium">
          <SocialLoginButton
            size="medium"
            social="facebook"
            className="flex-1"
            onClick={() => handleSubmitXeerpa('FB')}
          />
          <SocialLoginButton
            size="medium"
            social="google"
            className="flex-1"
            onClick={() => handleSubmitXeerpa('GO')}
          />
        </div>
        <Divider />
        <Grid columns="12" className="gap-large lg:gap-xxlarge">
          <Grid.Item span={{ xs: '12', lg: '12' }}>
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="E-mail *"
                  placeholder="E-mail"
                  type="email"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="col-span-1"
                />
              )}
            />
          </Grid.Item>
          <Grid.Item span={{ xs: '12', lg: '12' }}>
            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="Senha *"
                  placeholder="Senha"
                  type="password"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </Grid.Item>
        </Grid>
        <Link colorMode="main" href="/esqueci-minha-senha" className="w-fit">
          Esqueci minha senha
        </Link>

        <Button
          colorMode="main"
          size="medium"
          endIcon="MdChevronRight"
          variant="primary"
          className="uppercase"
          type="submit"
        >
          Entrar
        </Button>
      </form>
    </section>
  )
}
