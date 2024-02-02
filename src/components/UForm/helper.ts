import {
  UFormColumnField,
  UFormFieldSettingsCheckbox,
  UFormFieldSettingsDate,
  UFormFieldSettingsDropdown,
  UFormFieldSettingsFileUpload,
  UFormFieldSettingsHidden,
  UFormFieldSettingsLongAnswer,
  UFormFieldSettingsMultipleChoice,
  UFormFieldSettingsShortAnswer,
  UFormFieldSettingsSingleChoice,
  UFormSettings,
} from '@/models/UForm'
import fileToBase64 from '@/utils/fileToBase64'
import * as br from 'validations-br'
import { z as zod } from 'zod'

export function getValidationFromUFormSettings(settings: UFormSettings) {
  const shape: Record<string, any> = {}

  settings.pages.forEach((page) => {
    page.fieldsets.forEach((fieldset) => {
      fieldset.columns.forEach((column) => {
        column.fields.forEach((field) => {
          const fieldValidation = getValidationByFieldType(field)
          if (fieldValidation) {
            shape[field.alias] = fieldValidation
          }
        })
      })
    })
  })

  return zod.object(shape)
}

export function getInputNamesFromPageAndUFormSettings(
  page: number,
  settings: UFormSettings,
) {
  const inputs: string[] = []
  try {
    settings.pages[page].fieldsets.forEach((fieldset) => {
      fieldset.columns.forEach((column) => {
        column.fields.forEach((field) => {
          inputs.push(field.alias)
        })
      })
    })
  } catch (error) {
    // TODO: handle error
  }
  return inputs
}

export function getDefaultValuesFromUFormSettings(settings: UFormSettings) {
  const defaultValues: Record<string, any> = {}

  settings.pages.forEach((page) => {
    page.fieldsets.forEach((fieldset) => {
      fieldset.columns.forEach((column) => {
        column.fields.forEach((field) => {
          defaultValues[field.alias] = getDefaultValueByFieldType(field)
        })
      })
    })
  })

  return defaultValues
}

function getDefaultValueByFieldType(field: UFormColumnField) {
  switch (field.type.name) {
    case 'Short answer': {
      const { settings } =
        field as UFormColumnField<UFormFieldSettingsShortAnswer>
      return settings.defaultValue || ''
    }
    case 'Long answer': {
      const { settings } =
        field as UFormColumnField<UFormFieldSettingsLongAnswer>
      return settings.defaultValue || ''
    }
    case 'Date': {
      return ''
    }
    case 'Checkbox': {
      return false
    }
    case 'File upload': {
      return []
    }
    case 'Multiple choice': {
      const { settings } =
        field as UFormColumnField<UFormFieldSettingsMultipleChoice>
      return (settings.defaultValue || '').split(',').map((item) => item.trim())
    }
    case 'Dropdown': {
      const { settings } = field as UFormColumnField<UFormFieldSettingsDropdown>
      return settings.defaultValue || ''
    }
    case 'Single choice': {
      const { settings } =
        field as UFormColumnField<UFormFieldSettingsSingleChoice>
      return settings.defaultValue || ''
    }
    case 'Title and description': {
      return ''
    }
    case 'Hidden': {
      const { settings } = field as UFormColumnField<UFormFieldSettingsHidden>
      return settings.defaultValue || ''
    }
    case 'reCAPTCHA v3 with score': {
      return ''
    }
    default: {
      return ''
    }
  }
}

function getValidationByFieldType(field: UFormColumnField) {
  switch (field.type.name) {
    case 'Short answer': {
      const {
        alias,
        required,
        requiredErrorMessage,
        settings,
        pattern,
        patternInvalidErrorMessage,
      } = field as UFormColumnField<UFormFieldSettingsShortAnswer>

      return (
        zod
          .string()
          .optional()
          // required
          .refine((value = '') => {
            if (required) {
              return zod.string().nonempty().safeParse(value).success
            }
            return true
          }, requiredErrorMessage)
          // max
          .refine((value = '') => {
            if (settings.maximumLength) {
              return zod
                .string()
                .max(Number(settings.maximumLength))
                .safeParse(value).success
            }
            return true
          }, `Deve ter ${settings.maximumLength} ou menos caracteres.`)
          // email
          .refine((value = '') => {
            if (settings.fieldType === 'email') {
              return zod.string().email().safeParse(value).success
            }
            return true
          }, 'E-mail inválido.')
          // url
          .refine((value = '') => {
            if (settings.fieldType === 'url') {
              return zod.string().url().safeParse(value).success
            }
            return true
          }, 'Link inválido.')
          // cpf/cnpj
          .refine((value = '') => {
            if (alias === 'personalDocument') {
              return br.validateCPF(value) || br.validateCNPJ(value)
            }
            return true
          }, 'Documento inválido.')
          // regex
          .refine((value = '') => {
            if (pattern) {
              return zod.string().regex(new RegExp(pattern)).safeParse(value)
                .success
            }
            return true
          }, patternInvalidErrorMessage)
      )
    }
    case 'Long answer': {
      const {
        required,
        requiredErrorMessage,
        settings,
        pattern,
        patternInvalidErrorMessage,
      } = field as UFormColumnField<UFormFieldSettingsLongAnswer>
      return (
        zod
          .string()
          .optional()
          // required
          .refine((value = '') => {
            if (required) {
              return zod.string().nonempty().safeParse(value).success
            }
            return true
          }, requiredErrorMessage)
          // max
          .refine((value = '') => {
            if (settings.maximumLength) {
              return zod
                .string()
                .max(Number(settings.maximumLength))
                .safeParse(value).success
            }
            return true
          }, `Deve ter ${settings.maximumLength} ou menos caracteres.`)
          // regex
          .refine((value = '') => {
            if (pattern) {
              return zod.string().regex(new RegExp(pattern)).safeParse(value)
                .success
            }
            return true
          }, patternInvalidErrorMessage)
      )
    }
    case 'Date': {
      const { required, requiredErrorMessage } =
        field as UFormColumnField<UFormFieldSettingsDate>
      return (
        zod
          .string()
          .optional()
          // required
          .refine((value = '') => {
            if (required) {
              return zod.string().nonempty().safeParse(value).success
            }
            return true
          }, requiredErrorMessage)
      )
    }
    case 'Checkbox': {
      const { required, requiredErrorMessage } =
        field as UFormColumnField<UFormFieldSettingsCheckbox>
      return (
        zod
          .boolean()
          .optional()
          // transform value
          .transform((value) => !!value)
          // required
          .refine((value) => {
            if (required) {
              return value
            }
            return true
          }, requiredErrorMessage)
      )
    }
    case 'File upload': {
      const { required, requiredErrorMessage, fileUploadOptions } =
        field as UFormColumnField<UFormFieldSettingsFileUpload>
      const allowedExt = fileUploadOptions.allowedUploadExtensions.map((item) =>
        item.toLowerCase(),
      )
      return (
        zod
          .any()
          .array()
          .optional()
          // transform
          .transform((value?: File[]) => value || [])
          // required
          .refine((value) => {
            if (required) {
              return !!value && value.length > 0
            }
            return true
          }, requiredErrorMessage)
          // extension
          .refine((value) => {
            if (!fileUploadOptions.allowAllUploadExtensions) {
              const allFileExt = value.map(
                (item) => item.name.split('.').pop()?.toLowerCase() || '',
              )
              const allValidExt = allFileExt.filter((item) =>
                allowedExt.includes(item),
              )

              return allValidExt.length === value.length
            }
            return true
          }, `Formatos de arquivo permitidos: ${allowedExt.join(', ')}`)
      )
    }
    case 'Multiple choice': {
      const { required, requiredErrorMessage } =
        field as UFormColumnField<UFormFieldSettingsMultipleChoice>
      return (
        zod
          .string()
          .array()
          .optional()
          // required
          .refine((value) => {
            if (required) {
              return !!value && value.length > 0
            }
            return true
          }, requiredErrorMessage)
      )
    }
    case 'Dropdown': {
      const { required, requiredErrorMessage } =
        field as UFormColumnField<UFormFieldSettingsDropdown>
      return (
        zod
          .string()
          .optional()
          // required
          .refine((value = '') => {
            if (required) {
              return zod.string().nonempty().safeParse(value).success
            }
            return true
          }, requiredErrorMessage)
      )
    }
    case 'Single choice': {
      const { required, requiredErrorMessage } =
        field as UFormColumnField<UFormFieldSettingsSingleChoice>
      return (
        zod
          .string()
          .optional()
          // required
          .refine((value = '') => {
            if (required) {
              return zod.string().nonempty().safeParse(value).success
            }
            return true
          }, requiredErrorMessage)
      )
    }
    case 'Title and description': {
      return null
    }
    case 'Hidden': {
      return null
    }
    // TODO:
    case 'reCAPTCHA v3 with score': {
      return null
    }
    default: {
      return null
    }
  }
}

export async function makeValueFromFormData(
  settings: UFormSettings,
  form: any,
): Promise<Record<string, any>> {
  const fields: {
    type: UFormColumnField['type']['name']
    alias: string
    value: any
  }[] = []

  settings.pages.forEach((page) => {
    page.fieldsets.forEach((fieldset) => {
      fieldset.columns.forEach((column) => {
        column.fields.forEach((field) => {
          fields.push({
            type: field.type.name,
            alias: field.alias,
            value: form[field.alias],
          })
        })
      })
    })
  })

  const value: Record<string, any> = {}

  for (const field of fields) {
    switch (field.type) {
      case 'File upload': {
        const data = await Promise.all(
          ((form[field.alias] || []) as File[]).map(async (file: File) => {
            const fileContents = await fileToBase64(file)
            return {
              fileName: file.name,
              fileContents,
            }
          }),
        )
        value[field.alias] = data
        break
      }
      case 'reCAPTCHA v3 with score': {
        break
      }
      case 'Checkbox': {
        value[field.alias] = form[field.alias] ? 'on' : 'off'
        break
      }
      default: {
        value[field.alias] = form[field.alias] || ''
        break
      }
    }
  }

  return value
}
