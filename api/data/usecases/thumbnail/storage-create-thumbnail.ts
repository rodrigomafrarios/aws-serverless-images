import { FormatImage } from '@/data/interfaces/format'
import {
  LoadImageRepository
} from '@/data/interfaces/storage/image/load-image-repository'
import {
  UploadImageRepository
} from '@/data/interfaces/storage/image/upload-image-repository'
import { S3ThumbnailParams } from '@/domain/models/thumbnail'
import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'

export class StorageCreateThumbnail implements CreateThumbnail {
  constructor (
    private readonly loadImageRepository: LoadImageRepository,
    private readonly formatImage: FormatImage,
    private readonly uploadImageRepository: UploadImageRepository
  ) {}

  async create (s3ThumbnailParams: S3ThumbnailParams): Promise<void> {
    const image = await this.loadImageRepository.loadByKey(s3ThumbnailParams)
    if (image) {
      const thumbnail = await this.formatImage.createThumbnail(image.Body)
      await this.uploadImageRepository.upload({
        Bucket: process.env.THUMBNAIL_BUCKET,
        Key: `thumbnail-${new Date().getTime()}.jpeg`,
        ContentType: 'image/jpeg',
        ContentEncoding: 'base64',
        Body: thumbnail
      })
    }
  }
}
