import { PageContentSectionNutritionalInformation } from '@/models/PageContent'
import { NutritionalInformation as DonutNutritionalInformation } from '@squadfy/uai-design-system'

type Props = {
  data: PageContentSectionNutritionalInformation
}

export default function NutritionalInformation({ data }: Props) {
  return (
    <>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <DonutNutritionalInformation
        className="relative"
        mainTitle={data.titleMain || ''}
        volume={data.volume || ''}
        ingredients={
          data.ingredients
            ? {
                asChild: true,
                children: (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.ingredients || '',
                    }}
                  />
                ),
              }
            : undefined
        }
        alergenics={
          data.allergens
            ? {
                asChild: true,
                children: (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.allergens || '',
                    }}
                  />
                ),
              }
            : undefined
        }
        showAboutContent={!!data.showAboutContent}
        aboutContent={
          data.showAboutContent
            ? {
                position: data.position || 'start',
                media: data.media
                  ? {
                      src: data.media?.url,
                      alt: data.media?.alt,
                    }
                  : undefined,
                text: {
                  overline: data.aboutOverline || '',
                  title: data.aboutTitle || '',
                  description: data.aboutDescription
                    ? {
                        asChild: true,
                        children: (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: data.aboutDescription || '',
                            }}
                          />
                        ),
                      }
                    : undefined,
                },
              }
            : undefined
        }
        values={data.values.map((value, index) => ({
          id: index.toString(),
          aditionInfo: undefined,
          title: value.title || '',
          description: value.description
            ? {
                asChild: true,
                children: (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: value.description || '',
                    }}
                  />
                ),
              }
            : undefined,
          icon: value.icon
            ? {
                src: value.icon.url || '',
                alt: value.icon.alt || '',
              }
            : undefined,
        }))}
      />
    </>
  )
}
