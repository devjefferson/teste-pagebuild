import { PageContentSectionIframe } from '@/models/PageContent'
import classMerge from '@/utils/classMerge'
import { Grid, Heading, Paragraph } from '@squadfy/uai-design-system'

type Props = {
  data: PageContentSectionIframe
}

export default function Iframe({ data }: Props) {
  return (
    <section className="w-full bg-white overflow-x-hidden">
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
        <Grid columns="12">
          <Grid.Item
            dangerouslySetInnerHTML={{
              __html: data.iframe || '',
            }}
            className={classMerge([
              {
                Cheia: ['h-80vh', '[&_iframe]:!h-80vh'],
                '2/3': [
                  '!h-[calc(100vh_/_3_*_2)]',
                  '[&_iframe]:!h-[calc(100vh_/_3_*_2)]',
                ],
                '1/2': ['h-1/2', '[&_iframe]:!h-1/2'],
                '1/3': [
                  'h-[calc(100vh_/_3)]',
                  '[&_iframe]:!h-[calc(100vh_/_3)]',
                ],
                Filete: ['h-[160px]', '[&_iframe]:!h-[160px]'],
              }[data.height],
              {
                Largo: ['[&_iframe]:!w-full'],
                Médio: ['[&_iframe]:!w-full'],
                Estreito: ['[&_iframe]:!w-full'],
              }[data.width],
            ])}
            span={{
              xs: '12',
              md: {
                Largo: '12',
                Médio: '8',
                Estreito: '6',
              }[data.width] as any,
            }}
            startIn={{
              xs: '1',
              md: {
                Largo: '1',
                Médio: '3',
                Estreito: '4',
              }[data.width] as any,
            }}
          />
        </Grid>
      </div>
    </section>
  )
}
