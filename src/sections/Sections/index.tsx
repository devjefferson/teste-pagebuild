import {
  PageContentSection,
  PageContentSectionCardGridDesconstructed,
  PageContentSectionCardStack,
  PageContentSectionCardStackButton,
  PageContentSectionCarouselCardsLine,
  PageContentSectionContentImage,
  PageContentSectionContentText,
  PageContentSectionContentVideo,
  PageContentSectionFAQ,
  PageContentSectionIframe,
  PageContentSectionLegalInformationItem,
  PageContentSectionLegalInformationList,
  PageContentSectionMediaCarousel,
  PageContentSectionMediaEmbed,
  PageContentSectionNutritionalInformation,
  PageContentSectionProductCardGrid,
  PageContentSectionProductCarousel,
  PageContentSectionRecommendedContent,
  PageContentSectionSectionForm,
  PageContentSectionSocialLinks,
  PageContentSectionSocialShare,
  PageContentSectionWidgetCapture,
} from '@/models/PageContent'
import { Headline } from '@squadfy/uai-design-system'
import CardGridDesconstructed from './CardGridDesconstructed'
import CardStack from './CardStack'
import CardStackButton from './CardStackButton'
import CarouselCardsLine from './CarouselCardsLine'
import ContentImage from './ContentImage'
import ContentText from './ContentText'
import ContentVideo from './ContentVideo'
import Faq from './Faq'
import Iframe from './Iframe'
import LegalInformationItem from './LegalInformationItem'
import LegalInformationList from './LegalInformationList'
import MediaCarousel from './MediaCarousel'
import MediaEmbed from './MediaEmbed'
import NutritionalInformation from './NutritionalInformation'
import ProductCardGrid from './ProductCardGrid'
import ProductCarousel from './ProductCarousel'
import RecommendedContent from './RecommendedContent'
import SectionForm from './SectionForm'
import SocialLinks from './SocialLinks'
import SocialShare from './SocialShare'
import WidgetCapture from './WidgetCapture'

type SectionsProps = {
  items: PageContentSection[]
}

export default function Sections({ items }: SectionsProps) {
  if (items.length === 0) return null

  return (
    <>
      {items.map((item, index) => (
        <Section key={index} data={{ ...item, index }} />
      ))}
    </>
  )
}

type SectionProps = {
  data: PageContentSection & { index: number }
}

function Section({ data }: SectionProps) {
  switch (data.type) {
    case 'contentImage': {
      return (
        <ContentImage data={data.config as PageContentSectionContentImage} />
      )
    }
    case 'contentText': {
      return <ContentText data={data.config as PageContentSectionContentText} />
    }
    case 'cardStackButton': {
      return (
        <CardStackButton
          data={
            {
              ...data.config,
              index: data.index,
            } as PageContentSectionCardStackButton
          }
        />
      )
    }
    case 'socialLinks': {
      return <SocialLinks data={data.config as PageContentSectionSocialLinks} />
    }
    case 'faq': {
      return <Faq data={data.config as PageContentSectionFAQ} />
    }
    case 'socialShare': {
      return <SocialShare data={data.config as PageContentSectionSocialShare} />
    }
    case 'cardStack': {
      return <CardStack data={data.config as PageContentSectionCardStack} />
    }
    case 'carouselCardsLine': {
      return (
        <CarouselCardsLine
          data={data.config as PageContentSectionCarouselCardsLine}
        />
      )
    }
    case 'cardGridDesconstructed': {
      return (
        <CardGridDesconstructed
          data={data.config as PageContentSectionCardGridDesconstructed}
        />
      )
    }
    case 'productCarousel': {
      return (
        <ProductCarousel
          data={data.config as PageContentSectionProductCarousel}
        />
      )
    }
    case 'mediaCarousel': {
      return (
        <MediaCarousel data={data.config as PageContentSectionMediaCarousel} />
      )
    }
    case 'contentVideo': {
      return (
        <ContentVideo data={data.config as PageContentSectionContentVideo} />
      )
    }
    case 'sectionForm': {
      return (
        <SectionForm
          data={
            {
              ...data.config,
              index: data.index,
            } as PageContentSectionSectionForm & { index: number }
          }
        />
      )
    }
    case 'productCardGrid': {
      return (
        <ProductCardGrid
          data={data.config as PageContentSectionProductCardGrid}
        />
      )
    }
    case 'legalInformationList': {
      return (
        <LegalInformationList
          data={data.config as PageContentSectionLegalInformationList}
        />
      )
    }
    case 'legalInformationItem': {
      return (
        <LegalInformationItem
          data={data.config as PageContentSectionLegalInformationItem}
        />
      )
    }
    case 'iframe': {
      return <Iframe data={data.config as PageContentSectionIframe} />
    }
    case 'mediaEmbed': {
      return <MediaEmbed data={data.config as PageContentSectionMediaEmbed} />
    }
    case 'nutritionalInformation': {
      return (
        <NutritionalInformation
          data={data.config as PageContentSectionNutritionalInformation}
        />
      )
    }
    case 'widgetCapture': {
      return (
        <WidgetCapture
          data={
            {
              ...data.config,
              index: data.index,
            } as PageContentSectionWidgetCapture & { index: number }
          }
        />
      )
    }

    case 'socialLoginRecommender': {
      return (
        <RecommendedContent
          data={data.config as PageContentSectionRecommendedContent}
        />
      )
    }
    default: {
      return <Headline title={data.type} variant="soft" />
    }
  }
}
