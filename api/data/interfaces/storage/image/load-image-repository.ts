import { AWSError } from 'aws-sdk'
import { GetObjectOutput, GetObjectRequest } from 'aws-sdk/clients/s3'

export interface LoadImageRepository {
  loadByKey: (params: GetObjectRequest) => Promise<GetObjectOutput | AWSError>
}
