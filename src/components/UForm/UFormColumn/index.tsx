import { UFormFieldsetColumn } from '@/models/UForm'
import classMerge from '@/utils/classMerge'
import UFormField from '../UFormField'

export type UFormColumnProps = {
  data: UFormFieldsetColumn
}
export default function UFormColumn({ data }: UFormColumnProps) {
  return (
    <div className={classMerge(['flex', 'flex-col', 'gap-medium'])}>
      {data.fields.map((field) => (
        <UFormField key={field.id} data={field} />
      ))}
    </div>
  )
}
