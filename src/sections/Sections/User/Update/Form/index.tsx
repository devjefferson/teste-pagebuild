import ImageUpload from '@/components/ImageUpload'
import useMessage from '@/hooks/useMessage'
import { useReCaptcha } from '@/hooks/useReCaptcha'
import getGenderList from '@/services/gender/getGenderList'
import { TUser } from '@/services/GetAuth/me'
import GetStateList from '@/services/GetStateList'
import updateUserSchema, {
  UpdateUserPayload,
} from '@/services/User/updateUser/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Divider,
  Grid,
  Heading,
  InputMask,
  InputSelect,
  InputText,
  Paragraph,
} from '@squadfy/uai-design-system'
import axios from 'axios'
import { signIn, signOut } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

type userProps = {
  user: TUser
}

export default function UserUpdateForm({ user }: userProps) {
  const { success, error } = useMessage()
  const [image, setImage] = useState<string | null>(null)

  const { reload } = useReCaptcha()

  const form = useForm<UpdateUserPayload>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.firstName,
      surName: user?.surName,
      birthdate: user?.birthdate,
      gender: user?.gender || '',
      phone: user?.phone || '',
      profession: user?.profession || '',
      address: user?.address || '',
      addressNumber: user?.addressNumber || '',
      addressDistrict: user?.addressDistrict || '',
      addressState: user?.addressState || '',
      addressCity: user?.addressCity || '',
      zipCode: user?.zipCode || '',
      addressComplement: user?.addressComplement || '',
    },
  })

  const reloadRecaptch = useCallback(() => {
    reload((token) => {
      form.setValue('recaptchaToken', token)
    }, 'formUpdateUser')
  }, [form, reload])

  useEffect(() => {
    reloadRecaptch()
  }, [reloadRecaptch])

  const handleUpdateImage = async (data: string) => {
    reloadRecaptch()
    try {
      setImage(data)
      const response = await axios.post('/api/auth/update-image', {
        image: data || user.imagePath,
        id: user.id,
        recaptchaToken: form.getValues('recaptchaToken'),
      })

      if (response.status === 200) {
        const updateUserSession = await signIn('refresh-user', {
          token: user.token,
          redirect: false,
        })
        reloadRecaptch()

        if (updateUserSession?.error) throw updateUserSession.error
      }
    } catch (error) {}
  }

  const handleSubmit: SubmitHandler<UpdateUserPayload> = async (dataForm) => {
    reloadRecaptch()
    try {
      const response = await axios.post('/api/auth/update-profile', {
        ...user,
        ...dataForm,
        image: image || user.imagePath,
      })
      if (response.status === 200) {
        const updateUserSession = await signIn('refresh-user', {
          token: user.token,
          redirect: false,
        })

        if (updateUserSession?.error) throw updateUserSession.error
      }

      if (response?.status !== 200) throw response

      success(`Cadastro atualizado com sucesso!`)
      setTimeout(function () {
        window.location.href = `/perfil-do-usuario`
      }, 2000)
    } catch (e: any) {
      error(e.response.data.error.title)
    }
  }

  const handleDelete = async (userId: string) => {
    reloadRecaptch()
    try {
      const response = await axios.post('/api/auth/delete-profile', {
        userId,

        recaptchaToken: form.getValues('recaptchaToken'),
      })

      if (response?.status !== 200) throw response

      success(`Cadastro removido com sucesso`)

      setTimeout(async function () {
        localStorage.clear()
        await signOut({
          redirect: true,
          callbackUrl: '/',
        })
      }, 2000)
    } catch (e: any) {
      error(e.response.data.error.title)
    }
  }

  const genderList = getGenderList()

  const stateList = GetStateList()

  return (
    <section className="container py-huge lg:py-giant">
      <div className="mb-huge">
        <Heading size="xLarge" as="h1">
          Olá, {`${user.firstName} ${user.surName}`}
        </Heading>
        <Paragraph>Você está editando seus dados pessoais</Paragraph>
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Grid columns="12" className="gap-xlarge">
          <Grid.Item
            span={{ xs: '12', lg: '6' }}
            className="flex flex-col gap-xlarge"
          >
            <ImageUpload
              image={image}
              setImage={handleUpdateImage}
              preview={user.imagePath}
              // previewText={`${user.firstName.split(' ')[0][0] || ''}${
              //   user.firstName.split(' ').length > 1
              //     ? user.firstName.split(' ')[1][0]
              //     : ''
              // }`}
            />
            <Paragraph size="large" colorMode="main">
              Dados pessoais
            </Paragraph>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="Nome *"
                  placeholder="Seu nome"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="surName"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="Sobrenome *"
                  placeholder="Seu sobrenome"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <InputMask
                  inputRef={field.ref}
                  label="Celular *"
                  placeholder="(00) 00000-0000"
                  mask="(99) 99999-9999"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="birthdate"
              render={({ field, fieldState }) => (
                <InputMask
                  inputRef={field.ref}
                  label="Data de nascimento *"
                  placeholder="00/00/0000"
                  mask="99/99/9999"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="gender"
              render={({ field, fieldState }) => (
                <InputSelect
                  ref={field.ref}
                  label="Gênero"
                  options={genderList}
                  placeholder="Selecione"
                  errorText={fieldState.error?.message}
                  value={genderList.find((item) => item.value === field.value)}
                  name={field.name}
                  onChange={(e) => field.onChange(e?.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="profession"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="Profissão"
                  placeholder="Seu nome"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </Grid.Item>
          <Grid.Item
            span={{ xs: '12', lg: '6' }}
            className="flex flex-col gap-xlarge"
          >
            <Paragraph size="large" colorMode="main">
              Localização
            </Paragraph>
            <Controller
              control={form.control}
              name="zipCode"
              render={({ field, fieldState }) => (
                <InputMask
                  inputRef={field.ref}
                  label="CEP"
                  placeholder="00000-00"
                  mask="99999-999"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="addressState"
              render={({ field, fieldState }) => (
                <InputSelect
                  ref={field.ref}
                  label="Estado (UF)"
                  options={stateList}
                  placeholder="Estado (UF)"
                  errorText={fieldState.error?.message}
                  value={stateList.find((item) => item.value === field.value)}
                  name={field.name}
                  onChange={(e) => field.onChange(e?.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="addressCity"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="Cidade"
                  placeholder="Cidade"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="addressDistrict"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="Bairro"
                  placeholder="Seu Bairro"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="Endereço"
                  placeholder="Endereço"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="addressNumber"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="Número"
                  placeholder="n°"
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
            <Controller
              control={form.control}
              name="addressComplement"
              render={({ field, fieldState }) => (
                <InputText
                  ref={field.ref}
                  label="Complemento"
                  placeholder=""
                  errorText={fieldState.error?.message}
                  value={field.value}
                  name={field.name}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </Grid.Item>
        </Grid>
        <Button
          colorMode="main"
          size="medium"
          endIcon="MdChevronRight"
          variant="secondary"
          className="uppercase w-full mt-xxlarge"
          type="submit"
        >
          Alterar
        </Button>
      </form>
      <Divider className="my-xxlarge" />

      <Grid columns="12" className="gap-xlarge lg:gap-xxlarge">
        <Grid.Item span={{ xs: '12', lg: '6' }}>
          <Button
            asChild
            variant="secondary"
            className="w-full uppercase"
            startIcon="MdOutlineKey"
          >
            <a href="/perfil-do-usuario/editar-senha">Alterar senha</a>
          </Button>
        </Grid.Item>
        <Grid.Item span={{ xs: '12', lg: '6' }}>
          <Button
            variant="secondary"
            className="w-full uppercase"
            startIcon="FaUserTimes"
            size="medium"
            onClick={() => handleDelete(user.id)}
          >
            Apagar minha conta
          </Button>
        </Grid.Item>
      </Grid>
    </section>
  )
}
