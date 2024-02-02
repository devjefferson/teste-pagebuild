export function htmlToText(data: string | null) {
  return data?.replace(/<.*?>/g, '') || ''
}
