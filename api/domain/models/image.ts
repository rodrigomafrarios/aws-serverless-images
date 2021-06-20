export interface S3ImageParams {
  Bucket: string
  Key: string
  Body: Buffer
  ContentEncoding?: string
  ContentType?: string
}
