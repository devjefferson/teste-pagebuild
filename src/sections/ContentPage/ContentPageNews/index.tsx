/* eslint-disable @next/next/no-img-element */
'use client'

import { TContentPageData, TContentPagePayloadData } from '@/models/PageContent'
import { Heading } from '@squadfy/uai-design-system'
import { useState } from 'react'

type PageTitleProps = {
  data: TContentPagePayloadData[]
}

export default function ContentPageNews({ data }: PageTitleProps) {
  const [contetDataPage] = useState<TContentPageData>(() =>
    data.reduce((acc: { [key: string]: any }, item) => {
      acc[item.alias] = item.value || item.mediaItems || item.sourceValue
      return acc
    }, {}),
  )
  return (
    <div className="flex items-center gap-[150px]">
      <div className="lg:flex hidden w-[48%] h-[900px]">
        <img
          className=" object-cover w-[100%]"
          src={contetDataPage?.image?.[0]?.url}
          alt={contetDataPage.alttext}
        />
      </div>
      <div className="flex flex-col gap-large lg:p-0 py-huge px-medium">
        <Heading>{contetDataPage.title}</Heading>
        <div
          dangerouslySetInnerHTML={{
            __html: contetDataPage.description || '',
          }}
        />
      </div>
    </div>
  )
}
