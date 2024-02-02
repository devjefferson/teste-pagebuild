/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import {
  Grid,
  Image,
  ImageType,
  Link,
  LinkType,
  Paragraph,
  ParagraphType,
} from '@squadfy/uai-design-system'
import classMerge from '@/utils/classMerge'

export type FooterCopyrightType = {
  aditionalLink?: LinkType
  awareness?: ParagraphType
  copyrightText?: ParagraphType
  copyrightLogo?: ImageType
}

export default function FooterCopyright({
  aditionalLink,
  awareness,
  copyrightText,
  copyrightLogo,
}: FooterCopyrightType) {
  return (
    <div className="bg-background">
      <div className="container">
        <Grid
          columns={'12'}
          className="footer-copyright-grid py-medium gap-large"
        >
          {!!awareness && (
            <Grid.Item
              className="footer-copyright-grid-column-1"
              span={{
                lg: !aditionalLink ? '8' : '4',
                xs: !aditionalLink ? '12' : '6',
              }}
            >
              <Paragraph
                size="small"
                {...awareness}
                className={classMerge([
                  'border',
                  'border-t-hairline',
                  'px-xsmall',
                  'py-nano',
                  'w-fit',
                  awareness.className,
                ])}
              />
            </Grid.Item>
          )}
          {!!aditionalLink && (
            <Grid.Item
              className="footer-copyright-grid-column-2 flex justify-end lg:justify-center items-center"
              span={{
                lg: !awareness ? '8' : '4',
                xs: !awareness ? '12' : '6',
              }}
            >
              <Link
                {...aditionalLink}
                className={classMerge([
                  '!typography-paragraph-color-main',
                  '!from-content !to-content',
                  '!bg-gradient-to-r',
                  aditionalLink.className,
                ])}
              />
            </Grid.Item>
          )}
          <Grid.Item
            className="footer-copyright-grid-column-3"
            span={{ lg: !awareness && !aditionalLink ? '12' : '4', xs: '12' }}
          >
            <div
              className={classMerge([
                'footer-copyright-grid-column-3-container',
                'flex',
                'items-center',
                'justify-between',
                'gap-large',
                'w-full',
                'lg:justify-end',
                'lg:w-auto',
              ])}
            >
              {!!copyrightText && (
                <Paragraph
                  size="small"
                  {...copyrightText}
                  className={classMerge([
                    'whitespace-nowrap',
                    copyrightText.className,
                  ])}
                />
              )}
              {!!copyrightLogo && (
                <Image
                  aspectRatio="fluid"
                  {...copyrightLogo}
                  className={classMerge([
                    'h-xlarge',
                    '!w-auto',
                    copyrightLogo.className,
                  ])}
                />
              )}
            </div>
          </Grid.Item>
        </Grid>
      </div>
    </div>
  )
}
