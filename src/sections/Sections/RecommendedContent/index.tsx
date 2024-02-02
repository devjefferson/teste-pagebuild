/* eslint-disable react-hooks/exhaustive-deps */
import { PageContentSectionRecommendedContent } from '@/models/PageContent'
import {
  Link,
  Divider,
  Grid,
  Button,
  Overline,
  InputText,
  InputMask,
  Paragraph,
  InputCheckbox,
  SocialLoginButton,
  Heading,
  CardStack,
} from '@squadfy/uai-design-system'
import NextLink from 'next/link'
import Modal from '@/components/Modal'
import useXeerpaLogin from '@/hooks/useXeerpaLogin'
import { SocialNetwork } from '@/models/Auth'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import useProgressBar from '@/hooks/useProgressBar'
import { format, differenceInYears, parse } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { z as zod } from 'zod'
import ReCaptcha from '@/components/ReCaptcha'
import axios from 'axios'
import { useApp } from '@/providers/App'
import {
  XeerpaRecommendedContent,
  XeerpaRecommendedContentArea,
} from '@/models/XeerpaRecommendedContent'
import classMerge from '@/utils/classMerge'

type Props = {
  data: PageContentSectionRecommendedContent
}

export default function RecommendedContent({ data }: Props) {
  const app = useApp()
  const progressBar = useProgressBar()
  const [recommendedContent, setRecommendedContent] = useState<
    XeerpaRecommendedContentArea[]
  >([])

  const handleGetRecommendedContent = async () => {
    try {
      progressBar.start()
      const { data: content } = await axios.get<XeerpaRecommendedContent>(
        `${process.env.NEXT_PUBLIC_API_XEERPA}/widgets/summary`,
        {
          params: {
            id: app?.authSection?.id || '',
            token: app?.authSection?.token || '',
            lang: 'pt',
          },
        },
      )
      setRecommendedContent(content.areas)
    } catch (error) {
      // TODO: handle error
    } finally {
      progressBar.done()
    }
  }

  useEffect(() => {
    if (app.authSection) {
      handleGetRecommendedContent()
    }
  }, [])

  if (!!app.authSection && recommendedContent.length > 0) {
    return (
      <CardStack
        columns={4}
        delay={3000}
        title={data.title || ''}
        description={`Com base nas suas curtidas do ${
          {
            FB: 'Facebook',
            GO: 'Google',
            TW: 'Twitter',
            TH: 'Twitch',
          }[app.authSection.socialNetwork] || ''
        }:`}
        mobileOrientation="horizontal"
        cards={recommendedContent.map((item, index) => {
          const id = item?.slides?.[0]?.id || index.toString()
          const title = item?.slides?.[0]?.imageTexts?.bottom || ''
          const description = item?.slides?.[0]?.info || ''
          const link = item?.slides?.[0]?.link || ''
          const image = item?.slides?.[0]?.image || ''
          return {
            id,
            description: description || '',
            title: title || '',
            media: image
              ? {
                  src: image,
                  title: description,
                  alt: title,
                }
              : undefined,
            render: (component) => (
              <a href={link} target="_blank" className="w-full h-full block">
                {component}
              </a>
            ),
          }
        })}
      />
    )
  }

  return (
    <section className={classMerge(['w-full', 'bg-white'])}>
      <div
        className={classMerge([
          'container',
          'flex',
          'flex-col',
          'gap-xlarge',
          'py-xxhuge',
        ])}
      >
        {!!data.title && (
          <Heading as="h2" size="large">
            {data.title}
          </Heading>
        )}
        <RecommendedContentForm onFinish={handleGetRecommendedContent} />
      </div>
    </section>
  )
}

type RecommendedContentFormProps = {
  onFinish: () => void
}
function RecommendedContentForm({ onFinish }: RecommendedContentFormProps) {
  const xeerpa = useXeerpaLogin()
  const progressBar = useProgressBar()
  const [showForm, setShowForm] = useState(false)
  const formSchema = zod.object({
    PersonalCellphone: zod
      .string()
      .nonempty('Campo obrigatório.')
      .regex(/\d{2}-\d{5}-\d{4}/, 'Formato inválido. Informe: 00-00000-0000'),
    PersonalBirthdate: zod
      .string()
      .nonempty('Campo obrigatório.')
      .regex(/\d{2}\/\d{2}\/\d{4}/, 'Formato inválido. Informe: dd/mm/aaaa')
      .refine((date) => {
        const years = differenceInYears(
          new Date(),
          parse(date, 'dd/MM/yyyy', new Date()),
        )
        return years >= 18
      }, 'Sua idade não pode ser menor que 18 anos'),
    PersonalFullName: zod.string().nonempty('Campo obrigatório.'),
    PersonalEmail: zod
      .string()
      .nonempty('Campo obrigatório.')
      .email('Informe um e-mail válido.'),
    TermsPrivacyConsent: zod.boolean().refine((v) => !!v, 'Campo obrigatório.'),
    TermsPediaConsent: zod.boolean().refine((v) => !!v, 'Campo obrigatório.'),
    SourceTitle: zod.string().optional(),
    RecaptchaToken: zod.string().optional(),
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      PersonalCellphone: '',
      PersonalBirthdate: '',
      PersonalFullName: '',
      PersonalEmail: '',
      TermsPrivacyConsent: false,
      TermsPediaConsent: false,
      SourceTitle: 'conteudos_recomendados',
      RecaptchaToken: '',
      ItFormRegister: '',
    },
  })

  const handleSignIn = async (social: SocialNetwork) => {
    const data = await xeerpa.requestBySocialNetwork(social)

    if (data) {
      try {
        form.setValue('PersonalFullName', data?.user?.name || '')
        form.setValue('PersonalEmail', data?.user?.email || '')
        form.setValue('ItFormRegister', data?.token || '')
        form.setValue(
          'PersonalBirthdate',
          data?.user?.birthday
            ? format(new Date(data.user.birthday), 'dd/MM/yyyy')
            : '',
        )
      } catch (error) {
        // TODO: handle error
      } finally {
        setShowForm(true)
      }
    }
  }

  const onSubmit = async (data: any) => {
    try {
      progressBar.start()
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_UMBRACO}/umbraco/surface/formsender/widgetnewsletter`,
        data,
      )
      onFinish()
      setShowForm(false)
    } catch (error) {
      // TODO: handle error
    } finally {
      progressBar.done()
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-large">
        <div className="flex flex-col gap-large">
          <Paragraph size="large">
            Para ver conteúdos recomendados, basta entrar com uma rede social:
          </Paragraph>
          <Controller
            control={form.control}
            name="TermsPrivacyConsent"
            render={({ field, fieldState: { error } }) => (
              <InputCheckbox
                name={field.name}
                checked={!!field.value}
                onChange={(e) => field.onChange(!!e.target.checked)}
                errorText={error?.message}
                description={{
                  children: (
                    <>
                      Autorizo a HEINEKEN Brasil a armazenar e utilizar minhas
                      informações para analisar meus comportamento e interesses,
                      melhorando a experiência com suas marcas para oferecer
                      comunicações personalizadas. Eu posso cancelar minha
                      inscrição a qualquer momento. Veja mais informações nos{' '}
                      <Link asChild>
                        <NextLink href="/informacoes-legais/termos-de-uso">
                          Termos de uso
                        </NextLink>
                      </Link>{' '}
                      e{' '}
                      <Link asChild>
                        <NextLink href="/informacoes-legais/politica-de-privacidade">
                          Política de privacidade
                        </NextLink>
                      </Link>
                      .
                    </>
                  ),
                }}
              />
            )}
          />
          <Controller
            control={form.control}
            name="TermsPediaConsent"
            render={({ field, fieldState: { error } }) => (
              <InputCheckbox
                name={field.name}
                checked={!!field.value}
                onChange={(e) => field.onChange(!!e.target.checked)}
                errorText={error?.message}
                description={{
                  children: (
                    <>
                      Autorizo a HEINEKEN Brasil a me enviar notícias, promoções
                      e ofertas sobre suas marcas e eventos, baseados nas minhas
                      preferências e comportamentos, através de mídia online,
                      e-mail ou telefone. Eu posso cancelar minha inscrição a
                      qualquer momento. Veja mais informações nos{' '}
                      <Link asChild>
                        <NextLink href="/informacoes-legais/termos-de-uso">
                          Termos de uso
                        </NextLink>
                      </Link>{' '}
                      e{' '}
                      <Link asChild>
                        <NextLink href="/informacoes-legais/politica-de-privacidade">
                          Política de privacidade
                        </NextLink>
                      </Link>
                      .
                    </>
                  ),
                }}
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-medium md:flex-row">
          <SocialLoginButton
            onClick={() => handleSignIn('FB')}
            className="w-full"
            social="facebook"
            disabled={
              !!progressBar.isLoading ||
              !form.watch('TermsPediaConsent') ||
              !form.watch('TermsPrivacyConsent')
            }
          />
          <SocialLoginButton
            onClick={() => handleSignIn('GO')}
            className="w-full"
            social="google"
            disabled={
              !!progressBar.isLoading ||
              !form.watch('TermsPediaConsent') ||
              !form.watch('TermsPrivacyConsent')
            }
          />
        </div>
      </div>
      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        overline="Cadastro"
        title="Informações pessoais"
        className="md:max-w-[500px]"
      >
        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col w-full gap-medium pb-medium">
            <div className="flex flex-col gap-medium p-medium md:p-large">
              <Controller
                control={form.control}
                name="PersonalEmail"
                render={({ field, fieldState: { error } }) => (
                  <InputText
                    name={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="E-mail"
                    placeholder="seu@email.com"
                    errorText={error?.message}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="PersonalFullName"
                render={({ field, fieldState: { error } }) => (
                  <InputText
                    name={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Nome Completo"
                    placeholder="John Doe"
                    errorText={error?.message}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="PersonalBirthdate"
                render={({ field, fieldState: { error } }) => (
                  <InputMask
                    name={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Data de Nascimento"
                    mask="99/99/9999"
                    placeholder="dd/mm/aaaa"
                    errorText={error?.message}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="PersonalCellphone"
                render={({ field, fieldState: { error } }) => (
                  <InputMask
                    name={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    label="Telefone"
                    mask="99-99999-9999"
                    placeholder="00-00000-0000"
                    errorText={error?.message || ''}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="RecaptchaToken"
                render={({ field }) => (
                  <ReCaptcha onChange={(token) => field.onChange(token)} />
                )}
              />
            </div>
            <Divider />
            <Grid columns="12" className="gap-medium px-medium md:px-large">
              <Grid.Item
                span={{
                  xs: '6',
                  md: '3',
                }}
              >
                <Button
                  variant="secondary"
                  size="small"
                  startIcon="FaChevronLeft"
                  className="w-full"
                  onClick={() => {}}
                  disabled={progressBar.isLoading}
                >
                  Voltar
                </Button>
              </Grid.Item>
              <Grid.Item
                span={{
                  xs: '6',
                  md: '9',
                }}
              >
                <Button
                  variant="primary"
                  size="small"
                  endIcon="FaChevronRight"
                  className="w-full"
                  type="submit"
                  disabled={progressBar.isLoading}
                >
                  Próximo
                </Button>
              </Grid.Item>
              <Grid.Item span="12">
                <Overline
                  className={classMerge([
                    '[&_*]:typography-overline',
                    '[&_span]:text-background-brand',
                    'whitespace-nowrap',
                  ])}
                >
                  ETAPA <span>01</span> DE 01
                </Overline>
              </Grid.Item>
            </Grid>
          </div>
        </form>
      </Modal>
    </div>
  )
}
