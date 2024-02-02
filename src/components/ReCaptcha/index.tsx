/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

type ReCaptchaProps = {
  onChange?: (token: string) => void
}

export default function ReCaptcha({ onChange = () => {} }: ReCaptchaProps) {
  const { executeRecaptcha } = useGoogleReCaptcha()

  useEffect(() => {
    if (executeRecaptcha) {
      executeRecaptcha('enquiryFormSubmit').then((gReCaptchaToken) => {
        onChange(gReCaptchaToken)
      })
    }
  }, [executeRecaptcha])

  return null
}
