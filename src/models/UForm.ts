export type UFormCondition = {
  actionType: 'Show' | 'Hide'
  logicType: 'Any' | 'All'
  rules: {
    field: string
    operator:
      | 'Is'
      | 'IsNot'
      | 'GreaterThen'
      | 'LessThen'
      | 'Contains'
      | 'StartsWith'
      | 'EndsWith'
    value: string
  }[]
}

type UFormFieldSettingsShowLabel = 'False' | 'True'

export type UFormFieldSettingsShortAnswer = {
  settings: {
    defaultValue: string
    placeholder: string
    showLabel: UFormFieldSettingsShowLabel
    maximumLength: string
    fieldType: string
    autocompleteAttribute: string
  }
}

export type UFormFieldSettingsLongAnswer = {
  settings: {
    defaultValue: string
    placeholder: string
    showLabel: UFormFieldSettingsShowLabel
    autocompleteAttribute: string
    numberOfRows: string
    maximumLength: string
  }
}

export type UFormFieldSettingsDate = {
  settings: {
    placeholder: string
    showLabel: UFormFieldSettingsShowLabel
  }
}

export type UFormFieldSettingsCheckbox = {
  settings: {
    defaultValue: string
    showLabel: UFormFieldSettingsShowLabel
  }
}

export type UFormFieldSettingsFileUpload = {
  settings: {
    showLabel: UFormFieldSettingsShowLabel
  }
  fileUploadOptions: {
    allowAllUploadExtensions: boolean
    allowedUploadExtensions: string[]
    allowMultipleFileUploads: boolean
  }
}

export type UFormFieldSettingsMultipleChoice = {
  settings: {
    defaultValue: string
    showLabel: UFormFieldSettingsShowLabel
  }
}

export type UFormFieldSettingsDropdown = {
  settings: {
    defaultValue: string
    allowMultipleSelections: string
    showLabel: UFormFieldSettingsShowLabel
    autocompleteAttribute: string
    selectPrompt: string
  }
}

export type UFormFieldSettingsSingleChoice = {
  settings: {
    defaultValue: string
    showLabel: UFormFieldSettingsShowLabel
  }
}

export type UFormFieldSettingsTitleAndDescription = {
  settings: {
    captionTag: string
    caption: string
    bodyText: string
    showLabel: UFormFieldSettingsShowLabel
  }
}

export type UFormFieldSettingsHidden = {
  settings: {
    defaultValue: string
  }
}

export type UFormFieldSettingsRecaptchaV3WithScore = {
  settings: {
    saveScore: string
    scoreThreshold: string
    errorMessage: string
  }
}

export type UFormColumnField<
  S =
    | UFormFieldSettingsShortAnswer
    | UFormFieldSettingsLongAnswer
    | UFormFieldSettingsDate
    | UFormFieldSettingsCheckbox
    | UFormFieldSettingsFileUpload
    | UFormFieldSettingsMultipleChoice
    | UFormFieldSettingsDropdown
    | UFormFieldSettingsSingleChoice
    | UFormFieldSettingsTitleAndDescription
    | UFormFieldSettingsHidden
    | UFormFieldSettingsRecaptchaV3WithScore,
> = {
  id: string
  alias: string
  caption: string
  helpText: string
  pattern: string
  patternInvalidErrorMessage: string
  placeholder: string
  preValues: {
    caption: string
    value: string
  }[]
  required: boolean
  requiredErrorMessage: string
  condition?: UFormCondition
  type: {
    id: string
    name:
      | 'Short answer'
      | 'Long answer'
      | 'Date'
      | 'Checkbox'
      | 'File upload'
      | 'Multiple choice'
      | 'Dropdown'
      | 'Single choice'
      | 'Title and description'
      | 'Hidden'
      | 'reCAPTCHA v3 with score'
    supportsPreValues: boolean
    supportsUploadTypes: boolean
  }
} & S

export type UFormFieldsetColumn = {
  caption: string
  fields: UFormColumnField[]
  width: number
}

export type UFormPageFieldset = {
  id: string
  caption: string
  condition?: UFormCondition
  columns: UFormFieldsetColumn[]
}

export type UFormPage = {
  caption: string
  condition?: UFormCondition
  fieldsets: UFormPageFieldset[]
}

export type UFormSettings = {
  disableDefaultStylesheet: boolean
  fieldIndicationType: string
  hideFieldValidation: boolean
  id: string
  contentId: string
  indicator: string
  messageOnSubmit: string
  messageOnSubmitIsHtml: boolean
  name: string
  nextLabel: string
  previousLabel: string
  showValidationSummary: boolean
  submitLabel: string
  pages: UFormPage[]
  type: 'contact' | 'simple'
}
