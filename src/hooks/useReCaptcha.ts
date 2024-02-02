import { useCallback } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

export const useReCaptcha = () => {
  const { executeRecaptcha } = useGoogleReCaptcha()
  const reload = useCallback(
    async (setReload: (token: string) => void, action: string) => {
      if (!executeRecaptcha) return
      const recTokenResult = await executeRecaptcha(action)
      setReload(recTokenResult)
    },
    [executeRecaptcha],
  )

  return {
    reload,
  }
}
