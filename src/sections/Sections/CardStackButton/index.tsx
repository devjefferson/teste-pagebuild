import { MessageModal } from '@/components/MessageModal'
import Modal from '@/components/Modal'
import UForm from '@/components/UForm'
import { PageContentSectionCardStackButton } from '@/models/PageContent'
import { UFormSettings } from '@/models/UForm'
import {
  Button,
  CardGrid as DonutCardGrid,
  Link,
  Paragraph,
} from '@squadfy/uai-design-system'
import NextLink from 'next/link'
import { useState } from 'react'

type Props = {
  data: PageContentSectionCardStackButton
}

export default function CardStackButton({ data }: Props) {
  return (
    <DonutCardGrid
      className="overflow-x-hidden"
      title={data.title || ''}
      cards={data.cards.map((item, index) => ({
        id: index.toString(),
        overline: item.overline || '',
        title: item.title || '',
        description: item.description || '',
        action: item.form
          ? {
              render() {
                return (
                  <CardStackButtonForm
                    index={data.index || 0}
                    title={item.title || ''}
                    label={item?.action?.label || ''}
                    form={item.form!}
                  />
                )
              },
            }
          : item.action
          ? {
              asChild: true,
              children: (
                <NextLink href={item.action?.url || '/'}>
                  {item.action.label || ''}
                </NextLink>
              ),
            }
          : undefined,
        media: item.media
          ? {
              src: item.media.url,
              alt: item.media.alt,
            }
          : undefined,
      }))}
    />
  )
}

function CardStackButtonForm({
  index,
  title,
  label,
  form,
}: {
  index: number
  title: string
  label: string
  form: UFormSettings
}) {
  const [openModal, setOpenModal] = useState(false)
  const [formResponse, setFormResponse] = useState<any>(null)

  return (
    <>
      <Button
        size="medium"
        variant="ghost"
        onClick={() => setOpenModal(true)}
        className="w-full"
      >
        {label}
      </Button>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false)
        }}
        title={formResponse ? 'Sucesso' : title}
        overline={label}
        className="md:max-w-[600px]"
      >
        {!formResponse && (
          <UForm
            sectionOrder={index}
            className="p-large"
            data={form}
            onFinish={setFormResponse}
          />
        )}
        {!!formResponse && form.type === 'contact' && (
          <div className="p-medium flex flex-col gap-medium">
            <Paragraph asChild>
              <div
                dangerouslySetInnerHTML={{
                  __html: formResponse?.message,
                }}
              />
            </Paragraph>
            <div className="flex flex-col py-xlarge items-center justify-center">
              <Paragraph className="text-content-soft" size="small">
                Número do protocolo:
              </Paragraph>
              <Paragraph className="text-content-soft" asChild>
                <div
                  dangerouslySetInnerHTML={{
                    __html: formResponse?.data?.caseNumber || '',
                  }}
                />
              </Paragraph>
            </div>
            <div className="flex flex-col gap-xxsmall justify-center items-center">
              <Button
                className="flex w-full"
                onClick={() => {
                  setFormResponse(null)
                  setOpenModal(false)
                }}
              >
                Concluir e fechar
              </Button>
              <Link href="/informacoes-legais">Informações legais</Link>
            </div>
          </div>
        )}
        {!!formResponse && form.type !== 'contact' && (
          <MessageModal
            onCloseModal={() => {
              setFormResponse(null)
              setOpenModal(false)
            }}
            message={formResponse?.message}
          />
        )}
      </Modal>
    </>
  )
}
