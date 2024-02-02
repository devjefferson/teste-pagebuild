import { AuthSection, SocialNetwork } from '@/models/Auth'
import { useApp } from '@/providers/App'
import axios from 'axios'
import useProgressBar from './useProgressBar'
import nProgress from 'nprogress'

export default function useXeerpaLogin() {
  const progressBar = useProgressBar()
  const app = useApp()

  async function requestBySocialNetwork(
    social: SocialNetwork,
  ): Promise<AuthSection | undefined> {
    try {
      if (window.isPopupSocialOpen) return

      progressBar.start()
      const data = await getXeerpaDataFromSocial(social)
      const message = JSON.parse(data || '{}')

      if (!message?.It) throw new Error("It's no xeerpa return")

      const [id = '', token = ''] = Buffer.from(String(message.It), 'base64')
        .toString()
        .split('?')

      const authSection: AuthSection = {
        id,
        token,
        it: message.It,
        socialNetwork: message?.Sn || 'FB',
        user: {
          name: message?.User?.Name || '',
          email: message?.User?.Email || '',
          birthday: message?.User?.Birthday || '',
        },
      }

      await axios.post('/api/session/auth', authSection)

      app.setAuthSection(authSection)

      return authSection
    } catch (error) {
      return undefined
    } finally {
      progressBar.done()
    }
  }

  return {
    requestBySocialNetwork,
  }
}

async function getXeerpaDataFromSocial(social: SocialNetwork) {
  const data = await new Promise<string>((resolve) => {
    const y = window.outerHeight / 2 + window.screenY - 500 / 2
    const x = window.outerWidth / 2 + window.screenX - 700 / 2
    let postMessage = ''

    // método para capturar a mensagem post da janela aberta
    const messageListener = (e: MessageEvent<any>) => {
      postMessage = e?.data || ''
      window.removeEventListener('message', messageListener, false)
    }

    // abre janela para autenticar com xeerpa
    const signInWindow = window.open(
      `${process.env.NEXT_PUBLIC_API_UMBRACO}/umbraco/v1/sociallogin/BuildLoginPage?socialnetwork=${social}`,
      '_blank',
      `width=600,height=575,scrollbars=yes,left=${y},screenX=${x},top=${x},screenY=${y}`,
    )

    window.isPopupSocialOpen = true

    // verifica se abriu uma janela
    if (signInWindow) {
      // cria um timer para verificar se a janela se fechou

      const timerRef = setInterval(() => {
        try {
          if (signInWindow.closed) {
            clearInterval(timerRef)
            window.isPopupSocialOpen = false
            resolve(postMessage)
          }
        } catch (error) {
          nProgress.done()
          window.isPopupSocialOpen = false
          clearInterval(timerRef)
        }
      }, 1000)

      window.removeEventListener('message', messageListener, false)
      window.addEventListener('message', messageListener, false)
    }
  })

  return data
}
