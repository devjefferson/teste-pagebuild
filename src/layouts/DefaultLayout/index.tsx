import React from 'react'
import { useApp } from '@/providers/App'
import { PageContentHero, PageContentSeo } from '@/models/PageContent'
import Head from 'next/head'
import Hero from '@/sections/Hero'
import { Header, Footer } from '@/sections/Navigation'
import AgeGate from '@/sections/Sections/AgeGate'

type DefaultLayoutProps = {
  children: React.ReactNode
  seo: PageContentSeo
  hero: PageContentHero | null
}

export default function DefaultLayout({
  children,
  seo,
  hero,
}: DefaultLayoutProps) {
  const {
    siteSetup: { brand, navigation },
    ageGateSection,
  } = useApp()

  const headerColorMode = hero?.type === 'heroImage' ? 'contrast' : 'main'

  return (
    <>
      {!!brand && !!seo && (
        <Head>
          <title>
            {seo.title ? `${seo.title} | ${brand.brandName}` : brand.brandName}
          </title>
          <meta
            name="title"
            content={
              seo.title ? `${seo.title} | ${brand.brandName}` : brand.brandName
            }
          />
          <meta name="description" content={seo.description || ''} />
          <meta name="keywords" content={seo.keywords || ''} />
        </Head>
      )}
      {!!brand && !!navigation && (
        <Header
          brand={brand}
          colorMode={headerColorMode}
          navigation={navigation.headers}
        />
      )}
      <Hero content={hero} />
      {children}
      {!!brand && !!navigation && (
        <Footer brand={brand} navigation={navigation.footers} />
      )}
      {ageGateSection !== 'GRANTED' && <AgeGate />}
    </>
  )
}
