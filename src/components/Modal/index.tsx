import classMerge from '@/utils/classMerge'
import * as RadixDialog from '@radix-ui/react-dialog'
import {
  Divider,
  Heading,
  IconButton,
  Overline,
} from '@squadfy/uai-design-system'
import React from 'react'

type ModalProps = {
  open?: boolean
  onClose?: () => void
  title?: string
  overline?: string
  children?: React.ReactNode
  className?: string
}

export default function Modal({
  className,
  open = false,
  onClose = () => {},
  title,
  overline,
  children,
}: ModalProps) {
  return (
    <RadixDialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
      modal
    >
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={classMerge([
            'bg-black/20',
            'backdrop-blur-sm',
            'fixed',
            'inset-0',
          ])}
        />
        <RadixDialog.Content
          onPointerDownOutside={(e) => e.preventDefault()}
          className={classMerge([
            'fixed',
            'inset-0',
            'md:inset-[50%_0_0_50%]',
            'w-full',
            'h-full',
            'md:h-min',
            'md:max-h-90vh',
            'md:translate-x-[-50%]',
            'md:translate-y-[-50%]',
            'bg-white',
            'shadow-xlarge',
            'focus:outline-none',
            'flex',
            'flex-col',
            className,
          ])}
        >
          <div
            className={classMerge([
              'p-medium',
              'md:p-large',
              'relative',
              'flex',
              'items-start',
              'justify-between',
              'gap-xxsmall',
            ])}
          >
            <div className="flex flex-col gap-xsmall">
              {!!overline && <Overline colorMode="main">{overline}</Overline>}
              {!!title && (
                <Heading as="h2" size="medium" colorMode="main">
                  {title}
                </Heading>
              )}
            </div>
            <RadixDialog.Close asChild>
              <IconButton
                variant="ghost"
                colorMode="main"
                size="medium"
                icon="MdClose"
              />
            </RadixDialog.Close>
          </div>
          <Divider />
          <div
            className={classMerge([
              'flex',
              'flex-col',
              'flex-1',
              'overflow-y-auto',
            ])}
          >
            {children}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
