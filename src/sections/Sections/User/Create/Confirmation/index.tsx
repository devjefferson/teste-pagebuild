import useMessage from '@/hooks/useMessage'
import { Button, Paragraph } from '@squadfy/uai-design-system'
import axios from 'axios'

type UserCreateConfirmationProps = {
  token: string
  userId: string
}

export default function UserCreateConfirmation({
  token,
  userId,
}: UserCreateConfirmationProps) {
  const { success, error } = useMessage()

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/auth/complete-register', {
        code: token,
        userId,
      })

      if (response?.status !== 200) throw response

      success(`E-mail confirmado com sucesso`)

      setTimeout(function () {
        window.location.href = `/login`
      }, 2000)
    } catch (e: any) {
      error(e.response.data.error.title)
    }
  }

  return (
    <section>
      <div className="container py-xxlarge md:pt-xgiant flex flex-col justify-end min-h-1/2">
        <div className="w-full md:max-w-[648px] space-y-medium">
          <Paragraph size="large">E-mail confirmado com sucesso</Paragraph>
          <Button
            onClick={handleSubmit}
            size="medium"
            variant="secondary"
            className="uppercase w-full"
            endIcon="MdOutlineKeyboardArrowRight"
          >
            Fazer Login
          </Button>
        </div>
      </div>
    </section>
  )
}
