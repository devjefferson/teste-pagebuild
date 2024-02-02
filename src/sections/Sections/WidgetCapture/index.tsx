import { MessageModal } from '@/components/MessageModal'
import Modal from '@/components/Modal'
import UForm from '@/components/UForm'
import useXeerpaLogin from '@/hooks/useXeerpaLogin'
import { SocialNetwork } from '@/models/Auth'
import { PageContentSectionWidgetCapture } from '@/models/PageContent'
import classMerge from '@/utils/classMerge'
import { htmlToText } from '@/utils/htmlToText'
import { NewsletterWidget, Paragraph } from '@squadfy/uai-design-system'
import { useState } from 'react'

type Props = {
  data: PageContentSectionWidgetCapture & { index: number }
}

type TPropsSocialNetwork = {
  email: string
  name?: string
  birthday?: string
}

const socialOptions = {
  Facebook: {
    id: 'social-facebook',
    social: 'facebook',
    sigla: 'FB',
  },
  Google: {
    id: 'social-google',
    social: 'google',
    sigla: 'GO',
  },
  Twitter: {
    id: 'social-twitter',
    social: 'twitter',
    sigla: 'TW',
  },
  Twitch: {
    id: 'social-twitch',
    social: 'twitch',
    sigla: 'TH',
  },
} as {
  [key: string]: {
    id: string
    social: 'facebook' | 'twitter' | 'google' | 'twitch'
    sigla: 'FB' | 'TH' | 'TW' | 'GO'
  }
}
export default function WidgetCapture({ data }: Props) {
  const xeerpa = useXeerpaLogin()
  const [openModal, setOpenModal] = useState(false)
  const [socialNetwork, setSocialNetwork] = useState<TPropsSocialNetwork>()
  const [formResponse, setFormResponse] = useState<any>(null)
  const [progress, setProgress] = useState(false)

  if (!data.form || data.form.pages.length === 0) return null

  const checkSocialNetwork = async (params: SocialNetwork) => {
    xeerpa.requestBySocialNetwork(params).then((auth) => {
      if (auth) {
        setOpenModal(true)
        setSocialNetwork(auth.user)
      }
    })
  }
  return (
    <>
      <Modal
        open={openModal}
        onClose={() => {
          setFormResponse(null)
          setOpenModal(false)
          setSocialNetwork({
            email: '',
            name: '',
          })
        }}
        title={
          formResponse
            ? 'Sucesso'
            : progress
            ? 'Enviando'
            : 'Informações pessoais'
        }
        overline="Cadastro"
        className="md:max-w-[700px] z-50"
      >
        {!!formResponse && (
          <MessageModal
            onCloseModal={() => {
              setOpenModal((prev) => !prev)
              setFormResponse(null)
            }}
            message={formResponse?.message}
          />
        )}
        {!formResponse && !progress && (
          <UForm
            className="p-large"
            data={data.form}
            sectionOrder={data.index}
            progress={setProgress}
            onFinish={setFormResponse}
            defaultValues={{
              personalFullName: socialNetwork?.name,
              personalEmail: socialNetwork?.email,
            }}
          />
        )}

        {progress && (
          <div className="py-xlarge px-large">
            <Paragraph size="medium">
              Enviando os dados para cadastro.
            </Paragraph>
          </div>
        )}
      </Modal>
      <NewsletterWidget
        className={classMerge(
          data.socialLoginOptions?.current === null && '[&_.divider]:hidden',
        )}
        heading={{
          title: htmlToText(data.title) || '',
          overline: htmlToText(data.overline) || '',
          description: data.description
            ? {
                asChild: true,
                children: (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.description || '',
                    }}
                  />
                ),
              }
            : undefined,
        }}
        content={{
          title:
            data.socialLoginOptions.current === null
              ? ''
              : 'Cadastre-se com sua rede social:',
          loginButtons:
            data.socialLoginOptions.current === null
              ? []
              : data.socialLoginOptions?.map((item: string) => {
                  return {
                    id: socialOptions[item]?.id,
                    social: socialOptions[item]?.social,
                    onClick: () => {
                      checkSocialNetwork(socialOptions[item]?.sigla)
                    },
                  }
                }),
          form: {
            input: {
              label: 'E-mail',
              placeholder: 'seu@email.com',
              type: 'email',
              onChange: (e) => {
                setSocialNetwork({ email: e.target.value })
              },
              value: socialNetwork?.email,
            },
            submit: {
              children: 'Proximo',
              endIcon: 'MdOutlineChevronRight',
              onClick: () => setOpenModal(true),
            },
          },
        }}
      />
    </>
  )
}
