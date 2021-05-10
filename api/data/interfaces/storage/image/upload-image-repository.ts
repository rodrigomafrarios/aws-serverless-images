import { AWSError } from 'aws-sdk'
import { PutObjectOutput, PutObjectRequest } from 'aws-sdk/clients/s3'

export interface UploadImageRepository {
  upload: (params: PutObjectRequest) => Promise<PutObjectOutput | AWSError>
}
