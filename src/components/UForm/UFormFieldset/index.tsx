import { UFormPageFieldset } from '@/models/UForm'
import classMerge from '@/utils/classMerge'
import { Grid, Overline } from '@squadfy/uai-design-system'
import UFormColumn from '../UFormColumn'

export type UFormFieldsetProps = {
  data: UFormPageFieldset
}
export default function UFormFieldset({ data }: UFormFieldsetProps) {
  return (
    <div className={classMerge(['flex', 'flex-col', 'gap-medium'])}>
      {!!data.caption && <Overline colorMode="main">{data.caption}</Overline>}
      <Grid
        columns={{
          xs: '1',
          md: Math.min(data.columns.length, 12).toString() as any,
        }}
        className="gap-medium"
      >
        {data.columns.map((column, index) => (
          <Grid.Item key={index} span="1">
            <UFormColumn data={column} />
          </Grid.Item>
        ))}
      </Grid>
    </div>
  )
}
