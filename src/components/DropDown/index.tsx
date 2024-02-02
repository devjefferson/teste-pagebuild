/* eslint-disable @next/next/no-img-element */

import { Heading, IconButton, Paragraph } from '@squadfy/uai-design-system'
import { useState } from 'react'

type LinkItem = {
  link?: string
  path?: () => void
}

type DropDownProps = {
  title: string
  items: LinkItem[]
  image: string
}

export default function DropDown({ items, title, image }: DropDownProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="relative cursor-pointer">
      <div
        className="bg-background-disabled flex items-center gap-xsmall pr-small rounded-large"
        onClick={() => setDropdownOpen((old) => !old)}
      >
        {!image ? (
          <IconButton
            className="bg-background-soft rounded-pill"
            colorMode="main"
            icon="FaRegUser"
            size="small"
            variant="ghost"
          />
        ) : (
          <img
            alt="image-profile"
            src={image}
            className="flex w-xlarge  rounded-pill"
          />
        )}

        <svg
          className="w-[8px] h-auto"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </div>

      {isDropdownOpen && (
        <div className="bg-background z-10 absolute py-xsmall rounded-medium w-[280px] mt-[4px] top-huge lg:right-small">
          <div className="mb-xxsmall lg:px-medium">
            <Heading className="px-medium lg:px-0" size="medium">
              {title}
            </Heading>
          </div>
          <ul className="flex flex-col gap-xsmall">
            {items.map((item) => {
              return (
                <li key={item.link} className="hover:bg-background-soft">
                  <button className="px-medium" onClick={item.path}>
                    <Paragraph>{item.link}</Paragraph>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
