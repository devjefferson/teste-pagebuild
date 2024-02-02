import { useState } from 'react'
import { UFormSettings } from '@/models/UForm'
import { Button, Divider, Grid, Overline } from '@squadfy/uai-design-system'
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import UFormStep from './UFormStep'
import {
  getInputNamesFromPageAndUFormSettings,
  getValidationFromUFormSettings,
  getDefaultValuesFromUFormSettings,
  makeValueFromFormData,
} from './helper'
import classMerge from '@/utils/classMerge'
import axios from 'axios'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import useMessage from '@/hooks/useMessage'
import useProgressBar from '@/hooks/useProgressBar'

export type UFormSubmitType = {
  formId: string
  contentId: string
  fields: Record<string, any>
  sectionOrder?: number
}

export type UFormProps = {
  data: UFormSettings
  className?: string
  onFinish?: (response: any) => void
  defaultValues?: Record<string, any>
  progress?: (params: boolean) => void
  sectionOrder: number
}

export default function UForm({
  data,
  sectionOrder,
  className,
  onFinish = () => {},
  defaultValues,
  progress = () => {},
}: UFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { executeRecaptcha } = useGoogleReCaptcha()
  const message = useMessage()
  const progressBar = useProgressBar()

  const form = useForm({
    resolver: zodResolver(getValidationFromUFormSettings(data)),
    defaultValues: defaultValues
      ? {
          ...getDefaultValuesFromUFormSettings(data),
          ...defaultValues,
        }
      : getDefaultValuesFromUFormSettings(data),
  })

  const handleSubmit: SubmitHandler<any> = async () => {
    progressBar.start()
    progress(true)
    try {
      const fields = await makeValueFromFormData(data, form.getValues())
      if (executeRecaptcha) {
        fields['g-recaptcha-response'] = await executeRecaptcha(
          'enquiryFormSubmit',
        )
      }

      const response = await axios.post('/api/section-form', {
        formId: data.id,
        contentId: data.contentId,
        fields,
        sectionOrder,
      })

      onFinish(response.data)

      form.reset()
      setCurrentStep(0)
    } catch (error) {
      message.error(
        'Erro ao enviar o formulário. Verifique os dados e tente novamente!',
      )
    } finally {
      progressBar.done()
      progress(false)
    }
  }

  const handleNextStep = async () => {
    const validStep = await form.trigger(
      getInputNamesFromPageAndUFormSettings(currentStep, data),
    )
    if (validStep) {
      setCurrentStep((old) => old + 1)
    }
  }

  if (data.pages.length === 0) {
    return null
  }

  return (
    <FormProvider {...form}>
      <form
        className={classMerge(['flex flex-col w-full gap-medium', className])}
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {!!data.pages[currentStep] && (
          <UFormStep data={data.pages[currentStep]} />
        )}
        <Divider />
        <Grid columns="12" className="gap-medium">
          <Grid.Item
            span={{
              xs: '6',
              md: '3',
            }}
          >
            <Button
              variant="secondary"
              size="small"
              startIcon="FaChevronLeft"
              className="w-full"
              onClick={() => {
                setCurrentStep((old) => old - 1)
              }}
              disabled={currentStep === 0 || progressBar.isLoading}
            >
              {data.previousLabel}
            </Button>
          </Grid.Item>
          <Grid.Item
            span={{
              xs: '6',
              md: '9',
            }}
          >
            {data.pages.length - 1 === currentStep && (
              <Button
                variant="primary"
                size="small"
                className="w-full"
                type="submit"
                disabled={progressBar.isLoading}
              >
                {data.submitLabel}
              </Button>
            )}
            {data.pages.length - 1 !== currentStep && (
              <Button
                variant="primary"
                size="small"
                endIcon="FaChevronRight"
                className="w-full"
                onClick={handleNextStep}
                disabled={progressBar.isLoading}
              >
                {data.nextLabel}
              </Button>
            )}
          </Grid.Item>
        </Grid>
        <Overline
          className={classMerge([
            '[&_*]:typography-overline',
            '[&_span]:text-background-brand',
            'whitespace-nowrap',
          ])}
        >
          ETAPA <span>{String(currentStep + 1).padStart(2, '0')}</span> DE{' '}
          {String(data.pages.length).padStart(2, '0')}
        </Overline>
      </form>
    </FormProvider>
  )
}
