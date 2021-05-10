export interface ImageBuffer {
  buffer: Buffer
  type: string
  fileName: string
}

export const imageAdapt = (image: any): ImageBuffer => {
  const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const type = image.split(';')[0].split('/')[1]
  const fileName = `image-${new Date().getTime()}`
  return {
    buffer,
    type,
    fileName
  }
}
