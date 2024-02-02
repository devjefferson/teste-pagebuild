import { PageContentSectionSocialShare } from '@/models/PageContent'
import { SocialShare as DonutSocialShare } from '@squadfy/uai-design-system'

type Props = {
  data: PageContentSectionSocialShare
}

export default function SocialShare({ data }: Props) {
  return (
    <DonutSocialShare
      className="overflow-x-hidden"
      title={data.title || ''}
      socialMedia={[
        {
          social: 'whatsApp',
          onClick: () => {
            try {
              const url = encodeURIComponent(
                `${window.location.href}?utm_source=whatsapp&utm_medium=social&utm_campaign=compartilhamento+do+site`,
              )
              window.open(
                `https://api.whatsapp.com/send?text=${url}`,
                '_blank',
                'width=625,height=430',
              )
            } catch (error) {
              // TODO: handle error
            }
          },
        },
        {
          social: 'facebook',
          onClick: () => {
            try {
              const url = encodeURIComponent(
                `${window.location.href}?utm_source=facebook&utm_medium=social&utm_campaign=compartilhamento+do+site`,
              )
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                '_blank',
                'width=625,height=430',
              )
            } catch (error) {
              // TODO: handle error
            }
          },
        },
        {
          social: 'twitter',
          onClick: () => {
            try {
              const url = encodeURIComponent(
                `${window.location.href}?utm_source=twitter&utm_medium=social&utm_campaign=compartilhamento+do+site`,
              )
              window.open(
                `https://twitter.com/intent/tweet?url=${url}`,
                '_blank',
                'width=625,height=430',
              )
            } catch (error) {
              // TODO: handle error
            }
          },
        },
        {
          social: 'share-variant',
          onClick: async () => {
            try {
              const url = `${window.location.href}?utm_source=link+copiado&utm_medium=referral&utm_campaign=compartilhamento+do+site`
              await navigator.clipboard.writeText(url)
              alert('URL copiada')
            } catch (error) {
              // TODO: handle error
            }
          },
        },
      ]}
    />
  )
}
