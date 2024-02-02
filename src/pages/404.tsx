import { PageError } from '@squadfy/uai-design-system'
import NextLink from 'next/link'

export default function Page() {
  return (
    <PageError
      className="h-screen w-screen"
      title={'Página não encontrada'}
      description={
        'Parece que a página que você está tentando acessar não existe.'
      }
      action={{
        asChild: true,
        children: <NextLink href="/">Voltar para a Home</NextLink>,
      }}
    />
  )
}
