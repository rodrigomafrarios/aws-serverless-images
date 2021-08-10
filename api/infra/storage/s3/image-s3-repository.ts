import { LoadImageRepository } from '@/data/interfaces/storage/image/load-image-repository'
import { UploadImageRepository } from '@/data/interfaces/storage/image/upload-image-repository'
import { AWSError } from 'aws-sdk'
import S3, {
  PutObjectOutput,
  PutObjectRequest,
  GetObjectRequest,
  GetObjectOutput
} from 'aws-sdk/clients/s3'

export class ImageS3Repository
implements
UploadImageRepository,
LoadImageRepository {
  constructor (private readonly client: S3) {}

  async loadByKey (params: GetObjectRequest): Promise<GetObjectOutput> {
    return this.client.getObject(params).promise()
  }

  async upload (params: PutObjectRequest): Promise<PutObjectOutput | AWSError> {
    return this.client.putObject(params).promise()
  }
}
