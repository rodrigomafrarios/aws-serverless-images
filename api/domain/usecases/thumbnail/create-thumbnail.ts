import { S3ThumbnailParams } from '@/domain/models/thumbnail'

export interface CreateThumbnail {
  create: (s3ThumbnailParams: S3ThumbnailParams) => Promise<void>
}
