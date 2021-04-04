import { S3ImageParams } from '@/domain/models/image'

export interface UploadImage {
  upload: (s3ImageParams: S3ImageParams) => Promise<void>
}
