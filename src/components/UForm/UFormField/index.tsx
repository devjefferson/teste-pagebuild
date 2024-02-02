import {
  UFormColumnField,
  UFormFieldSettingsDropdown,
  UFormFieldSettingsMultipleChoice,
  UFormFieldSettingsSingleChoice,
  UFormFieldSettingsTitleAndDescription,
  UFormFieldSettingsShortAnswer,
  UFormFieldSettingsLongAnswer,
  UFormFieldSettingsDate,
  UFormFieldSettingsCheckbox,
  UFormFieldSettingsFileUpload,
  UFormFieldSettingsHidden,
} from '@/models/UForm'
import GetStateList from '@/services/GetStateList'
import {
  Heading,
  InputCheckbox,
  InputFile,
  InputRadio,
  InputSelect,
  InputSelectOptionType,
  InputText,
  InputTextarea,
  Paragraph,
} from '@squadfy/uai-design-system'
import { useFormContext, Controller } from 'react-hook-form'
import masker from 'vanilla-masker'

export type UFormFieldProps = {
  data: UFormColumnField
}
export default function UFormField({ data }: UFormFieldProps) {
  switch (data.type.name) {
    case 'Short answer': {
      const field = data as UFormColumnField<UFormFieldSettingsShortAnswer>
      return <FieldShortAnswer data={field} />
    }
    case 'Long answer': {
      const field = data as UFormColumnField<UFormFieldSettingsLongAnswer>
      return <FieldLongAnswer data={field} />
    }
    case 'Date': {
      const field = data as UFormColumnField<UFormFieldSettingsDate>
      return <FieldDate data={field} />
    }
    case 'Checkbox': {
      const field = data as UFormColumnField<UFormFieldSettingsCheckbox>
      return <FieldCheckbox data={field} />
    }
    case 'File upload': {
      const field = data as UFormColumnField<UFormFieldSettingsFileUpload>
      return <FieldFileUpload data={field} />
    }
    case 'Multiple choice': {
      const field = data as UFormColumnField<UFormFieldSettingsMultipleChoice>
      return <FieldMultipleChoice data={field} />
    }
    case 'Dropdown': {
      const field = data as UFormColumnField<UFormFieldSettingsDropdown>
      return <FieldDropdown data={field} />
    }
    case 'Single choice': {
      const field = data as UFormColumnField<UFormFieldSettingsSingleChoice>
      return <FieldSingleChoice data={field} />
    }
    case 'Title and description': {
      const field =
        data as UFormColumnField<UFormFieldSettingsTitleAndDescription>
      return <FieldTitleAndDescription data={field} />
    }
    case 'Hidden': {
      const field = data as UFormColumnField<UFormFieldSettingsHidden>
      return <FieldHidden data={field} />
    }
    // case 'reCAPTCHA v3 with score': {
    //   const field =
    //     data as UFormColumnField<UFormFieldSettingsRecaptchaV3WithScore>
    //   return <FieldRecaptchaV3WithScore data={field} />
    // }
    default: {
      return null
    }
  }
}

function FieldShortAnswer({
  data,
}: {
  data: UFormColumnField<UFormFieldSettingsShortAnswer>
}) {
  const { control } = useFormContext()

  const maskAliasList = [
    'personalDocument',
    'personalCellphone',
    'personalBirthdate',
    'personalAddressZipCode',
  ]

  if (maskAliasList.includes(data.alias)) {
    return (
      <Controller
        control={control}
        name={data.alias}
        render={({ field: { ref, ...field }, fieldState: { error } }) => (
          <InputText
            {...field}
            onChange={(e) => {
              const value = masker.toNumber(e.target.value).toString()
              switch (data.alias) {
                case 'personalCellphone': {
                  field.onChange(masker.toPattern(value, '99-99999-9999'))
                  break
                }
                case 'personalBirthdate': {
                  field.onChange(masker.toPattern(value, '99/99/9999'))
                  break
                }
                case 'personalAddressZipCode': {
                  field.onChange(masker.toPattern(value, '99999-999'))
                  break
                }
                case 'personalDocument': {
                  if (value.length <= 11) {
                    field.onChange(masker.toPattern(value, '999.999.999-99'))
                  } else {
                    field.onChange(
                      masker.toPattern(value, '99.999.999/9999-99'),
                    )
                  }
                  break
                }
                default: {
                  field.onChange(value)
                  break
                }
              }
            }}
            helperText={data.helpText || ''}
            errorText={error?.message || ''}
            label={data.caption || ''}
            placeholder={data.settings.placeholder}
            type={(data.settings.fieldType || 'text') as any}
          />
        )}
      />
    )
  } else if (data.alias === 'personalAddressState') {
    return (
      <Controller
        control={control}
        name={data.alias}
        render={({ field, fieldState: { error } }) => {
          const stateList = GetStateList()
          return (
            <InputSelect
              {...field}
              isClearable
              isSearchable
              options={stateList}
              helperText={data.helpText || ''}
              errorText={error?.message || ''}
              label={data.caption || ''}
              placeholder="Selecione..."
              value={stateList.find((item) => item.value === field.value)}
              onChange={(e) => field.onChange(e?.value || '')}
              noOptionsMessage={() => 'Nenhum dado'}
              className="[&_.react-select-menu]:bg-background-soft"
            />
          )
        }}
      />
    )
  }

  return (
    <Controller
      control={control}
      name={data.alias}
      render={({ field, fieldState: { error } }) => (
        <InputText
          {...field}
          helperText={data.helpText || ''}
          errorText={error?.message || ''}
          label={data.caption || ''}
          placeholder={data.settings.placeholder}
          type={(data.settings.fieldType || 'text') as any}
        />
      )}
    />
  )
}

function FieldLongAnswer({
  data,
}: {
  data: UFormColumnField<UFormFieldSettingsLongAnswer>
}) {
  const { control } = useFormContext()

  return (
    <Controller
      control={control}
      name={data.alias}
      render={({ field, fieldState: { error } }) => (
        <InputTextarea
          {...field}
          helperText={data.helpText || ''}
          errorText={error?.message || ''}
          label={data.caption || ''}
          placeholder={data.settings.placeholder}
          rows={
            data.settings.numberOfRows ? Number(data.settings.numberOfRows) : 3
          }
        />
      )}
    />
  )
}

function FieldDate({
  data,
}: {
  data: UFormColumnField<UFormFieldSettingsDate>
}) {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={data.alias}
      render={({ field, fieldState: { error } }) => (
        <InputText
          {...field}
          onChange={(e) => {
            const value = masker.toNumber(e.target.value).toString()
            field.onChange(masker.toPattern(value, '99/99/9999'))
          }}
          helperText={data.helpText || ''}
          errorText={error?.message || ''}
          label={data.caption || ''}
          placeholder={data.settings.placeholder}
          type={'text'}
        />
      )}
    />
  )
}

function FieldCheckbox({
  data,
}: {
  data: UFormColumnField<UFormFieldSettingsCheckbox>
}) {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={data.alias}
      render={({
        field: { value, onChange, ...field },
        fieldState: { error },
      }) => (
        <InputCheckbox
          {...field}
          helperText={data.helpText || ''}
          errorText={error?.message || ''}
          description={data.caption || ''}
          checked={!!value}
          onChange={(e) => onChange(!!e.target.checked)}
        />
      )}
    />
  )
}

function FieldFileUpload({
  data,
}: {
  data: UFormColumnField<UFormFieldSettingsFileUpload>
}) {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={data.alias}
      render={({
        field: { onChange, value = [], ...field },
        fieldState: { error },
      }) => (
        <InputFile
          {...field}
          helperText={data.helpText || ''}
          errorText={error?.message || ''}
          label={data.caption || ''}
          value={value}
          accept={data.fileUploadOptions.allowedUploadExtensions
            .map((item) => `.${item}`.toLowerCase())
            .join(',')}
          multiple={!!data.fileUploadOptions.allowMultipleFileUploads}
          onChange={onChange}
          onRemove={(pos) => {
            onChange((value as File[]).filter((_, index) => index !== pos))
          }}
        />
      )}
    />
  )
}

function FieldMultipleChoice({
  data,
}: {
  data: UFormColumnField<UFormFieldSettingsMultipleChoice>
}) {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={data.alias}
      render={({
        field: { value = [], onChange, ...field },
        fieldState: { error },
      }) => {
        const arrayValues = (value || []) as any[]
        return (
          <div className="flex flex-col gap-xsmall">
            {data.preValues.map((option, index) => {
              const isLastItem = index === data.preValues.length - 1
              return (
                <InputCheckbox
                  key={option.value}
                  {...field}
                  helperText={isLastItem ? data.helpText || '' : undefined}
                  errorText={isLastItem ? error?.message || '' : undefined}
                  value={option.value}
                  description={option.caption}
                  checked={arrayValues.some((item) => item === option.value)}
                  onChange={(e) => {
                    const newValue = arrayValues.filter(
                      (item) => item !== option.value,
                    )
                    if (e.target.checked) {
                      newValue.push(option.value)
                    }
                    onChange(newValue)
                  }}
                />
              )
            })}
          </div>
        )
      }}
    />
  )
}

function FieldDropdown({
  data,
}: {
  data: UFormColumnField<UFormFieldSettingsDropdown>
}) {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={data.alias}
      render={({
        field: { value, onChange, ...field },
        fieldState: { error },
      }) => {
        const options: InputSelectOptionType[] = data.preValues.map((item) => ({
          label: item.caption,
          value: item.value,
        }))
        return (
          <div className="flex flex-col gap-xsmall">
            <InputSelect
              {...field}
              isClearable
              isSearchable
              options={options}
              helperText={data.helpText || ''}
              errorText={error?.message || ''}
              label={data.caption || ''}
              placeholder="Selecione..."
              value={options.find((item) => item.value === value)}
              onChange={(e) => onChange(e?.value || '')}
              noOptionsMessage={() => 'Nenhum dado'}
              className="[&_.react-select-menu]:bg-background-soft"
            />
          </div>
        )
      }}
    />
  )
}

function FieldSingleChoice({
  data,
}: {
  data: UFormColumnField<UFormFieldSettingsSingleChoice>
}) {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={data.alias}
      render={({ field: { value, ...field }, fieldState: { error } }) => (
        <div className="flex flex-col gap-xsmall">
          {data.preValues.map((option, index) => {
            const isLastItem = index === data.preValues.length - 1
            return (
              <InputRadio
                key={option.value}
                {...field}
                helperText={isLastItem ? data.helpText || '' : undefined}
                errorText={isLastItem ? error?.message || '' : undefined}
                description={option.caption ? option.caption : undefined}
                checked={option.value === value}
                value={option.value}
              />
            )
          })}
        </div>
      )}
    />
  )
}

function FieldTitleAndDescription({
  data,
}: {
  data: UFormColumnField<UFormFieldSettingsTitleAndDescription>
}) {
  return (
    <div className="flex flex-col gap-xsmall">
      {!!data.settings.caption && (
        <Heading size="medium" as={(data.settings.captionTag || 'h2') as any}>
          {data.settings.caption}
        </Heading>
      )}
      {!!data.settings.bodyText && (
        <Paragraph size="medium">{data.settings.bodyText}</Paragraph>
      )}
    </div>
  )
}

function FieldHidden({
  data,
}: {
  data: UFormColumnField<UFormFieldSettingsHidden>
}) {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={data.alias}
      render={({ field }) => <input type="hidden" {...field} />}
    />
  )
}

// function FieldRecaptchaV3WithScore({
//   data,
// }: {
//   data: UFormColumnField<UFormFieldSettingsRecaptchaV3WithScore>
// }) {
//   const { control } = useFormContext()
//   return (
//     <Controller
//       control={control}
//       name={data.alias}
//       render={({ field }) => (
//         <ReCaptcha
//           onChange={(token) => {
//             field.onChange(token)
//           }}
//         />
//       )}
//     />
//   )
// }
