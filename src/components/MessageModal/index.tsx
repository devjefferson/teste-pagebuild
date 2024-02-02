import { Button, Link, Paragraph } from '@squadfy/uai-design-system'

type PropsMessageModal = {
  message: string
  onCloseModal: () => void
}

export const MessageModal = ({ message, onCloseModal }: PropsMessageModal) => {
  return (
    <div className="p-medium flex flex-col gap-medium">
      <Paragraph asChild>
        <div
          dangerouslySetInnerHTML={{
            __html: message,
          }}
        />
      </Paragraph>
      <div className="flex flex-col gap-xxsmall justify-center items-center">
        <Button className="flex w-full" onClick={onCloseModal}>
          Concluir e fechar
        </Button>
        <Link href="/informacoes-legais">Informações legais</Link>
      </div>
    </div>
  )
}
