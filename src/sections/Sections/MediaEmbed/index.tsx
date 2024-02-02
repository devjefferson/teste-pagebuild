import { PageContentSectionMediaEmbed } from '@/models/PageContent'
import classMerge from '@/utils/classMerge'
import { Image, Label, Overline } from '@squadfy/uai-design-system'
import IGEmbed from './IGEmbed'

type Props = {
  data: PageContentSectionMediaEmbed
}

export default function MediaEmbed({ data }: Props) {
  return (
    <section className="w-full bg-white overflow-x-hidden">
      <div
        className={classMerge([
          'container',
          'flex',
          'flex-col',
          'gap-xlarge',
          'py-huge',
        ])}
      >
        <div>
          {{
            IGTV: (
              <>
                <IGEmbed url={data.urlEmbed || ''} />
              </>
            ),
            Imagem: (
              <Image
                className="w-full"
                aspectRatio="fluid"
                src={data.media?.url}
                alt={data.media?.alt}
              />
            ),
            Playlist: (
              <iframe
                src={data.urlEmbed || ''}
                width="100%"
                height="380"
                allow="encrypted-media"
              />
            ),
            Podcast: (
              <iframe
                src={data.urlEmbed || ''}
                width="100%"
                height="232"
                allow="encrypted-media"
              />
            ),
            Vídeo: (
              <div>
                <iframe
                  width="100%"
                  height="624"
                  src={data.urlEmbed || ''}
                  title="YouTube video player"
                  allow="accelerometer, autoplay, clipboard-write, encrypted-media, gyroscope, picture-in-picture"
                  allowFullScreen
                />
              </div>
            ),
          }[data.type] || null}
        </div>
        <div className="flex flex-col gap-xsmall">
          {!!data.overline && (
            <Overline colorMode="main">{data.overline}</Overline>
          )}
          {!!data.caption && <Label colorMode="main">{data.caption}</Label>}
        </div>
      </div>
    </section>
  )
}
