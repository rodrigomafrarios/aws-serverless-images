import { UploadImageRepository } from '@/data/interfaces/storage/image/upload-image-repository'
import { S3Service } from '@/services/s3'
import S3 from 'aws-sdk/clients/s3'

export class ImageS3Repository implements UploadImageRepository {
  constructor (private readonly storageService: S3Service) {}

  async upload (params: S3.Types.PutObjectRequest): Promise<void> {
    await this.storageService.put(params)
  }
}
