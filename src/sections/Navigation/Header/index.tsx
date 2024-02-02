import DropDown from '@/components/DropDown'
import { BrandContent } from '@/models/BrandContent'
import { NavigationContent } from '@/models/NavigationContent'
import { Header as DonutHeader } from '@squadfy/uai-design-system'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

type Props = {
  navigation: NavigationContent['headers']
  brand: BrandContent
  colorMode: 'contrast' | 'main'
}

export default function Header({ navigation, brand, colorMode }: Props) {
  const { data, status } = useSession()
  const router = useRouter()

  const handleExit = async () => {
    localStorage.clear()
    await signOut({
      redirect: true,
      callbackUrl: '/',
    })
  }

  const linkDropDown = [
    {
      link: status === 'authenticated' ? 'Perfil' : 'Cadastrar',
      path: () =>
        router.push(
          status === 'authenticated' ? '/perfil-do-usuario' : '/cadastro',
        ),
    },
    {
      link: status === 'authenticated' ? 'Sair' : 'Fazer login',
      path: () =>
        status === 'authenticated' ? handleExit() : router.push('/login'),
    },
  ]

  switch (navigation.flavor) {
    case 'headerDefault':
      return (
        <DonutHeader
          flavor="default"
          colorMode={colorMode}
          className={
            {
              contrast: 'absolute w-full top-[0] left-[0] z-20',
              main: '',
            }[colorMode]
          }
          logo={{
            src: {
              contrast:
                brand.logo?.monochromeLogo?.url || brand.logo.colorfulLogo.url,
              main: brand.logo.colorfulLogo.url,
            }[colorMode],
            alt: brand.brandName,
          }}
          actions={
            navigation.buttonHeader
              ? [
                  {
                    id: 'action-header',
                    asChild: true,
                    children: (
                      <a
                        href={navigation.buttonHeader?.url || ''}
                        target="_blank"
                      >
                        {navigation.buttonHeader.label}
                      </a>
                    ),
                  },
                ]
              : [
                  {
                    asChild: true,
                    children: (
                      <>
                        {status !== 'loading' && (
                          <DropDown
                            title="Sua Conta"
                            items={linkDropDown}
                            image={data?.user?.imagePath || ''}
                          />
                        )}
                      </>
                    ),
                    id: data?.user ? 'Sair' : 'Entrar',
                  },
                ]
          }
          socialNetworks={brand.socialMedia.map((item) => ({
            id: `social-${item.type}`,
            social: item.type,
            href: item.url,
          }))}
          menu={navigation.navigation.map((item) => ({
            id: item.label,
            children: item.label,
            href: item.url,
          }))}
        />
      )
    case 'headerSeparated':
      return (
        <DonutHeader
          flavor="separated"
          colorMode={colorMode}
          className={
            {
              contrast: 'absolute w-full top-[0] left-[0] z-20',
              main: '',
            }[colorMode]
          }
          logo={{
            src: {
              contrast:
                brand.logo?.monochromeLogo?.url || brand.logo.colorfulLogo.url,
              main: brand.logo.colorfulLogo.url,
            }[colorMode],
            alt: brand.brandName,
          }}
          leftMenu={navigation.navigationLeft.map((item) => ({
            id: item.label,
            children: item.label,
            href: item.url,
          }))}
          rightMenu={navigation.navigationRight.map((item) => ({
            id: item.label,
            children: item.label,
            href: item.url,
          }))}
        />
      )

    case 'headerSocials':
      return (
        <DonutHeader
          flavor="socials"
          colorMode={colorMode}
          className={
            {
              contrast: 'absolute w-full top-[0] left-[0] z-20',
              main: '',
            }[colorMode]
          }
          logo={{
            src: {
              contrast:
                brand.logo?.monochromeLogo?.url || brand.logo.colorfulLogo.url,
              main: brand.logo.colorfulLogo.url,
            }[colorMode],
            alt: brand.brandName,
          }}
          actions={
            navigation.buttonHeader
              ? [
                  {
                    id: 'action-header',
                    asChild: true,
                    children: (
                      <a
                        href={navigation.buttonHeader?.url || ''}
                        target="_blank"
                      >
                        {navigation.buttonHeader.label}
                      </a>
                    ),
                  },
                ]
              : []
          }
          socialNetworks={brand.socialMedia.map((item) => ({
            id: `social-${item.type}`,
            social: item.type,
            href: item.url,
          }))}
          menu={navigation.navigationRight.map((item) => ({
            id: item.label,
            children: item.label,
            href: item.url,
          }))}
        />
      )
    default:
      return null
  }
}
