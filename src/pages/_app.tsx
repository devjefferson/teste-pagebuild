import { SiteSetup } from '@/models/SiteSetup'
import AppProvider from '@/providers/App'
import GetSiteSetup from '@/services/GetSiteSetup'
import { SessionProvider } from 'next-auth/react'

import '@/styles/globals.css'
import App, { AppContext, AppProps } from 'next/app'
import Head from 'next/head'
import { getIronSession } from 'iron-session'
import { SESSION_OPTIONS } from '@/configs/session'
import { AuthSection } from '@/models/Auth'
import Router from 'next/router'
import { useCallback, useEffect } from 'react'
import useProgressBar from '@/hooks/useProgressBar'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import NProgress from 'nprogress'

import 'nprogress/nprogress.css'
import { ToastContainer } from 'react-toastify'

type MyAppProps = AppProps & {
  siteSetup: SiteSetup
  authSection: AuthSection | null
  ageGateSection?: string
}

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  siteSetup,
  authSection,
  ageGateSection,
}: MyAppProps) {
  const progressBar = useProgressBar()
  const handleRouteStart = useCallback(() => progressBar.start(), [progressBar])

  const handleRouteDone = useCallback(() => progressBar.done(), [progressBar])

  useEffect(() => {
    const handleRouteStart = () => NProgress.start()
    const handleRouteDone = () => {
      NProgress.done()
    }
    Router.events.on('routeChangeStart', handleRouteStart)
    Router.events.on('routeChangeComplete', handleRouteDone)
    Router.events.on('routeChangeError', handleRouteDone)
    return () => {
      Router.events.off('routeChangeStart', handleRouteStart)
      Router.events.off('routeChangeComplete', handleRouteDone)
      Router.events.off('routeChangeError', handleRouteDone)
    }
  }, [handleRouteDone, handleRouteStart])

  return (
    <SessionProvider session={session}>
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
        scriptProps={{
          async: false,
          defer: false,
          appendTo: 'head',
          nonce: undefined,
        }}
      >
        <AppProvider
          siteSetup={siteSetup}
          authSection={authSection || undefined}
          ageGateSection={ageGateSection}
        >
          <Head>
            <link rel="icon" href={siteSetup?.brand?.favicon?.url || ''} />
            <title>{siteSetup?.brand?.brandName}</title>
          </Head>
          <Component {...pageProps} />
        </AppProvider>
        <ToastContainer />
      </GoogleReCaptchaProvider>
    </SessionProvider>
  )
}

MyApp.getInitialProps = async (app: AppContext): Promise<any> => {
  const ctx = await App.getInitialProps(app)
  const siteSetup = await GetSiteSetup()
  const section = await getIronSession(
    app.ctx.req!,
    app.ctx.res!,
    SESSION_OPTIONS,
  )

  return {
    ...ctx,
    siteSetup,
    authSection: section?.auth || null,
    ageGateSection: section?.ageGate,
  }
}

export default MyApp
