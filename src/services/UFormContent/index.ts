import RestClient from '../RestClient'

export async function GetUFormContent(
  formId: string,
  contentId: string,
  type = 'simple',
): Promise<any | null> {
  try {
    const { data: form } = await RestClient.get<any>(
      `forms/api/v1.0/definitions/${formId}?date=${new Date().toISOString()}`,
      {
        headers: {
          'Api-Key': process.env.API_KEY_UMBRACO_FORM,
        },
      },
    )

    return {
      ...form,
      type: String(type).toLowerCase().replace('uforms', ''),
      contentId,
    }
  } catch (error: any) {
    return null
  }
}
