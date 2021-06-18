import { FormatImage } from '@/data/interfaces/format'
import { 
  LoadImageRepository
} from '@/data/interfaces/storage/image/load-image-repository'
import { 
  CreateThumbnailRepository 
} from '@/data/interfaces/storage/thumbnail/create-thumbnail-repository'
import { S3ThumbnailParams } from '@/domain/models/thumbnail'
import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'

export class StorageCreateThumbnail implements CreateThumbnail {
  constructor (
    private readonly loadImageRepository: LoadImageRepository,
    private readonly formatImage: FormatImage,
    private readonly createThumbnailRepository: CreateThumbnailRepository
  ) {}

  async create (s3ThumbnailParams: S3ThumbnailParams): Promise<void> {
    const image = await this.loadImageRepository.loadByKey(s3ThumbnailParams)
    if (image) {
      const base64 = image.Body.toString('base64')
      const thumbnail = await this.formatImage.createThumbnail(base64)
      await this.createThumbnailRepository.create({
        Bucket: process.env.THUMBNAIL_BUCKET,
        Key: `thumbnail-${new Date().getTime()}.png`,
        ContentType: 'image/png',
        ContentEncoding: 'base64',
        Body: thumbnail
      })
    }
  }
}
