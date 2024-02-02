import { BrandContent } from '@/models/BrandContent'
import { NavigationContent } from '@/models/NavigationContent'
import { Footer as DonutFooter } from '@squadfy/uai-design-system'
import NextLink from 'next/link'

type Props = {
  navigation: NavigationContent['footers']
  brand: BrandContent
}

export default function Footer({ navigation, brand }: Props) {
  switch (navigation.flavor) {
    case 'footer':
      return (
        <DonutFooter
          flavor="column"
          logo={{
            src: navigation.logoFooter.url,
            alt: brand.brandName,
          }}
          socialNetworks={brand.socialMedia.map((item) => ({
            id: `social-${item.type}`,
            social: item.type,
            href: item.url,
          }))}
          customerService={{
            asChild: true,
            children: (
              <div
                dangerouslySetInnerHTML={{
                  __html: navigation.contactInfo,
                }}
              />
            ),
          }}
          columnLinks={navigation.navigationFooter.map((item) => ({
            id: item.title,
            title: item.title,
            links: item.links.map((link) => ({
              id: link.label,
              asChild: true,
              children: <NextLink href={link.url}>{link.label}</NextLink>,
            })),
          }))}
          awareness={navigation.awareness || ''}
          copyrightText={navigation.copyrightText || ''}
          copyrightLogo={{
            src: navigation.heinekenLogo.url,
            alt: 'Copyright Logo',
          }}
        />
      )
    case 'footerSimple':
      return (
        <DonutFooter
          flavor="simple"
          logo={{
            src: navigation.logoFooter.url,
            alt: brand.brandName,
          }}
          socialNetworks={brand.socialMedia.map((item) => ({
            id: `social-${item.type}`,
            social: item.type,
            href: item.url,
          }))}
          customerService={{
            asChild: true,
            children: (
              <div
                dangerouslySetInnerHTML={{
                  __html: navigation.contactInfo,
                }}
              />
            ),
          }}
          links={navigation.navigationFooter[0].links.map((link) => ({
            id: link.label,
            children: link.label,
            href: link.url,
          }))}
          aditionalLink={{
            children: navigation.aditionalLink.name,
            href: navigation.aditionalLink.url,
          }}
          awareness={navigation.awareness || ''}
          copyrightText={navigation.copyrightText || ''}
          copyrightLogo={{
            src: navigation.heinekenLogo.url,
            alt: 'Copyright Logo',
          }}
        />
      )

    default:
      return null
  }
}
