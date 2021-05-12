import { StorageUploadImage } from '@/data/usecases/image/storage-upload-image'
import { UploadImage } from '@/domain/usecases/image/upload-image'
import { S3ClientFactory } from '@/infra/aws/aws-config-factory'
import { ImageS3Repository } from '@/infra/storage/s3/image-s3-repository'

export const makeStorageUploadImage = (): UploadImage => {
  const client = S3ClientFactory({
    apiVersion: '2006-03-01'
  })
  const imageS3Repository = new ImageS3Repository(client)
  return new StorageUploadImage(imageS3Repository)
}
