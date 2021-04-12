import { UploadImageRepository } from '@/data/interfaces/storage/image/upload-image-repository'
import S3, { PutObjectRequest } from 'aws-sdk/clients/s3'

export class ImageS3Repository implements UploadImageRepository {
  constructor (private readonly client: S3) {}

  async upload (params: PutObjectRequest): Promise<void> {
    await this.client.putObject(params)
  }
}
