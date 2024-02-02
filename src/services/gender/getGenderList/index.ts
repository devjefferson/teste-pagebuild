import { GetGenderListResponse } from './schema'

export default function getGenderList(): GetGenderListResponse {
  return [
    { label: 'Masculino', value: 'male' },
    { label: 'Feminino', value: 'female' },
    { label: 'Outro', value: 'notSpecified' },
  ]
}
