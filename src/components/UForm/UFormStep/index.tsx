import { UFormPage } from '@/models/UForm'
import classMerge from '@/utils/classMerge'
import { Heading } from '@squadfy/uai-design-system'
import React from 'react'
import UFormFieldset from '../UFormFieldset'

export interface UFormStepProps extends React.HTMLAttributes<HTMLDivElement> {
  data: UFormPage
}
export default function UFormStep({ data, ...props }: UFormStepProps) {
  return (
    <div
      {...props}
      className={classMerge([
        'flex',
        'flex-col',
        'gap-medium',
        props.className,
      ])}
    >
      <div className="flex flex-col gap-xsmall">
        {!!data.caption && (
          <Heading as="h3" size="small" colorMode="main">
            {data.caption}
          </Heading>
        )}
      </div>
      {data.fieldsets.map((fieldset) => (
        <UFormFieldset key={fieldset.id} data={fieldset} />
      ))}
    </div>
  )
}
