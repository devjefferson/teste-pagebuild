import { TUser } from '@/services/GetAuth/me'
import {
  Button,
  Grid,
  Heading,
  Overline,
  Paragraph,
} from '@squadfy/uai-design-system'

export default function UserProfile({
  data,
}: {
  data?: {
    user?: TUser
  }
}) {
  return (
    <section>
      <div className="container py-huge">
        <Heading size="xLarge" className="mb-xxlarge" as="h1">
          Olá, {`${data?.user?.firstName} ${data?.user?.surName}`}
        </Heading>
        <pre className="hidden">{JSON.stringify(data || {}, null, 2)}</pre>
        <Grid columns="12" className="gap-xlarge lg:gap-xxlarge">
          <Grid.Item span={{ xs: '12', lg: '6' }}>
            <Button
              asChild
              variant="secondary"
              className="w-full uppercase"
              startIcon="FaRegUser"
              size="medium"
            >
              <a href={`/perfil-do-usuario/editar-dados?id=${data?.user?.id}`}>
                Editar dados pessoais
              </a>
            </Button>
          </Grid.Item>
          <Grid.Item span={{ xs: '12', lg: '6' }}>
            <Button
              asChild
              variant="secondary"
              className="w-full uppercase"
              startIcon="MdOutlineKey"
            >
              <a href={`/perfil-do-usuario/editar-senha?id=${data?.user?.id}`}>
                Alterar senha
              </a>
            </Button>
          </Grid.Item>
        </Grid>
      </div>
      <div className="bg-background-soft">
        <div className="container p-xxlarge flex flex-col items-center justify-center gap-medium">
          <Overline>Sobrelinha</Overline>
          <Heading as="h2">Titulo</Heading>
          <Paragraph className="mb-medium">Descrição</Paragraph>
        </div>
      </div>
    </section>
  )
}
