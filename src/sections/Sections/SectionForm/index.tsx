import React, { useState } from 'react'
import UForm from '@/components/UForm'
import { PageContentSectionSectionForm } from '@/models/PageContent'
import {
  Button,
  Grid,
  Heading,
  Paragraph,
  SocialLoginButton,
} from '@squadfy/uai-design-system'
import { useApp } from '@/providers/App'
import useXeerpaLogin from '@/hooks/useXeerpaLogin'
import classMerge from '@/utils/classMerge'
import { MessageModal } from '@/components/MessageModal'
import Modal from '@/components/Modal'

type Props = {
  data: PageContentSectionSectionForm & { index: number }
}

export default function SectionForm({ data }: Props) {
  const app = useApp()
  const xeerpa = useXeerpaLogin()
  const [formResponse, setFormResponse] = useState<any>(null)
  const [manualSigned, setManualSigned] = useState(false)

  if (!data.form || data.form.pages.length === 0) return null

  return (
    <section className="bg-white overflow-x-hidden">
      <div
        className={classMerge([
          'container',
          'flex',
          'flex-col',
          'gap-xlarge',
          'py-huge',
        ])}
      >
        <div className="flex flex-col gap-xsmall">
          {!!data.title && (
            <Heading size="large" as="h2">
              {data.title}
            </Heading>
          )}
          {!!data.description && (
            <Paragraph size="medium">{data.description}</Paragraph>
          )}
        </div>
        {!!data.enableSocialLogin && !app.authSection && !manualSigned ? (
          <Grid columns="2" className="gap-medium">
            <Grid.Item span={{ xs: '2', md: '1' }}>
              <SocialLoginButton
                onClick={() => xeerpa.requestBySocialNetwork('FB')}
                social="facebook"
                className="w-full"
              />
            </Grid.Item>
            <Grid.Item span={{ xs: '2', md: '1' }}>
              <SocialLoginButton
                onClick={() => xeerpa.requestBySocialNetwork('GO')}
                social="google"
                className="w-full"
              />
            </Grid.Item>
            <Grid.Item span="2">
              <Button
                onClick={() => {
                  setManualSigned(true)
                }}
                className="w-full"
              >
                Continuar Manualmente
              </Button>
            </Grid.Item>
          </Grid>
        ) : (
          <UForm
            data={data.form}
            sectionOrder={data.index}
            onFinish={setFormResponse}
          />
        )}
        {!!formResponse && (
          <Modal
            open={true}
            onClose={() => setFormResponse(null)}
            title="Sucesso"
            overline="Cadastro"
            className="md:max-w-[700px]"
          >
            <MessageModal
              onCloseModal={() => setFormResponse(null)}
              message={formResponse?.message}
            />
          </Modal>
        )}
      </div>
    </section>
  )
}
