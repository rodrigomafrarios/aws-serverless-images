export interface UploadS3ImageParams {
  image: {
    Bucket: string
    Key: string
    ContentType: string
    ContentEncoding: string
    Body: Buffer
  }
}

export const imageAdapt = (image: string): UploadS3ImageParams => {
  const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const type = image.split(';')[0].split('/')[1]
  const fileName = `image-${new Date().getTime()}`
  return {
    image: {
      Bucket: process.env.IMAGE_BUCKET,
      Key: `${fileName}.${type}`,
      ContentType: `image/${type}`,
      ContentEncoding: 'base64',
      Body: buffer
    }
  }
}
