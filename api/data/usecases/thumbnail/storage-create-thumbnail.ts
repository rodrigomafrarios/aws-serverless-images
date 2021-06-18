import { FormatImage } from '@/data/interfaces/format'
import { 
  LoadImageRepository
} from '@/data/interfaces/storage/image/load-image-repository'
import { S3ThumbnailParams } from '@/domain/models/thumbnail'
import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'

export class StorageCreateThumbnail implements CreateThumbnail {
  constructor (
    private readonly loadImageRepository: LoadImageRepository,
    private readonly formatImage: FormatImage
  ) {}

  async create (s3ThumbnailParams: S3ThumbnailParams): Promise<void> {
    const image = await this.loadImageRepository.loadByKey(s3ThumbnailParams)
    if (image) {
      const base64 = image.Body.toString('base64')
      await this.formatImage.createThumbnail(base64)
    }
    return null
  }
}
