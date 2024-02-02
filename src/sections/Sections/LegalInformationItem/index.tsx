import { PageContentSectionLegalInformationItem } from '@/models/PageContent'
import classMerge from '@/utils/classMerge'
import { Grid, Heading, Link, Overline } from '@squadfy/uai-design-system'
import { format } from 'date-fns'
import NextLink from 'next/link'

type Props = {
  data: PageContentSectionLegalInformationItem
}

export default function LegalInformationItem({ data }: Props) {
  return (
    <section
      className={classMerge(['w-full', 'py-huge', 'md:py-xxhuge', 'bg-white'])}
    >
      <div className="container">
        <Grid columns="12" className="gap-medium">
          <Grid.Item
            span={{
              xs: '12',
              md: '4',
              lg: '3',
            }}
            className="w-full"
          >
            <ul className="flex flex-col gap-medium">
              {data.menu.map((item) => (
                <li key={item.id}>
                  <Link
                    asChild
                    className={classMerge([
                      {
                        'font-body-bold': item.action.url === data.action.url,
                      },
                    ])}
                  >
                    <NextLink href={item.action.url || ''}>
                      {item.action.label}
                    </NextLink>
                  </Link>
                </li>
              ))}
            </ul>
          </Grid.Item>
          <Grid.Item
            span={{
              xs: '12',
              md: '8',
              lg: '9',
            }}
            className="w-full flex flex-col gap-medium"
          >
            <Heading as="h2" size="large" colorMode="main">
              {data.title}
            </Heading>
            <Overline colorMode="main">
              Última atualização:{' '}
              {format(new Date(data.updatedAt), 'dd.MM.yyyy')}
            </Overline>
            <div
              dangerouslySetInnerHTML={{
                __html: data.description || '',
              }}
              className={classMerge([
                'flex',
                'flex-col',
                'gap-medium',
                'w-full',
                // heading
                '[&_.typography.heading]:typography-heading-color-main',
                '[&_.typography.heading_*]:typography-heading-color-main',
                // heading - small
                '[&_.typography.heading.small]:typography-heading-size-small-default',
                '[&_.typography.heading.small_*]:typography-heading-size-small-default',
                'md:[&_.typography.heading.small]:typography-heading-size-small-responsive',
                'md:[&_.typography.heading.small_*]:typography-heading-size-small-responsive',
                // heading - xSmall
                '[&_.typography.heading.xsmall]:typography-heading-size-xsmall-default',
                '[&_.typography.heading.xsmall_*]:typography-heading-size-xsmall-default',
                'md:[&_.typography.heading.xsmall]:typography-heading-size-xsmall-responsive',
                'md:[&_.typography.heading.xsmall_*]:typography-heading-size-xsmall-responsive',
                // paragraph
                '[&_.typography.paragraph.medium]:typography-paragraph-size-medium',
                '[&_.typography.paragraph.medium]:typography-paragraph-color-main',
                // link
                '[&_a]:link',
                '[&_a]:link-color-main',
                // list
                '[&_ul]:list-disc',
                '[&_ul]:pl-xlarge',
              ])}
            />
          </Grid.Item>
        </Grid>
      </div>
    </section>
  )
}
