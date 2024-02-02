/* eslint-disable @next/next/no-img-element */
import { Paragraph } from '@squadfy/uai-design-system'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'

export interface ImageState extends File {
  preview: string
}

type ImageUploadProps = {
  maxSize?: number
  fullWidth?: boolean
  image: string | null
  setImage: React.Dispatch<string>
  error?: string
  preview?: string
  variant?: 'product' | 'logo'
  previewText?: string
}

const getBase64 = async (file: Blob): Promise<string | undefined> => {
  const reader = new FileReader()
  reader.readAsDataURL(file as Blob)

  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result as any)
    reader.onerror = (error) => reject(error)
  })
}

export default function ImageUpload({
  maxSize = 3145728,
  image,
  setImage,
  error,
  preview,
  previewText,
  variant = 'product',
}: ImageUploadProps) {
  const [errorMessages, setErrorMessages] = useState<string[]>([])

  const translate = (code: string) => {
    const messages = {
      'file-too-large': 'Arquivo muito grande.',
      'too-many-files': 'Muitos arquivos.',
      'file-invalid-type': 'Tipo de arquivo inválido.',
      'file-too-small': 'Arquivo muito pequeno.',
    } as { [key: string]: string }

    return messages[code] ?? 'Erro ao carregar imagem.'
  }

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    multiple: false,
    maxSize,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length <= 0) return
      const imageBase64 = await getBase64(acceptedFiles[0])

      setImage(imageBase64!)
      setErrorMessages([])
    },
    onDropRejected: (rejections) => {
      setErrorMessages(
        rejections.reduce((acc: string[], rejection) => {
          const message = translate(rejection.errors[0].code)
          if (acc.includes(message)) return acc
          return [...acc, message]
        }, []),
      )
    },
  })

  return (
    <div className="flex flex-col gap-xsmall">
      <Paragraph className=" font-body-bold text-background-brand ">
        FOTO DE PERFIL
      </Paragraph>
      <Paragraph size="small" className=" text-mono-500">
        Fazer upload de uma nova foto
      </Paragraph>
      <div
        {...getRootProps()}
        className="  bg-background-brand max-w-[150px] min-h-xlarge rounded-full flex flex-1"
      >
        <input {...getInputProps()} />
        {(image || preview) &&
          (variant === 'product' ? (
            <img
              alt="imagem de visualização"
              className=" w-[150px] h-[150px] object-cover rounded-full flex flex-1"
              src={image || preview}
              onLoad={() => {
                if (!image) return
                URL.revokeObjectURL(image)
              }}
            />
          ) : (
            <img
              alt="imagem de visualização"
              src={image || preview}
              className="w-[150px] h-[150px] object-cover rounded-full flex flex-1"
              onLoad={() => {
                if (!image) return
                URL.revokeObjectURL(image)
              }}
            />
          ))}
        {!image && !preview && (
          <div className="flex flex-1  px-small py-xxsmall items-center h-full">
            <Paragraph className="font-bold text-white capitalize">
              Procurar...
            </Paragraph>
          </div>
        )}
      </div>
      <Paragraph size="small" className="font-bold text-background-negative">
        {errorMessages}
      </Paragraph>
    </div>
  )
}
