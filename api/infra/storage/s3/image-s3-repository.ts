import { UploadImageRepository } from '@/data/interfaces/storage/image/upload-image-repository'
import { AWSError } from 'aws-sdk'
import S3, { PutObjectOutput, PutObjectRequest } from 'aws-sdk/clients/s3'

export class ImageS3Repository implements UploadImageRepository {
  constructor (private readonly client: S3) {}

  async upload (params: PutObjectRequest): Promise<PutObjectOutput | AWSError> {
    return this.client.putObject(params).promise()
  }
}
