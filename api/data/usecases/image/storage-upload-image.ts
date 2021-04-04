import { UploadImageRepository } from '@/data/interfaces/storage/image/upload-image-repository'
import { S3ImageParams } from '@/domain/models/image'
import { UploadImage } from '@/domain/usecases/image/upload-image'

export class StorageUploadImage implements UploadImage {
  constructor (private readonly uploadImageRepository: UploadImageRepository) {}

  async upload (s3ImageParams: S3ImageParams): Promise<void> {
    await this.uploadImageRepository.upload(s3ImageParams)
  }
}
