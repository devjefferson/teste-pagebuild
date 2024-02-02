import useXeerpaLogin from '@/hooks/useXeerpaLogin'
import { SocialNetwork } from '@/models/Auth'
import { Button, SocialLoginButton } from '@squadfy/uai-design-system'
import { useRouter } from 'next/router'

export default function UserCreateMethod() {
  const xeerpa = useXeerpaLogin()
  const { push } = useRouter()

  const handleUserSocial = async (params: SocialNetwork) => {
    const xeerpaUser = await xeerpa.requestBySocialNetwork(params)

    if (!xeerpaUser) return

    push(
      `/cadastro/formulario?email=${xeerpaUser?.user.email}&fullName=${xeerpaUser?.user.name}&roles=Social Login&token=${xeerpaUser.it}`,
    )
  }
  return (
    <section>
      <div className="py-xxlarge md:py-xgiant container">
        <div className="flex flex-col md:flex-row justify-center md:justify-between flex-wrap items-center gap-medium">
          <SocialLoginButton
            size="medium"
            social="facebook"
            className="md:flex-1 uppercase w-full"
            onClick={() => handleUserSocial('FB')}
          />
          <SocialLoginButton
            size="medium"
            social="google"
            className="md:flex-1 uppercase w-full"
            onClick={() => handleUserSocial('GO')}
          />
          <Button
            asChild
            colorMode="main"
            size="medium"
            startIcon="MdEmail"
            variant="secondary"
            className="md:flex-1 uppercase w-full"
          >
            <a href="/cadastro/formulario">Continuar com e-mail</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
