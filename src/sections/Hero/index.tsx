import {
  PageContentHero,
  PageContentHeroHeadline,
  PageContentHeroImage,
  PageContentHeroProduct,
} from '@/models/PageContent'
import { htmlToText } from '@/utils/htmlToText'
import { Headline, HeroImage, HeroProduct } from '@squadfy/uai-design-system'
import NextLink from 'next/link'

type HeroProps = {
  content: PageContentHero | null
}

export default function Hero({ content }: HeroProps) {
  if (!content) return null

  switch (content.type) {
    case 'heroImage': {
      const heroImage = content.config as PageContentHeroImage
      return (
        <HeroImage
          className="h-90vh"
          vertical="bottom"
          horizontal="left"
          overline={htmlToText(heroImage.overline)}
          title={{
            children: htmlToText(heroImage.title),
            size: 'small',
          }}
          description={
            heroImage.description
              ? {
                  asChild: true,
                  children: (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: heroImage.description || '',
                      }}
                    />
                  ),
                }
              : undefined
          }
          action={
            heroImage.action
              ? {
                  asChild: true,
                  children: (
                    <NextLink href={heroImage.action?.url || '/'}>
                      {heroImage.action.label || ''}
                    </NextLink>
                  ),
                }
              : undefined
          }
          media={
            heroImage.image
              ? {
                  src: heroImage.image.url,
                  alt: heroImage.image.alt,
                }
              : undefined
          }
        />
      )
    }
    case 'headline': {
      const headline = content.config as PageContentHeroHeadline
      return (
        <Headline
          overline={headline.overline || ''}
          title={headline.title || ''}
          description={
            headline.description
              ? {
                  asChild: true,
                  children: (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: headline.description || '',
                      }}
                    />
                  ),
                }
              : undefined
          }
          variant="brand"
        />
      )
    }
    case 'heroProduct': {
      const heroProduct = content.config as PageContentHeroProduct
      return (
        <HeroProduct
          breadcrumbs={heroProduct.breadcrumb.map((item) => ({
            children: item.label,
            href: item.url,
            id: item.id,
          }))}
          media={
            heroProduct.image
              ? {
                  alt: heroProduct.image.alt,
                  src: heroProduct.image.url,
                }
              : undefined
          }
          subtitle={
            heroProduct.subtitle
              ? {
                  asChild: true,
                  children: (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: heroProduct.subtitle || '',
                      }}
                    />
                  ),
                }
              : undefined
          }
          title={heroProduct.title || ''}
        />
      )
    }
    default:
      return null
  }
}
