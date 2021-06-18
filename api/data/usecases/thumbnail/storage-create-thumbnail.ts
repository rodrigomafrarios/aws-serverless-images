import { 
  LoadImageRepository
} from '@/data/interfaces/storage/image/load-image-repository'
import { S3ThumbnailParams } from '@/domain/models/thumbnail'
import { CreateThumbnail } from '@/domain/usecases/thumbnail/create-thumbnail'

export class StorageCreateThumbnail implements CreateThumbnail {
  constructor (private readonly loadImageRepository: LoadImageRepository) {}

  async create (s3ThumbnailParams: S3ThumbnailParams): Promise<void> {
    await this.loadImageRepository.loadByKey(s3ThumbnailParams)
    return null
  }
}
