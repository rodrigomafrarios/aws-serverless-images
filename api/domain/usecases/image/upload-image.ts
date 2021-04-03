import { S3 } from 'aws-sdk'

export interface UploadImage {
  upload: (params: S3.PutObjectRequest) => Promise<any> 
}
