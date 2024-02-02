import FooterCopyright from '@/components/FooterCopyright'
import { useApp } from '@/providers/App'
import classMerge from '@/utils/classMerge'
import { AgeGate as DonutAgeGate } from '@squadfy/uai-design-system'
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function AgeGate() {
  const [showDenied, setShowDenied] = useState(false)
  const [granted, setGranted] = useState(false)
  const {
    siteSetup: { brand, ageGate },
  } = useApp()

  useEffect(() => {
    document.body.classList.add('overflow-y-hidden')
  }, [])

  const handleGrantAccess = async () => {
    try {
      await axios.post('/api/session/age-gate', {
        status: 'GRANTED',
      })
      document.body.classList.remove('overflow-y-hidden')
      setGranted(true)
    } catch (error) {
      alert('Ocorreu um erro ao confirmar sua idade. Tente novamente!')
    }
  }

  if (!granted) {
    return (
      <div
        className={classMerge([
          'fixed',
          'inset-0',
          'flex',
          'flex-col',
          'h-screen',
          'overflow-hidden',
          'z-[999]',
        ])}
      >
        <DonutAgeGate
          className="flex flex-1 w-screen"
          denied={showDenied}
          logo={
            brand
              ? {
                  src: brand.logo.colorfulLogo.url,
                  alt: brand.brandName,
                }
              : undefined
          }
          title={ageGate ? ageGate.title || '' : ''}
          description={
            ageGate
              ? {
                  asChild: true,
                  children: (
                    <div
                      dangerouslySetInnerHTML={{ __html: ageGate.description }}
                    />
                  ),
                }
              : undefined
          }
          image={
            ageGate
              ? {
                  src: ageGate.image.url,
                  alt: ageGate.altText,
                }
              : undefined
          }
          titleDenied={ageGate ? ageGate.deniedAccessTitle || '' : ''}
          descriptionDenied={
            ageGate
              ? {
                  asChild: true,
                  children: (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: ageGate.deniedAccessDescription,
                      }}
                    />
                  ),
                }
              : undefined
          }
          imageDenied={
            ageGate
              ? {
                  src: ageGate.deniedAccessImage.url,
                  alt: ageGate.deniedAccessAltText,
                }
              : undefined
          }
          actionConfirm={{
            children: 'Sim',
            onClick: handleGrantAccess,
          }}
          actionCancel={{
            children: 'Não',
            onClick: () => setShowDenied(true),
          }}
        />
        <FooterCopyright
          awareness={{
            className: 'font-heading-bold text-content-brand',
            children: 'Aprecie com moderação',
          }}
          copyrightLogo={{
            src: '/images/copyright.svg',
            alt: 'Heineken',
            className: 'h-xlarge w-auto',
          }}
          copyrightText={{
            children: `© HEINEKEN Brasil ${new Date().getFullYear()}`,
          }}
        />
      </div>
    )
  }

  return null
}
